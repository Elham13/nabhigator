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
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument } from "mongoose";
import DashboardData from "@/lib/Models/dashboardData";
import ClaimCase from "@/lib/Models/claimCase";
import { captureCaseEvent } from "../../Claims/caseEvent/helpers";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { id, userId, userName } = await req?.json();

  try {
    if (!id) throw new Error("id is required!");
    await connectDB(Databases.FNI);

    const stage = NumericStage.POST_QC;

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

    dashboardData.stage = stage;
    dashboardData.actionsTaken = dashboardData?.actionsTaken
      ? [
          ...dashboardData?.actionsTaken,
          {
            actionName: EventNames.INVESTIGATION_REPORT_SUBMITTED,
            userId,
          },
        ]
      : [
          {
            actionName: EventNames.INVESTIGATION_REPORT_SUBMITTED,
            userId,
          },
        ];

    await captureCaseEvent({
      claimId: dashboardData?.claimId,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      eventName: EventNames.INVESTIGATION_REPORT_SUBMITTED,
      stage: stage,
      userId: userId as string,
      eventRemarks: EventNames.INVESTIGATION_REPORT_SUBMITTED,
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
