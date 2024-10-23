import connectDB from "@/lib/db/dbConnectWithMongoose";
import { getStageLabel } from "@/lib/helpers";
import DashboardData from "@/lib/Models/dashboardData";
import { Databases } from "@/lib/utils/types/enums";
import {
  EventNames,
  IDashboardData,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { captureCaseEvent } from "../caseEvent/helpers";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  const { id, stage, userName } = body;
  try {
    if (!id) throw new Error(`id is required`);
    if (!stage) throw new Error(`stage is required`);
    if (!userName) throw new Error(`userName is required`);

    const newStage = parseInt(stage) as NumericStage;

    await connectDB(Databases.FNI);

    const data: HydratedDocument<IDashboardData> | null =
      await DashboardData.findById(id);

    if (!data) throw new Error(`No data found with the id ${id}`);

    // if (data?.stage === newStage)
    //   throw new Error(
    //     `This case is already in ${getStageLabel(data?.stage)} stage`
    //   );

    // if (data?.stage === NumericStage.PENDING_FOR_PRE_QC)
    //   throw new Error(
    //     `You should not change a case with the stage ${getStageLabel(
    //       data?.stage
    //     )}`
    //   );

    // if (newStage === NumericStage.CLOSED)
    //   throw new Error(`You should not close a case all of a sudden`);

    dayjs.extend(utc);
    dayjs.extend(timezone);

    captureCaseEvent({
      eventName: EventNames.STAGE_CHANGE,
      intimationDate:
        data?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      stage: newStage,
      userName,
      claimId: data?.claimId,
      eventRemarks: `Stage changed from ${getStageLabel(
        data?.stage
      )} to ${getStageLabel(newStage)}`,
    });

    data.stage = newStage;
    await data.save();

    return NextResponse.json(
      {
        success: true,
        message: `Successfully changed to ${getStageLabel(newStage)}`,
        data: null,
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
