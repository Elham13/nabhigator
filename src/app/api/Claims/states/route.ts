import StatesAndDistricts from "@/lib/Models/statesAndDistricts";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.get(async (req) => {
  const url = new URL(req.url);

  const filter = url.searchParams.get("filter");
  const stateName = url.searchParams.get("stateName");
  const districtName = url.searchParams.get("districtName");
  const limit = url.searchParams.get("limit");

  try {
    if (!filter)
      throw new Error(
        "Please specify you want only states or states with districts"
      );

    await connectDB(Databases.FNI);

    let data: any = [];

    if (filter === "onlyStates") {
      const query: Record<string, any> = {};
      if (stateName)
        query.state = { $regex: new RegExp(stateName as string, "i") };
      data = await StatesAndDistricts.find(query).select("-districts");
    }

    if (filter === "statesWithDistricts") {
      const query: Record<string, any> = {};
      if (districtName)
        query.districts = { $regex: new RegExp(districtName as string, "i") };
      data = await StatesAndDistricts.find(query).limit(
        limit ? parseInt(limit as string) : 20
      );
    }

    const count = await StatesAndDistricts.countDocuments();

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
