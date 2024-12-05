import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { IUser } from "@/lib/utils/types/fniDataTypes";
import User from "@/lib/Models/user";
import { encrypt } from "@/lib/helpers/authHelpers";
import { Databases } from "@/lib/utils/types/enums";
import * as crypto from 'crypto';

interface RequestContext {}
const key = crypto
.createHash('sha512')
.update('secretKey')
.digest('hex')
.substring(0, 32);
const encryptionIV = crypto
.createHash('sha512')
.update('secretIV')
.digest('hex')
.substring(0, 16);
let updatedPass:string;
const router = createEdgeRouter<NextRequest, RequestContext>();

router.post(async (req) => {
  const { userId, password } = await req?.json();
  try {
    if (!userId) throw new Error("userId is required");
    if (!password) throw new Error("password is required");
    if(password){
      updatedPass =  decryptData(password);
    }

    await connectDB(Databases.FNI);

    const result: HydratedDocument<IUser> | null = await User.findOne({
      userId,
    });

    if (!result) throw new Error("Wrong userId");

    if (result?.status === "Inactive")
      throw new Error(
        "Your status is Inactive, please contact the admin to change your status!"
      );

    // if (result?.password !== updatedPass) throw new Error("Wrong password");
    const now = new Date();

    // Check if the user is blocked
    if (result.blockedUntil && now < result?.blockedUntil) {
      const remainingTime = Math.ceil(
        (result.blockedUntil - now.valueOf()) / 1000 / 60
      );
      throw new Error(`Too many failed attempts. Try again in ${remainingTime} minutes.`)
    }

  if (result?.password !== updatedPass) {
    const MAX_ATTEMPTS = 3;
    const BLOCK_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds      
    result.failedAttempts += 1;

    if (result?.failedAttempts >= MAX_ATTEMPTS) {
      result.failedAttempts = 0; // Reset attempts
      result.blockedUntil = new Date(now.getTime() + BLOCK_DURATION); // Block for 10 minutes
      await result?.save();
    throw new Error("Too many failed attempts. You are blocked for 10 minutes");
    }

    await result?.save();

    throw new Error("Wrong password");
  }
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
    result.failedAttempts = 0;
    result.blockedUntil = null;
    await result?.save();

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

    function decryptData(encryptedData:any) {
      const buff = Buffer.from(encryptedData, 'base64')
      const decipher = crypto.createDecipheriv('aes-256-cbc',key, encryptionIV)
      return (
        decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
        decipher.final('utf8')
      )
    }

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}
