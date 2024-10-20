import ClaimCase from "@/lib/Models/claimCase";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { CaseDetail } from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  const { id, action, postQaDoc, index, postQaOverRulingReason } = body;

  try {
    if (!id) throw new Error(`Id is missing`);

    await connectDB(Databases.FNI);

    const caseDetail: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(id);

    if (!caseDetail) throw new Error(`No data found with id ${id}`);

    let updatedCase: any = null;
    let message: string = "No transaction happened!";

    if (action === "AddPostQADocument") {
      if (!!index || index === 0) {
        const foundCase = await ClaimCase.findById(id);
        if (!foundCase) throw new Error(`No data found with the id ${id}`);
        foundCase.postQARecommendation.documents =
          foundCase?.postQARecommendation?.documents?.filter(
            (_: any, ind: number) => ind !== index
          );
        updatedCase = await foundCase.save();
        message = "Document deleted successfully!";
      } else {
        if (!postQaDoc) throw new Error("Post QA document is required");
        updatedCase = await ClaimCase.findByIdAndUpdate(
          id,
          {
            $push: { "postQARecommendation.documents": postQaDoc },
          },
          { new: true, useFindAndModify: false }
        );
        message = "Document added successfully!";
      }
    }

    if (action === "AddOverRulingReason") {
      if (!postQaOverRulingReason)
        throw new Error("postQaOverRulingReason is required");
      caseDetail.postQaOverRulingReason = postQaOverRulingReason;
      updatedCase = await caseDetail.save();
      message = "Captured successfully";
    }

    return NextResponse.json(
      {
        success: true,
        message,
        updatedCase,
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
