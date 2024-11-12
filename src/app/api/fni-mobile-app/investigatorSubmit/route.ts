import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
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
import { HydratedDocument, PipelineStage } from "mongoose";
import DashboardData from "@/lib/Models/dashboardData";
import ClaimCase from "@/lib/Models/claimCase";
import { captureCaseEvent } from "../../Claims/caseEvent/helpers";
import User from "@/lib/Models/user";
import ZoneStateMaster from "@/lib/Models/zoneStateMaster";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";

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
    { $sort: { "config.thresholdUpdatedAt": -1 } },
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

    const stage = NumericStage.POST_QC;

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

      if (!dashboardData?.postQa) {
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
      dashboardData.stage = stage;
    } else {
      eventRemarks = `Investigator ${
        userName || "-"
      } completed the case and submitted`;
    }

    dashboardData.invReportReceivedDate = new Date();

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
