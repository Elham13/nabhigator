import User from "@/lib/Models/user";
import UsersMaster from "@/lib/Models/usersMaster";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.get(async (req) => {
  const url = new URL(req.url);
  const newUsers = url.searchParams.get("newUsers");
  try {
    await connectDB(Databases.FNI);

    let data: any[] = [];

    if (newUsers) {
      const users = await User.find({}).lean();

      const existingIds = users.map((el) => el?.userId);

      data = await UsersMaster.find({ userId: { $nin: existingIds } });
    } else {
      data = await UsersMaster.find({});
    }

    const count = await UsersMaster.countDocuments({});

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
