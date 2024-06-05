import ZoneStateMaster from "@/lib/Models/zoneStateMaster";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { PipelineStage } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { stateName, zoneId, stateCode, limit } = await req?.json();

  try {
    await connectDB(Databases.FNI);

    const matchStage: PipelineStage.Match["$match"] = {};

    if (zoneId) {
      if (Array.isArray(zoneId)) {
        matchStage["zoneId"] = { $in: zoneId };
      } else if (typeof zoneId === "string") {
        matchStage["zoneId"] = zoneId;
      }
    }

    if (stateCode) {
      if (Array.isArray(stateCode)) {
        matchStage["State_code"] = { $in: stateCode };
      } else if (typeof stateCode === "string") {
        matchStage["State_code"] = stateCode;
      }
    }

    if (stateName) {
      if (Array.isArray(stateName)) {
        matchStage["State"] = { $in: stateName };
      } else if (typeof stateName === "string") {
        matchStage["State"] = stateName;
      }
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "zonemasters",
          localField: "zoneId",
          foreignField: "zoneId",
          as: "zone",
        },
      },
      {
        $unwind: { path: "$zone", preserveNullAndEmptyArrays: true },
      },
    ];

    if (limit && typeof limit === "number") {
      pipeline.push({ $limit: limit });
    }

    const states = await ZoneStateMaster.aggregate(pipeline);
    const count = await ZoneStateMaster.countDocuments(matchStage);

    return NextResponse.json(
      {
        success: true,
        message: "Fetched",
        data: states,
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
