import { Dayjs } from "dayjs";
import { ObjectId } from "mongoose";
import { IRMFindings } from "./rmDataTypes";
import { TSourceSystem } from "./maximusResponseTypes";

export type SortOrder = 1 | -1 | null;

export interface CommonThProps {
  children: React.ReactNode;
  sortable: boolean;
  sorted: SortOrder;
  sortKey: string;
  onSort(sortKey: string): void;
}

export type TReportReceivedTime = {
  from?: Date;
  to?: Date;
  is24Hour?: boolean;
};

export type UserConfig = {
  leadView?: string[];
  isPreQcAutomated?: boolean;
  canSeeConsolidatedInbox?: "Yes" | "No";
  canSeeFailedCases?: "Yes" | "No";
  canExportConsolidatedInbox?: "Yes" | "No";
  dailyThreshold?: number;
  dailyAssign?: number;
  claimAmount?: string;
  reportReceivedTime?: TReportReceivedTime;
  thresholdUpdatedAt?: Date;
  triggerSubType?: "Mandatory" | "Non Mandatory";
};

export enum Role {
  ADMIN = "Admin",
  ALLOCATION = "Allocation",
  POST_QA = "Post QA",
  POST_QA_LEAD = "Post QA Lead",
  PRE_QC = "Pre QC",
  INTERNAL_INVESTIGATOR = "Internal Investigator",
  EXTERNAL_INVESTIGATOR = "External Investigator",
  CFR = "CFR",
  TL = "TL",
  CENTRAL_OPERATION = "Central Operation",
  CLUSTER_MANAGER = "Cluster Manager",
  NA = "NA",
}

export type UserExpedition = {
  _id?: string;
  claimId: number;
  message?: string;
  noted: boolean;
  subject: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserUpdates = {
  userIsInformed: boolean;
  details: Record<string, string>;
  expedition?: UserExpedition[];
};

export interface IUserLeave {
  fromDate: Date | null;
  toDate: Date | null;
  status: "Requested" | "Approved" | "Rejected" | "";
  remark: string;
}

export type TClaimAmountThreshold =
  | "Any Amount"
  | "Bellow 1 Lac"
  | "1 Lac to 5 Lacs"
  | "5 Lacs to 10 Lacs"
  | "10 Lacs to 20 Lacs"
  | "20 Lacs to 50 Lacs"
  | "Above 50 Lacs";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userId: string;
  password: string;
  pinCode: string;
  city: string;
  district: string;
  state: string[];
  role: Role[];
  activeRole: Role;
  status: string;
  userType: "Internal" | "External";
  team: IUser | string;
  config: UserConfig;
  updates: UserUpdates;
  claimAmountThreshold: TClaimAmountThreshold;
  leave?: IUserLeave;
  zone: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PostQaApproveFormValues {
  summaryOfInvestigation: string;
  frcuRecommendationOnClaims: string;
  claimsGroundOfRepudiation: string[];
  frcuGroundOfRepudiation: string[];
  queriesToRaise: string;
  providerRecommendation: string;
  policyRecommendation: string;
  sourcingRecommendation: string;
  regulatoryReportingRecommendation: string;
  documents?: string[];
}

export type TValueCode = { value: string; code: string };

export interface RevisedQaApproveFormValues
  extends Omit<
    PostQaApproveFormValues,
    "frcuRecommendationOnClaims" | "frcuGroundOfRepudiation"
  > {
  frcuRecommendationOnClaims: TValueCode;
  frcuGroundOfRepudiation: TValueCode[];
}

export enum EColorCode {
  "PreAuth-Red" = "PreAuth-Red",
  "PreAuth-Green" = "PreAuth-Green",
  "PreAuth-Amber" = "PreAuth-Amber",
  "RM-Red" = "RM-Red",
  "RM-Green" = "RM-Green",
  "RM-Amber" = "RM-Amber",
  "PAOrCI-Red" = "PAOrCI-Red",
  "PAOrCI-Green" = "PAOrCI-Green",
  "PAOrCI-Amber" = "PAOrCI-Amber",
}

export interface IUserSearchValues {
  pinCode: string;
  city: string;
  district?: string;
  state: string;
  providers?: string;
  leaders?: string;
}

export interface IInvestigatorPinCodeData {
  _id: string;
  name: string;
  pinCodes: string[];
}
export interface IInvestigatorCityData {
  _id: string;
  name: string;
  cities: string[];
}
export interface IInvestigatorStateData {
  _id: string;
  name: string;
  states: string[];
}
export interface IInvestigatorProviderData {
  _id: string;
  name: string;
  providers: string[];
}

export interface IHospitalProvider {
  _id: string;
  providerNumber: string;
  providerName: string;
  providerType: string;
  providerAddress: string;
  providerCity: string;
  providerState: string;
  pinCode: string;
  fraudList: boolean;
  coutionList: boolean;
  preferPartnerList: boolean;
}

export type InvestigatorUpdate = {
  expedition: UserExpedition[];
};

export interface Investigator {
  _id: string;
  phone: string;
  email: string[];
  password: string;
  investigatorName: string;
  investigatorCode: string;
  Type: "External" | "Internal";
  Mode: string;
  assignmentPreferred: string[];
  dailyThreshold: number;
  monthlyThreshold: number;
  dailyAssign: number;
  monthlyAssigned: number;
  userStatus: string;
  hitRate: number;
  TAT: number;
  performance: number;
  pinCodeData?: IInvestigatorPinCodeData;
  pinCodes: string[];
  cityData?: IInvestigatorCityData;
  cities: string[];
  stateData?: IInvestigatorStateData;
  states: string[];
  district: string[];
  providerData?: IInvestigatorProviderData;
  providers: string[];
  inactiveReason?: string;
  inactiveFrom?: Date | null;
  inactiveTo?: Date | null;
  rejectedCases?: number[];
  updatedDate: Date;
  role?: "Leader" | "TeamMate" | "None";
  leader?: string;
  updates: InvestigatorUpdate;
  createdAt: string;
  updatedAt: string;
}

export interface ContractDetails {
  contractNo: string;
  product: string;
  policyNo: string;
  policyStartDate: string;
  policyEndDate: string;
  port: string;
  prevInsuranceCompany: string;
  insuredSince: string;
  mbrRegDate: string;
  NBHIPolicyStartDate: string;
  membersCovered: number;
  agentName: string;
  currentStatus: string;
  agentCode: string;
  branchLocation: string;
  sourcing: string;
  bancaDetails: string;
  customerType: string;
}

export interface InsuredDetails {
  insuredName: string;
  gender: string;
  age: number;
  dob: string;
  address: string;
  city: string;
  state: string;
  contactNo: string;
  emailId: string;
  memberType: string;
  memberId: string;
  pivotalCustomerId: string;
  height: string;
  weight: string;
  occupation: string;
  insuredType: string;
}

export interface City {
  Title: string;
  Code: string;
  State: string;
  Description: string;
  HospitalLocations: string;
  PremiumCalculator: string;
  ID: string;
  MetroCity: string;
}

export interface PinCode {
  _id: string;
  CITY_CODE: string;
  PIN_CODE: string;
  CITY_NAME: string;
  STATE_CODE: string;
  STATE_NAME: string;
}

export interface ClaimDetails {
  claimStatus: string;
  claimStatusUpdated: string;
  noOfClaimsInHistory: number;
  claimNo: string;
  submittedAt: string;
  receivedAt: string;
  payTo: string;
  memberNo: string;
  pivotalCustomerId: string;
  claimType: string;
  mainClaim: string;
  hospitalizationType: string;
  deductibleAmount: string;
  diagnosis: string;
  diagnosisCode1?: string;
  diagnosisCode2?: string | null;
  diagnosisCode3?: string | null;
  icdCode: string;
  lineOfTreatment: string;
  billedAmount: string;
  preAuthNo: string;
  submittedBy: string;
  claimAmount: number;
  exclusionRemark: string;
  fraudType: string;
  fraudReason: string;
  spotNumber: string;
  spotInvestigationRecommendation: string;
  spotInvestigationFindings: string;
  noOfClaimsCorrespondingToPivotalId: string;
  claimTrigger: string;
  fraudStatus: string;
  prePostIndicator: string;
}

export interface HospitalDetails {
  providerNo: string;
  providerName: string;
  providerType: string;
  providerAddress: string;
  providerState: string;
  providerCity: string;
  pinCode: string;
  preferredPartnerList?: string;
  doubtfulProvider?: string;
  fraudList?: string;
  coutionList?: string | null;
}

export enum AdmissionType {
  ADMITTED = "Admitted",
  PLANNED = "Planned",
  POST_FACTO = "Post Facto",
  NA = "",
}

export interface HospitalizationDetails {
  treatingDoctorName: string;
  treatingDoctorRegNo: string;
  dateOfAdmission: string;
  dateOfAdmissionUpdated: string;
  dateOfDischarge: string;
  dateOfDischargeUpdated: string;
  admissionType: AdmissionType;
  LOS: string;
}

export type RejectionReason = {
  reason: string;
  remark: string;
};

export interface IBenefitsCovered {
  benefitType: string;
  benefitTypeIndicator: string;
}

export interface Member {
  _id?: string;
  membershipNumber: number;
  membershipName: string;
  DOB: string;
  relation: string;
  benefitsCovered: IBenefitsCovered[];
}

export interface History {
  _id: string;
  hospital: string;
  diagnosis: string;
  DOA: string;
  DOD: string;
  claimAmount: string;
  claim_number: string;
  claims_Status: string;
  fcu: string;
  dsClaimId: string;
}

export interface HistoricalClaim {
  _id: string;
  memberName: string;

  claimPreAuthNo: string;
  memberNo: string;
  history: History[];
}

export type ClaimInvestigator = {
  _id: string;
  name: string;
  assignedFor: string;
  assignedData: Date | null;
  investigationStatus: "Unassigned" | "Assigned" | "Accepted" | "Completed";
};

export interface IAutoPreQC {
  _id: string;
  autoPreQC: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export enum NumericStage {
  PENDING_FOR_PRE_QC = 1,
  PENDING_FOR_ALLOCATION = 2,
  IN_FIELD_FRESH = 3,
  POST_QC = 4,
  IN_FIELD_REWORK = 5,
  IN_FIELD_REINVESTIGATION = 6,
  INVESTIGATION_ACCEPTED = 7,
  INVESTIGATION_SKIPPED_AND_COMPLETING = 8,
  INVESTIGATION_SKIPPED_AND_RE_ASSIGNING = 9,
  PENDING_FOR_RE_ALLOCATION = 10,
  REJECTED = 11,
  CLOSED = 12,
}

// Old stages
// export enum NumericStage {
//   PENDING_FOR_PRE_QC = 1,
//   PENDING_FOR_ALLOCATION = 3,
//   IN_FIELD_FRESH = 4,
//   POST_QC = 5,
//   IN_FIELD_REINVESTIGATION = 7,
//   CLOSED = 12,
//   REJECTED = 13,
//   INVESTIGATION_ACCEPTED = 14,
//   INVESTIGATION_SKIPPED = 15,
//   IN_FIELD_REWORK = 16,
// }

export enum EventNames {
  INTIMATION_OR_REFERRAL = "Intimation/Referral",
  SYSTEM_PRE_QC = "System Pre-QC",
  PRE_QC_ACCEPTED = "Pre-QC Accepted",
  AUTO_ALLOCATION = "Auto Allocation",
  MANUAL_ALLOCATION = "Manual Allocation",
  CASE_ACCEPTED = "Case Accepted",
  INVESTIGATION_REJECTED = "Investigation Rejected",
  INVESTIGATION_REPORT_SUBMITTED = "Investigation Report Submitted",
  REPORT_VALIDATION = "Report Validation",
  RETURN_TO_FIELD = "Returned back to Field from Post QA",
  QA_ASSIGNED = "QA Assigned",
  QA_COMPLETED = "QA Completed",
  MOVE_TO_ALLOCATION_BUCKET = "Move to Allocation Bucket",
  PRE_QC_REJECTED = "Pre QC Rejected",
  TASK_UPDATE_BY_QA = "Task Update By QA",
  CASE_LOCKED = "Case Locked",
  CASE_UNLOCKED = "Case unlocked",
  INVESTIGATION_SKIPPED_AND_COMPLETING = "Investigation skipped And Completing",
  INVESTIGATION_SKIPPED_AND_RE_ASSIGNING = "Investigation skipped And Re-Assigning",
  INVESTIGATION_SKIPPED_CANCELEd = "Investigation which was skipped, is canceled and sent back to where it was before",
  EXPEDITION_MESSAGE_SENT = "Expedition Message Sent",
  INV_REQUESTED_TO_CHANGE_CLAIM_SUBTYPE = "Investigator requested to change claim sub-type",
  SENT_BACK_TO_PRE_QC_DUE_TO_PA = "Case came back to Pre-QC",
  MANUALLY_ASSIGNED_TO_POST_QA = "Manually assigned to Post QA user",
  CLAIM_SUB_TYPE_CHANGE_APPROVED = "Claim Sub-Type changed approved by TL",
  CLAIM_SUB_TYPE_CHANGE_REJECTED = "Claim Sub-Type changed rejected by TL",
  CLAIM_SUB_TYPE_CHANGE = "Claim Sub-Type changed",
  DOCUMENT_DELETED = "Document Deleted",
  DOCUMENT_RESTORED = "Document Restored",
  DOCUMENT_REPLACED = "Document Replaced",
  STAGE_CHANGE = "Stage changed",
}

export interface INewCityMaster {
  _id: string;
  Title: string;
  City_code: string;
  State_code: string;
  State: string;
}

export interface INewPinCodeMaster {
  _id: string;
  PIN_CODE: string;
  CITY_CODE: string;
  STATE_CODE: string;
  CITY_NAME: string;
  STATE_NAME: string;
}

export interface INewStateDistrictMaster {
  _id: string;
  DIST_CODE: string;
  State_code: string;
  District: string;
  State: string;
}

export interface MainTriage {
  variable: string;
  logic: string;
  result: string;
  acceptOrReject: {
    condition: boolean;
    text: string;
  };
}

export interface IFraudIndicator {
  _id: string;
  FRAUD_INDICATOR_DESC: string;
  Values: {
    CL_Selected: "TRUE" | "FALSE";
    FI_Selected: "TRUE" | "FALSE";
  };
}

export interface IFraudIndicators {
  indicatorsList: IFraudIndicator[];
  remarks: string;
}

export interface ICataractOrDayCareProcedure {
  Benefit_Type: string | null;
  Benefit_Head: string | null;
}

export interface IAction {
  actionName: string;
  userId: string | IUser[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ILocked {
  _id?: string;
  status: boolean;
  name?: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITLInbox {
  claimSubTypeChange?: { value: string; remarks: string; origin: string };
}

export interface IDashboardData {
  _id: string | ObjectId;
  contractDetails: ContractDetails;
  insuredDetails: InsuredDetails;
  claimDetails: ClaimDetails;
  hospitalDetails: HospitalDetails;
  hospitalizationDetails: HospitalizationDetails;
  fraudIndicators: IFraudIndicators;
  rejectionReasons?: RejectionReason[];
  claimId: number;
  claimType: "PreAuth" | "Reimbursement";
  benefitType: string;
  members: Member[];
  historicalClaim: HistoricalClaim[];
  allocationType: string;
  stage: NumericStage;
  intimationDate: string | null;
  isReInvestigated: boolean;
  investigationCount: number;
  caseId: string | null;
  dateOfOS: Date | null;
  dateOfClosure: Date | null;
  clusterManager: string | IUser;
  postQa: string | IUser;
  triageSummary: MainTriage[];
  closureTAT: number;
  lossType: string;
  lossDate: Date | null;
  sumInsured: string;
  claimInvestigators: ClaimInvestigator[];
  teamLead: IUser[];
  claimSubType: string;
  openTAT: number;
  rejectionReason?: string;
  cataractOrDayCareProcedure: ICataractOrDayCareProcedure[];
  rowColor?: string;
  applicationId: string;
  referralType: "Manual" | "API";
  actionsTaken: IAction[];
  expedition: UserExpedition[];
  locked: ILocked;
  dateOfFallingIntoAllocationBucket: Date | null;
  dateOfFallingIntoPostQaBucket: Date | null;
  dateOfFallingIntoReInvestigation: Date | null;
  invReportReceivedDate: Date | null;
  investigatorRecommendation?: string;
  finalOutcome?: string;
  sourceSystem: TSourceSystem;
  tlInbox?: ITLInbox;
  createdAt: string;
  updatedAt: string;
}

export interface State {
  _id: string;
  state: string;
  districts?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ValueLabel {
  value: string;
  label: string;
}

export interface IMoreFiltersOptions {
  value: string;
  label: string;
  type: "text" | "number" | "date" | "array" | "select" | "dateRange";
}

export interface DashboardFilters {
  stage?: string[];
  claimType?: string;
  claimSubType?: string[];
  benefitType?: string[];
  teamLead?: string;
  moreFilters?: string[];
  filterApplied: boolean;
  [key: string]: any;
}

export type Task = {
  name: string;
  completed: boolean;
  comment: string;
  _id?: string;
};

export type TGender = "Male" | "Female" | "Transgender";
export type TYesNo = "Yes" | "No";
export type TYesNoNa = "Yes" | "No" | "NA";

export type TPatientHabit = {
  _id?: string;
  habit: string;
  frequency?: string;
  quantity?: string;
  duration?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TAilment = {
  _id?: string;
  ailment: string;
  diagnosis?: string;
  duration?: string;
  onMedication?: TYesNo;
  createdAt?: string;
  updatedAt?: string;
};

export interface IOtherRecommendation {
  value: string;
  detail: { value: string; remark?: string }[];
}

interface IDocLocation {
  latitude: number;
  longitude: number;
}

export interface DocumentData {
  _id?: string;
  name: string;
  docUrl: string[];
  hiddenDocUrls: string[];
  replacedDocUrls: string[];
  location: IDocLocation | null;
}

export type DocumentMap = Map<string, DocumentData[]>;

export type ResponseDoc = Record<string, DocumentData[]>;

export interface IInvestigationFindings {
  dateOfVisitToInsured?: Dayjs | null;
  timeOfVisitToInsured?: Dayjs;
  dateOfVisitToHospital?: Dayjs | null;
  timeOfVisitToHospital?: Dayjs;
  hospitalizationStatus?: {
    value?: string;
    differedAdmission?: string;
    cancelledAdmission?: string;
    cancelledAdmissionOther?: string;
  };
  hospitalizationDetails?: {
    dateOfAdmission?: Dayjs | null;
    timeOfAdmission?: Dayjs | null;
    dateOfDischarge?: Dayjs | null;
    timeOfDischarge?: Dayjs | null;
    tentativeDateOfAdmission?: Dayjs | null;
    tentativeDateOfDischarge?: Dayjs | null;
    proposedDateOfAdmission?: Dayjs | null;
    proposedDateOfDischarge?: Dayjs | null;
  };
  patientDetails?: {
    patientName?: string;
    patientAge?: number;
    patientGender?: string;
    revisedPatientName?: string;
    revisedPatientAge?: number;
    revisedPatientGender?: string;
  };
  attendantDetails?: {
    status?: "Available" | "Not Available" | "NA";
    name?: string;
    gender?: string;
    relationship?: string;
    mobileNo?: string;
  };
  occupationOfInsured?: string;
  workPlaceDetails?: string;
  anyOtherPolicyWithNBHI?: string;
  otherPolicyNoWithNBHI?: string;
  policyNumber?: string;
  anyPreviousClaimWithNBHI?: string;
  insurancePolicyOtherThanNBHI?: {
    hasPolicy?: string;
    nameOfInsuranceCompany?: string;
    policyNumber?: string;
  };
  classOfAccommodation?: {
    status?: string;
    remark?: string;
  };
  changeInClassOfAccommodation?: {
    status?: string;
    remark?: string;
  };
  patientOnActiveLineOfTreatment?: {
    status?: string;
    remark?: string;
  };
  mismatchInDiagnosis?: {
    status?: string;
    remark?: string;
  };
  discrepancies?: {
    status?: string;
    remark?: string;
  };
  patientHabit?: TPatientHabit[];
  pedOrNoneDisclosure?: TYesNoNa;
  ailment?: TAilment[];
  insuredOrAttendantCooperation?: TYesNo;
  reasonForInsuredNotCooperation?: string;
  providerCooperation?: TYesNo;
  reasonForProviderNotCooperation?: string;
  port?: string;
  investigationSummary?: string;
  recommendation?: { value: string; code: string };
  inconclusiveRemark?: string;
  frcuGroundOfRepudiation?: { value: string; code: string }[];
  evidenceDocs?: string[];
  groundOfRepudiationNonCooperationOf?: "Insured" | "Hospital" | "Both";
  nonCooperationDetails?: string;
  otherRecommendation?: IOtherRecommendation[];
  evidenceOfRepudiation?: string;
  repudiationReason?: string;
  createdAt?: Date | string;
}

export interface RevisedInvestigationFindings
  extends Omit<
    IInvestigationFindings,
    "frcuGroundOfRepudiation" | "recommendation"
  > {
  frcuGroundOfRepudiation?: TValueCode[];
  recommendation?: TValueCode;
}

export interface IInvestigationRejected {
  remark: string;
  insuredAddress: string;
  insuredCity: string;
  insuredState: string;
  insuredMobileNumber: string;
  investigationRejectedReason: string;
}

export interface ITasksAndDocuments {
  _id?: string;
  tasks?: Task[];
  docs?: DocumentMap | ResponseDoc | null;
  investigator?: Investigator | string | null;
  preAuthFindings?: RevisedInvestigationFindings | null;
  preAuthFindingsPostQa?: RevisedInvestigationFindings | null;
  rmFindings?: IRMFindings | null;
  rmFindingsPostQA?: IRMFindings | null;
  invReportReceivedDate?: Date | null;
  outSourcingDate?: Date | null;
  investigationRejected?: IInvestigationRejected;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CaseDetail {
  _id: string | ObjectId;
  caseType: string[];
  caseTypeDependencies: { [key: string]: string[] | undefined };
  caseStatus: "Accepted" | "Rejected" | "Investigation Rejected";
  preQcObservation: string;
  allocationType: "Single" | "Dual";
  singleTasksAndDocs: ITasksAndDocuments | null;
  insuredTasksAndDocs: ITasksAndDocuments | null;
  hospitalTasksAndDocs: ITasksAndDocuments | null;
  dashboardDataId: string | ObjectId;
  intimationDate: Date | string;
  rejectionReasons: RejectionReason[];
  assignedBy: string | IUser[] | ObjectId;
  updatedBy: string | IUser[] | ObjectId;
  insuredAddress: string;
  insuredCity: string;
  insuredState: string;
  insuredPinCode?: number;
  allocatorComment?: string;
  postQaComment?: string;
  postQARecommendation?: RevisedQaApproveFormValues;
  reportSubmissionDateQa: Date | null;
  postQaOverRulingReason?: string;
  qaBy?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Triage {
  variable: string;
  logic: string;
  result: string;
  acceptOrReject: {
    condition: boolean;
    text: string;
  };
}
export interface TempTriage {
  variable: string;
  result: string;
  inference: {
    condition: boolean;
    text: string;
  };
}

export interface TriageResult {
  total: number;
  accepted: number;
  rejected: number;
  result: string;
}

export enum CaseState {
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface HospitalProviderDetail {
  _id: string;
  providerNumber: string;
  providerName: string;
  providerType: string;
  providerAddress: string;
  providerCity: string;
  providerState: string;
  pinCode: string;
  fraudList: boolean;
  coutionList: boolean;
  preferPartnerList: boolean;
}

export type ColorCount = {
  green: number;
  amber: number;
  red: number;
};

export interface ICaseEvent {
  _id: string;
  claimId: number;
  claimType: string;
  spotNumber: string;
  contractNumber: string;
  membershipNumber: string;
  pivotalCustomerId: string;
  eventName: string;
  eventDate: Date;
  userName: string;
  eventRemarks: string;
  intimationDate: Date;
  status: NumericStage;
  recommendation: string;
  closureDate: Date | null;
  investigator: Investigator | null | string;
  clusterManager: IUser | null | string;
  zonalManager: string;
  qaBy: string;
}

export interface IMultipleEvents extends ICaseEvent {
  children: ICaseEvent[];
}

export interface IDashboardCount {
  preAuth: ColorCount;
  reimbursement: ColorCount;
  PAOrCI: ColorCount;
  total: ColorCount;
}

export interface AcceptedValues
  extends Omit<
    CaseDetail,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "assignedBy"
    | "intimationDate"
    | "rejectionReasons"
    | "updatedBy"
    | "outSourcingDate"
    | "invReportReceivedDate"
    | "reportSubmissionDateQa"
  > {
  _id?: string;
}

export interface AssignToInvestigatorRes {
  success: boolean;
  message: string;
  data: Investigator[];
}
// --------------- Response Types -------------//
export interface ResponseType<T> {
  success: boolean;
  message: string;
  data: T[];
  count: number;
}

export interface SingleResponseType<T> {
  success: boolean;
  message: string;
  data: T;
  count: number;
}

export interface ILoadings {
  state: boolean;
  district: boolean;
  city: boolean;
  pinCode: boolean;
  provider?: boolean;
  leaders?: boolean;
}

export type IDType = { _id: string };
export type DistResponse = { _id: string; state: string };

export interface IDDataFeedingLog {
  _id?: string | ObjectId;
  totalRecords: number;
  insertedRecords: number;
  skippedRecords: number;
  foundAndUpdatedRecords: number;
  skippedClaimIds: string[];
  skippedReasons: string[];
  updatedAt: string | Date;
  createdAt: string | Date;
}

export interface IFeedingLogsTableData {
  claimId: string;
  failureReason: string;
}

export interface IShowElement {
  changeTask: boolean;
  allocationAccept: boolean;
  allocationReject: boolean;
  postQaAccept: boolean;
  postQaReject: boolean;
  completeTasks: boolean;
  completeDocuments: boolean;
  preQCAccept: boolean;
  preQCReject: boolean;
  assignToPostQA: boolean;
}

export type LocationType = {
  latitude: number;
  longitude: number;
};

export interface IVisibleColumn {
  value: string;
  label: string;
  visible: boolean;
}

export interface ITableHeader {
  value: string;
  label: string;
  sortable: boolean;
}

export type TDashboardOrigin = "Inbox" | "Outbox" | "Consolidated";

export interface IZoneMaster {
  _id: string;
  Zone: string;
  zoneId: string;
}

export interface IZoneStateMaster {
  _id: string;
  State_code: string;
  State: string;
  Zone: string;
  zoneId: string;
  zone?: IZoneMaster;
}

export interface IMainOptions {
  name: string;
  options: ValueLabel[];
}

export interface IMaximusResponseLog {
  _id?: string;
  api: string;
  originFileName: string;
  claimId?: number;
  dashboardDataId?: any;
  requestBody?: any;
  responseBody?: any;
  requestHeaders?: any;
  errorPayloadFromCatchBlock?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TGeoOption = {
  city: string[];
  state: string[];
  pinCode: string[];
};
