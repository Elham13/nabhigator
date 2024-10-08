import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { HydratedDocument } from "mongoose";
import {
  ClaimInvestigator as IClaimInvestigator,
  EventNames,
  IDashboardData,
  Investigator,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import DashboardData from "@/lib/Models/dashboardData";
import { captureCaseEvent } from "../caseEvent/helpers";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import ClaimCase from "@/lib/Models/claimCase";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  const { _id, dashboardDataId, allocationType, user } = body;

  try {
    if (!_id) throw new Error("_id is missing in body");
    if (!dashboardDataId) throw new Error("dashboardDataId is missing in body");

    delete body._id;
    delete body.dashboardDataId;

    await connectDB(Databases.FNI);

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findById(dashboardDataId);

    if (!dashboardData)
      throw new Error(`No data found with the Id ${dashboardDataId}`);

    await captureCaseEvent({
      claimId: dashboardData?.claimId,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      eventName: EventNames.TASK_UPDATE_BY_QA,
      userName: user?.name,
      stage: NumericStage.POST_QC,
      qaBy: user?.name,
    });

    const invIds: string[] = [];

    if (allocationType === "Single") {
      let invId = body?.singleTasksAndDocs?.investigator;
      if (!invId) throw new Error("Investigator is required");
      invIds.push(invId);
      const inv: HydratedDocument<Investigator> | null =
        await ClaimInvestigator.findById(invId);

      if (!inv)
        throw new Error(`Failed to find investigator with the id ${invId}`);

      dashboardData.claimInvestigators = dashboardData.claimInvestigators?.map(
        (i) => {
          if (i?._id?.toString() === inv?._id)
            return {
              ...i,
              _id: inv?._id,
              assignedData: new Date(),
              assignedFor: "",
              name: inv?.investigatorName,
            };
          else return i;
        }
      );
    } else if (allocationType === "Dual") {
      let claimInvestigators: IClaimInvestigator[] = [];

      if (body?.insuredTasksAndDocs?.investigator)
        invIds?.push(body?.insuredTasksAndDocs?.investigator);
      if (body?.hospitalTasksAndDocs?.investigator)
        invIds?.push(body?.hospitalTasksAndDocs?.investigator);

      if (invIds?.length < 2) throw new Error("2 investigator are required");

      let counter = 0;
      for (let id of invIds) {
        const inv: HydratedDocument<Investigator> | null =
          await ClaimInvestigator.findById(id);

        if (!inv)
          throw new Error(`Failed to find investigator with the id ${id}`);

        claimInvestigators?.push({
          _id: inv?._id,
          assignedData: new Date(),
          assignedFor: counter === 0 ? "Insured" : "Hospital",
          name: inv?.investigatorName,
          investigationStatus: "Assigned",
        });

        counter += 1;
      }

      dashboardData.claimInvestigators = claimInvestigators;
    }
    await dashboardData.save();

    const data = await ClaimCase.findByIdAndUpdate(
      _id,
      {
        $set: { ...body },
      },
      { useFindAndModify: false }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Updated successfully",
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
