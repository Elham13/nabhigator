import DashboardData from "@/lib/Models/dashboardData";
import User from "@/lib/Models/user";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import {
  EventNames,
  IDashboardData,
  IUser,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, PipelineStage } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { captureCaseEvent } from "../caseEvent/helpers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  const { action } = body;

  let data: any = null;
  let count: number = 0;
  let message: string = "Fetched";
  let status: number = 200;
  try {
    if (!action) throw new Error("action is required");
    await connectDB(Databases.FNI);

    if (action === "list") {
      const { sort, skip, limit } = body;
      const match: PipelineStage.Match["$match"] = { role: "Post QA" };

      const pipeline: PipelineStage[] = [
        { $match: match },
        { $sort: { updatedAt: -1, ...(!!sort ? sort : {}) } },
        { $skip: skip && limit ? skip * limit : 0 },
        { $limit: limit || 10 },
      ];

      data = await User.aggregate(pipeline);
      count = await User.countDocuments(match);
    } else if (action === "assign") {
      const { userId, claimId, executer, userName, executerName } = body;
      if (!userId) throw new Error("userId is required");
      if (!claimId) throw new Error("claimId is required");

      const dashboardData: HydratedDocument<IDashboardData> | null =
        await DashboardData.findOne({ claimId });

      if (!dashboardData)
        throw new Error(`No data found with claimId ${claimId}`);

      await User.findByIdAndUpdate(
        userId,
        {
          $push: { assignedCases: dashboardData?._id },
          $inc: { "config.dailyAssign": 1 },
        },
        { useFindAndModify: false }
      );

      dashboardData.dateOfFallingIntoPostQaBucket = new Date();
      dashboardData.expedition =
        dashboardData?.expedition && dashboardData?.expedition?.length > 0
          ? dashboardData?.expedition?.map((el) => ({ ...el, noted: true }))
          : dashboardData?.expedition;
      dashboardData.postQa = userId;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: EventNames.MANUALLY_ASSIGNED_TO_POST_QA,
              userId: executer,
            },
          ]
        : [
            {
              actionName: EventNames.MANUALLY_ASSIGNED_TO_POST_QA,
              userId: executer,
            },
          ];

      await captureCaseEvent({
        claimId: dashboardData?.claimId,
        intimationDate:
          dashboardData?.intimationDate ||
          dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
        eventName: EventNames.MANUALLY_ASSIGNED_TO_POST_QA,
        stage: dashboardData?.stage,
        userId: userId as string,
        eventRemarks: `${EventNames.MANUALLY_ASSIGNED_TO_POST_QA} (${userName}), by Post QA Lead ${executerName}`,
        userName: executerName,
      });

      data = await dashboardData.save();
      message = `Case successfully assigned to ${userName}`;
    } else throw new Error("Wrong action");

    return NextResponse.json(
      {
        success: true,
        message,
        data,
        count,
      },
      { status }
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
