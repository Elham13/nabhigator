import DashboardFeedingLog from "@/lib/Models/dashboardFeedingLog";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { PipelineStage } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { MdCatchingPokemon } from "react-icons/md";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { limit, skip, claimId } = await req?.json();

  try {
    await connectDB(Databases.FNI);

    let sort: PipelineStage.Sort["$sort"] = { updatedAt: -1 };
    let limitStage: PipelineStage.Limit["$limit"] = limit || 10;
    const match: PipelineStage.Match["$match"] = {};
    const addField: PipelineStage.AddFields["$addFields"] = {};

    if (claimId) {
      addField["temp"] = {
        $filter: {
          input: "$skippedClaimIds",
          as: "claimId",
          cond: { $eq: ["$$claimId", claimId?.toString()] },
        },
      };
      addField["resp"] = { $arrayElemAt: ["$skippedReasons", 0] };
      match["temp"] = { $exists: true, $size: 1 };
      sort = { _id: 1 };
      limitStage = 1;
    }

    const data = await DashboardFeedingLog.aggregate([
      { $addFields: addField },
      { $match: match },
      { $sort: sort },
      { $skip: skip && limit ? skip * limit : 0 },
      { $limit: limitStage },
    ]);

    const count = await DashboardFeedingLog.countDocuments(match);

    return NextResponse.json(
      {
        success: true,
        message: "Fetched success",
        data,
        count: count || data?.length,
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
