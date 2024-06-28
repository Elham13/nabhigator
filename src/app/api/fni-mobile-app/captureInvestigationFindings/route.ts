import ClaimCase from "@/lib/Models/claimCase";
import DashboardData from "@/lib/Models/dashboardData";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import {
  CaseDetail,
  IDashboardData,
  IInvestigationFindings,
  Task,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, Types } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

const initialValues: IInvestigationFindings = {
  dateOfVisitToInsured: null,
  dateOfVisitToHospital: null,
  hospitalizationStatus: {
    value: "",
    differedAdmission: "",
    cancelledAdmission: "",
  },
  hospitalizationDetails: {
    dateOfAdmission: null,
    timeOfAdmission: null,
    dateOfDischarge: null,
    timeOfDischarge: null,
    tentativeDateOfAdmission: null,
    tentativeDateOfDischarge: null,
    proposedDateOfAdmission: null,
    proposedDateOfDischarge: null,
  },
  patientDetails: {
    patientName: "",
    patientAge: 0,
    patientGender: "Male",
    revisedPatientName: "",
    revisedPatientAge: 0,
    revisedPatientGender: undefined,
  },
  attendantDetails: {
    status: "NA",
    name: "",
  },
  occupationOfInsured: "",
  workPlaceDetails: "",
  anyOtherPolicyWithNBHI: "",
  anyPreviousClaimWithNBHI: "No",
  insurancePolicyOtherThanNBHI: {
    hasPolicy: "No",
  },
  classOfAccommodation: {
    status: "",
  },
  changeInClassOfAccommodation: {
    status: "",
  },
  patientOnActiveLineOfTreatment: {
    status: "",
  },
  mismatchInDiagnosis: {
    status: "",
  },
  discrepancies: {
    status: "",
  },
  patientHabit: [],
  pedOrNoneDisclosure: "NA",
  ailment: [],
  insuredOrAttendantCooperation: "No",
  providerCooperation: "No",
  investigationSummary: "",
  recommendation: "",
  otherRecommendation: [],
  frcuGroundOfRepudiation: [],
  evidenceDocs: [],
};

router.post(async (req) => {
  const { id, key, value, isPostQa } = await req?.json();

  try {
    if (!id) throw new Error("id is required");
    await connectDB(Databases.FNI);

    let message = "Noting changed";
    let data: any = null;

    const caseDetail: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(id);

    if (!caseDetail) throw new Error(`No data found with the id ${id}`);

    if (key && value) {
      if (isPostQa) {
        // @ts-expect-error
        caseDetail.postQaFindings = { [key]: value };

        if (caseDetail?.postQaFindings) {
          const caseData = caseDetail?.toJSON();
          const findings = caseData?.postQaFindings;

          let completed: boolean = true;
          if (findings && Object.keys(findings)?.length > 0) {
            for (let key of Object.keys(initialValues)) {
              // @ts-expect-error
              if (!findings[key]) {
                completed = false;
                break;
              }
            }
          }

          if (completed) {
            let tasks: Task[] = caseDetail?.tasksAssigned || [];
            tasks = tasks?.map((el) => ({ ...el, completed: true }));
            caseDetail.tasksAssigned = tasks;
          }
        }
      } else {
        if (caseDetail.investigationFindings) {
          // @ts-expect-error
          caseDetail.investigationFindings[key] = value;
          // @ts-expect-error
          caseDetail.postQaFindings[key] = value;
        } else {
          // @ts-expect-error
          caseDetail.investigationFindings = { [key]: value };
          // @ts-expect-error
          caseDetail.postQaFindings = { [key]: value };
        }

        if (caseDetail?.investigationFindings) {
          const caseData = caseDetail?.toJSON();
          const findings = caseData?.investigationFindings;

          let completed: boolean = true;
          if (findings && Object.keys(findings)?.length > 0) {
            for (let key of Object.keys(initialValues)) {
              // @ts-expect-error
              if (!findings[key]) {
                completed = false;
                break;
              }
            }
          }

          if (completed) {
            let tasks: Task[] = caseDetail?.tasksAssigned || [];
            tasks = tasks?.map((el) => ({ ...el, completed: true }));
            caseDetail.tasksAssigned = tasks;
          }
        }

        if (key === "recommendation" && !!value?.value) {
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
