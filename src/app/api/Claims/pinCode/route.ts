import PinCodeMaster from "@/lib/Models/pinCodeMaster";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.get(async (req) => {
  const url = new URL(req.url);

  const cityName = url.searchParams.get("cityName");
  const stateName = url.searchParams.get("stateName");

  try {
    await connectDB(Databases.FNI);

    if (!cityName && !stateName)
      throw new Error("Either stateName or cityName is required");

    let data: any = [];

    if (cityName) {
      data = await PinCodeMaster.aggregate([
        {
          $match: {
            CITY_NAME: { $regex: new RegExp(cityName as string, "i") },
          },
        },
      ]);
    }

    const count = await PinCodeMaster.countDocuments();

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
