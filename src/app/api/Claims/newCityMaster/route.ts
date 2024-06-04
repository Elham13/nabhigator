import NewCityMaster from "@/lib/Models/newCityMaster";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { PipelineStage } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { cityName, stateCode, limit } = await req?.json();

  try {
    await connectDB(Databases.FNI);

    const matchStage: PipelineStage.Match["$match"] = {};

    if (stateCode) {
      if (Array.isArray(stateCode)) {
        matchStage["State_code"] = { $in: stateCode };
      } else if (typeof stateCode === "string") {
        matchStage["State_code"] = stateCode;
      }
    }

    if (cityName) {
      matchStage["Title"] = { $regex: new RegExp(cityName as string, "i") };
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      { $sort: { Title: 1 } },
    ];

    if (limit && typeof limit === "number") {
      pipeline.push({ $limit: limit });
    }

    const districts = await NewCityMaster.aggregate(pipeline);
    const count = await NewCityMaster.countDocuments(matchStage);

    return NextResponse.json(
      {
        success: true,
        message: "Fetched",
        data: districts,
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

router.get(async (req) => {
  const url = new URL(req.url);

  const cityCode = url.searchParams.get("cityCode");
  const limit = url.searchParams.get("limit");
  const searchValue = url.searchParams.get("searchValue");
  const state = url.searchParams.get("state");
  const returnType = url.searchParams.get("returnType");

  try {
    await connectDB(Databases.FNI);

    const query: Record<string, any> = {};
    if (cityCode) query["City_code"] = cityCode;
    if (searchValue)
      query["Title"] = { $regex: new RegExp(searchValue as string, "i") };

    if (state) {
      if (Array.isArray(state)) {
        query["State"] = { $in: state };
      } else {
        query["State"] = state;
      }
    }

    let data: any = null;

    if (returnType === "cities") {
      data = await NewCityMaster.aggregate([
        { $match: query },
        { $group: { _id: "$Title" } },
        { $limit: limit ? parseInt(limit as string) : 10 },
      ]);
    } else {
      data = await NewCityMaster.find(query).limit(
        limit ? parseInt(limit as string) : 10
      );
    }
    const count = await NewCityMaster.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        message: "Fetched success",
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

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}
