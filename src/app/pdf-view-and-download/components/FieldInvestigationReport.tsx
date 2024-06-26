import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import AssignmentSummary from "./AssignmentSummary";
import TwoSectionView from "./TwoSectionView";
import dayjs from "dayjs";
import SectionHeading from "./SectionHeading";
import TableView from "./TableView";
import SingleLine from "./SingleLine";
import { TDocType } from "../page";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";

const styles = StyleSheet.create({ txt: { fontSize: 20 } });

type PropTypes = {
  dashboardData: IDashboardData | null;
  caseData: CaseDetail | null;
  docType: TDocType;
};

const FieldInvestigationReport = ({
  dashboardData,
  caseData,
  docType,
}: PropTypes) => {
  const findings = caseData?.investigationFindings;
  const preAuthInvestigationSummary = [
    {
      key: "Date of Visit to Insured",
      value: findings?.dateOfVisitToInsured
        ? dayjs(findings?.dateOfVisitToInsured).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Time of Visit to Insured",
      value: findings?.timeOfVisitToInsured
        ? dayjs(findings?.timeOfVisitToInsured).format("hh:mm:ss a")
        : "-",
    },
    {
      key: "Date of Visit to Hospital",
      value: findings?.dateOfVisitToHospital
        ? dayjs(findings?.dateOfVisitToHospital).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Time of Visit to Hospital",
      value: findings?.timeOfVisitToHospital
        ? dayjs(findings?.timeOfVisitToHospital).format("hh:mm:ss a")
        : "-",
    },
    {
      key: "Hospitalization Status",
      value: findings?.hospitalizationStatus?.value,
    },
  ];

  const hospitalizationDetails = [
    ...(findings?.hospitalizationStatus?.value === "Differed Admission"
      ? [
          {
            key: "Differed Admission",
            value: findings?.hospitalizationStatus?.differedAdmission || "-",
          },
        ]
      : []),
    ...(findings?.hospitalizationStatus?.value === "Cancelled Admission"
      ? [
          {
            key: "Cancelled Admission",
            value: findings?.hospitalizationStatus?.differedAdmission || "-",
          },
        ]
      : []),
    ...(findings?.hospitalizationStatus?.cancelledAdmission === "Other"
      ? [
          {
            key: "Specify Other for cancelled admission",
            value:
              findings?.hospitalizationStatus?.cancelledAdmissionOther || "-",
          },
        ]
      : []),
    ...(findings?.hospitalizationStatus?.value &&
    ["Admitted", "Discharged"].includes(findings?.hospitalizationStatus?.value)
      ? [
          {
            key: "System Date of Admission",
            value: dashboardData?.hospitalizationDetails?.dateOfAdmission
              ? dayjs(
                  dashboardData?.hospitalizationDetails?.dateOfAdmission
                ).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Date of Admission",
            value: findings?.hospitalizationDetails?.dateOfAdmission
              ? dayjs(findings?.hospitalizationDetails?.dateOfAdmission).format(
                  "DD-MMM-YYYY"
                )
              : "-",
          },
          {
            key: "Time of Admission",
            value: findings?.hospitalizationDetails?.timeOfAdmission
              ? dayjs(findings?.hospitalizationDetails?.timeOfAdmission).format(
                  "hh:mm:ss a"
                )
              : "-",
          },
          {
            key: "Date of Discharge",
            value: findings?.hospitalizationDetails?.dateOfDischarge
              ? dayjs(findings?.hospitalizationDetails?.dateOfDischarge).format(
                  "DD-MMM-YYYY"
                )
              : "-",
          },
          {
            key: "Time of Discharge",
            value: findings?.hospitalizationDetails?.timeOfDischarge
              ? dayjs(findings?.hospitalizationDetails?.timeOfDischarge).format(
                  "hh:mm:ss a"
                )
              : "-",
          },
        ]
      : []),
    ...(findings?.hospitalizationStatus?.value &&
    ["Planned Admission", "Differed Admission"].includes(
      findings?.hospitalizationStatus?.value
    )
      ? [
          {
            key: "Tentative Date of Admission",
            value: findings?.hospitalizationDetails?.tentativeDateOfAdmission
              ? dayjs(
                  findings?.hospitalizationDetails?.tentativeDateOfAdmission
                ).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Tentative Date of Discharge",
            value: findings?.hospitalizationDetails?.tentativeDateOfDischarge
              ? dayjs(
                  findings?.hospitalizationDetails?.tentativeDateOfAdmission
                ).format("DD-MMM-YYYY")
              : "-",
          },
        ]
      : []),
    ...(findings?.hospitalizationStatus?.value &&
    ["Cancelled Admission", "Roaming around in/out Hospital"].includes(
      findings?.hospitalizationStatus?.value
    )
      ? [
          {
            key: "Proposed Date of Admission",
            value: findings?.hospitalizationDetails?.proposedDateOfAdmission
              ? dayjs(
                  findings?.hospitalizationDetails?.proposedDateOfAdmission
                ).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Proposed Date of Discharge",
            value: findings?.hospitalizationDetails?.proposedDateOfDischarge
              ? dayjs(
                  findings?.hospitalizationDetails?.proposedDateOfDischarge
                ).format("DD-MMM-YYYY")
              : "-",
          },
        ]
      : []),
  ];

  const patientDetails = [
    {
      key: "Patient Name",
      value: findings?.patientDetails?.patientName || "-",
    },
    {
      key: "Patient Age",
      value: findings?.patientDetails?.patientAge || "-",
    },
    {
      key: "Patient Gender",
      value: findings?.patientDetails?.patientGender || "-",
    },
    {
      key: "Revised Patient Name",
      value: findings?.patientDetails?.revisedPatientName || "-",
    },
    {
      key: "Revised Patient Age",
      value: findings?.patientDetails?.revisedPatientAge || "-",
    },
    {
      key: "Revised Patient Gender",
      value: findings?.patientDetails?.revisedPatientGender || "-",
    },
    {
      key: "Attendant Available",
      value: findings?.attendantDetails?.status || "-",
    },
    ...(findings?.attendantDetails?.status === "Available"
      ? [
          {
            key: "Attendant Name",
            value: findings?.attendantDetails?.name,
          },
          {
            key: "Attendant Gender",
            value: findings?.attendantDetails?.gender,
          },
          {
            key: "Relationship",
            value: findings?.attendantDetails?.relationship,
          },
          {
            key: "Attendant Mobile No.",
            value: findings?.attendantDetails?.mobileNo,
          },
        ]
      : []),
    {
      key: "Occupation of Insured",
      value: findings?.occupationOfInsured || "-",
    },
    {
      key: "Work Place Details",
      value: findings?.workPlaceDetails || "-",
    },
    {
      key: "Any Other Policy with NBHI",
      value: findings?.anyOtherPolicyWithNBHI || "-",
    },
    ...(findings?.anyOtherPolicyWithNBHI === "Yes"
      ? [
          {
            key: "Other Policy Number with NBHI",
            value: findings?.otherPolicyNoWithNBHI || "-",
          },
        ]
      : []),
    {
      key: "Any Previous Claim with NBHI",
      value: findings?.anyPreviousClaimWithNBHI || "-",
    },
    {
      key: "Any Insurance Policy Other Than NBHI",
      value: findings?.insurancePolicyOtherThanNBHI?.hasPolicy || "-",
    },
    ...(findings?.insurancePolicyOtherThanNBHI?.hasPolicy === "Yes"
      ? [
          {
            key: "Name of insurance company",
            value:
              findings?.insurancePolicyOtherThanNBHI?.nameOfInsuranceCompany ||
              "-",
          },
          {
            key: "Policy Number",
            value: findings?.insurancePolicyOtherThanNBHI?.policyNumber || "-",
          },
        ]
      : []),
    {
      key: "Class of Accommodation",
      value: findings?.classOfAccommodation?.status || "-",
    },
    ...(findings?.classOfAccommodation?.status === "Other"
      ? [
          {
            key: "Remarks for other class of accommodation",
            value: findings?.classOfAccommodation?.remark || "-",
          },
        ]
      : []),
    {
      key: "Any Change in Class of Accommodation",
      value: findings?.changeInClassOfAccommodation?.status || "-",
    },
    ...(findings?.changeInClassOfAccommodation?.status &&
    ["Yes", "NA"].includes(findings?.changeInClassOfAccommodation?.status)
      ? [
          {
            key: "Remarks for change in class of accommodation",
            value: findings?.changeInClassOfAccommodation?.remark || "-",
          },
        ]
      : []),
    {
      key: "Patient on Active Line of Treatment",
      value: findings?.patientOnActiveLineOfTreatment?.status || "-",
    },
    ...(findings?.patientOnActiveLineOfTreatment?.status &&
    ["No", "NA"].includes(findings?.patientOnActiveLineOfTreatment?.status)
      ? [
          {
            key: "Remarks for patient on active line of treatment",
            value: findings?.patientOnActiveLineOfTreatment?.remark || "-",
          },
        ]
      : []),
    {
      key: "Mismatch in Diagnosis",
      value: findings?.mismatchInDiagnosis?.status || "-",
    },
    ...(findings?.mismatchInDiagnosis?.status &&
    ["Yes", "NA"].includes(findings?.mismatchInDiagnosis?.status)
      ? [
          {
            key: "Remarks for mismatch in symptoms",
            value: findings?.mismatchInDiagnosis?.remark || "-",
          },
        ]
      : []),
    {
      key: "Discrepancies Observed",
      value: findings?.discrepancies?.status || "-",
    },
    ...(findings?.discrepancies &&
    ["Yes", "NA"].includes(findings?.discrepancies?.status)
      ? [
          {
            key: "Remarks for Discrepancies",
            value: findings?.discrepancies?.remark || "-",
          },
        ]
      : []),
    {
      key: "PED/Non-disclosures",
      value: findings?.pedOrNoneDisclosure || "-",
    },
    {
      key: "Insured/Attendant Cooperation",
      value: findings?.insuredOrAttendantCooperation || "-",
    },
    ...(findings?.insuredOrAttendantCooperation === "No"
      ? [
          {
            key: "Reason of insured/attendant not cooperating",
            value: findings?.reasonForInsuredNotCooperation || "-",
          },
        ]
      : []),
    {
      key: "Provider Insured/Attendent-cooperation",
      value: findings?.providerCooperation || "-",
    },
    ...(findings?.providerCooperation === "No"
      ? [
          {
            key: "Reason of provider not cooperating",
            value: findings?.reasonForProviderNotCooperation || "-",
          },
        ]
      : []),
  ];

  const mappedAilmentData = findings?.ailment.map((element) => {
    return {
      Ailment: element.ailment,
      Diagnosis: element.diagnosis,
      Duration: element.duration,
      "On Medication": element.onMedication,
    };
  });

  const ailmentsTableData = {
    column: ["Ailment", "Diagnosis", "Duration", "On Medication"],
    data: mappedAilmentData,
  };

  const mappedHabitTable = findings?.patientHabit.map((element) => {
    return {
      Habit: element.habit,
      Frequency: element.frequency,
      Quantity: element.quantity,
      Duration: element.duration,
    };
  });

  const habitTableData = {
    column: ["Habit", "Frequency", "Quantity", "Duration"],
    data: mappedHabitTable,
  };

  const investigationDetailsData = [
    {
      key: "Recommendation from Investigator",
      value: findings?.recommendation?.value || "-",
    },
    {
      key: "Ground of Repudiation from Investigator",
      value:
        findings?.frcuGroundOfRepudiation?.map((el) => el.value)?.join(", ") ||
        "-",
    },
    {
      key: "Flag For",
      value:
        findings?.otherRecommendation?.map((el) => el?.value)?.join(", ") ||
        "-",
    },
    {
      key: "Flag Category",
      value:
        findings?.otherRecommendation
          ?.map((el) => el?.detail?.map((e) => e.value)?.join(", "))
          ?.join(", ") || "-",
    },
    {
      key: "Flag Category Remark",
      value:
        findings?.otherRecommendation
          ?.map((el) => el?.detail?.map((e) => e.remark)?.join(", "))
          ?.join(", ") || "-",
    },
  ];

  const investigationFooter = [
    {
      key: "Name of investigator",
      value: dashboardData?.claimInvestigators
        ?.map((el) => el.name)
        ?.join(", "),
    },
    {
      key: "Date of report submission",
      value: dayjs(caseData?.invReportReceivedDate).format(
        "DD-MMM-YYYY hh:mm:ss a"
      ),
    },
    {
      key: "Name of QA",
      value: caseData?.qaBy || "-",
    },
    {
      key: "Date of report submission",
      value: caseData?.reportSubmissionDateQa
        ? dayjs(caseData?.reportSubmissionDateQa).format(
            "DD-MMM-YYYY hh:mm:ss a"
          )
        : "-",
    },
  ];

  return (
    <View>
      <AssignmentSummary
        data={dashboardData}
        caseData={caseData}
        title="Field Investigation Report"
        docType={docType}
      />
      <TwoSectionView
        data={preAuthInvestigationSummary}
        topic="Pre-auth Investigation Summary"
        customStyle={{ marginTop: 100 }}
      />
      <TwoSectionView
        data={hospitalizationDetails}
        topic="Hospitalization Details"
      />
      <TwoSectionView data={patientDetails} topic="Patient Details" />
      <SectionHeading>Ailment Details</SectionHeading>
      <TableView tableData={ailmentsTableData} />
      <SectionHeading>Habit Details</SectionHeading>
      <TableView tableData={habitTableData} />
      <SingleLine>Investigation Summary</SingleLine>
      <Text style={styles.txt}>{findings?.investigationSummary}</Text>
      <TwoSectionView
        data={investigationDetailsData}
        topic="Investigation Details"
      />
      <TwoSectionView data={investigationFooter} topic="" />
    </View>
  );
};

export default FieldInvestigationReport;
