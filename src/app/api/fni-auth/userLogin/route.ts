import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { IUser } from "@/lib/utils/types/fniDataTypes";
import User from "@/lib/Models/user";
import { encrypt } from "@/lib/helpers/authHelpers";
import { Databases } from "@/lib/utils/types/enums";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();

router.post(async (req) => {
  const { userId, password } = await req?.json();
  try {
    if (!userId) throw new Error("userId is required");
    if (!password) throw new Error("password is required");

    await connectDB(Databases.FNI);

    const result: HydratedDocument<IUser> | null = await User.findOne({
      userId,
    });

    if (!result) throw new Error("Wrong userId");

    if (result?.status === "Inactive")
      throw new Error(
        "Your status is Inactive, please contact the admin to change your status!"
      );

    if (result?.password !== password) throw new Error("Wrong password");

    const data = {
      _id: result?._id,
      name: result?.name,
      role: result?.role,
      userId: result?.userId,
    };

    // Expires in 1 hour
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const session = await encrypt({ user: data, expires });

    // Save the session in a cookie
    cookies().set("session", session, { httpOnly: true });

    return NextResponse.json(
      {
        success: true,
        message: "Login Success",
        data: { ...result?.toJSON(), password: undefined },
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
