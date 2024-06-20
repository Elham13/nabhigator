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
  IUser,
  IZoneStateMaster,
  NumericStage,
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
}

const findPostQaUser = async (props: IProps) => {
  const { claimType, providerState } = props;

  const addField: PipelineStage.AddFields["$addFields"] = {
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
  };

  const targetTime = dayjs().format("hh:mm:ss");

  const match: PipelineStage.Match["$match"] = {
    "config.leadView": claimType,
    "config.reportReceivedTime": { $exists: true },
    $expr: {
      $and: [
        { $lt: ["$fromTimeHour", targetTime] },
        { $gt: ["$toTimeHour", targetTime] },
      ],
    },
  };

  const zoneState: HydratedDocument<IZoneStateMaster> | null =
    await ZoneStateMaster.findOne({
      State: { $regex: new RegExp(providerState, "i") },
    });

  if (zoneState) {
    match["zone"] = zoneState?.Zone;
  }

  const pipeline: PipelineStage[] = [
    {
      $match: {
        $expr: {
          $lte: ["$config.dailyAssign", "$config.dailyThreshold"],
        },
      },
    },
    { $addFields: addField },
    { $match: match },
    { $sort: { "config.thresholdUpdatedAt": 1 } },
  ];

  const users: IUser[] = await User.aggregate(pipeline);

  return users;
};

router.post(async (req) => {
  const { id, userId, userName } = await req?.json();

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

    dashboardData.dateOfFallingIntoPostQaBucket = new Date();

    dashboardData.expedition =
      dashboardData?.expedition && dashboardData?.expedition?.length > 0
        ? dashboardData?.expedition?.map((el) => ({ ...el, noted: true }))
        : dashboardData?.expedition;

    caseDetail.invReportReceivedDate = new Date();

    const users: IUser[] = await findPostQaUser({
      claimType: dashboardData?.claimType,
      providerState: dashboardData?.hospitalDetails?.providerState,
    });

    if (users && users?.length > 0) {
      let isAssigned = false;
      for (const obj of users) {
        const user: HydratedDocument<IUser> | null = await User.findById(
          obj?._id
        );

        if (!user)
          throw new Error(`Failed to find a user with the id ${obj?._id}`);

        const dailyThreshold = user?.config?.dailyThreshold || 0;
        const dailyAssign = user?.config?.dailyAssign || 0;
        const updatedAt = user?.config?.thresholdUpdatedAt || null;

        const dailyLimitReached = dailyThreshold - dailyAssign <= 1;

        if (dailyLimitReached) {
          if (updatedAt) {
            const noOfDaysSinceUpdated = dayjs()
              .startOf("day")
              .diff(dayjs(updatedAt).startOf("day"), "day");

            if (noOfDaysSinceUpdated > 0) {
              // It is not updated today, therefore reset the daily assign
              user.config.dailyAssign = 1;
              user.config.thresholdUpdatedAt = new Date();
              dashboardData.postQa = user?._id;
              eventRemarks =
                eventRemarks += `, and assigned to post qa ${user?.name}`;
              await user.save();
              isAssigned = true;
              break;
            }
          } else {
            // There is no updated date, so we know that it's the first time this user is getting assigned
            user.config.dailyAssign = 1;
            user.config.thresholdUpdatedAt = new Date();
            dashboardData.postQa = user?._id;
            eventRemarks =
              eventRemarks += `, and assigned to post qa ${user?.name}`;
            await user.save();
            isAssigned = true;
            break;
          }
        } else {
          // Limit is not reached
          user.config.dailyAssign = user?.config?.dailyAssign
            ? user.config.dailyAssign + 1
            : 1;
          user.config.thresholdUpdatedAt = new Date();
          dashboardData.postQa = user?._id;
          eventRemarks =
            eventRemarks += `, and assigned to post qa ${user?.name}`;
          await user.save();
          isAssigned = true;
          break;
        }
      }

      if (!isAssigned) {
        eventRemarks =
          eventRemarks += `, and moved to Post QA Lead bucket because no Post Qa matched`;
      }
    }

    dashboardData.stage = stage;
    dashboardData.actionsTaken = dashboardData?.actionsTaken
      ? [
          ...dashboardData?.actionsTaken,
          {
            actionName: eventRemarks,
            userId,
          },
        ]
      : [
          {
            actionName: eventRemarks,
            userId,
          },
        ];

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

    await caseDetail.save();
    const data = await dashboardData.save();

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
