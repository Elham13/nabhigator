import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const {} = await req?.json();

  try {
    await connectDB(Databases.FNI);

    return NextResponse.json(
      {
        success: true,
        message: "Fetched",
        data: null,
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
  const id = url.searchParams.get("id");

  try {
    await connectDB(Databases.FNI);

    return NextResponse.json(
      {
        success: true,
        message: "Fetched",
        data: null,
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
