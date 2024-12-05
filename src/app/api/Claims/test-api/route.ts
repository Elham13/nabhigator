import connectDB from "@/lib/db/dbConnectWithMongoose";
import User from "@/lib/Models/user";
import ZoneStateMaster from "@/lib/Models/zoneStateMaster";
import { Databases } from "@/lib/utils/types/enums";
import {
  IDashboardData,
  Investigator,
  IUser,
  IZoneStateMaster,
  Role,
} from "@/lib/utils/types/fniDataTypes";
import dayjs from "dayjs";
import { HydratedDocument, PipelineStage } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import DashboardData from "@/lib/Models/dashboardData";
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

    const investigators = (await ClaimInvestigator.find(
      {}
    ).lean()) as Investigator[];

    const updated: any[] = [];

    for (const inv of investigators) {
      let alreadyAssignedClaimIdsRM: number[] = [];
      let alreadyAssignedClaimIdsPreAuth: number[] = [];

      if (!!inv?.pendency) {
        if (!!inv?.pendency?.rm && inv?.pendency?.rm?.length > 0) {
          alreadyAssignedClaimIdsRM = inv?.pendency?.rm;
        }
        if (!!inv?.pendency?.preAuth && inv?.pendency?.preAuth?.length > 0) {
          alreadyAssignedClaimIdsPreAuth = inv?.pendency?.preAuth;
        }
      }

      const unwantedClaimIds = [
        ...alreadyAssignedClaimIdsPreAuth,
        ...alreadyAssignedClaimIdsRM,
      ];

      const data = (await DashboardData.find({
        "claimInvestigators._id": inv?._id,
        stage: { $ne: 12 },
        claimId: {
          $nin: unwantedClaimIds,
        },
      }).lean()) as IDashboardData[];

      if (!!data && data?.length > 0) {
        const preAuthIds = data
          ?.filter((el) => el?.claimType === "PreAuth")
          ?.map((el) => el?.claimId);
        const rmIds = data
          ?.filter((el) => el?.claimType === "Reimbursement")
          ?.map((el) => el?.claimId);

        if (preAuthIds?.length > 0 || rmIds?.length > 0) {
          const newInv: HydratedDocument<Investigator> | null =
            await ClaimInvestigator.findById(inv?._id);

          if (!newInv) throw new Error(`No inv found with the Id ${inv?._id}`);

          if (!!newInv?.pendency) {
            if (newInv?.pendency?.preAuth?.length > 0) {
              newInv.pendency.preAuth = [
                ...newInv.pendency.preAuth,
                ...preAuthIds,
              ];
            } else {
              newInv.pendency.preAuth = preAuthIds;
            }
            if (newInv?.pendency?.rm?.length > 0) {
              newInv.pendency.rm = [...newInv.pendency.rm, ...rmIds];
            } else {
              newInv.pendency.rm = rmIds;
            }
          } else {
            newInv.pendency = { preAuth: preAuthIds, rm: rmIds };
          }

          updated.push({
            invName: newInv?.investigatorName,
            preAuthIds,
            rmIds,
          });

          await newInv.save();
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Success",
        data: updated,
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
