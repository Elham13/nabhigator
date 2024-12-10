import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases, FromEmails } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  CaseDetail,
  Investigator,
  EventNames,
  IDashboardData,
  ITasksAndDocuments,
  IUser,
  IZoneStateMaster,
  NumericStage,
  Role,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, PipelineStage, Types } from "mongoose";
import DashboardData from "@/lib/Models/dashboardData";
import ClaimCase from "@/lib/Models/claimCase";
import { captureCaseEvent } from "../../Claims/caseEvent/helpers";
import User from "@/lib/Models/user";
import ZoneStateMaster from "@/lib/Models/zoneStateMaster";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import sendEmail from "@/lib/helpers/sendEmail";

const router = createEdgeRouter<NextRequest, {}>();

interface IProps {
  claimType: "PreAuth" | "Reimbursement";
  providerState: string;
  claimAmount: number;
}

const getClaimAmountQuery = (claimAmount: number) => {
  let amountString = "";
  if (claimAmount < 500000) amountString = "0-5 Lakh";
  else if (claimAmount > 500000 && claimAmount <= 1000000)
    amountString = "5-10 Lakh";
  else if (claimAmount > 1000000) amountString = "10 Lakh Plus";

  return amountString;
};

const findPostQaUser = async (props: IProps) => {
  const { claimType, providerState, claimAmount } = props;

  dayjs.extend(utc);
  dayjs.extend(timezone);
  const now = dayjs().tz("Europe/London");

  const currentHour = now.hour();
  const currentMinute = now.minute();

  const addField: PipelineStage.AddFields["$addFields"] = {
    fromHour: {
      $hour: "$config.reportReceivedTime.from",
    },
    fromMinute: {
      $minute: "$config.reportReceivedTime.from",
    },
    toHour: {
      $hour: "$config.reportReceivedTime.to",
    },
    toMinute: {
      $minute: "$config.reportReceivedTime.to",
    },
  };

  const match: PipelineStage.Match["$match"] = {
    role: Role.POST_QA,
    status: "Active",
    "leave.status": { $ne: "Approved" },
    "config.leadView": claimType,
    "config.reportReceivedTime": { $exists: true },
  };

  const zoneState: HydratedDocument<IZoneStateMaster> | null =
    await ZoneStateMaster.findOne({
      State: { $regex: new RegExp(providerState, "i") },
    });

  if (zoneState) {
    match["zone"] = zoneState?.Zone;
  }

  if (claimAmount > 0) {
    const claimAmountQuery = getClaimAmountQuery(claimAmount);
    if (!!claimAmountQuery) {
      match["config.claimAmount"] = claimAmountQuery;
    }
  }

  const pipeline: PipelineStage[] = [
    {
      $match: match,
    },
    { $addFields: addField },
    {
      $match: {
        $or: [
          {
            "config.reportReceivedTime.is24Hour": true,
          },
          {
            $expr: {
              $and: [
                {
                  $lt: [
                    {
                      $add: [
                        "$fromHour",
                        {
                          $divide: ["$fromMinute", 60],
                        },
                      ],
                    },
                    {
                      $add: [
                        currentHour,
                        {
                          $divide: [currentMinute, 60],
                        },
                      ],
                    },
                  ],
                },
                {
                  $gt: [
                    {
                      $add: [
                        "$toHour",
                        {
                          $divide: ["$toMinute", 60],
                        },
                      ],
                    },
                    {
                      $add: [
                        currentHour,
                        {
                          $divide: [currentMinute, 60],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
    { $sort: { "config.thresholdUpdatedAt": 1 } },
    { $limit: 1 },
  ];

  const users: IUser[] = await User.aggregate(pipeline);

  if (users?.length > 0) return users[0];

  return null;
};

router.post(async (req) => {
  const { id, userId, userName, type } = await req?.json();

  try {
    if (!id) throw new Error("id is required!");
    await connectDB(Databases.FNI);

    let stage = NumericStage.POST_QC;

    let eventRemarks: string = EventNames.INVESTIGATION_REPORT_SUBMITTED;

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findById(id);

    if (!dashboardData) throw new Error(`No record found with the id ${id}`);

    const caseDetail: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(dashboardData?.caseId);

    if (!caseDetail)
      throw new Error(
        `No Claim Case found with the id ${dashboardData?.caseId}`
      );
    const inv: HydratedDocument<Investigator> | null =
      await ClaimInvestigator.findById(userId);

    if (!inv) throw new Error(`No investigator found with the id ${userId}`);

    if (dashboardData?.claimType === "PreAuth") {
      if (!!inv?.pendency?.preAuth && inv?.pendency?.preAuth?.length > 0) {
        inv.pendency.preAuth = inv?.pendency?.preAuth?.filter(
          (claimId) => claimId !== dashboardData?.claimId
        );
      }
    } else if (dashboardData?.claimType === "Reimbursement") {
      if (!!inv?.pendency?.rm && inv?.pendency?.rm?.length > 0) {
        inv.pendency.rm = inv?.pendency?.rm?.filter(
          (claimId) => claimId !== dashboardData?.claimId
        );
      }
    }

    let findings: ITasksAndDocuments | null = null;

    if (caseDetail?.allocationType === "Single") {
      dashboardData.claimInvestigators = dashboardData?.claimInvestigators?.map(
        (inv) => ({ ...inv, investigationStatus: "Completed" })
      );
      findings = caseDetail?.singleTasksAndDocs || null;
    } else if (caseDetail?.allocationType === "Dual") {
      if (type === "notInvestigator") {
        dashboardData.claimInvestigators =
          dashboardData?.claimInvestigators?.map((inv) => {
            return { ...inv, investigationStatus: "Completed" };
          });
      } else {
        if (!userId) throw new Error("userId is required");
        dashboardData.claimInvestigators =
          dashboardData?.claimInvestigators?.map((inv) => {
            if (inv?._id?.toString() === userId)
              return { ...inv, investigationStatus: "Completed" };
            return inv;
          });
      }

      if (!type) {
        if (
          caseDetail?.insuredTasksAndDocs?.investigator?.toString() === userId
        ) {
          findings = caseDetail?.insuredTasksAndDocs || null;
        } else if (
          caseDetail?.hospitalTasksAndDocs?.investigator?.toString() === userId
        ) {
          findings = caseDetail?.hospitalTasksAndDocs || null;
        }
      }
    } else throw new Error("allocationType not found");

    if (type === "notInvestigator") {
      if (caseDetail?.allocationType === "Single") {
        caseDetail.singleTasksAndDocs!.invReportReceivedDate = new Date();
      } else if (caseDetail?.allocationType === "Dual") {
        caseDetail.insuredTasksAndDocs!.invReportReceivedDate = new Date();
        caseDetail.hospitalTasksAndDocs!.invReportReceivedDate = new Date();
      }
    } else {
      if (!findings) throw new Error("Failed to find the tasks and documents");
      findings.invReportReceivedDate = new Date();
    }

    const canClose = dashboardData?.claimInvestigators?.every(
      (inv) => inv?.investigationStatus === "Completed"
    );

    if (canClose) {
      dashboardData.dateOfFallingIntoPostQaBucket = new Date();

      dashboardData.expedition =
        dashboardData?.expedition && dashboardData?.expedition?.length > 0
          ? dashboardData?.expedition?.map((el) => ({ ...el, noted: true }))
          : dashboardData?.expedition;
      let postQaEmail: string = "";
      let postQaUsername: string = "";
      if (!!dashboardData?.postQa) {
        stage = NumericStage.POST_QA_REWORK;
        const postQaUser = await User.findById(dashboardData?.postQa);
        if (!postQaUser) throw new Error("no postqa user found");
        postQaEmail = postQaUser?.email;
        postQaUsername = postQaUser?.name;
      } else {
        const user = await findPostQaUser({
          claimType: dashboardData?.claimType,
          providerState: dashboardData?.hospitalDetails?.providerState,
          claimAmount: dashboardData?.claimDetails?.claimAmount || 0,
        });

        if (!user) {
          eventRemarks =
            eventRemarks += `, and moved to Post QA Lead bucket because no Post Qa matched`;
        } else {
          const newUser: HydratedDocument<IUser> | null = await User.findById(
            user?._id
          );

          if (!newUser)
            throw new Error(`No user found with the id ${user?._id}`);
          postQaEmail = newUser?.email;
          postQaUsername = newUser?.name;
          dashboardData.postQa = user?._id;

          if (dashboardData?.claimType === "PreAuth") {
            if (
              !!newUser?.config?.preAuthPendency &&
              newUser?.config?.preAuthPendency > 0
            ) {
              newUser.config.preAuthPendency += 1;
            } else {
              newUser.config.preAuthPendency = 1;
            }

            if (!!newUser?.config?.pendency) {
              newUser!.config!.pendency!.preAuth =
                !!newUser?.config?.pendency?.preAuth &&
                newUser?.config?.pendency?.preAuth?.length > 0
                  ? [
                      ...newUser?.config?.pendency?.preAuth,
                      { claimId: dashboardData?.claimId, type: "Auto" },
                    ]
                  : [{ claimId: dashboardData?.claimId, type: "Auto" }];
            } else {
              newUser!.config!.pendency = {
                preAuth: [{ claimId: dashboardData?.claimId, type: "Auto" }],
                rm: [],
              };
            }
          } else {
            if (
              !!newUser?.config?.rmPendency &&
              newUser?.config?.rmPendency > 0
            ) {
              newUser.config.rmPendency += 1;
            } else {
              newUser.config.rmPendency = 1;
            }

            if (!!newUser?.config?.pendency) {
              newUser!.config!.pendency!.rm =
                !!newUser?.config?.pendency?.rm &&
                newUser?.config?.pendency?.rm?.length > 0
                  ? [
                      ...newUser?.config?.pendency?.rm,
                      { claimId: dashboardData?.claimId, type: "Auto" },
                    ]
                  : [{ claimId: dashboardData?.claimId, type: "Auto" }];
            } else {
              newUser!.config!.pendency = {
                rm: [{ claimId: dashboardData?.claimId, type: "Auto" }],
                preAuth: [],
              };
            }
          }

          newUser.config.thresholdUpdatedAt = new Date();

          eventRemarks =
            eventRemarks += `, and assigned to post qa ${user?.name}`;
          await newUser!.save();
        }
      }
      if (dashboardData?.stage === NumericStage.IN_FIELD_REWORK) {
        await informInvestigators({
          userName,
          data: dashboardData,
          userId,
          postQaEmail,
          postQaUsername,
        });
      }
      dashboardData.stage = stage;
    } else {
      eventRemarks = `Investigator ${
        userName || "-"
      } completed the case and submitted`;
    }

    dashboardData.invReportReceivedDate = new Date();

    await inv.save();
    await caseDetail.save();
    const data = await dashboardData.save();

    dayjs.extend(utc);
    dayjs.extend(timezone);
    await captureCaseEvent({
      claimId: dashboardData?.claimId,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      eventName: EventNames.INVESTIGATION_REPORT_SUBMITTED,
      stage: stage,
      userId: userId as string,
      eventRemarks,
      userName,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Completed successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
        data: null,
      },
      { status: error?.statusCode || 500 }
    );
  }
});

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}
async function informInvestigators({
  data,
  userName,
  userId,
  postQaEmail,
  postQaUsername,
}: {
  data: IDashboardData;
  userName: string;
  userId: string;
  postQaEmail: string;
  postQaUsername: string;
}) {
  const claimType = data?.claimType;
  const recipients: string[] = [postQaEmail];
  const ccRecipients: string[] = [
    "Sanjay.Kumar16@nivabupa.com",
    "FIallocation@nivabupa.com",
  ];
  let invName = "";

  const investigators: Investigator[] = await ClaimInvestigator.find({
    _id: {
      $in: data?.claimInvestigators?.map((inv: any) => inv?._id),
    },
  });

  if (investigators && investigators?.length > 0) {
    investigators?.map((inv) => {
      invName += inv?.investigatorName + ", ";
      recipients.push(...inv?.email);
    });
  } else throw new Error("No investigator found");

  const userIds = [new Types.ObjectId(userId)];

  if (data?.teamLead)
    userIds?.push(data?.teamLead as unknown as Types.ObjectId);

  if (data?.clusterManager)
    userIds?.push(data?.clusterManager as unknown as Types.ObjectId);

  const users: IUser[] = await User.find({ _id: { $in: userIds } });

  if (users && users?.length > 0) {
    users?.map((u) => ccRecipients?.push(u?.email));
  }

  const html = `<!doctypehtml><html lang=en xmlns:o=urn:schemas-microsoft-com:office:office xmlns:v=urn:schemas-microsoft-com:vml><title></title><meta content="text/html; charset=utf-8"http-equiv=Content-Type><meta content="width=device-width,initial-scale=1"name=viewport><!--[if mso]><xml><o:officedocumentsettings><o:pixelsperinch>96</o:pixelsperinch><o:allowpng></o:officedocumentsettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]--><style>*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none}sub,sup{line-height:0;font-size:75%}@media (max-width:520px){.mobile_hide{display:none}.row-content{width:100%!important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}}</style><!--[if mso ]><style>sub,sup{font-size:100%!important}sup{mso-text-raise:10%}sub{mso-text-raise:-10%}</style><![endif]--><body class=body style=background-color:#fff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none><table border=0 cellpadding=0 cellspacing=0 class=nl-container role=presentation style=mso-table-lspace:0;mso-table-rspace:0;background-color:#fff width=100%><tr><td><table border=0 cellpadding=0 cellspacing=0 class="row row-1"role=presentation style=mso-table-lspace:0;mso-table-rspace:0 width=100% align=center><tr><td><table border=0 cellpadding=0 cellspacing=0 class="row-content stack"role=presentation style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:500px;margin:0 auto"width=500 align=center><tr><td class="column column-1"style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0 width=100%><table border=0 cellpadding=10 cellspacing=0 class="block-1 heading_block"role=presentation style=mso-table-lspace:0;mso-table-rspace:0 width=100%><tr><td class=pad><h3 style="margin:0;color:#7747ff;direction:ltr;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:24px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:left;margin-top:0;margin-bottom:0;mso-line-height-alt:28.799999999999997px"><span class=tinyMce-placeholder style=word-break:break-word>Investigator closed rework case</span></h3></table></table></table><table border=0 cellpadding=0 cellspacing=0 class="row row-2"role=presentation style=mso-table-lspace:0;mso-table-rspace:0;background-color:#fff width=100% align=center><tr><td><table border=0 cellpadding=0 cellspacing=0 class="row-content stack"role=presentation style="mso-table-lspace:0;mso-table-rspace:0;color:#000;background-color:#fff;width:500px;margin:0 auto"width=500 align=center><tr><td class="column column-1"style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0 width=100%><table border=0 cellpadding=10 cellspacing=0 class="block-1 paragraph_block"role=presentation style=mso-table-lspace:0;mso-table-rspace:0;word-break:break-word width=100%><tr><td class=pad><div style="color:#101112;direction:ltr;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:16px;font-weight:400;letter-spacing:0;line-height:120%;text-align:left;mso-line-height-alt:19.2px"><p style=margin:0>Dear ${postQaUsername}<br><br>
  A case with the preauth ID/ Claim ID ${data?.claimId} rework done and resubmitted by ${userName} and it’s in your bucket, please check and close accordingly.<br><br>Best Regards
  <br>FRCU</div></table></table></table></table>`;

  await sendEmail({
    from: FromEmails.DO_NOT_REPLY,
    recipients,
    cc_recipients: ccRecipients,
    subject: `Investigator closed rework case  (${data?.claimId})`,
    html,
  });
}
