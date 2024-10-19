import ClaimCase from "@/lib/Models/claimCase";
import DashboardData from "@/lib/Models/dashboardData";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import {
  CaseDetail,
  IDashboardData,
  RevisedInvestigationFindings,
  Task,
} from "@/lib/utils/types/fniDataTypes";
import { Document, HydratedDocument, Types } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

const initialValues = {
  dateOfVisitToInsured: null,
  timeOfVisitToInsured: null,
  dateOfVisitToHospital: null,
  timeOfVisitToHospital: null,
  hospitalizationStatus: null,
  patientDetails: null,
  attendantDetails: null,
  occupationOfInsured: null,
  workPlaceDetails: null,
  anyOtherPolicyWithNBHI: null,
  anyPreviousClaimWithNBHI: null,
  insurancePolicyOtherThanNBHI: null,
  classOfAccommodation: null,
  changeInClassOfAccommodation: null,
  patientOnActiveLineOfTreatment: null,
  mismatchInDiagnosis: null,
  discrepancies: null,
  patientHabit: null,
  pedOrNoneDisclosure: null,
  insuredOrAttendantCooperation: null,
  providerCooperation: null,
  investigationSummary: null,
  recommendation: null,
  otherRecommendation: null,
};

router.post(async (req) => {
  const { id, key, value, isQa, userId, formPart } = await req?.json();

  try {
    if (!id) throw new Error("id is required");
    await connectDB(Databases.FNI);

    let message = "Noting changed";
    let data: any = null;

    const caseDetail: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(id);

    if (!caseDetail) throw new Error(`No data found with the id ${id}`);

    let tempFindings: RevisedInvestigationFindings | null = null;
    let tempFindingsQa: RevisedInvestigationFindings | null = null;
    const allocationType = caseDetail?.allocationType;

    if (allocationType === "Dual" && !userId)
      throw new Error("userId is required");

    let part: "Insured" | "Hospital" | null = null;

    if (allocationType === "Single") {
      tempFindings = caseDetail?.singleTasksAndDocs?.preAuthFindings || {};
      tempFindingsQa =
        caseDetail?.singleTasksAndDocs?.preAuthFindingsPostQa || {};
    } else if (allocationType === "Dual") {
      if (!!formPart) {
        part = formPart;
      } else {
        if (
          caseDetail?.insuredTasksAndDocs?.investigator?.toString() === userId
        )
          part = "Insured";
        if (
          caseDetail?.hospitalTasksAndDocs?.investigator?.toString() === userId
        )
          part = "Hospital";
      }

      tempFindings =
        part === "Insured"
          ? caseDetail?.insuredTasksAndDocs?.preAuthFindings || {}
          : part === "Hospital"
          ? caseDetail?.hospitalTasksAndDocs?.preAuthFindings || {}
          : null;

      tempFindingsQa =
        part === "Insured"
          ? caseDetail?.insuredTasksAndDocs?.preAuthFindingsPostQa || {}
          : part === "Hospital"
          ? caseDetail?.hospitalTasksAndDocs?.preAuthFindingsPostQa || {}
          : null;
    }

    if (!tempFindings || !tempFindingsQa) {
      throw new Error("No tasks found for this investigator");
    }

    if (key && value) {
      const tempKey = key as keyof RevisedInvestigationFindings;

      if (isQa) {
        tempFindingsQa[tempKey] = value;
      } else {
        tempFindings[tempKey] = value;
        tempFindingsQa[tempKey] = value;
      }

      if (isQa) {
        if (allocationType === "Single") {
          caseDetail.singleTasksAndDocs!.preAuthFindingsPostQa = tempFindingsQa;
        } else {
          if (part === "Insured")
            caseDetail.insuredTasksAndDocs!.preAuthFindingsPostQa =
              tempFindingsQa;
          if (part === "Hospital")
            caseDetail.hospitalTasksAndDocs!.preAuthFindingsPostQa =
              tempFindingsQa;
        }
      } else {
        if (allocationType === "Single") {
          caseDetail.singleTasksAndDocs!.preAuthFindingsPostQa = tempFindingsQa;
          caseDetail.singleTasksAndDocs!.preAuthFindings = tempFindings;
        } else {
          if (part === "Insured") {
            caseDetail.insuredTasksAndDocs!.preAuthFindingsPostQa =
              tempFindingsQa;
            caseDetail.insuredTasksAndDocs!.preAuthFindings = tempFindings;
          }
          if (part === "Hospital") {
            caseDetail.hospitalTasksAndDocs!.preAuthFindingsPostQa =
              tempFindingsQa;
            caseDetail.hospitalTasksAndDocs!.preAuthFindings = tempFindings;
          }
        }

        let completed: boolean = true;

        const tfs =
          tempFindings instanceof Document
            ? tempFindings.toJSON()
            : tempFindings;

        if (tfs && Object.keys(tfs)?.length > 0) {
          for (let tfsKey of Object.keys(initialValues)) {
            if (!tfs[tfsKey as keyof RevisedInvestigationFindings]) {
              completed = false;
              break;
            }
          }
        } else {
          completed = false;
        }

        if (completed) {
          let tasks: Task[] = [];

          if (allocationType === "Single") {
            tasks = caseDetail?.singleTasksAndDocs?.tasks || [];
          } else if (allocationType === "Dual") {
            if (part === "Insured") {
              tasks = caseDetail?.insuredTasksAndDocs?.tasks || [];
            } else if (part === "Hospital") {
              tasks = caseDetail?.hospitalTasksAndDocs?.tasks || [];
            }
          }

          tasks = tasks?.map((el) => ({ ...el, completed: true }));

          if (allocationType === "Single") {
            caseDetail.singleTasksAndDocs!.tasks = tasks;
          } else if (allocationType === "Dual") {
            if (part === "Insured") {
              caseDetail.insuredTasksAndDocs!.tasks = tasks;
            } else if (part === "Hospital") {
              caseDetail.hospitalTasksAndDocs!.tasks = tasks;
            }
          }
        }

        if (tempKey === "recommendation" && !!value?.value) {
          const dashboardData: HydratedDocument<IDashboardData> | null =
            await DashboardData.findOne({
              caseId: new Types.ObjectId(id),
            });

          if (!dashboardData)
            throw new Error(
              `Failed to find dashboardData with the caseId ${id}`
            );

          dashboardData.investigatorRecommendation = value?.value;
          await dashboardData.save();
        }
      }

      data = await caseDetail.save();
      message = `Value of ${key} added to db as ${value}`;
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message,
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
