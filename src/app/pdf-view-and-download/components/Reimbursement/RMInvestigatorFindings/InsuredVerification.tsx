import React from "react";
import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";
import dayjs from "dayjs";

type PropTypes = {
  values: IInsuredVerification;
};

const InsuredVerification = ({ values }: PropTypes) => {
  const habits =
    values?.personalOrSocialHabits && values?.personalOrSocialHabits?.length > 0
      ? values?.personalOrSocialHabits?.flatMap((habit, ind) => [
          {
            title: `Personal/Social Habits ${ind + 1}`,
            key: "Habit",
            value: habit?.habit || "-",
            shouldWrap: true,
          },
          {
            key: `Frequency`,
            value: habit?.frequency || "-",
          },
          {
            key: `Quantity`,
            value: habit?.quantity || "-",
          },
          {
            key: `Duration`,
            value: habit?.duration || "-",
          },
        ])
      : [];

  const ailments =
    values.pedOrNonDisclosure?.ailmentDetail &&
    values.pedOrNonDisclosure?.ailmentDetail?.length > 0
      ? values.pedOrNonDisclosure?.ailmentDetail?.flatMap((ailment, ind) => [
          {
            title: `Ailment ${ind + 1}`,
            key: "Ailment",
            value: ailment?.ailment || "-",
            shouldWrap: true,
          },
          {
            key: "Diagnosis",
            value: ailment?.diagnosis || "-",
          },
          {
            key: "Duration",
            value: ailment?.duration || "-",
          },
          {
            key: "On Medication",
            value: ailment?.onMedication || "-",
          },
        ])
      : [];

  const classesOfAccommodation =
    values?.classOfAccommodation &&
    values?.classOfAccommodation?.length > 0 &&
    values?.classOfAccommodationDetails &&
    values?.classOfAccommodationDetails?.length > 0
      ? values?.classOfAccommodationDetails?.flatMap((el, ind) => [
          {
            title: `Class of accommodation ${ind + 1}`,
            key: "Name",
            value: values?.classOfAccommodation![ind],
            shouldWrap: true,
          },
          {
            key: "From Date",
            value: el?.fromDate
              ? dayjs(el?.fromDate).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "To Date",
            value: el?.toDate ? dayjs(el?.toDate).format("DD-MMM-YYYY") : "-",
          },
          ...(!!el?.othersSpecify
            ? [
                {
                  key: "Others Specify",
                  value: el?.othersSpecify || "-",
                },
              ]
            : []),
        ])
      : [];

  const insuredDetails =
    values?.insuredVisit === "Done"
      ? [
          {
            key: "Date of visit to insured",
            value: values?.dateOfVisitToInsured
              ? dayjs(values?.dateOfVisitToInsured).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Time of visit to insured",
            value: values?.timeOfVisitToInsured
              ? dayjs(values?.timeOfVisitToInsured).format("hh:mm:ss a")
              : "-",
          },
          {
            key: "Name of patient (System Fetch)",
            value: values?.nameOfPatientSystem || "-",
          },
          {
            key: "Name of patient (User Feed)",
            value: values?.nameOfPatientUser || "-",
          },
          {
            key: "Age of patient (System Fetch)",
            value: values?.ageOfPatientSystem || "-",
          },
          {
            key: "Age of patient (User Feed)",
            value: values?.ageOfPatientUser || "-",
          },
          {
            key: "Gender of patient (System Fetch)",
            value: values?.genderOfPatientSystem || "-",
          },
          {
            key: "Gender of patient (User Feed)",
            value: values?.genderOfPatientUser || "-",
          },
          {
            key: "Mobile Number",
            value: values?.mobileNumber || "-",
          },
          {
            key: "Occupation of Insured",
            value: values?.occupationOfInsured || "-",
          },
          {
            key: "Work place details",
            value: values?.workPlaceDetail || "-",
          },
          {
            key: "Any Other Policy with NBHI?",
            value: values?.anyOtherPolicyWithNBHI || "-",
          },
          ...(values?.anyOtherPolicyWithNBHI === "Yes"
            ? [
                {
                  key: "Policy Number",
                  value: values?.policyNo || "-",
                },
              ]
            : []),
          {
            key: "Any Previous claim with NBHI",
            value: values?.anyPreviousClaimWithNBHI || "-",
          },
          {
            key: "Any Insurance policy other than NBHI?",
            value: values?.anyInsurancePolicyOtherThanNBHI?.value || "-",
          },
          ...(values?.anyInsurancePolicyOtherThanNBHI?.value === "Yes"
            ? [
                {
                  key: "Policy Number",
                  value:
                    values?.anyInsurancePolicyOtherThanNBHI?.policyNo || "-",
                },
                {
                  key: "Name of Insured Company",
                  value:
                    values?.anyInsurancePolicyOtherThanNBHI
                      ?.nameOfInsuranceCompany || "-",
                },
                {
                  key: "Name of Insured Company",
                  value:
                    values?.anyInsurancePolicyOtherThanNBHI
                      ?.nameOfInsuranceCompany || "-",
                },
              ]
            : []),
          {
            key: "Coverage Under Any Gov Scheme",
            value: values?.coverageUnderAnyGovSchema || "-",
          },
          ...(!!values?.coverageUnderAnyGovSchema
            ? [
                {
                  key: "Remarks",
                  value: values?.coverageUnderAnyGovSchemaRemark || "-",
                },
              ]
            : []),
          {
            key: "Policy Type",
            value: values?.policyType?.value || "-",
          },
          ...(values?.policyType?.value === "Port"
            ? [
                {
                  key: "Ported From",
                  value: values?.policyType?.portedFrom || "-",
                },
                {
                  key: "Reason of portability",
                  value: values?.policyType?.reasonOfPortability || "-",
                },
              ]
            : []),
          {
            key: "Any claim with previous Insurance Company?",
            value: values?.anyClaimWithPrevInsurance || "-",
          },
          ...(values?.anyClaimWithPrevInsurance === "Yes"
            ? [
                {
                  key: "Claim Details",
                  value: values?.claimDetailsOfPreviousInsurance || "-",
                },
              ]
            : []),
          {
            key: "Symptoms with duration insured presented with",
            value: values?.symptomsWithDuration || "-",
          },
          {
            key: "First Consultation Details",
            value: values?.firstConsultationDetails?.value || "-",
          },
          ...(!!values?.firstConsultationDetails?.value
            ? [
                {
                  key: "Remark",
                  value: values?.firstConsultationDetails?.remark || "-",
                },
              ]
            : []),
          {
            key: "First Consultation/Referral slip",
            value: values?.firstConsultationOrReferralSlip?.value || "-",
          },
          ...(!!values?.firstConsultationOrReferralSlip?.value
            ? [
                {
                  key: "Remark",
                  value: values?.firstConsultationOrReferralSlip?.remark || "-",
                },
              ]
            : []),
          {
            key: "Name of hospital (System Fetch)",
            value: values?.nameOfHospitalSystem || "-",
          },
          {
            key: "Name of hospital (User Feed)",
            value: values?.nameOfHospitalUser || "-",
          },
          {
            key: "Date of Admission (System Fetch)",
            value: values?.dateOfAdmissionSystem
              ? dayjs(values?.dateOfAdmissionSystem).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Date of Admission (User Feed)",
            value: values?.dateOfAdmissionUser
              ? dayjs(values?.dateOfAdmissionUser).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Time of Admission",
            value: values?.timeOfAdmission?.value || "-",
          },
          ...(values?.timeOfAdmission?.value === "Disclosed"
            ? [
                {
                  key: "At what time Admitted?",
                  value: values?.timeOfAdmission?.time
                    ? dayjs(values?.timeOfAdmission?.time).format("hh:mm:ss a")
                    : "-",
                },
              ]
            : []),
          {
            key: "Date of Discharge (System Fetch)",
            value: values?.dateOfDischargeSystem
              ? dayjs(values?.dateOfDischargeSystem).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Date of Discharge (User Feed)",
            value: values?.dateOfDischargeUser
              ? dayjs(values?.dateOfDischargeUser).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Time of Discharge",
            value: values?.timeOfDischarge?.value || "-",
          },
          ...(values?.timeOfDischarge?.value === "Disclosed"
            ? [
                {
                  key: "At what time Discharged?",
                  value: values?.timeOfDischarge?.time
                    ? dayjs(values?.timeOfDischarge?.time).format("hh:mm:ss a")
                    : "-",
                },
              ]
            : []),
          {
            key: "Name of Doctor attended",
            value: values?.nameOfDoctorAttended || "-",
          },
          {
            key: "Number of visits of Doctor",
            value: values?.numberOfVisitsOfDoctor || "-",
          },
          {
            key: "Treatment Type",
            value: values?.treatmentType || "-",
          },
          ...(values?.treatmentType === "Surgical"
            ? [
                {
                  key: "Name of Procedure",
                  value: values?.surgicalTreatmentType?.nameOfProcedure || "-",
                },
                {
                  key: "Date of Surgery",
                  value: values?.surgicalTreatmentType?.dateOfSurgery
                    ? dayjs(
                        values?.surgicalTreatmentType?.dateOfSurgery
                      ).format("DD-MMM-YYYY")
                    : "-",
                },
                {
                  key: "Time of Surgery",
                  value: values?.surgicalTreatmentType?.timeOfSurgery
                    ? dayjs(
                        values?.surgicalTreatmentType?.timeOfSurgery
                      ).format("hh:mm:ss a")
                    : "-",
                },
                {
                  key: "Anesthesia Given?",
                  value: values?.surgicalTreatmentType?.anesthesiaGiven || "-",
                },
                ...(values?.surgicalTreatmentType?.anesthesiaGiven === "Yes"
                  ? [
                      {
                        key: "Type of Anesthesia",
                        value:
                          values?.surgicalTreatmentType?.typeOfAnesthesia ||
                          "-",
                      },
                    ]
                  : []),
                {
                  key: "Name of surgeon",
                  value: values?.surgicalTreatmentType?.nameOfSurgeon || "-",
                },
                {
                  key: "Name of Anesthetist",
                  value:
                    values?.surgicalTreatmentType?.nameOfAnesthetist || "-",
                },
              ]
            : []),
          ...classesOfAccommodation,
          {
            key: "Attendant details at the time of Admission",
            value: values?.attendantDetailsAtTheTimeOfAdmission || "-",
          },
          ...(values?.attendantDetailsAtTheTimeOfAdmission === "Shared"
            ? [
                {
                  key: "Name of attendant",
                  value: values?.attendantDetails?.name || "-",
                },
                {
                  key: "Gender",
                  value: values?.attendantDetails?.gender || "-",
                },
                {
                  key: "Relationship",
                  value: values?.attendantDetails?.relationship || "-",
                },
                {
                  key: "Mobile Number",
                  value: values?.attendantDetails?.mobileNo || "-",
                },
              ]
            : []),
          {
            key: "Medicine",
            value: values?.medicines || "-",
          },
          ...(values?.medicines === "Outsourced"
            ? [
                {
                  key: "Cost of Medicine Bills",
                  value: values?.medicinesDetail?.costOfMedicineBill || "0",
                },
                {
                  key: "Payment Mode",
                  value: values?.medicinesDetail?.paymentMode || "-",
                },
                {
                  key: "Remark",
                  value: values?.medicinesDetail?.remark || "-",
                },
              ]
            : []),
          ...(!!values?.medicines
            ? [
                {
                  key: "Medicine Returned?",
                  value: values?.medicinesDetail?.medicinesReturned || "-",
                },
                ...(values?.medicinesDetail?.medicinesReturned === "Yes"
                  ? [
                      {
                        key: "Amount Refunded",
                        value: values?.medicinesDetail?.amountRefunded || "0",
                      },
                      {
                        key: "Refund Invoice",
                        value: values?.medicinesDetail?.refundInvoice || "-",
                      },
                    ]
                  : []),
              ]
            : []),
          {
            key: "Amount Paid to Hospital",
            value: values?.amountPaidToHospital?.value || "0",
          },
          ...(!!values?.amountPaidToHospital?.value
            ? [
                {
                  key: "Payment Mode",
                  value: values?.amountPaidToHospital?.paymentMode || "-",
                },
                {
                  key: "Remark",
                  value: values?.amountPaidToHospital?.remark || "-",
                },
              ]
            : []),
          {
            key: "Amount Paid for Diagnostic Tests",
            value: values?.amountPaidForDiagnosticTests?.value || "0",
          },
          ...(!!values?.amountPaidForDiagnosticTests?.value
            ? [
                {
                  key: "Payment Mode",
                  value:
                    values?.amountPaidForDiagnosticTests?.paymentMode || "-",
                },
              ]
            : []),
          {
            key: "Any other amount paid?",
            value: values?.anyOtherAmountPaid?.value || "0",
          },
          ...(values?.anyOtherAmountPaid?.value === "Yes"
            ? [
                {
                  key: "Amount Paid",
                  value: values?.anyOtherAmountPaid?.amount || "0",
                },
                {
                  key: "Payment Mode",
                  value: values?.anyOtherAmountPaid?.paymentMode || "-",
                },
              ]
            : []),
          {
            key: "Total Amount Paid",
            value: values?.totalAmountPaid || "0",
          },
          {
            key: "Remarks",
            value: values?.remarks || "-",
          },
          ...habits,
          {
            key: "PED/Non-Disclosure",
            value: values?.pedOrNonDisclosure?.value || "-",
          },
          ...(values?.pedOrNonDisclosure?.value === "Yes" ? ailments : []),
          {
            key: "Claim NEFT details verified",
            value: values?.claimNEFTDetail || "-",
          },
          {
            key: "Insured/Attendant Co-operation",
            value: values?.insuredOrAttendantCooperation || "-",
          },
          ...(values?.insuredOrAttendantCooperation === "No"
            ? [
                {
                  key: "Reason for insured not co-operating",
                  value: values?.reasonForInsuredNotCooperating || "-",
                },
              ]
            : []),
          {
            key: "Verification Summary",
            value: values?.verificationSummary || "-",
            isLongText: true,
          },
          {
            key: "Discrepancies/Irregularities Observed",
            value: values?.discrepanciesOrIrregularitiesObserved || "-",
            isLongText: true,
          },
        ]
      : [];

  const data = [
    { key: "Insured Visit", value: values?.insuredVisit || "-" },
    ...(values?.insuredVisit === "Not Done"
      ? [
          {
            key: "Why Insured not visited?",
            value: `${values?.reasonOfInsuredNotVisit?.value || ""} ${
              values?.reasonOfInsuredNotVisit?.reason || ""
            }`,
          },
        ]
      : insuredDetails),
  ];

  return <ThreeSectionView data={data} topic="Insured Verification" />;
};

export default InsuredVerification;
