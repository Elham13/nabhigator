import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";

export const hasValue = (value: any) => {
  // Check for boolean values (true/false)
  if (typeof value === "boolean") {
    return true;
  }

  // Check for non-empty string
  if (typeof value === "string" && value.trim() !== "") {
    return true;
  }

  // Check for non-empty array
  if (Array.isArray(value)) {
    if (value.length > 0) {
      // Check if any element in the array has a value
      return value.some(hasValue);
    }
    return false;
  }

  // Check for non-empty object
  if (typeof value === "object" && value !== null) {
    if (Object.keys(value).length > 0) {
      // Check if any property in the object has a value
      return Object.values(value).some(hasValue);
    }
    return false;
  }

  // Check for any number (including zero)
  if (typeof value === "number") {
    return true;
  }

  return false; // Default case, if none of the above are true
};

const insuredVisitDoneValues = {
  dateOfVisitToInsured: null,
  timeOfVisitToInsured: null,
  nameOfPatientSystem: null,
  nameOfPatientUser: null,
  ageOfPatientSystem: null,
  ageOfPatientUser: null,
  genderOfPatientSystem: null,
  genderOfPatientUser: null,
  mobileNumber: null,
  occupationOfInsured: null,
  workPlaceDetail: null,
  anyOtherPolicyWithNBHI: null,
  anyPreviousClaimWithNBHI: null,
  anyInsurancePolicyOtherThanNBHI: null,
  coverageUnderAnyGovSchema: null,
  policyType: null,
  prevInsurancePolicyCopy: null,
  anyClaimWithPrevInsurance: null,
  claimDetailsOfPreviousInsurance: null,
  symptomsWithDuration: null,
  firstConsultationDetails: null,
  firstConsultationOrReferralSlip: null,
  nameOfHospitalSystem: null,
  nameOfHospitalUser: null,
  dateOfAdmissionSystem: null,
  dateOfAdmissionUser: null,
  timeOfAdmission: null,
  dateOfDischargeSystem: null,
  dateOfDischargeUser: null,
  timeOfDischarge: null,
  nameOfDoctorAttended: null,
  numberOfVisitsOfDoctor: null,
  treatmentType: null,
  classOfAccommodation: null,
  attendantDetailsAtTheTimeOfAdmission: null,
  medicines: null,
  amountPaidToHospital: null,
  amountPaidForDiagnosticTests: null,
  anyOtherAmountPaid: null,
  remarks: null,
  personalOrSocialHabits: null,
  pedOrNonDisclosure: null,
  insuredOrAttendantCooperation: null,
  verificationSummary: null,
  discrepanciesOrIrregularitiesObserved: null,
};

export const isInsuredPartCompleted = (obj: IInsuredVerification) => {
  if (!obj?.insuredVisit) return false;

  if (obj?.insuredVisit === "Not Done" && !obj?.reasonOfInsuredNotVisit)
    return false;

  if (obj?.insuredVisit === "Done") {
    for (let tfsKey of Object.keys(insuredVisitDoneValues)) {
      if (!obj[tfsKey as keyof IInsuredVerification]) {
        return false;
      }
    }
    return true;
  }
  return true;
};
