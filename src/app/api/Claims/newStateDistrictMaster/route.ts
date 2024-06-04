import NewStateDistrictMaster from "@/lib/Models/newStateDistrictMaster";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { PipelineStage } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { stateCode, districtName, limit } = await req?.json();

  try {
    await connectDB(Databases.FNI);

    const matchStage: PipelineStage.Match["$match"] = {
      $and: [
        {
          District: {
            $nin: ["-", null],
          },
        },
      ],
    };

    if (stateCode) {
      if (Array.isArray(stateCode)) {
        matchStage["State_code"] = { $in: stateCode };
      } else if (typeof stateCode === "string") {
        matchStage["State_code"] = stateCode;
      }
    }

    if (districtName) {
      matchStage["$and"]?.push({
        District: {
          $regex: new RegExp(districtName as string, "i"),
        },
      });
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      { $group: { _id: "$District" } },
    ];

    if (limit && typeof limit === "number") {
      pipeline.push({ $limit: limit });
    }

    const districts = await NewStateDistrictMaster.aggregate(pipeline);
    const count = await NewStateDistrictMaster.countDocuments(matchStage);

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

  const limit = url.searchParams.get("limit");
  const stateSearchValue = url.searchParams.get("stateSearchValue");
  const districtSearchValue = url.searchParams.get("districtSearchValue");
  const stateCode = url.searchParams.get("stateCode");
  const returnType = url.searchParams.get("returnType");

  try {
    await connectDB(Databases.FNI);

    let data: any = null;
    const matchFilter: Record<string, any> = {};

    if (returnType === "states") {
      const pipeline: PipelineStage[] = [
        {
          $group: {
            _id: "$State",
          },
        },
        {
          $match: !!stateSearchValue
            ? { _id: { $regex: new RegExp(stateSearchValue as string, "i") } }
            : {},
        },
        { $limit: limit ? parseInt(limit as string) : 10 },
      ];
      data = await NewStateDistrictMaster.aggregate(pipeline);
    } else if (returnType === "districts") {
      const matchStage: PipelineStage.Match["$match"] = {};

      if (districtSearchValue) {
        matchStage["$and"] = [
          { _id: { $nin: ["-", null] } },
          { _id: { $regex: new RegExp(districtSearchValue as string, "i") } },
        ];
      } else {
        matchStage["_id"] = { $nin: ["-", null] };
      }

      if (stateSearchValue) {
        let tempSearch: any = stateSearchValue as string;
        tempSearch = tempSearch.split(", ");
        matchStage["state"] = { $in: tempSearch };
      }

      const pipeline: PipelineStage[] = [
        {
          $group: {
            _id: "$District",
            state: { $push: "$State" },
          },
        },
        { $unwind: { path: "$state", preserveNullAndEmptyArrays: true } },
        {
          $match: matchStage,
        },
        { $limit: limit ? parseInt(limit as string) : 10 },
      ];

      data = await NewStateDistrictMaster.aggregate(pipeline);
    } else {
      const query: Record<string, any> = {};

      if (stateCode) query["State_code"] = stateCode;

      if (stateSearchValue) {
        if (Array.isArray(stateSearchValue)) {
          query["State"] = {
            $in: stateSearchValue?.map((el) => new RegExp(el, "i")),
          };
        } else
          query["State"] = {
            $regex: new RegExp(stateSearchValue as string, "i"),
          };
      }

      if (districtSearchValue)
        query["District"] = {
          $regex: new RegExp(districtSearchValue as string, "i"),
        };

      data = await NewStateDistrictMaster.find(query).limit(
        limit ? parseInt(limit as string) : 10
      );
    }
    const count = await NewStateDistrictMaster.countDocuments(matchFilter);

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
