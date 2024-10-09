import ClaimCase from "@/lib/Models/claimCase";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

const router = createEdgeRouter<NextRequest, {}>();

router.get(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const dashboardDataId = url.searchParams.get("dashboardDataId");

  try {
    if (!id && !dashboardDataId)
      throw new Error("id or dashboardDataId is required");

    await connectDB(Databases.FNI);

    let data: any[] | null = null;
    let count = 0;

    if (dashboardDataId) {
      const pipeline = [
        {
          $match: {
            dashboardDataId: new Types.ObjectId(dashboardDataId as string),
          },
        },
        {
          $lookup: {
            from: "claiminvestigators",
            localField: "investigator",
            foreignField: "_id",
            as: "investigator",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignedBy",
            foreignField: "_id",
            as: "assignedBy",
          },
        },
      ];
      data = await ClaimCase.aggregate(pipeline);
      if (data && data?.length > 0) data = data[0];
      else data = null;
      count = await ClaimCase.countDocuments({
        dashboardDataId,
      });
    } else if (id) {
      data = await ClaimCase.findById(id);
    }

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

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}
