import ClaimCase from "@/lib/Models/claimCase";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";
import CaseEvent from "@/lib/Models/caseEvent";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { searchPayload } = await req?.json();

  try {
    await connectDB(Databases.FNI);

    const pipeline: PipelineStage[] = [
      { $match: searchPayload },
      {
        $lookup: {
          from: "claiminvestigators",
          localField: "investigator",
          foreignField: "_id",
          as: "investigator",
        },
      },
      {
        $unwind: { path: "$investigator", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "clusterManager",
          foreignField: "_id",
          as: "clusterManager",
        },
      },
      {
        $unwind: { path: "$clusterManager", preserveNullAndEmptyArrays: true },
      },
      { $sort: { eventDate: 1 } },
    ];

    let data = await CaseEvent.aggregate(pipeline);

    const count = await CaseEvent.countDocuments(searchPayload);

    return NextResponse.json(
      {
        success: true,
        message: "Fetched",
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
