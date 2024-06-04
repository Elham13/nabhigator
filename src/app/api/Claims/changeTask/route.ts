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

  const { _id, dashboardDataId, allocationType, investigators, user } = body;

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

    if (investigators?.length > 0) {
      if (allocationType === "Single") {
        let invId = investigators[0];
        const inv: HydratedDocument<Investigator> | null =
          await ClaimInvestigator.findById(invId);

        if (!inv)
          throw new Error(`Failed to find investigator with the id ${invId}`);

        dashboardData.claimInvestigators = [
          {
            _id: inv?._id,
            assignedData: new Date(),
            assignedFor: "",
            name: inv?.investigatorName,
          },
        ];

        dashboardData.actionsTaken = dashboardData?.actionsTaken
          ? [
              ...dashboardData?.actionsTaken,
              {
                actionName: EventNames.TASK_UPDATE_BY_QA,
                userId: user?._id,
              },
            ]
          : [
              {
                actionName: EventNames.TASK_UPDATE_BY_QA,
                userId: user?._id,
              },
            ];
      } else if (allocationType === "Dual") {
        let invIds = investigators?.slice(0, 2); // Getting first 2 ids
        let claimInvestigators: any[] = [];

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
          });

          counter += 1;
        }

        dashboardData.claimInvestigators = claimInvestigators;
        dashboardData.actionsTaken = dashboardData?.actionsTaken
          ? [
              ...dashboardData?.actionsTaken,
              {
                actionName: EventNames.TASK_UPDATE_BY_QA,
                userId: user?._id,
              },
            ]
          : [
              {
                actionName: EventNames.TASK_UPDATE_BY_QA,
                userId: user?._id,
              },
            ];
      }
      await dashboardData.save();
    }

    const invIds =
      allocationType === "Single"
        ? investigators[0]
        : investigators?.slice(0, 2);

    const data = await ClaimCase.findByIdAndUpdate(_id, {
      $set: { ...req.body, investigator: invIds },
    });

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
