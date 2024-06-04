import { TAilment, TPatientHabit } from "./fniDataTypes";

export interface IPharmacy {
  _id?: string;
  name: string;
  address: string;
  city: string;
  qrCodeAvailableOnBill: string;
  codeScanResult?: string;
  billsVerified: string;
  reasonOfBillsNotVerified?: string;
  discrepancyStatus?: string;
  billVerificationResult?: string;
  billVerificationResultRemark?: string;
  briefSummaryOfDiscrepancy?: string;
  observation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILab extends Omit<IPharmacy, "billVerificationResult"> {
  billVerificationResult?: string[];
  finalObservation: string;
}

export interface IOtherBill {
  _id?: string;
  nameOfEntity: string;
  typeOfEntity: string;
  address: string;
  city: string;
  billsAndReportsVerified: string;
  reasonOfBillsNotVerified?: string;
  discrepancyStatus?: string;
  billVerificationResult?: string[];
  billVerificationResultRemark?: string;
  briefSummaryOfDiscrepancy?: string;
  observation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDoctor {
  _id?: string;
  name: string;
  qualification: string;
  registrationNo: { value: string; remark: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface ITreatingDoctor extends IDoctor {
  meetingStatus: string;
  remarkForUntraceable?: string;
  cooperation?: string;
}

export interface IConsultationPaperAndDoctorDetail {
  _id?: string;
  doctorName: string;
  consultationOrFollowUpConfirmation: string;
  consultationIsRelatedToDiagnosis: string;
  observation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMainClaimDetails {
  _id?: string;
  discrepancyStatus: string;
  observation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IInsuredCooperationDetails {
  _id?: string;
  dateOfVisitToInsured: Date | null;
  timeOfVisitToInsured: Date | null;
  nameOfInsuredSystem: string;
  nameOfInsuredUser: string;
  dateOfAdmissionSystem: string;
  dateOfAdmissionUser: string;
  timeOfDischargeSystem: string;
  timeOfDischargeUser: string;
  durationOfHospitalizationSystem: string;
  durationOfHospitalizationUser: string;
  diagnosis: string;
  classOfAccommodation: string;
  discrepanciesObserved: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHospitalCooperationDetail {
  _id?: string;
  dateOfVisitToHospital: Date | null;
  timeOfVisitToHospital: Date | null;
  dateOfAdmissionSystem: Date | null;
  dateOfAdmissionUser: Date | null;
  timeOfDischargeSystem: Date | null;
  timeOfDischargeUser: Date | null;
  durationOfHospitalizationSystem: string;
  durationOfHospitalizationUser: string;
  diagnosis: string;
  classOfAccommodation: string;
  discrepanciesObserved: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReasonOfInsuredNotVisit {
  _id?: string;
  value: string;
  reason: string;
  proof: string[];
  untraceableBasis?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAnyInsurancePolicyOtherThanNBHI {
  _id?: string;
  value: string;
  nameOfInsuranceCompany?: string;
  documents?: string[];
  policyNo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPolicyType {
  _id?: string;
  value: string;
  portedFrom?: string;
  reasonOfPortability?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISurgicalTreatmentType {
  _id?: string;
  nameOfProcedure: string;
  dateOfSurgery: Date | null;
  timeOfSurgery: Date | null;
  anesthesiaGiven: string;
  typeOfAnesthesia?: string;
  nameOfSurgeon: string;
  nameOfAnesthetist: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IClassOfAccommodation {
  _id?: string;
  name: string;
  fromDate?: Date | null;
  toDate?: Date | null;
  othersSpecify?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAttendantDetails {
  _id?: string;
  name: string;
  gender: string;
  relationship?: string;
  mobileNo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMedicinesDetails {
  _id?: string;
  costOfMedicineBill?: number;
  paymentMode?: string;
  remark?: string;
  medicinesReturned: string;
  amountRefunded?: string;
  refundInvoice?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAmountPaidToHospital {
  _id?: string;
  value: number;
  paymentMode?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAmountPaidForDiagnosticTests {
  _id?: string;
  value: number;
  paymentMode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAnyOtherAmountPaid {
  _id?: string;
  value: string;
  amount: number;
  paymentMode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPedOrNonDisclosure {
  _id?: string;
  value: string;
  ailmentDetail?: TAilment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IPatientLift {
  _id?: string;
  available: string;
  operational: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHospitalRegistration {
  _id?: string;
  registered: string;
  registeredFrom?: Date | null;
  registeredTo?: Date | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRecordKeeping {
  _id?: string;
  value: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHospitalInfrastructure {
  _id?: string;
  value: string;
  noOfBeds?: number;
  OT?: string;
  ICU?: string;
  specialty?: string;
  roundOfClockRMO?: string;
  pharmacy?: string;
  pathology?: string;
  hospitalOperations?: string;
  patientLifts?: IPatientLift;
  hospitalRegistration?: IHospitalRegistration;
  recordKeeping?: IRecordKeeping;
  createdAt?: string;
  updatedAt?: string;
}

export interface IICPSCollected {
  _id?: string;
  value: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IIndoorEntry {
  _id?: string;
  value: string;
  periodOfHospitalizationMatching?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOldRecordCheck {
  _id?: string;
  value: string;
  remark: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPathologistDetail {
  _id?: string;
  name: string;
  qualification: string;
  registrationNo: string;
  meetingStatus: string;
  reasonForUntraceable?: string;
  cooperation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILabs {
  _id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  reportsSigned: string;
  labReports: string;
  labBills: string;
  pathologistDetails: IPathologistDetail;
  createdAt?: string;
  updatedAt?: string;
}

export interface IChemist {
  _id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  billsVerified: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEmployer {
  _id?: string;
  nameOfEmployer: string;
  address: string;
  dateOfJoining: Date | null;
  anyGroupHealthPolicy: string;
  claimDetails?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEstablishmentVerification {
  _id?: string;
  value: string;
  status?: {
    value: string;
    address?: string;
    city?: string;
    state?: string;
    typeOfEstablishments?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IRecommendation {
  _id?: string;
  value: string;
  hasEvidence?: string;
  evidences?: string[];
  reasonOfEvidenceNotAvailable?: string;
  inconclusiveRemark?: string;
  groundOfRepudiation?: string[];
  nonCooperationOf?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOtherRecommendation {
  _id?: string;
  value: string;
  recommendationFor: { value: string; remark?: string }[];
  tempRecommendationFor?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface INPSVerification {
  _id?: string;
  insuredVisit: string;
  insuredMobileNo: string;
  insuredVisitDate: Date | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPrePostVerification {
  _id?: string;
  pharmacyBillVerified: string;
  pharmacies?: IPharmacy[];
  labVerified: string;
  labs?: ILab[];
  otherBillVerified: string;
  otherBills?: IOtherBill[];
  consultationPaperAndDoctorVerified: string;
  consultationPaperAndDoctorDetail?: IConsultationPaperAndDoctorDetail;
  mainClaimIsVerified: string;
  mainClaimDetail?: IMainClaimDetails;
  insuredIsVerified: string;
  insuredVerificationDetail?: IMainClaimDetails;
  finalObservation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHospitalDailyCashPart {
  _id?: string;
  insuredVisit: string;
  insuredCooperation: string;
  insuredNotCooperatingReason?: string;
  insuredCooperationDetail?: IInsuredCooperationDetails;
  hospitalVisit: string;
  hospitalCooperation: string;
  hospitalNotCooperatingReason?: string;
  hospitalCooperationDetail?: IHospitalCooperationDetail;
  finalObservation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOPDVerificationPart {
  _id?: string;
  finalObservation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAHCVerificationPart {
  _id?: string;
  labVerified: string;
  labs?: ILab[];
  finalObservation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IClaimVerification {
  _id?: string;
  finalObservation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IInsuredVerification {
  _id?: string;
  insuredVisit: string;
  reasonOfInsuredNotVisit?: IReasonOfInsuredNotVisit;
  dateOfVisitToInsured?: Date | null;
  timeOfVisitToInsured?: Date | null;
  nameOfPatientSystem?: string;
  nameOfPatientUser?: string;
  ageOfPatientSystem?: number;
  ageOfPatientUser?: number;
  genderOfPatientSystem?: string;
  genderOfPatientUser?: string;
  mobileNumber?: string;
  occupationOfInsured?: string;
  workPlaceDetail?: string;
  anyOtherPolicyWithNBHI?: string;
  policyNo?: string;
  anyPreviousClaimWithNBHI?: string;
  anyInsurancePolicyOtherThanNBHI?: IAnyInsurancePolicyOtherThanNBHI;
  coverageUnderAnyGovSchema?: string;
  coverageUnderAnyGovSchemaRemark?: string;
  policyType?: IPolicyType;
  prevInsurancePolicyCopy?: string;
  anyClaimWithPrevInsurance?: string;
  symptomsWithDuration?: string;
  firstConsultationDetails?: { value: string; remark: string };
  firstConsultationOrReferralSlip?: { value: string; remark: string };
  nameOfHospitalSystem?: string;
  nameOfHospitalUser?: string;
  dateOfAdmissionSystem?: Date | null;
  dateOfAdmissionUser?: Date | null;
  timeOfAdmission?: { value: string; time: Date | null };
  dateOfDischargeSystem?: Date | null;
  dateOfDischargeUser?: Date | null;
  timeOfDischarge?: { value: string; time: Date | null };
  nameOfDoctorAttended?: string;
  numberOfVisitsOfDoctor?: string;
  treatmentType?: string;
  surgicalTreatmentType?: ISurgicalTreatmentType;
  classOfAccommodation?: string[];
  classOfAccommodationDetails?: IClassOfAccommodation[];
  attendantDetailsAtTheTimeOfAdmission?: string;
  attendantDetails?: IAttendantDetails;
  medicines?: string;
  medicinesDetail?: IMedicinesDetails;
  amountPaidToHospital?: IAmountPaidToHospital;
  amountPaidForDiagnosticTests?: IAmountPaidForDiagnosticTests;
  anyOtherAmountPaid?: IAnyOtherAmountPaid;
  totalAmountPaid?: number;
  remarks?: string;
  tempHabits?: string[];
  personalOrSocialHabits?: TPatientHabit[];
  tempAilments?: string[];
  pedOrNonDisclosure?: IPedOrNonDisclosure;
  claimNEFTDetail?: string;
  insuredOrAttendantCooperation?: string;
  reasonForInsuredNotCooperating?: string;
  verificationSummary: string;
  discrepanciesOrIrregularitiesObserved?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IVicinityVerification {
  _id?: string;
  status: string;
  verificationSummary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHospitalVerification {
  _id?: string;
  dateOfVisitToHospital: Date | null;
  timeOfVisitToHospital: Date | null;
  providerCooperation: string;
  reasonOfProviderNotCooperating?: string;
  hospitalInfrastructure: IHospitalInfrastructure;
  remarks: string;
  icpsCollected?: IICPSCollected;
  indoorEntry?: IIndoorEntry;
  oldRecordCheck?: IOldRecordCheck;
  billVerification?: string;
  paymentReceipts?: string;
  tempHabits?: string[];
  personalOrSocialHabits?: TPatientHabit[];
  tempAilments?: string[];
  pedOrNonDisclosure?: IPedOrNonDisclosure;
  verificationSummary?: string;
  discrepanciesOrIrregularitiesObserved?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITreatingDoctorVerification {
  _id?: string;
  doctors: ITreatingDoctor[];
  verificationSummary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFamilyDoctorOrReferringDoctorVerification {
  _id?: string;
  doctors: IDoctor[];
  verificationSummary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILabOrPathologistVerification {
  _id?: string;
  labs: ILabs[];
  verificationSummary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IChemistVerification {
  _id?: string;
  chemists: IChemist[];
  verificationSummary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEmployerVerification {
  _id?: string;
  employers: IEmployer[];
  verificationSummary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRandomVicinityVerification {
  _id?: string;
  verificationSummary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMiscellaneousVerification {
  _id?: string;
  anyMarketOrIndustryFeedback: string;
  verificationSummary: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEmploymentAndEstablishmentVerification {
  _id?: string;
  nameOfEstablishment: string;
  address: string;
  city: string;
  state: string;
  establishmentVerification: IEstablishmentVerification;
  natureOfWork: string;
  totalNoOfEmployeesWorking: number;
  listOfWorkingEmployees: string;
  listOfEmpMatchWithMembersEnrolled: string;
  employeeAndEmployerRelationship: string;
  employeeIdCard: string;
  salaryProof: string;
  investigationSummary: string;
  discrepanciesObserved: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRMFindings {
  _id?: string;
  "NPS Confirmation"?: INPSVerification;
  "Pre-Post Verification"?: IPrePostVerification;
  "Hospital Daily Cash Part"?: IHospitalDailyCashPart;
  "OPD Verification Part"?: IOPDVerificationPart;
  "AHC Verification Part"?: IAHCVerificationPart;
  "Claim Verification"?: IClaimVerification;
  "Insured Verification"?: IInsuredVerification;
  "Vicinity Verification"?: IVicinityVerification;
  "Hospital Verification"?: IHospitalVerification;
  "Treating Doctor Verification"?: ITreatingDoctorVerification;
  "Family Doctor Part/Referring Doctor Verification"?: IFamilyDoctorOrReferringDoctorVerification;
  "Lab Part/Pathologist Verification"?: ILabOrPathologistVerification;
  "Chemist Verification"?: IChemistVerification;
  "Employer Verification"?: IEmployerVerification;
  "Random Vicinity Hospital/Lab/Doctor/Chemist Verification"?: IRandomVicinityVerification;
  "Miscellaneous Verification"?: IMiscellaneousVerification;
  "Employment & Establishment Verification"?: IEmploymentAndEstablishmentVerification;
  investigationSummary?: string;
  discrepanciesOrIrregularitiesObserved?: string;
  recommendation?: IRecommendation;
  otherRecommendation?: IOtherRecommendation[];
}
