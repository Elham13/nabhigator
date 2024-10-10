import connectDB from "@/lib/db/dbConnectWithMongoose";
import ClaimCase from "@/lib/Models/claimCase";
import DashboardData from "@/lib/Models/dashboardData";
import { Databases } from "@/lib/utils/types/enums";
import {
  CaseDetail,
  IDashboardData,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  const { claimId, docs, caseId } = body;
  try {
    await connectDB(Databases.FNI);

    if (!claimId && !caseId) throw new Error("claimId or caseId is required");
    if (!docs) throw new Error("docs is required");

    let id: any = null;

    if (!!caseId) {
      id = caseId;
    } else {
      const dashboardData = await DashboardData.findOne({ claimId });

      if (!dashboardData)
        throw new Error(`No Dashboard Data found with the id ${claimId}`);

      if (!dashboardData?.caseId)
        throw new Error(`No Claim Case found for this data`);

      id = dashboardData?.caseId;
    }

    if (!id) throw new Error(`id not found`);

    const claimCase: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(id);

    if (!claimCase) throw new Error(`No Claim Case found with the id ${id}`);

    if (claimCase?.allocationType === "Single") {
      claimCase.singleTasksAndDocs!.docs! = !!caseId
        ? new Map(docs)
        : (new Map(Object.entries(JSON.parse(docs))) as any);
    } else {
    }

    await claimCase.save();

    return NextResponse.json(
      {
        success: true,
        message: "Updated",
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
