import User from "@/lib/Models/user";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { Role } from "@/lib/utils/types/fniDataTypes";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  try {
    await connectDB(Databases.FNI);

    await User.updateMany(
      { role: Role.POST_QA },
      { $set: { assignedCases: [] } }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Post QA Assigned cases cleared",
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
