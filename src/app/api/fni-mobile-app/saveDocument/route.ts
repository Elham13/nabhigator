import connectDB from "@/lib/db/dbConnectWithMongoose";
import ClaimCase from "@/lib/Models/claimCase";
import { Databases } from "@/lib/utils/types/enums";
import { CaseDetail, DocumentMap } from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  const {
    id,
    taskId,
    docName,
    docId,
    docUrl,
    action,
    docIndex,
    comment,
    taskComment,
    location,
    postQaDoc,
    postQaOverRulingReason,
    userId,
  } = body;

  try {
    let message: string = "No transaction happened!";
    let updatedCase: any = null;

    if (!id) throw new Error(`Id is required`);
    if (!docName) throw new Error(`docName is required`);
    if (!docId) throw new Error(`docId is required`);
    if (!action) throw new Error(`action is required`);

    await connectDB(Databases.FNI);

    const caseDetail: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(id);

    if (!caseDetail) throw new Error(`No data found with id ${id}`);

    let docs: DocumentMap | null = null;

    if (caseDetail?.allocationType === "Single") {
      docs = caseDetail?.singleTasksAndDocs?.docs as DocumentMap;
    } else if (caseDetail?.allocationType === "Dual") {
      if (!userId) throw new Error(`userId is required`);
      if (
        !!caseDetail?.insuredTasksAndDocs?.investigator &&
        caseDetail?.insuredTasksAndDocs?.investigator?.toString() === userId
      ) {
        docs = caseDetail?.insuredTasksAndDocs?.docs as DocumentMap;
      } else if (
        !!caseDetail?.hospitalTasksAndDocs?.investigator &&
        caseDetail?.hospitalTasksAndDocs?.investigator?.toString() === userId
      ) {
        docs = caseDetail?.hospitalTasksAndDocs?.docs as DocumentMap;
      }
    }

    if (!docs) throw new Error("No documents found");

    const documents = docs?.get(docName);

    if (!documents)
      throw new Error(`No documents found with the docName ${docName}`);

    const docObj = documents?.find((el) => el?._id?.toString() === docId);

    if (!docObj) throw new Error(`No document found with the id ${docId}`);

    if (action === "Add") {
      if (!docUrl) throw new Error(`docUrl is required`);
      if (docObj?.docUrl?.length > 0) docObj.docUrl.push(docUrl);
      else docObj.docUrl = [docUrl];
      docObj.location = location;
      updatedCase = await caseDetail.save();
      message = "Document uploaded successfully";
    } else if (action === "Remove") {
      if (docIndex || docIndex === 0) {
        if (docObj?.docUrl?.length > 1) {
          docObj.docUrl = docObj?.docUrl?.filter((_, ind) => ind !== docIndex);
          updatedCase = await caseDetail.save();
          message = "Document removed successfully";
        } else {
          docObj.docUrl = [];
          docObj.location = null;
          updatedCase = await caseDetail.save();
          message = "Document removed successfully";
        }
      } else throw new Error("donIndex is required");
    } else throw new Error("The value of action must be either Add or Remove");

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
