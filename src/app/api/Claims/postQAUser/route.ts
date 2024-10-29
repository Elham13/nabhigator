import DashboardData from "@/lib/Models/dashboardData";
import User from "@/lib/Models/user";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import {
  EventNames,
  IDashboardData,
  IUser,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, PipelineStage, Types } from "mongoose";
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
      const match: PipelineStage.Match["$match"] = {
        role: "Post QA",
      };

      const pipeline: PipelineStage[] = [
        { $match: match },
        { $sort: !!sort ? sort : { updatedAt: -1 } },
        { $skip: skip && limit ? skip * limit : 0 },
        { $limit: limit || 10 },
      ];

      data = await User.aggregate(pipeline);
      count = await User.countDocuments(match);
    } else if (
      [
        "updateShiftTime",
        "updateClaimType",
        "updateThreshold",
        "updateStatus",
      ].includes(action)
    ) {
      const { id, time, claimType, type, threshold, status } = body;
      if (!id) throw new Error("id is required");

      const user: HydratedDocument<IUser> | null = await User.findById(id);

      if (!user) throw new Error(`No user found with the id ${id}`);

      if (action === "updateShiftTime") {
        if (!time) throw new Error("Shift time values are required");
        user.config.reportReceivedTime = time;
      } else if (action === "updateClaimType") {
        if (!claimType) throw new Error("Claim type is required");
        user.config.leadView = claimType;
      } else if (action === "updateThreshold") {
        if (!type) throw new Error("type is required");
        if (!threshold && threshold !== 0)
          throw new Error("threshold is required");

        const thresholdType: "dailyThreshold" | "dailyAssign" = type;
        user.config[thresholdType] = threshold;
      } else if (action === "updateStatus") {
        if (!status) throw new Error("status is required");

        user.status = status;
      }
      data = await user.save();
    } else if (action === "assignCases") {
      const { id, caseIds, userId } = body;
      if (!id) throw new Error("id is required");
      if (!userId) throw new Error("userId is required");
      if (!caseIds || caseIds?.length < 1)
        throw new Error("caseIds is required");

      const user: HydratedDocument<IUser> | null = await User.findById(id);
      if (!user) throw new Error(`Failed to find a user with the id ${id}`);

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
          } else
            throw new Error(
              "Daily limit reached, please select a different user or increase the daily assign"
            );
        } else {
          // There is no updated date, so we know that it's the first time this user is getting assigned
          user.config.dailyAssign = 1;
          user.config.thresholdUpdatedAt = new Date();
        }
      } else {
        // Limit is not reached
        user.config.dailyAssign = !!dailyAssign ? dailyAssign + 1 : 1;
        user.config.thresholdUpdatedAt = new Date();
      }

      await user?.save();

      await DashboardData.updateMany(
        {
          _id: { $in: caseIds?.map((i: string) => new Types.ObjectId(i)) },
        },
        {
          $set: {
            postQa: user?._id,
            dateOfFallingIntoPostQaBucket: new Date(),
          },
        }
      );

      for (const dId of caseIds) {
        await captureCaseEvent({
          eventName: EventNames.MANUALLY_ASSIGNED_TO_POST_QA,
          eventRemarks: `Manually assigned to ${user?.name}`,
          intimationDate: dayjs()
            .tz("Asia/Kolkata")
            .format("DD-MMM-YYYY hh:mm:ss A"),
          stage: NumericStage.POST_QC,
          claimId: dId,
          userId,
        });
      }
    } else throw new Error(`Wrong action ${action}`);

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
