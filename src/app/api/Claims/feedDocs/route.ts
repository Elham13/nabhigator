import connectDB from "@/lib/db/dbConnectWithMongoose";
import ClaimCase from "@/lib/Models/claimCase";
import { Databases } from "@/lib/utils/types/enums";
import { CaseDetail } from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  const { payload, action, pagination } = body;
  try {
    await connectDB(Databases.FNI);

    let data: any = null;
    let message = "";
    let count: number = 0;

    if (action === "getData") {
      const claimCase = await ClaimCase.find({
        "singleTasksAndDocs.docs": { $eq: {} },
        caseStatus: { $ne: "Rejected" },
      })
        .skip((pagination?.page - 1) * pagination?.limit)
        .limit(pagination?.limit || 10);
      count = await ClaimCase.countDocuments({
        "singleTasksAndDocs.docs": { $eq: {} },
        caseStatus: { $ne: "Rejected" },
      });
      data = claimCase;
      message = "Fetched";
    } else {
      if (!payload) throw new Error("payload is required");

      if (payload?.length > 0) {
        for (const obj of payload) {
          if (!obj?.id) throw new Error("id is required");

          const claimCase: HydratedDocument<CaseDetail> | null =
            await ClaimCase.findById(obj?.id);

          if (!claimCase)
            throw new Error(`No Claim Case found with the id ${obj?.id}`);

          if (claimCase?.allocationType === "Single") {
            claimCase.singleTasksAndDocs!.docs! = new Map(obj?.doc);
          } else {
          }

          await claimCase.save();
        }
      }

      message = "Updated";
    }

    return NextResponse.json(
      {
        success: true,
        message,
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
