import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { name, limit } = await req?.json();

  try {
    const countedLimit = limit ? parseInt(limit as string) : 50;
    const query: Record<string, any> = {
      Type: "External",
      role: "Leader",
    };

    if (name) {
      query["investigatorName"] = { $regex: new RegExp(name as string, "i") };
    }

    await connectDB(Databases.FNI);

    const data = await ClaimInvestigator.find(query).limit(countedLimit);
    const count = await ClaimInvestigator.countDocuments(query);

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
