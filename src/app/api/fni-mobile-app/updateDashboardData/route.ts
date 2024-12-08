import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases, FromEmails } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DashboardData from "@/lib/Models/dashboardData";
import { HydratedDocument, Types } from "mongoose";
import {
  CaseDetail,
  EventNames,
  IDashboardData,
  ILocked,
  IUser,
  Investigator,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import ClaimCase from "@/lib/Models/claimCase";
import User from "@/lib/Models/user";
import sendEmail from "@/lib/helpers/sendEmail";
import { captureCaseEvent } from "../../Claims/caseEvent/helpers";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const {
    id,
    action,
    stage,
    userId,
    postQaComment,
    postQARecommendation,
    userName,
    claimSubType,
    remarks,
  } = await req?.json();

  try {
    if (!id) throw new Error("id is required");
    if (!action) throw new Error("action is required");

    await connectDB(Databases.FNI);

    let message: string = "";
    let eventName: string = "";
    let eventRemarks: string = "";
    let data: any = null;

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findById(id);

    if (!dashboardData) throw new Error(`No data found with the id ${id}`);

    const caseDetail: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(dashboardData?.caseId);

    if (!caseDetail)
      throw new Error(
        `No case detail found with the id ${dashboardData?.caseId}`
      );

    if (action === "changeStage") {
      if (!stage) throw new Error("stage is required!");

      if (stage === NumericStage.INVESTIGATION_ACCEPTED) {
        eventName = EventNames.CASE_ACCEPTED;
        eventRemarks = "Investigation Accepted";
        message = eventRemarks;
      } else if (stage === NumericStage.IN_FIELD_REWORK) {
        dashboardData.expedition =
          dashboardData?.expedition && dashboardData?.expedition?.length > 0
            ? dashboardData?.expedition?.map((el: any) => ({
                ...el,
                noted: true,
              }))
            : dashboardData?.expedition;
        dashboardData.claimInvestigators =
          dashboardData?.claimInvestigators?.map((inv) => ({
            ...inv,
            investigationStatus: "Rework",
          }));
        eventName = EventNames.RETURN_TO_FIELD;
        eventRemarks = `Returned back to field investigator from POST QA with comment: ${postQaComment}`;

        message = "Case returned back to field investigator";
        await informInvestigatorForRework({
          userName,
          data: dashboardData,
          userId,
          isCancel: true,
        });
      }
      dashboardData.stage = stage;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: eventName,
              userId,
            },
          ]
        : [
            {
              actionName: eventName,
              userId,
            },
          ];

      if (!!postQaComment) {
        caseDetail.postQaComment = postQaComment;
        await caseDetail?.save();
      }
      if (!!postQARecommendation) {
        caseDetail.postQARecommendation = postQARecommendation;
        dashboardData.finalOutcome =
          postQARecommendation?.frcuRecommendationOnClaims?.value || "-";
        await caseDetail?.save();
      }

      data = await dashboardData.save();
    } else if (action === "lock") {
      const msg = dashboardData?.locked?.status ? "Unlocked" : "Locked";
      const user: HydratedDocument<IUser> | null = await User.findById(userId);
      if (!user) throw new Error(`No user found with the id ${userId}`);

      const newLocked: ILocked = {
        status: !dashboardData?.locked?.status,
        role: user?.activeRole,
        name: user?.name,
      };
      dashboardData.locked = newLocked;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: msg,
              userId,
            },
          ]
        : [
            {
              actionName: msg,
              userId,
            },
          ];
      data = await dashboardData.save();

      eventName = data?.locked?.status
        ? EventNames.CASE_LOCKED
        : EventNames.CASE_UNLOCKED;

      eventRemarks = eventName;

      message = `Cases successfully ${msg}`;
    } else if (action === "skipInvestigationAndComplete") {
      dashboardData.expedition =
        dashboardData?.expedition && dashboardData?.expedition?.length > 0
          ? dashboardData?.expedition?.map((el: any) => ({
              ...el,
              noted: true,
            }))
          : dashboardData?.expedition;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_AND_COMPLETING,
              userId,
            },
          ]
        : [
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_AND_COMPLETING,
              userId,
            },
          ];
      dashboardData.stage = NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING;

      eventName = EventNames.INVESTIGATION_SKIPPED_AND_COMPLETING;
      eventRemarks = `${eventName} with remarks ${remarks}`;

      await informInvestigators({ userName, data: dashboardData, userId });

      data = await dashboardData.save();
      message =
        "Investigation successfully skipped, please start completing investigation.";
    } else if (action === "skipInvestigationAndReAssign") {
      dashboardData.expedition =
        dashboardData?.expedition && dashboardData?.expedition?.length > 0
          ? dashboardData?.expedition?.map((el: any) => ({
              ...el,
              noted: true,
            }))
          : dashboardData?.expedition;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING,
              userId,
            },
          ]
        : [
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING,
              userId,
            },
          ];
      dashboardData.stage = NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING;
      eventName = eventRemarks =
        EventNames.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING;

      await informInvestigators({ userName, data: dashboardData, userId });

      data = await dashboardData.save();
      message =
        "Investigation successfully skipped, please Re-Assign to an investigator.";
    } else if (action === "cancelSkipInvestigation") {
      dashboardData.expedition =
        dashboardData?.expedition && dashboardData?.expedition?.length > 0
          ? dashboardData?.expedition?.map((el: any) => ({
              ...el,
              noted: true,
            }))
          : dashboardData?.expedition;
      dashboardData.stage = NumericStage.IN_FIELD_FRESH;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_CANCELEd,
              userId,
            },
          ]
        : [
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_CANCELEd,
              userId,
            },
          ];

      eventName = eventRemarks = EventNames.INVESTIGATION_SKIPPED_CANCELEd;

      await informInvestigators({
        userName,
        data: dashboardData,
        userId,
        isCancel: true,
      });

      data = await dashboardData.save();
      message = "The case sent back to the investigator";
    } else if (action === "changeClaimSubType") {
      if (!claimSubType) throw new Error(`claimSubType is required`);
      dashboardData.claimSubType = claimSubType;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: "Claim Sub Type changed",
              userId,
            },
          ]
        : [
            {
              actionName: "Claim Sub Type changed",
              userId,
            },
          ];

      data = await dashboardData.save();
    }

    dayjs.extend(utc);
    dayjs.extend(timezone);
    await captureCaseEvent({
      claimId: dashboardData?.claimId,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      eventName,
      stage: stage,
      userId: userId as string,
      eventRemarks,
      userName: userName,
    });

    return NextResponse.json(
      {
        success: true,
        message,
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
  isCancel,
}: {
  data: IDashboardData;
  userName: string;
  userId: string;
  isCancel?: boolean;
}) {
  const claimType = data?.claimType;
  const recipients: string[] = [];
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

  const html = `<!doctypehtml><html lang=en xmlns:o=urn:schemas-microsoft-com:office:office xmlns:v=urn:schemas-microsoft-com:vml><title></title><meta content="text/html; charset=utf-8"http-equiv=Content-Type><meta content="width=device-width,initial-scale=1"name=viewport><!--[if mso]><xml><o:officedocumentsettings><o:pixelsperinch>96</o:pixelsperinch><o:allowpng></o:officedocumentsettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]--><style>*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none}sub,sup{line-height:0;font-size:75%}@media (max-width:520px){.mobile_hide{display:none}.row-content{width:100%!important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}}</style><!--[if mso ]><style>sub,sup{font-size:100%!important}sup{mso-text-raise:10%}sub{mso-text-raise:-10%}</style><![endif]--><body class=body style=background-color:#fff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none><table border=0 cellpadding=0 cellspacing=0 class=nl-container role=presentation style=mso-table-lspace:0;mso-table-rspace:0;background-color:#fff width=100%><tr><td><table border=0 cellpadding=0 cellspacing=0 class="row row-1"role=presentation style=mso-table-lspace:0;mso-table-rspace:0 width=100% align=center><tr><td><table border=0 cellpadding=0 cellspacing=0 class="row-content stack"role=presentation style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:500px;margin:0 auto"width=500 align=center><tr><td class="column column-1"style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0 width=100%><table border=0 cellpadding=10 cellspacing=0 class="block-1 heading_block"role=presentation style=mso-table-lspace:0;mso-table-rspace:0 width=100%><tr><td class=pad><h3 style="margin:0;color:#7747ff;direction:ltr;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:24px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:left;margin-top:0;margin-bottom:0;mso-line-height-alt:28.799999999999997px"><span class=tinyMce-placeholder style=word-break:break-word>Investigation skipped</span></h3></table></table></table><table border=0 cellpadding=0 cellspacing=0 class="row row-2"role=presentation style=mso-table-lspace:0;mso-table-rspace:0;background-color:#fff width=100% align=center><tr><td><table border=0 cellpadding=0 cellspacing=0 class="row-content stack"role=presentation style="mso-table-lspace:0;mso-table-rspace:0;color:#000;background-color:#fff;width:500px;margin:0 auto"width=500 align=center><tr><td class="column column-1"style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0 width=100%><table border=0 cellpadding=10 cellspacing=0 class="block-1 paragraph_block"role=presentation style=mso-table-lspace:0;mso-table-rspace:0;word-break:break-word width=100%><tr><td class=pad><div style="color:#101112;direction:ltr;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:16px;font-weight:400;letter-spacing:0;line-height:120%;text-align:left;mso-line-height-alt:19.2px"><p style=margin:0>Dear ${invName}<br><br>A case with the ${
    claimType === "PreAuth" ? "Pre-Auth" : "Claim"
  } ID ${data?.claimId} is ${
    isCancel ? "assigned back to you" : "skipped"
  } by ${userName} and it's ${
    isCancel ? "in your bucket again" : "out of"
  } your bucket, you can contact your team lead regarding any concerns.<br><br>Best Regards<br>Nabhigator</div></table></table></table></table>`;

  await sendEmail({
    from: FromEmails.DO_NOT_REPLY,
    recipients,
    cc_recipients: ccRecipients,
    subject: `Investigation skipped (${data?.claimId})`,
    html,
  });
}
async function informInvestigatorForRework({
  data,
  userName,
  userId,
  isCancel,
}: {
  data: IDashboardData;
  userName: string;
  userId: string;
  isCancel?: boolean;
}) {
  const claimType = data?.claimType;
  const recipients: string[] = [];
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

  const html = `<!doctypehtml><html lang=en xmlns:o=urn:schemas-microsoft-com:office:office xmlns:v=urn:schemas-microsoft-com:vml>
    <title></title>
    <meta content="text/html; charset=utf-8"http-equiv=Content-Type><meta content="width=device-width,initial-scale=1"name=viewport>
    <style>*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none}sub,sup{line-height:0;font-size:75%}@media (max-width:520px){.mobile_hide{display:none}.row-content{width:100%!important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}}
    </style>
    <body class=body style=background-color:#fff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none>
        <table border=0 cellpadding=0 cellspacing=0 class=nl-container role=presentation style=mso-table-lspace:0;mso-table-rspace:0;background-color:#fff width=100%>
            <tr>
                <td>
                    <table border=0 cellpadding=0 cellspacing=0 class="row row-1"role=presentation style=mso-table-lspace:0;mso-table-rspace:0 width=100% align=center>
                        <tr>
                            <td>
                                <table border=0 cellpadding=0 cellspacing=0 class="row-content stack"role=presentation style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:500px;margin:0 auto"width=500 align=center><tr><td class="column column-1"style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0 width=100%><table border=0 cellpadding=10 cellspacing=0 class="block-1 heading_block"role=presentation style=mso-table-lspace:0;mso-table-rspace:0 width=100%><tr><td class=pad><h3 style="margin:0;color:#7747ff;direction:ltr;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:24px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:left;margin-top:0;margin-bottom:0;mso-line-height-alt:28.799999999999997px"><span class=tinyMce-placeholder style=word-break:break-word>Case send by Post QC</span></h3></table></table></table><table border=0 cellpadding=0 cellspacing=0 class="row row-2"role=presentation style=mso-table-lspace:0;mso-table-rspace:0;background-color:#fff width=100% align=center><tr><td><table border=0 cellpadding=0 cellspacing=0 class="row-content stack"role=presentation style="mso-table-lspace:0;mso-table-rspace:0;color:#000;background-color:#fff;width:500px;margin:0 auto"width=500 align=center><tr><td class="column column-1"style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0 width=100%><table border=0 cellpadding=10 cellspacing=0 class="block-1 paragraph_block"role=presentation style=mso-table-lspace:0;mso-table-rspace:0;word-break:break-word width=100%><tr><td class=pad><div style="color:#101112;direction:ltr;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:16px;font-weight:400;letter-spacing:0;line-height:120%;text-align:left;mso-line-height-alt:19.2px"><p style=margin:0>Dear ${invName}<br><br>A case with the preauth ID/ Claim ID ${data?.claimId} is return back to you by ${userName} and it’s in your bucket, please check the triggers mentioned , work and resubmit accordingly. 
.<br><br>Best Regards<br>FRCU.</div></table></table></table></table>`;

  await sendEmail({
    from: FromEmails.DO_NOT_REPLY,
    recipients,
    cc_recipients: ccRecipients,
    subject: `Case send by Post QC (${data?.claimId})`,
    html,
  });
}
