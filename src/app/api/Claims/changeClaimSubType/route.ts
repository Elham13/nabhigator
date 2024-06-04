import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import { HydratedDocument } from "mongoose";
import {
  EventNames,
  IDashboardData,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import DashboardData from "@/lib/Models/dashboardData";
import { captureCaseEvent } from "../caseEvent/helpers";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { id, claimSubType, userName, origin } = await req?.json();

  try {
    if (!id) throw new Error("id is missing");
    await connectDB(Databases.FNI);

    const data: HydratedDocument<IDashboardData> | null =
      await DashboardData.findById(id);

    if (!data) throw new Error(`No record found with the id ${id}`);

    data.claimSubType = claimSubType;

    if (claimSubType === "PA/CI" && origin === "investigator") {
      data.stage = NumericStage.PENDING_FOR_PRE_QC;
      await captureCaseEvent({
        eventName: EventNames.SENT_BACK_TO_PRE_QC_DUE_TO_PA,
        intimationDate:
          data?.intimationDate ||
          dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
        stage: NumericStage.PENDING_FOR_PRE_QC,
        claimId: data?.claimId,
        eventRemarks:
          "Case came back to Pre-QC bucket because investigator selected",
        userName,
      });
    }

    const response = await data.save();

    return NextResponse.json(
      {
        success: true,
        message: "Fetched",
        data: response,
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
