import HospitalProvider from "@/lib/Models/hospitalProvider";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.get(async (req) => {
  const url = new URL(req.url);

  const name = url.searchParams.get("name");
  const code = url.searchParams.get(" code");
  const limit = url.searchParams.get(" limit");

  try {
    await connectDB(Databases.FNI);

    const query: Record<string, any> = {};
    if (name)
      query["providerName"] = { $regex: new RegExp(name as string, "i") };
    if (code)
      query["providerNumber"] = { $regex: new RegExp(code as string, "i") };

    const data = await HospitalProvider.find(query).limit(
      limit ? parseInt(limit as string) : 10
    );

    const count = await HospitalProvider.countDocuments(query);

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
