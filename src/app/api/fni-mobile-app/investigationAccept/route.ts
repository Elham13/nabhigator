import connectDB from "@/lib/db/dbConnectWithMongoose";
import ClaimCase from "@/lib/Models/claimCase";
import DashboardData from "@/lib/Models/dashboardData";
import { Databases } from "@/lib/utils/types/enums";
import {
  CaseDetail,
  EventNames,
  IDashboardData,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { captureCaseEvent } from "../../Claims/caseEvent/helpers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { id, stage, userId, userName } = await req?.json();

  try {
    if (!id) throw new Error("id is required");
    if (!userName) throw new Error("userName is required");
    if (!stage) throw new Error("stage is required");

    await connectDB(Databases.FNI);

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findById(id);

    if (!dashboardData) throw new Error(`No data found with the id ${id}`);

    const caseDetail: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(dashboardData?.caseId);

    if (!caseDetail)
      throw new Error(
        `No case detail found with the id ${dashboardData?.caseId}`
      );

    if (caseDetail?.allocationType === "Single") {
      dashboardData.claimInvestigators = dashboardData?.claimInvestigators?.map(
        (inv) => ({ ...inv, investigationStatus: "Accepted" })
      );
    } else if (caseDetail?.allocationType === "Dual") {
      if (!userId) throw new Error("userId is required");
      dashboardData.claimInvestigators = dashboardData?.claimInvestigators?.map(
        (inv) => {
          if (inv?._id?.toString() === userId)
            return { ...inv, investigationStatus: "Accepted" };
          return inv;
        }
      );
    } else throw new Error("allocationType not found");

    dashboardData.stage = stage;

    const data = await dashboardData.save();

    dayjs.extend(utc);
    dayjs.extend(timezone);
    await captureCaseEvent({
      claimId: dashboardData?.claimId,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      eventName: EventNames.CASE_ACCEPTED,
      stage: dashboardData?.stage,
      userId: userId as string,
      eventRemarks: `Investigator ${userName || "-"} accepted the case.`,
      userName,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Stage changed successfully",
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
