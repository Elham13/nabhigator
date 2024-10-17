import connectDB from "@/lib/db/dbConnectWithMongoose";
import ClaimCase from "@/lib/Models/claimCase";
import DashboardData from "@/lib/Models/dashboardData";
import { Databases } from "@/lib/utils/types/enums";
import {
  CaseDetail,
  IDashboardData,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import { PipelineStage } from "mongoose";
import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  const { payload, action, pagination } = body;
  try {
    await connectDB(Databases.FNI);

    let data: any = null;
    let message = "";
    let count: number = 0;

    if (action === "getData") {
      const dData = await DashboardData.find({
        stage: { $ne: NumericStage.REJECTED },
        caseId: { $exists: true, $ne: null },
        $or: [
          { invReportReceivedDate: { $exists: false } },
          { invReportReceivedDate: null },
        ],
      })
        .skip((pagination?.page - 1) * pagination?.limit)
        .limit(pagination?.limit || 10);

      if (!!dData && dData?.length > 0) {
        const ids = dData?.map((el) => el?.caseId);

        const match: PipelineStage.Match["$match"] = {
          $or: [
            {
              "singleTasksAndDocs.invReportReceivedDate": {
                $exists: true,
                $ne: null,
              },
            },
            {
              reportReceivedDate: {
                $exists: true,
                $ne: null,
              },
            },
            {
              invReportReceivedDate: {
                $exists: true,
                $ne: null,
              },
            },
          ],
          _id: { $in: ids },
        };

        const stages: PipelineStage[] = [{ $match: match }];

        data = await ClaimCase.aggregate(stages);
        count = await ClaimCase.countDocuments(match);
      }

      message = "Fetched";
    } else if (action === "addClaimCase") {
      if (!payload) throw new Error("payload is required");
      data = await ClaimCase.create(payload);
      message = "Created";
    } else if (action === "addDData") {
      if (!payload) throw new Error("payload is required");
      data = await DashboardData.create(payload);
      message = "Created";
    } else {
      if (!payload) throw new Error("payload is required");

      if (payload?.length > 0) {
        for (const obj of payload) {
          if (!obj?.id) throw new Error("id is required");

          if (!!obj?.date) {
            const dData: HydratedDocument<IDashboardData> | null =
              await DashboardData.findById(obj?.id);

            if (!dData) throw new Error(`No data found with the id ${obj?.id}`);

            dData.invReportReceivedDate = obj?.date;

            await dData.save();
          }
        }
      }

      message = "Updated";
    }

    return NextResponse.json(
      {
        success: true,
        message,
        data,
        count,
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
