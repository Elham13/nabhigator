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

const router = createEdgeRouter<NextRequest, {}>();

interface IProps {
  claimType: "PreAuth" | "Reimbursement";
  providerState: string;
  claimAmount: number;
}

const getClaimAmountQuery = (claimAmount: number) => {
  let amountString = "";
  if (claimAmount < 100000) amountString = "Less than 1 Lakh";
  else if (claimAmount > 100000 && claimAmount < 500000)
    amountString = "1 Lakh - 5 Lakhs";
  else if (claimAmount > 500000 && claimAmount < 1000000)
    amountString = "5 Lakhs - 10 Lakhs";
  else if (claimAmount > 1000000 && claimAmount < 2000000)
    amountString = "10 Lakhs - 20 Lakhs";
  else if (claimAmount > 2000000 && claimAmount < 5000000)
    amountString = "20 Lakhs - 50 Lakhs";
  else if (claimAmount > 5000000) amountString = "Greater than 50 Lakhs";

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
  ];

  const users: IUser[] = await User.aggregate(pipeline);

  return users;
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

      const users: IUser[] = await findPostQaUser({
        claimType: dashboardData?.claimType,
        providerState: dashboardData?.hospitalDetails?.providerState,
        claimAmount: dashboardData?.claimDetails?.claimAmount || 0,
      });

      if (users && users?.length > 0) {
        let isAssigned = false;
        for (const user of users) {
          const dailyThreshold = user?.config?.dailyThreshold || 0;
          let dailyAssign = user?.config?.dailyAssign || 0;
          const updatedAt = user?.config?.thresholdUpdatedAt || null;

          if (!!updatedAt) {
            const noOfDaysSinceUpdated = dayjs()
              .startOf("day")
              .diff(dayjs(updatedAt).startOf("day"), "day");

            if (noOfDaysSinceUpdated > 0) {
              // Means it's not updated today
              dailyAssign = 0;
            }
          } else {
            // There is no updated date so we know this user is getting assigned for the first time
            dailyAssign = 0;
          }

          const dailyLimitReached = dailyThreshold - dailyAssign < 1;

          if (!dailyLimitReached) {
            // Limit is not reached
            const newUser: HydratedDocument<IUser> | null = await User.findById(
              user?._id
            );

            newUser!.config.dailyAssign = !!newUser?.config?.dailyAssign
              ? newUser!.config.dailyAssign + 1
              : 1;
            newUser!.config.thresholdUpdatedAt = new Date();
            dashboardData.postQa = user?._id;
            eventRemarks =
              eventRemarks += `, and assigned to post qa ${user?.name}`;
            await newUser!.save();
            isAssigned = true;
            break;
          }
        }

        if (!isAssigned) {
          eventRemarks =
            eventRemarks += `, and moved to Post QA Lead bucket because no Post Qa matched`;
        }
      } else {
        eventRemarks =
          eventRemarks += `, and moved to Post QA Lead bucket because no Post Qa matched`;
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

const pipeline = [
  {
    $match: {
      $expr: {
        $lte: ["$config.dailyAssign", "$config.dailyThreshold"],
      },
    },
  },
  {
    $addFields: {
      fromTimeHour: {
        $dateToString: {
          format: "%H:%M:%S",
          date: "$config.reportReceivedTime.from",
        },
      },
      toTimeHour: {
        $dateToString: {
          format: "%H:%M:%S",
          date: "$config.reportReceivedTime.to",
        },
      },
    },
  },
  {
    $match: {
      status: "Active",
      "config.leadView": "PreAuth",
      "config.reportReceivedTime": {
        $exists: true,
      },
      $expr: {
        $and: [
          {
            $lt: ["$fromTimeHour", "08:49:41"],
          },
          {
            $gt: ["$toTimeHour", "08:49:41"],
          },
        ],
      },
      zone: "East",
    },
  },
  {
    $sort: {
      "config.thresholdUpdatedAt": 1,
    },
  },
];
