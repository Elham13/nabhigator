import FNIManager from "@/lib/Models/fniManager";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { action } = await req?.json();

  try {
    if (!action) throw new Error("action is required");
    await connectDB(Databases.FNI);
    let data: any = null;
    let message: string = "";
    if (action === "check") {
      data = await FNIManager.findOne({});
      message = "Fetched";
    } else if (action === "toggle") {
      data = await FNIManager.findOne({});
      if (!data) throw new Error("Please create a record first");
      data.autoPreQC = !data.autoPreQC;
      data = await data.save();
      message = `Auto pre qc successfully set to ${
        data?.autoPreQC ? "Auto" : "Manual"
      }`;
    } else if (action === "create") {
      // TODO: Never change uncomment this unless you know what you are doing, This collection is supposed to contain only one document
      // data = await FNIManager.create({});
    }

    return NextResponse.json(
      {
        success: true,
        message,
        data,
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
