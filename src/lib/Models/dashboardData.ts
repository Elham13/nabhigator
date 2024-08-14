import {
  ClaimDetails,
  ILocked,
  ITLInbox,
  NumericStage,
  UserExpedition,
} from "../utils/types/fniDataTypes";
import { Document, Schema, model, models } from "mongoose";

interface IExpeditionSchema
  extends Omit<UserExpedition, "_id" | "role">,
    Document {
  role: string;
}
interface ILockedSchema extends Omit<ILocked, "_id" | "role">, Document {
  role: string;
}

interface ITLInboxSchema extends Omit<ITLInbox, "_id">, Document {}
interface IClaimDetailSchema extends Omit<ClaimDetails, "_id">, Document {}

const BenefitCoveredSchema = new Schema({
  benefitType: { type: String },
  benefitTypeIndicator: { type: String },
});

const MemberSchema = new Schema({
  membershipNumber: { type: Number },
  membershipName: { type: String },
  DOB: { type: Date },
  relation: { type: String },
  benefitsCovered: {
    type: [BenefitCoveredSchema],
    default: [],
  },
});

const ClaimDetailsSchema = new Schema<IClaimDetailSchema>({
  claimStatus: { type: String },
  claimStatusUpdated: { type: String },
  noOfClaimsInHistory: { type: Number },
  claimNo: { type: String },
  submittedAt: { type: String },
  receivedAt: { type: String },
  payTo: { type: String },
  memberNo: { type: String },
  pivotalCustomerId: { type: String },
  claimType: { type: String },
  mainClaim: { type: String },
  hospitalizationType: { type: String },
  deductibleAmount: { type: String },
  diagnosis: { type: String },
  diagnosisCode1: { type: String },
  diagnosisCode2: { type: String },
  diagnosisCode3: { type: String },
  icdCode: { type: String },
  lineOfTreatment: { type: String },
  billedAmount: { type: String },
  preAuthNo: { type: String },
  submittedBy: { type: String },
  claimAmount: { type: Number },
  exclusionRemark: { type: String },
  fraudStatus: { type: String },
  fraudType: { type: String },
  fraudReason: { type: String },
  spotNumber: { type: String },
  spotInvestigationRecommendation: { type: String },
  spotInvestigationFindings: { type: String },
  noOfClaimsCorrespondingToPivotalId: { type: String },
  claimTrigger: { type: String },
  prePostIndicator: { type: String },
});

const ContractDetailsSchema = new Schema({
  contractNo: { type: String },
  product: { type: String },
  policyNo: { type: String },
  policyStartDate: { type: Date },
  policyEndDate: { type: Date },
  port: { type: String },
  prevInsuranceCompany: { type: String },
  insuredSince: { type: String },
  mbrRegDate: { type: String },
  NBHIPolicyStartDate: { type: String },
  membersCovered: { type: Number },
  agentName: { type: String },
  currentStatus: { type: String },
  agentCode: { type: String },
  branchLocation: { type: String },
  sourcing: { type: String },
  bancaDetails: { type: String },
  customerType: { type: String },
});

const HistorySchema = new Schema({
  hospital: { type: String },
  diagnosis: { type: String },
  DOA: { type: Date },
  DOD: { type: Date },
  claimAmount: { type: String },
  claim_number: { type: String },
  claims_Status: { type: String },
  fcu: { type: String },
  dsClaimId: { type: String },
});

const InsuredDetailSchema = new Schema({
  insuredName: { type: String },
  gender: { type: String },
  dob: { type: Date },
  age: { type: Number },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  contactNo: { type: String },
  emailId: { type: String },
  memberType: { type: String },
  memberId: { type: String },
  pivotalCustomerId: { type: String },
  height: { type: String },
  weight: { type: String },
  occupation: { type: String },
  insuredType: { type: String },
});

const ClaimHistorySchema = new Schema({
  memberName: { type: String },
  claimPreAuthNo: { type: String },
  memberNo: { type: String },
  history: [HistorySchema],
});

const FraudIndicatorItem = new Schema({
  FRAUD_INDICATOR_DESC: { type: String },
  Values: { CL_Selected: { type: String }, FI_Selected: { type: String } },
});

const InvestigatorSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "ClaimInvestigator",
    default: null,
  },
  name: {
    type: String,
  },
  assignedFor: {
    type: String,
    enum: ["Hospital", "Insured", ""],
    default: "",
  },
  assignedData: { type: Date, default: null },
});

const HospitalDetailsSchema = new Schema({
  providerNo: { type: String },
  providerName: { type: String },
  providerType: { type: String },
  providerAddress: { type: String },
  providerState: { type: String },
  providerCity: { type: String },
  pinCode: { type: String },
  preferredPartnerList: { type: String },
  doubtfulProvider: { type: String },
  fraudList: { type: String },
  coutionList: { type: String },
});

const HospitalizationDetailsSchema = new Schema({
  treatingDoctorName: { type: String },
  treatingDoctorRegNo: { type: String },
  dateOfAdmission: { type: String },
  dateOfAdmissionUpdated: { type: String },
  dateOfDischarge: { type: String },
  dateOfDischargeUpdated: { type: String },
  admissionType: { type: String },
  LOS: { type: String },
});

const RejectionReasonSchema = new Schema({
  reason: { type: String, required: true },
  remark: { type: String, default: "" },
});

const TriageSchema = new Schema({
  variable: String,
  logic: String,
  result: String,
  acceptOrReject: {
    condition: Boolean,
    text: String,
  },
});

const ActionsSchema = new Schema(
  {
    actionName: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const ExpeditionSchema = new Schema<IExpeditionSchema>(
  {
    claimId: { type: Number, required: true },
    message: { type: String, default: "" },
    noted: { type: Boolean, default: false },
    subject: { type: String, default: "" },
    role: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const LockedSchema = new Schema<ILockedSchema>(
  {
    status: {
      type: Boolean,
      default: false,
    },
    role: { type: String, default: "" },
    name: { type: String, default: "" },
  },
  { timestamps: true }
);

const TLInboxSchema = new Schema<ITLInboxSchema>(
  {
    claimSubTypeChange: { value: String, remarks: String, origin: String },
  },
  { timestamps: true }
);

const DashboardDataSchema = new Schema(
  {
    claimId: {
      type: Number,
      required: [true, "ClaimId is required"],
      unique: true,
    },
    claimType: { type: String, required: [true, "Claim Type is required"] },
    claimSubType: { type: String, default: "" },
    lossType: { type: String, default: "" },
    benefitType: { type: String, default: "" },
    contractDetails: ContractDetailsSchema,
    members: [MemberSchema],
    insuredDetails: InsuredDetailSchema,
    claimDetails: ClaimDetailsSchema,
    hospitalDetails: HospitalDetailsSchema,
    hospitalizationDetails: HospitalizationDetailsSchema,
    historicalClaim: [ClaimHistorySchema],
    fraudIndicators: {
      indicatorsList: [FraudIndicatorItem],
      remarks: { type: String, default: "" },
    },
    triageSummary: [TriageSchema],
    allocationType: {
      type: String,
      enum: ["Single", "Dual", ""],
      default: "",
    },
    stage: {
      type: Number,
      default: NumericStage.PENDING_FOR_PRE_QC,
    },
    intimationDate: {
      type: String,
    },
    isReInvestigated: {
      type: Boolean,
      default: false,
    },
    investigationCount: {
      type: Number,
      default: 0,
    },
    applicationId: { type: String },
    teamLead: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "ClaimCase",
      default: null,
    },
    dateOfOS: {
      type: Date,
      default: null,
    },
    dateOfClosure: {
      type: Date,
      default: null,
    },
    clusterManager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    postQa: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    claimInvestigators: [InvestigatorSchema],
    lossDate: {
      type: Date,
      default: null,
    },
    sumInsured: {
      type: String,
      default: "",
    },
    rejectionReasons: { type: [RejectionReasonSchema], default: null },
    cataractOrDayCareProcedure: {
      type: [{ Benefit_Type: String, Benefit_Head: String }],
      default: [],
    },
    locked: LockedSchema,
    referralType: {
      type: String,
      required: true,
      enum: ["Manual", "API"],
    },
    actionsTaken: { type: [ActionsSchema], default: [] },
    expedition: {
      type: [ExpeditionSchema],
      default: [],
    },
    dateOfFallingIntoAllocationBucket: {
      type: Date,
      default: null,
    },
    dateOfFallingIntoPostQaBucket: {
      type: Date,
      default: null,
    },
    dateOfFallingIntoReInvestigation: {
      type: Date,
      default: null,
    },
    investigatorRecommendation: {
      type: String,
    },
    sourceSystem: { type: String },
    tlInbox: { type: TLInboxSchema },
  },
  { timestamps: true }
);

const DashboardData =
  models?.DashboardData || model("DashboardData", DashboardDataSchema);

export default DashboardData;
