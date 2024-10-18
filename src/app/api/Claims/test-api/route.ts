import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
// dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

const dbQueries = () => {
  // For report recieved date
  // db.dashboarddatas
  //   .aggregate([
  //     {
  //       $match: {
  //         stage: { $in: [12, 4] },
  //         caseId: { $exists: true, $ne: null },
  //         $or: [
  //           { invReportReceivedDate: { $exists: false } },
  //           { invReportReceivedDate: null },
  //         ],
  //       },
  //     },
  //     { $project: { claimId: 1, invReportReceivedDate: 1, caseId: 1 } },
  //   ])
  //   .forEach(function (doc) {
  //     const claimCase = db.claimcases.findOne({ _id: doc.caseId });
  //     if (claimCase) {
  //       let date = null;
  //       if (
  //         claimCase.singleTasksAndDocs &&
  //         claimCase.singleTasksAndDocs.invReportReceivedDate
  //       ) {
  //         date = claimCase.singleTasksAndDocs.invReportReceivedDate;
  //       } else if (claimCase.reportReceivedDate) {
  //         date = claimCase.reportReceivedDate;
  //       } else if (claimCase.invReportReceivedDate) {
  //         date = claimCase.invReportReceivedDate;
  //       } else {
  //         print("No condition success for caseId: " + claimCase._id);
  //       }
  //       if (date) {
  //         print("Update success: " + claimCase._id);
  //         db.dashboarddatas.findAndModify({
  //           query: { _id: doc._id },
  //           update: { $set: { invReportReceivedDate: date } },
  //         });
  //       }
  //     } else {
  //       print("Document not found for caseId: " + doc.caseId);
  //     }
  //   });
  // For recommendation
  // db.dashboarddatas
  //   .aggregate([
  //     {
  //       $match: {
  //         stage: { $in: [12, 4] },
  //         caseId: { $exists: true, $ne: null },
  //         $or: [
  //           { investigatorRecommendation: { $exists: false } },
  //           { investigatorRecommendation: null },
  //           { investigatorRecommendation: "" },
  //         ],
  //       },
  //     },
  //     { $project: { claimId: 1, investigatorRecommendation: 1, caseId: 1 } },
  //   ])
  //   .forEach(function (doc) {
  //     const claimCase = db.claimcases.findOne({ _id: doc.caseId });
  //     if (claimCase) {
  //       let recommendation = null;
  //       if (
  //         claimCase.singleTasksAndDocs &&
  //         claimCase.singleTasksAndDocs.preAuthFindings &&
  //         claimCase.singleTasksAndDocs.preAuthFindings &&
  //         claimCase.singleTasksAndDocs.preAuthFindings.recommendation &&
  //         claimCase.singleTasksAndDocs.preAuthFindings.recommendation.value
  //       ) {
  //         recommendation =
  //           claimCase.singleTasksAndDocs.preAuthFindings.recommendation.value;
  //       } else if (
  //         claimCase.investigationFindings &&
  //         claimCase.investigationFindings &&
  //         claimCase.investigationFindings &&
  //         claimCase.investigationFindings.recommendation &&
  //         claimCase.investigationFindings.recommendation.value
  //       ) {
  //         recommendation = claimCase.investigationFindings.recommendation.value;
  //       } else {
  //         print("No condition success for caseId: " + claimCase._id);
  //       }
  //       if (recommendation) {
  //         print("Update success: " + claimCase._id);
  //         db.dashboarddatas.findAndModify({
  //           query: { _id: doc._id },
  //           update: { $set: { investigatorRecommendation: recommendation } },
  //         });
  //       }
  //     } else {
  //       print("Document not found for caseId: " + doc.caseId);
  //     }
  //   });
};

router.post(async (req) => {
  const body = await req?.json();

  try {
    await connectDB(Databases.FNI);

    // const allCases: any = await ClaimCase.find({});

    // const updatedIds = [];

    // for (let obj of allCases) {
    //   obj.preQcObservation = obj?.preQcObservation || "Testing";

    //   if (obj?.allocationType === "Single") {
    //     const investigator =
    //       !!obj?.investigator && obj?.investigator?.length > 0
    //         ? obj?.investigator[0]
    //         : null;

    //     obj.singleTasksAndDocs = {
    //       tasks: obj?.tasksAssigned,
    //       docs: obj?.documents,
    //       investigationRejected: obj?.investigationRejected,
    //       investigator,
    //       investigatorComment: obj?.investigatorComment,
    //       outSourcingDate: obj?.outSourcingDate,
    //       invReportReceivedDate: obj?.invReportReceivedDate,
    //       preAuthFindings: obj?.investigationFindings,
    //       preAuthFindingsPostQa: obj?.postQaFindings,
    //       rmFindings: obj?.rmFindings,
    //       rmFindingsPostQA: obj?.rmFindingsPostQA,
    //     };
    //   } else if (obj?.allocationType === "Dual") {
    //     let investigator =
    //       !!obj?.investigator && obj?.investigator?.length > 0
    //         ? obj?.investigator[0]
    //         : null;
    //     obj.insuredTasksAndDocs = {
    //       tasks: obj?.tasksAssigned,
    //       docs: obj?.documents,
    //       investigationRejected: obj?.investigationRejected,
    //       investigator,
    //       investigatorComment: obj?.investigatorComment,
    //       outSourcingDate: obj?.outSourcingDate,
    //       invReportReceivedDate: obj?.invReportReceivedDate,
    //       preAuthFindings: obj?.investigationFindings,
    //       preAuthFindingsPostQa: obj?.postQaFindings,
    //       rmFindings: obj?.rmFindings,
    //       rmFindingsPostQA: obj?.rmFindingsPostQA,
    //     };

    //     investigator =
    //       !!obj?.investigator && obj?.investigator?.length > 1
    //         ? obj?.investigator[1]
    //         : null;
    //     obj.hospitalTasksAndDocs = {
    //       tasks: obj?.tasksAssigned,
    //       docs: obj?.documents,
    //       investigationRejected: obj?.investigationRejected,
    //       investigator,
    //       investigatorComment: obj?.investigatorComment,
    //       outSourcingDate: obj?.outSourcingDate,
    //       invReportReceivedDate: obj?.invReportReceivedDate,
    //       preAuthFindings: obj?.investigationFindings,
    //       preAuthFindingsPostQa: obj?.postQaFindings,
    //       rmFindings: obj?.rmFindings,
    //       rmFindingsPostQA: obj?.rmFindingsPostQA,
    //     };
    //   }
    //   await obj.save();
    //   updatedIds.push(obj?._id);
    // }

    return NextResponse.json(
      {
        success: true,
        message: "Success",
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
