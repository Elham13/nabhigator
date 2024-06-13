import DashboardFeedingLog from "@/lib/Models/dashboardFeedingLog";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { limit, skip } = await req?.json();

  try {
    await connectDB(Databases.FNI);

    const data = await DashboardFeedingLog.aggregate([
      { $sort: { updatedAt: -1 } },
      { $skip: skip && limit ? skip * limit : 0 },
      { $limit: limit || 10 },
    ]);

    const count = await DashboardFeedingLog.countDocuments({});

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

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}
