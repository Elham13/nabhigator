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

  const { id, action, postQaDoc, index, postQaOverRulingReason, preQcUploads } =
    body;

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
        caseDetail!.postQARecommendation!.documents =
          caseDetail?.postQARecommendation?.documents?.filter(
            (_: any, ind: number) => ind !== index
          );
        updatedCase = await caseDetail.save();
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
    } else if (action === "AddPostQAValues") {
      const { field, value } = body;

      if (!field) throw new Error("field name is required");

      caseDetail.postQARecommendation = { [field]: value };

      updatedCase = await caseDetail.save();
      message = "Captured successfully";
    } else if (action === "AddOverRulingReason") {
      if (!postQaOverRulingReason)
        throw new Error("postQaOverRulingReason is required");
      caseDetail.postQaOverRulingReason = postQaOverRulingReason;
      updatedCase = await caseDetail.save();
      message = "Captured successfully";
    } else if (action === "AddPreQcUploads") {
      if (!preQcUploads || !Array.isArray(preQcUploads))
        throw new Error("preQcUploads is required");

      caseDetail.preQcUploads = preQcUploads;
      updatedCase = await caseDetail.save();
      message = "Uploaded successfully";
    } else throw new Error(`Wrong action ${action}`);

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
