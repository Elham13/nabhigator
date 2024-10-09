import {
  IAHCVerificationPart,
  IAmountPaidForDiagnosticTests,
  IAmountPaidToHospital,
  IAnyInsurancePolicyOtherThanNBHI,
  IAnyOtherAmountPaid,
  IAttendantDetails,
  IChemist,
  IChemistVerification,
  IClaimVerification,
  IClassOfAccommodation,
  IConsultationPaperAndDoctorDetail,
  IDoctor,
  IEmployer,
  IEmployerVerification,
  IEmploymentAndEstablishmentVerification,
  IEstablishmentVerification,
  IFamilyDoctorOrReferringDoctorVerification,
  IHospitalCooperationDetail,
  IHospitalDailyCashPart,
  IHospitalInfrastructure,
  IHospitalRegistration,
  IHospitalVerification,
  IICPSCollected,
  IIndoorEntry,
  IInsuredCooperationDetails,
  IInsuredVerification,
  ILab,
  ILabOrPathologistVerification,
  ILabs,
  IMainClaimDetails,
  IMedicinesDetails,
  IMiscellaneousVerification,
  INPSVerification,
  IOPDVerificationPart,
  IOldRecordCheck,
  IOtherBill,
  IOtherRecommendation,
  IPathologistDetail,
  IPatientLift,
  IPedOrNonDisclosure,
  IPharmacy,
  IPolicyType,
  IPrePostVerification,
  IRMFindings,
  IRandomVicinityVerification,
  IReasonOfInsuredNotVisit,
  IRecommendation,
  IRecordKeeping,
  ISurgicalTreatmentType,
  ITreatingDoctor,
  ITreatingDoctorVerification,
  IVicinityVerification,
} from "../utils/types/rmDataTypes";
import { TAilment, TPatientHabit } from "../utils/types/fniDataTypes";
import { Document } from "mongoose";
import { Schema } from "mongoose";

interface IPharmacySchema extends Omit<IPharmacy, "_id">, Document {}

interface ILabSchema extends Omit<ILab, "_id">, Document {}

interface ILabsSchema extends Omit<ILabs, "_id">, Document {}

interface IOtherBillSchema extends Omit<IOtherBill, "_id">, Document {}

interface IConsultationPaperAndDoctorSchema
  extends Omit<IConsultationPaperAndDoctorDetail, "_id">,
    Document {}

interface IMainClaimDetailSchema
  extends Omit<IMainClaimDetails, "_id">,
    Document {}

interface IInsuredCooperationDetailSchema
  extends Omit<IInsuredCooperationDetails, "_id">,
    Document {}

interface IHospitalCooperationDetailSchema
  extends Omit<IHospitalCooperationDetail, "_id">,
    Document {}

interface IReasonOfInsuredNotVisitSchema
  extends Omit<IReasonOfInsuredNotVisit, "_id">,
    Document {}

interface IAnyInsurancePolicyOtherThanNBHISchema
  extends Omit<IAnyInsurancePolicyOtherThanNBHI, "_id">,
    Document {}

interface IPolicyTypeSchema extends Omit<IPolicyType, "_id">, Document {}

interface ISurgicalTreatmentTypeSchema
  extends Omit<ISurgicalTreatmentType, "_id">,
    Document {}

interface IClassOfAccommodationSchema
  extends Omit<IClassOfAccommodation, "_id">,
    Document {}

interface IAttendantDetailsSchema
  extends Omit<IAttendantDetails, "_id">,
    Document {}

interface IAmountPaidToHospitalSchema
  extends Omit<IAmountPaidToHospital, "_id">,
    Document {}

interface IMedicinesDetailsSchema
  extends Omit<IMedicinesDetails, "_id">,
    Document {}

interface IAmountPaidForDiagnosticTestsSchema
  extends Omit<IAmountPaidForDiagnosticTests, "_id">,
    Document {}

interface IAnyOtherAmountPaidSchema
  extends Omit<IAnyOtherAmountPaid, "_id">,
    Document {}

interface TPatientHabitSchema extends Omit<TPatientHabit, "_id">, Document {}

interface TAilmentSchema extends Omit<TAilment, "_id">, Document {}

interface IPedOrNonDisclosureSchema
  extends Omit<IPedOrNonDisclosure, "_id">,
    Document {}

interface IPatientLiftSchema extends Omit<IPatientLift, "_id">, Document {}

interface IHospitalRegistrationSchema
  extends Omit<IHospitalRegistration, "_id">,
    Document {}

interface IRecordKeepingSchema extends Omit<IRecordKeeping, "_id">, Document {}

interface IHospitalInfrastructureSchema
  extends Omit<IHospitalInfrastructure, "_id">,
    Document {}

interface IICPSCollectedSchema extends Omit<IICPSCollected, "_id">, Document {}

interface IIndoorEntrySchema extends Omit<IIndoorEntry, "_id">, Document {}

interface IOldRecordCheckSchema
  extends Omit<IOldRecordCheck, "_id">,
    Document {}

interface ITreatingDoctorSchema
  extends Omit<ITreatingDoctor, "_id">,
    Document {}

interface IDoctorSchema extends Omit<IDoctor, "_id">, Document {}

interface IPathologistDetailSchema
  extends Omit<IPathologistDetail, "_id">,
    Document {}

interface IChemistSchema extends Omit<IChemist, "_id">, Document {}

interface IEmployerSchema extends Omit<IEmployer, "_id">, Document {}

interface IEstablishmentVerificationSchema
  extends Omit<IEstablishmentVerification, "_id">,
    Document {}

interface INPSVerificationSchema
  extends Omit<INPSVerification, "_id">,
    Document {}

interface IPrePostVerificationSchema
  extends Omit<IPrePostVerification, "_id">,
    Document {}

interface IHospitalDailyCashPartSchema
  extends Omit<IHospitalDailyCashPart, "_id">,
    Document {}

interface IOPDVerificationPartSchema
  extends Omit<IOPDVerificationPart, "_id">,
    Document {}

interface IAHCVerificationPartSchema
  extends Omit<IAHCVerificationPart, "_id">,
    Document {}

interface IClaimVerificationSchema
  extends Omit<IClaimVerification, "_id">,
    Document {}

interface IInsuredVerificationSchema
  extends Omit<IInsuredVerification, "_id">,
    Document {}

interface IVicinityVerificationSchema
  extends Omit<IVicinityVerification, "_id">,
    Document {}

interface IHospitalVerificationSchema
  extends Omit<IHospitalVerification, "_id">,
    Document {}

interface ITreatingDoctorVerificationSchema
  extends Omit<ITreatingDoctorVerification, "_id">,
    Document {}

interface IFamilyDoctorOrReferringDoctorVerificationSchema
  extends Omit<IFamilyDoctorOrReferringDoctorVerification, "_id">,
    Document {}

interface ILabOrPathologistVerificationSchema
  extends Omit<ILabOrPathologistVerification, "_id">,
    Document {}

interface IChemistVerificationSchema
  extends Omit<IChemistVerification, "_id">,
    Document {}

interface IEmployerVerificationSchema
  extends Omit<IEmployerVerification, "_id">,
    Document {}

interface IRandomVicinityVerificationSchema
  extends Omit<IRandomVicinityVerification, "_id">,
    Document {}

interface IMiscellaneousVerificationSchema
  extends Omit<IMiscellaneousVerification, "_id">,
    Document {}

interface IEmploymentAndEstablishmentVerificationSchema
  extends Omit<IEmploymentAndEstablishmentVerification, "_id">,
    Document {}

interface IRMFindingsSchema extends Omit<IRMFindings, "_id">, Document {}

interface IRecommendationSchema
  extends Omit<IRecommendation, "_id">,
    Document {}

interface IOtherRecommendationSchema
  extends Omit<IOtherRecommendation, "_id">,
    Document {}

const NPSVerificationSchema = new Schema<INPSVerificationSchema>(
  {
    insuredVisit: { type: String },
    insuredMobileNo: { type: String },
    insuredVisitDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const PharmacySchema = new Schema<IPharmacySchema>(
  {
    name: { type: String },
    address: { type: String },
    city: { type: String },
    qrCodeAvailableOnBill: { type: String },
    codeScanResult: { type: String },
    billsVerified: { type: String },
    reasonOfBillsNotVerified: { type: String },
    discrepancyStatus: { type: String },
    billVerificationResult: { type: String },
    billVerificationResultRemark: { type: String },
    briefSummaryOfDiscrepancy: { type: String },
    observation: { type: String },
  },
  { timestamps: true }
);

const LabSchema = new Schema<ILabSchema>(
  {
    name: { type: String },
    address: { type: String },
    city: { type: String },
    qrCodeAvailableOnBill: { type: String },
    codeScanResult: { type: String },
    billsVerified: { type: String },
    reasonOfBillsNotVerified: { type: String },
    discrepancyStatus: { type: String },
    briefSummaryOfDiscrepancy: { type: String },
    observation: { type: String },
    billVerificationResult: { type: [String], default: [] },
    billVerificationResultRemark: { type: String },
    finalObservation: { type: String },
  },
  { timestamps: true }
);

const OtherBillSchema = new Schema<IOtherBillSchema>(
  {
    nameOfEntity: { type: String },
    typeOfEntity: { type: String },
    address: { type: String },
    city: { type: String },
    billsAndReportsVerified: { type: String },
    reasonOfBillsNotVerified: { type: String },
    discrepancyStatus: { type: String },
    billVerificationResult: { type: [String], default: [] },
    billVerificationResultRemark: { type: String },
    briefSummaryOfDiscrepancy: { type: String },
    observation: { type: String },
  },
  { timestamps: true }
);

const ConsultationPaperAndDoctorSchema =
  new Schema<IConsultationPaperAndDoctorSchema>(
    {
      doctorName: { type: String },
      consultationOrFollowUpConfirmation: { type: String },
      consultationIsRelatedToDiagnosis: { type: String },
      observation: { type: String },
    },
    { timestamps: true }
  );

const MainClaimSchema = new Schema<IMainClaimDetailSchema>(
  {
    discrepancyStatus: { type: String },
    observation: { type: String },
  },
  { timestamps: true }
);

const PrePostVerificationSchema = new Schema<IPrePostVerificationSchema>(
  {
    pharmacyBillVerified: { type: String },
    pharmacies: { type: [PharmacySchema], default: [] },
    labVerified: { type: String },
    labs: { type: [LabSchema], default: [] },
    otherBillVerified: { type: String },
    otherBills: { type: [OtherBillSchema], default: [] },
    consultationPaperAndDoctorVerified: { type: String },
    consultationPaperAndDoctorDetail: {
      type: ConsultationPaperAndDoctorSchema,
      default: null,
    },
    mainClaimIsVerified: { type: String },
    mainClaimDetail: { type: MainClaimSchema, default: null },
    insuredIsVerified: { type: String },
    insuredVerificationDetail: { type: MainClaimSchema, default: null },
    finalObservation: { type: String },
  },
  { timestamps: true }
);

const InsuredCooperationDetailSchema =
  new Schema<IInsuredCooperationDetailSchema>(
    {
      dateOfVisitToInsured: { type: Date, default: null },
      timeOfVisitToInsured: { type: Date, default: null },
      nameOfInsuredSystem: { type: String },
      nameOfInsuredUser: { type: String },
      dateOfAdmissionSystem: { type: String },
      dateOfAdmissionUser: { type: String },
      timeOfDischargeSystem: { type: String },
      timeOfDischargeUser: { type: String },
      durationOfHospitalizationSystem: { type: String },
      durationOfHospitalizationUser: { type: String },
      diagnosis: { type: String },
      classOfAccommodation: { type: String },
      discrepanciesObserved: { type: String },
    },
    { timestamps: true }
  );

const HospitalCooperationDetailSchema =
  new Schema<IHospitalCooperationDetailSchema>(
    {
      dateOfVisitToHospital: { type: Date, default: null },
      timeOfVisitToHospital: { type: Date, default: null },
      dateOfAdmissionSystem: { type: Date, default: null },
      dateOfAdmissionUser: { type: Date, default: null },
      timeOfDischargeSystem: { type: Date, default: null },
      timeOfDischargeUser: { type: Date, default: null },
      durationOfHospitalizationSystem: { type: String },
      durationOfHospitalizationUser: { type: String },
      diagnosis: { type: String },
      classOfAccommodation: { type: String },
      discrepanciesObserved: { type: String },
    },
    { timestamps: true }
  );

const ReasonOfInsuredNotVisitSchema =
  new Schema<IReasonOfInsuredNotVisitSchema>(
    {
      value: String,
      reason: String,
      proof: [String],
      untraceableBasis: String,
    },
    { timestamps: true }
  );

const AnyInsurancePolicyOtherThanNBHI =
  new Schema<IAnyInsurancePolicyOtherThanNBHISchema>(
    {
      value: { type: String },
      nameOfInsuranceCompany: { type: String },
      documents: { type: [String], default: [] },
      policyNo: { type: String },
    },
    { timestamps: true }
  );

const PolicyTypeSchema = new Schema<IPolicyTypeSchema>(
  {
    value: { type: String },
    portedFrom: { type: String },
    reasonOfPortability: { type: String },
  },
  { timestamps: true }
);

const SurgicalTreatmentTypeSchema = new Schema<ISurgicalTreatmentTypeSchema>(
  {
    nameOfProcedure: { type: String },
    dateOfSurgery: { type: Date, default: null },
    timeOfSurgery: { type: Date, default: null },
    anesthesiaGiven: { type: String },
    typeOfAnesthesia: { type: String },
    nameOfSurgeon: { type: String },
    nameOfAnesthetist: { type: String },
  },
  { timestamps: true }
);

const ClassOfAccommodationSchema = new Schema<IClassOfAccommodationSchema>(
  {
    name: { type: String },
    fromDate: { type: Date, default: null },
    toDate: { type: Date, default: null },
    othersSpecify: { type: String },
  },
  { timestamps: true }
);

const AttendantDetailsSchema = new Schema<IAttendantDetailsSchema>(
  {
    name: { type: String },
    gender: { type: String },
    relationship: { type: String },
    mobileNo: { type: String },
  },
  { timestamps: true }
);

const AmountPaidToHospitalSchema = new Schema<IAmountPaidToHospitalSchema>(
  {
    value: { type: Number },
    paymentMode: { type: String },
    remark: { type: String },
  },
  { timestamps: true }
);

const MedicinesDetailsSchema = new Schema<IMedicinesDetailsSchema>(
  {
    costOfMedicineBill: { type: Number },
    paymentMode: { type: String },
    remark: { type: String },
    medicinesReturned: { type: String },
    amountRefunded: { type: String },
    refundInvoice: { type: String },
  },
  { timestamps: true }
);

const AmountPaidForDiagnosticTestsSchema =
  new Schema<IAmountPaidForDiagnosticTestsSchema>(
    {
      value: { type: Number },
      paymentMode: { type: String },
    },
    { timestamps: true }
  );

const AnyOtherAmountPaidSchema = new Schema<IAnyOtherAmountPaidSchema>(
  {
    value: { type: String },
    amount: { type: Number },
    paymentMode: { type: String },
  },
  { timestamps: true }
);

const PatientHabitSchema = new Schema<TPatientHabitSchema>(
  {
    habit: { type: String },
    frequency: { type: String },
    quantity: { type: String },
    duration: { type: String },
  },
  { timestamps: true }
);

const AilmentSchema = new Schema<TAilmentSchema>(
  {
    ailment: { type: String },
    diagnosis: { type: String },
    duration: { type: String },
    onMedication: { type: String },
  },
  { timestamps: true }
);

const PedOrNonDisclosureSchema = new Schema<IPedOrNonDisclosureSchema>(
  {
    value: { type: String },
    ailmentDetail: { type: [AilmentSchema], default: [] },
  },
  { timestamps: true }
);

const HospitalDailyCashPartSchema = new Schema<IHospitalDailyCashPartSchema>(
  {
    insuredVisit: { type: String },
    insuredCooperation: { type: String },
    insuredNotCooperatingReason: { type: String },
    insuredCooperationDetail: {
      type: InsuredCooperationDetailSchema,
      default: null,
    },
    hospitalVisit: { type: String },
    hospitalCooperation: { type: String },
    hospitalNotCooperatingReason: { type: String },
    hospitalCooperationDetail: {
      type: HospitalCooperationDetailSchema,
      default: null,
    },
    finalObservation: { type: String },
  },
  { timestamps: true }
);

const OPDVerificationSchema = new Schema<IOPDVerificationPartSchema>(
  {
    finalObservation: { type: String },
  },
  { timestamps: true }
);

const AHCVerificationSchema = new Schema<IAHCVerificationPartSchema>(
  {
    labVerified: { type: String },
    labs: { type: [LabSchema], default: [] },
    finalObservation: { type: String },
  },
  { timestamps: true }
);

const ClaimVerificationSchema = new Schema<IClaimVerificationSchema>(
  {
    finalObservation: { type: String },
  },
  { timestamps: true }
);

const InsuredVerificationSchema = new Schema<IInsuredVerificationSchema>(
  {
    insuredVisit: { type: String },
    reasonOfInsuredNotVisit: { type: ReasonOfInsuredNotVisitSchema },
    dateOfVisitToInsured: { type: Date, default: null },
    timeOfVisitToInsured: { type: Date, default: null },
    nameOfPatientSystem: { type: String },
    nameOfPatientUser: { type: String },
    ageOfPatientSystem: { type: Number },
    ageOfPatientUser: { type: Number },
    genderOfPatientSystem: { type: String },
    genderOfPatientUser: { type: String },
    mobileNumber: { type: String },
    occupationOfInsured: { type: String },
    workPlaceDetail: { type: String },
    anyOtherPolicyWithNBHI: { type: String },
    policyNo: { type: String },
    anyPreviousClaimWithNBHI: { type: String },
    anyInsurancePolicyOtherThanNBHI: { type: AnyInsurancePolicyOtherThanNBHI },
    coverageUnderAnyGovSchema: { type: String },
    coverageUnderAnyGovSchemaRemark: { type: String },
    policyType: { type: PolicyTypeSchema },
    prevInsurancePolicyCopy: { type: String },
    anyClaimWithPrevInsurance: { type: String },
    claimDetailsOfPreviousInsurance: { type: String },
    symptomsWithDuration: { type: String },
    firstConsultationDetails: {
      type: { value: { type: String }, remark: { type: String } },
    },
    firstConsultationOrReferralSlip: {
      type: { value: { type: String }, remark: { type: String } },
    },
    nameOfHospitalSystem: { type: String },
    nameOfHospitalUser: { type: String },
    dateOfAdmissionSystem: { type: Date, default: null },
    dateOfAdmissionUser: { type: Date, default: null },
    timeOfAdmission: {
      type: { value: { type: String }, time: { type: Date, default: null } },
    },
    dateOfDischargeSystem: { type: Date, default: null },
    dateOfDischargeUser: { type: Date, default: null },
    timeOfDischarge: {
      type: { value: { type: String }, time: { type: Date, default: null } },
    },
    nameOfDoctorAttended: { type: String },
    numberOfVisitsOfDoctor: { type: String },
    treatmentType: { type: String },
    surgicalTreatmentType: { type: SurgicalTreatmentTypeSchema },
    classOfAccommodation: { type: [String], default: [] },
    classOfAccommodationDetails: {
      type: [ClassOfAccommodationSchema],
      default: [],
    },
    attendantDetailsAtTheTimeOfAdmission: { type: String },
    attendantDetails: { type: AttendantDetailsSchema },
    medicines: { type: String },
    medicinesDetail: { type: MedicinesDetailsSchema },
    amountPaidToHospital: { type: AmountPaidToHospitalSchema },
    amountPaidForDiagnosticTests: { type: AmountPaidForDiagnosticTestsSchema },
    anyOtherAmountPaid: { type: AnyOtherAmountPaidSchema },
    totalAmountPaid: { type: Number },
    remarks: { type: String },
    personalOrSocialHabits: { type: [PatientHabitSchema] },
    pedOrNonDisclosure: { type: PedOrNonDisclosureSchema },
    claimNEFTDetail: { type: String },
    insuredOrAttendantCooperation: { type: String },
    reasonForInsuredNotCooperating: { type: String },
    verificationSummary: { type: String },
    discrepanciesOrIrregularitiesObserved: { type: String },
  },
  { timestamps: true }
);

const VicinityVerificationSchema = new Schema<IVicinityVerificationSchema>(
  {
    status: { type: String },
    verificationSummary: { type: String },
  },
  { timestamps: true }
);

const PatientLiftSchema = new Schema<IPatientLiftSchema>(
  {
    available: { type: String },
    operational: { type: String },
  },
  { timestamps: true }
);

const HospitalRegistrationSchema = new Schema<IHospitalRegistrationSchema>(
  {
    registered: { type: String },
    registeredFrom: { type: Date, default: null },
    registeredTo: { type: Date, default: null },
  },
  { timestamps: true }
);

const RecordKeepingSchema = new Schema<IRecordKeepingSchema>(
  {
    value: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

const HospitalInfrastructureSchema = new Schema<IHospitalInfrastructureSchema>(
  {
    value: { type: String },
    noOfBeds: { type: Number },
    OT: { type: String },
    ICU: { type: String },
    specialty: { type: String },
    roundOfClockRMO: { type: String },
    pharmacy: { type: String },
    pathology: { type: String },
    hospitalOperations: { type: String },
    patientLifts: { type: PatientLiftSchema },
    hospitalRegistration: { type: HospitalRegistrationSchema },
    recordKeeping: { type: RecordKeepingSchema },
  },
  { timestamps: true }
);

const ICPSCollectedSchema = new Schema<IICPSCollectedSchema>(
  {
    value: { type: String },
    remark: { type: String },
  },
  { timestamps: true }
);

const IndoorEntrySchema = new Schema<IIndoorEntrySchema>(
  {
    value: { type: String },
    periodOfHospitalizationMatching: { type: String },
  },
  { timestamps: true }
);

const OldRecordCheckSchema = new Schema<IOldRecordCheckSchema>(
  {
    value: { type: String },
    remark: { type: String },
  },
  { timestamps: true }
);

const HospitalVerificationSchema = new Schema<IHospitalVerificationSchema>(
  {
    dateOfVisitToHospital: { type: Date, default: null },
    timeOfVisitToHospital: { type: Date, default: null },
    providerCooperation: { type: String },
    reasonOfProviderNotCooperating: { type: String },
    hospitalInfrastructure: { type: HospitalInfrastructureSchema },
    remarks: { type: String },
    icpsCollected: { type: ICPSCollectedSchema },
    indoorEntry: { type: IndoorEntrySchema },
    oldRecordCheck: { type: OldRecordCheckSchema },
    billVerification: { type: String },
    paymentReceipts: { type: String },
    personalOrSocialHabits: { type: [PatientHabitSchema], default: [] },
    pedOrNonDisclosure: { type: PedOrNonDisclosureSchema },
    verificationSummary: { type: String },
    discrepanciesOrIrregularitiesObserved: { type: String },
  },
  { timestamps: true }
);

const TreatingDoctorSchema = new Schema<ITreatingDoctorSchema>(
  {
    name: { type: String },
    qualification: { type: String },
    registrationNo: { value: String, remark: String },
    meetingStatus: { type: String },
    remarkForUntraceable: { type: String },
    cooperation: { type: String },
  },
  { timestamps: true }
);

const TreatingDoctorVerificationSchema =
  new Schema<ITreatingDoctorVerificationSchema>(
    {
      doctors: { type: [TreatingDoctorSchema], default: [] },
      verificationSummary: { type: String },
    },
    { timestamps: true }
  );

const DoctorSchema = new Schema<IDoctorSchema>(
  {
    name: { type: String },
    qualification: { type: String },
    registrationNo: { type: { value: String, remark: String } },
  },
  { timestamps: true }
);

const FamilyOrReferringDoctorVerificationSchema =
  new Schema<IFamilyDoctorOrReferringDoctorVerificationSchema>(
    {
      doctors: { type: [DoctorSchema], default: [] },
      verificationSummary: { type: String },
    },
    { timestamps: true }
  );

const PathologistDetailSchema = new Schema<IPathologistDetailSchema>(
  {
    name: { type: String },
    qualification: { type: String },
    registrationNo: { type: String },
    meetingStatus: { type: String },
    reasonForUntraceable: { type: String },
    cooperation: { type: String },
  },
  { timestamps: true }
);

const LabsSchema = new Schema<ILabsSchema>(
  {
    name: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    reportsSigned: { type: String },
    labReports: { type: String },
    labBills: { type: String },
    pathologistDetails: {
      type: PathologistDetailSchema,
      default: null,
    },
  },
  { timestamps: true }
);

const LabOrPathologistVerificationSchema =
  new Schema<ILabOrPathologistVerificationSchema>(
    {
      labs: { type: [LabsSchema], default: [] },
      verificationSummary: { type: String },
    },
    { timestamps: true }
  );

const ChemistSchema = new Schema<IChemistSchema>(
  {
    name: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    billsVerified: { type: String },
  },
  { timestamps: true }
);

const ChemistVerificationSchema = new Schema<IChemistVerificationSchema>(
  {
    chemists: { type: [ChemistSchema], default: [] },
    verificationSummary: { type: String },
  },
  { timestamps: true }
);

const EmployerSchema = new Schema<IEmployerSchema>(
  {
    nameOfEmployer: { type: String },
    address: { type: String },
    dateOfJoining: { type: Date, default: null },
    anyGroupHealthPolicy: { type: String },
    claimDetails: { type: String },
  },
  { timestamps: true }
);

const EmployerVerificationSchema = new Schema<IEmployerVerificationSchema>(
  {
    employers: { type: [EmployerSchema], default: [] },
    verificationSummary: { type: String },
  },
  { timestamps: true }
);

const RandomVicinityHospitalLabDoctorChemistVerificationSchema =
  new Schema<IRandomVicinityVerificationSchema>(
    {
      verificationSummary: { type: String },
    },
    { timestamps: true }
  );

const EstablishmentVerificationSchema =
  new Schema<IEstablishmentVerificationSchema>(
    {
      value: { type: String },
      status: {
        type: {
          value: { type: String },
          address: { type: String },
          city: { type: String },
          state: { type: String },
          typeOfEstablishments: { type: String },
        },
        default: null,
      },
    },
    { timestamps: true }
  );

const EmploymentAndEstablishmentVerificationSchema =
  new Schema<IEmploymentAndEstablishmentVerificationSchema>(
    {
      nameOfEstablishment: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      establishmentVerification: { type: EstablishmentVerificationSchema },
      natureOfWork: { type: String },
      totalNoOfEmployeesWorking: { type: Number },
      listOfWorkingEmployees: { type: String },
      listOfEmpMatchWithMembersEnrolled: { type: String },
      employeeAndEmployerRelationship: { type: String },
      employeeIdCard: { type: String },
      salaryProof: { type: String },
      investigationSummary: { type: String },
      discrepanciesObserved: { type: String },
    },
    { timestamps: true }
  );

const MiscellaneousVerificationSchema =
  new Schema<IMiscellaneousVerificationSchema>(
    {
      anyMarketOrIndustryFeedback: { type: String },
      verificationSummary: { type: String },
    },
    { timestamps: true }
  );

const RecommendationSchema = new Schema<IRecommendationSchema>(
  {
    value: { type: String },
    code: { type: String },
    hasEvidence: { type: String },
    evidences: { type: [String], default: [] },
    reasonOfEvidenceNotAvailable: { type: String },
    inconclusiveRemark: { type: String },
    groundOfRepudiation: { type: [String], default: [] },
    nonCooperationOf: { type: String },
  },
  { timestamps: true }
);

const OtherRecommendationSchema = new Schema<IOtherRecommendationSchema>(
  {
    value: { type: String },
    recommendationFor: {
      type: [{ value: { type: String }, remark: { type: String } }],
      default: [],
    },
  },
  { timestamps: true }
);

export const RMInvestigationFindingSchema = new Schema<IRMFindingsSchema>(
  {
    "NPS Confirmation": { type: NPSVerificationSchema, default: null },
    "Pre-Post Verification": { type: PrePostVerificationSchema, default: null },
    "Hospital Daily Cash Part": {
      type: HospitalDailyCashPartSchema,
      default: null,
    },
    "OPD Verification Part": { type: OPDVerificationSchema, default: null },
    "AHC Verification Part": {
      type: AHCVerificationSchema,
      default: null,
    },
    "Claim Verification": { type: ClaimVerificationSchema, default: null },
    "Insured Verification": { type: InsuredVerificationSchema, default: null },
    "Vicinity Verification": {
      type: VicinityVerificationSchema,
      default: null,
    },
    "Hospital Verification": {
      type: HospitalVerificationSchema,
      default: null,
    },
    "Treating Doctor Verification": {
      type: TreatingDoctorVerificationSchema,
      default: null,
    },
    "Family Doctor Part/Referring Doctor Verification": {
      type: FamilyOrReferringDoctorVerificationSchema,
      default: null,
    },
    "Lab Part/Pathologist Verification": {
      type: LabOrPathologistVerificationSchema,
      default: null,
    },
    "Chemist Verification": {
      type: ChemistVerificationSchema,
      default: null,
    },
    "Employer Verification": {
      type: EmployerVerificationSchema,
      default: null,
    },
    "Random Vicinity Hospital/Lab/Doctor/Chemist Verification": {
      type: RandomVicinityHospitalLabDoctorChemistVerificationSchema,
      default: null,
    },
    "Miscellaneous Verification": {
      type: MiscellaneousVerificationSchema,
      default: null,
    },
    "Employment & Establishment Verification": {
      type: EmploymentAndEstablishmentVerificationSchema,
      default: null,
    },
    investigationSummary: { type: String },
    discrepanciesOrIrregularitiesObserved: { type: String },
    recommendation: { type: RecommendationSchema },
    otherRecommendation: { type: [OtherRecommendationSchema], default: [] },
  },
  { timestamps: true }
);
