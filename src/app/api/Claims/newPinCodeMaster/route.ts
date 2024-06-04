import NewPinCodeMaster from "@/lib/Models/newPinCodeMaster";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { PipelineStage } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { cityCode, limit } = await req?.json();

  try {
    await connectDB(Databases.FNI);

    const matchStage: PipelineStage.Match["$match"] = {};

    if (cityCode) {
      if (Array.isArray(cityCode)) {
        matchStage["CITY_CODE"] = { $in: cityCode };
      } else if (typeof cityCode === "string") {
        matchStage["CITY_CODE"] = cityCode;
      }
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      { $sort: { PIN_CODE: 1 } },
    ];

    if (limit && typeof limit === "number") {
      pipeline.push({ $limit: limit });
    }

    const districts = await NewPinCodeMaster.aggregate(pipeline);
    const count = await NewPinCodeMaster.countDocuments(matchStage);

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

  const pinCode = url.searchParams.get("pinCode");
  const limit = url.searchParams.get("limit");
  const city = url.searchParams.get("city");

  try {
    await connectDB(Databases.FNI);

    const query: Record<string, any> = {};
    if (pinCode)
      query["PIN_CODE"] = { $regex: new RegExp(pinCode as string, "i") };

    if (city) {
      if (Array.isArray(city)) {
        query["CITY_NAME"] = { $in: city };
      } else {
        query["CITY_NAME"] = { $regex: new RegExp(city as string, "i") };
      }
    }

    const data = await NewPinCodeMaster.find(query).limit(
      limit ? parseInt(limit as string) : 10
    );

    const count = await NewPinCodeMaster.countDocuments(query);
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
