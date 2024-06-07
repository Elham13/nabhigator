import ClaimCase from "@/lib/Models/claimCase";
import connectDB from "@/lib/db/dbConnectWithMongoose";
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
  } = body;

  try {
    if (!id) throw new Error(`Id is missing`);

    await connectDB(Databases.FNI);

    const caseDetail: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(id);

    if (!caseDetail) throw new Error(`No data found with id ${id}`);

    let updatedCase: any = null;
    let message: string = "No transaction happened!";

    if (taskId) {
      const task = caseDetail?.tasksAssigned?.find(
        (el: any) => el?._id?.toString() === taskId
      );

      if (!task) throw new Error(`No Task found with the id ${taskId}`);

      if (action === "ToggleTask") {
        if (task.completed) task.comment = "";
        task.completed = !task?.completed;
        updatedCase = await caseDetail.save();
        message = "Task toggled!";
      } else if (action === "AddTaskComment") {
        task.comment = taskComment;
        updatedCase = await caseDetail.save();
        message = `Comment added to the task ${taskId}!`;
      }
    }

    if (docId && docName) {
      // if (!location) throw new Error("User location is required");

      const documents = caseDetail?.documents as DocumentMap;
      if (documents) {
        const docs = documents?.get(docName);

        if (!docs)
          throw new Error(`No documents found with the docName ${docName}`);

        const docArr = docs.find((el) => el?._id?.toString() === docId);
        if (!docArr) throw new Error(`No document found with the id ${docId}`);

        if (action === "Add") {
          if (!docUrl) throw new Error(`Please provide the docUrl in the body`);
          if (docArr?.docUrl?.length > 0) docArr.docUrl.push(docUrl);
          else docArr.docUrl = [docUrl];
          docArr.location = location;
          updatedCase = await caseDetail.save();
          message = "Document uploaded successfully";
        } else if (action === "Remove") {
          if (docIndex || docIndex === 0) {
            if (docArr?.docUrl?.length > 1) {
              docArr.docUrl = docArr?.docUrl?.filter(
                (_, ind) => ind !== docIndex
              );
              updatedCase = await caseDetail.save();
              message = "Document removed successfully";
            } else {
              docArr.docUrl = [];
              docArr.location = null;
              updatedCase = await caseDetail.save();
              message = "Document removed successfully";
            }
          } else throw new Error("donIndex is required");
        } else
          throw new Error("The value of action must be either Add or Remove");
      }
    }

    if (action === "AddComment") {
      if (!comment) throw new Error("Comment is missing!");
      caseDetail.investigatorComment = comment;
      updatedCase = await caseDetail.save();
      message = "Comment added successfully!";
    }

    if (action === "AddPostQADocument") {
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

    if (action === "AddInvestigationFindings") {
      const tempObj = { ...body, createdAt: new Date() };
      caseDetail.investigationFindings = tempObj;
      updatedCase = await caseDetail.save();
      message = "Investigation findings captured successfully";
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
