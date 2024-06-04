import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "next/dist/server/base-server";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Investigator } from "@/lib/utils/types/fniDataTypes";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import { encrypt } from "@/lib/helpers/authHelpers";

const router = createEdgeRouter<NextRequest, RequestContext>();

router.post(async (req) => {
  const { phone, password } = await req?.json();
  try {
    if (!phone) throw new Error("phone is required");
    if (!password) throw new Error("password is required");

    await connectDB("FNI");

    const result: HydratedDocument<Investigator> | null =
      await ClaimInvestigator.findOne({
        phone,
      });

    if (!result) throw new Error("Wrong phone");

    if (result?.password !== password) throw new Error("Wrong password");

    const data = {
      ...result?.toJSON(),
      password: undefined,
    };

    // Expires in 1 hour
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    const session = await encrypt({ user: data, expires });

    return NextResponse.json(
      {
        success: true,
        message: "Login success",
        data: { user: data, session },
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
