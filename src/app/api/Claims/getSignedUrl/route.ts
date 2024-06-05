import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { S3 } from "aws-sdk";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { docKey } = await req?.json();

  try {
    if (!docKey) throw new Error("docKey is required");
    await connectDB(Databases.FNI);

    const s3 = new S3({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_UAT,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY_ID_UAT,
      region: process.env.NEXT_PUBLIC_AWS_DEFAULT_REGION_UAT,
    });

    const bucketName =
      process.env.NEXT_PUBLIC_CONFIG === "PROD"
        ? process.env.NEXT_PUBLIC_S3_BUCKET_NAME_PROD
        : process.env.NEXT_PUBLIC_S3_BUCKET_NAME_UAT;

    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: bucketName,
      Key: docKey,
      Expires: 60 * 60 * 60,
    });
    return NextResponse.json(
      {
        success: true,
        message: "Success",
        data: { signedUrl },
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
