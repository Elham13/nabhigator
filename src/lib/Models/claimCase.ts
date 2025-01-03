import { RMInvestigationFindingSchema } from "../helpers/modelHelpers";
import { ObjectId } from "mongoose";
import { Document, Schema, model, models } from "mongoose";
import { CaseDetail, ITasksAndDocuments } from "../utils/types/fniDataTypes";

export interface IClaimCase extends Omit<CaseDetail, "_id">, Document {
  _id: ObjectId;
}

interface ITasksAndDocumentsSchema
  extends Omit<ITasksAndDocuments, "_id">,
    Document {}

const TasksSchema = new Schema({
  name: { type: String },
  completed: { type: Boolean },
  comment: { type: String },
});

const RejectionReasonSchema = new Schema({
  reason: { type: String, required: true },
  remark: { type: String, default: "" },
});

const PatientHabitSchema = new Schema({
  habit: String,
  frequency: String,
  quantity: String,
  duration: String,
});

const AilmentSchema = new Schema({
  ailment: String,
  diagnosis: String,
  duration: String,
  onMedication: String,
});

const OtherRecommendationSchema = new Schema({
  value: String,
  detail: [{ value: String, remark: String }],
});

const InvestigationFindingSchema = new Schema(
  {
    dateOfVisitToInsured: { type: Date, default: null },
    timeOfVisitToInsured: { type: Date, default: null },
    dateOfVisitToHospital: { type: Date, default: null },
    timeOfVisitToHospital: { type: Date, default: null },
    hospitalizationStatus: {
      value: String,
      differedAdmission: String,
      cancelledAdmission: String,
      cancelledAdmissionOther: String,
    },
    hospitalizationDetails: {
      dateOfAdmission: { type: Date, default: null },
      timeOfAdmission: { type: Date, default: null },
      dateOfDischarge: { type: Date, default: null },
      timeOfDischarge: { type: Date, default: null },
      tentativeDateOfAdmission: { type: Date, default: null },
      tentativeDateOfDischarge: { type: Date, default: null },
      proposedDateOfAdmission: { type: Date, default: null },
      proposedDateOfDischarge: { type: Date, default: null },
    },
    patientDetails: {
      patientName: String,
      patientAge: Number,
      patientGender: String,
      revisedPatientName: String,
      revisedPatientAge: Number,
      revisedPatientGender: String,
    },
    attendantDetails: {
      status: String,
      name: String,
      gender: String,
      relationship: String,
      mobileNo: String,
    },
    occupationOfInsured: String,
    workPlaceDetails: String,
    anyOtherPolicyWithNBHI: String,
    otherPolicyNoWithNBHI: String,
    policyNumber: String,
    anyPreviousClaimWithNBHI: String,
    insurancePolicyOtherThanNBHI: {
      hasPolicy: String,
      nameOfInsuranceCompany: String,
      policyNumber: String,
    },
    classOfAccommodation: {
      status: String,
      remark: String,
    },
    changeInClassOfAccommodation: {
      status: String,
      remark: String,
    },
    patientOnActiveLineOfTreatment: {
      status: String,
      remark: String,
    },
    mismatchInDiagnosis: {
      status: String,
      remark: String,
    },
    discrepancies: {
      status: String,
      remark: String,
    },
    patientHabit: [PatientHabitSchema],
    pedOrNoneDisclosure: String,
    ailment: [AilmentSchema],
    insuredOrAttendantCooperation: String,
    reasonForInsuredNotCooperation: String,
    providerCooperation: String,
    reasonForProviderNotCooperation: String,
    port: String,
    investigationSummary: String,
    recommendation: { value: String, code: String },
    inconclusiveRemark: String,
    frcuGroundOfRepudiation: {
      type: [{ value: String, code: String }],
      default: [],
    },
    evidenceDocs: [String],
    groundOfRepudiationNonCooperationOf: String,
    nonCooperationDetails: String,
    otherRecommendation: [OtherRecommendationSchema],
    evidenceOfRepudiation: String,
    repudiationReason: String,
    reInvestigationFindings: { type: String, default: "" },
  },
  { timestamps: true }
);

const InvestigationRejectSchema = new Schema(
  {
    remark: { type: String, default: "" },
    insuredAddress: { type: String, default: "" },
    insuredCity: { type: String, default: "" },
    insuredState: { type: String, default: "" },
    insuredMobileNumber: { type: String, default: "" },
    investigationRejectedReason: { type: String, default: "" },
  },
  { timestamps: true }
);

const TasksAndDocumentsSchema = new Schema<ITasksAndDocumentsSchema>(
  {
    tasks: { type: [TasksSchema], required: true },
    docs: {
      type: Map,
      of: [
        {
          name: String,
          docUrl: [String],
          hiddenDocUrls: [String],
          replacedDocUrls: [String],
          location: { latitude: Number, longitude: Number },
        },
      ],
      default: {},
    },
    investigator: {
      type: Schema.Types.ObjectId,
      ref: "ClaimInvestigator",
      default: null,
    },
    preAuthFindings: {
      type: InvestigationFindingSchema,
      default: null,
    },
    preAuthFindingsPostQa: {
      type: InvestigationFindingSchema,
      default: null,
    },
    rmFindings: { type: RMInvestigationFindingSchema, default: null },
    rmFindingsPostQA: { type: RMInvestigationFindingSchema, default: null },
    invReportReceivedDate: { type: Date, default: null },
    outSourcingDate: { type: Date, default: null },
    investigationRejected: { type: InvestigationRejectSchema, default: null },
  },
  { timestamps: true }
);

const ClaimCaseSchema = new Schema<any>(
  {
    caseType: {
      type: [String],
    },
    caseTypeDependencies: { type: Map, of: [String] },
    caseStatus: {
      type: String,
      enum: ["Accepted", "Rejected", "Investigation Rejected"],
      default: "Accepted",
    },
    preQcObservation: {
      type: String,
      required: true,
    },
    preQcUploads: {
      type: [String],
      default: [],
    },
    allocationType: {
      type: String,
      enum: ["Single", "Dual"],
      default: "Single",
    },
    singleTasksAndDocs: { type: TasksAndDocumentsSchema, default: null },
    insuredTasksAndDocs: { type: TasksAndDocumentsSchema, default: null },
    hospitalTasksAndDocs: { type: TasksAndDocumentsSchema, default: null },
    dashboardDataId: {
      type: Schema.Types.ObjectId,
      ref: "DashboardData",
      required: true,
      unique: true,
    },
    intimationDate: {
      type: Date,
      default: null,
    },
    rejectionReasons: {
      type: [RejectionReasonSchema],
      default: [],
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    allocatorComment: { type: String },
    postQaComment: { type: String },
    postQARecommendation: {
      summaryOfInvestigation: { type: String },
      qaRemarks: { type: String },
      reInvestigationRemarks: { type: String },
      frcuRecommendationOnClaims: {
        type: { value: String, code: String },
        default: {},
      },
      claimsGroundOfRepudiation: { type: [String], default: [] },
      frcuGroundOfRepudiation: {
        type: [{ value: String, code: String }],
        default: [],
      },
      queriesToRaise: { type: String },
      providerRecommendation: { type: String },
      policyRecommendation: { type: String },
      sourcingRecommendation: { type: String },
      regulatoryReportingRecommendation: { type: String },
      documents: { type: [String], default: [] },
    },
    insuredAddress: { type: String },
    insuredCity: { type: String },
    insuredState: { type: String },
    insuredPinCode: { type: Number },
    reportSubmissionDateQa: { type: Date, default: null },
    postQaOverRulingReason: { type: String, default: "" },
    qaBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const ClaimCase =
  models?.ClaimCase || model<IClaimCase>("ClaimCase", ClaimCaseSchema);

export default ClaimCase;
