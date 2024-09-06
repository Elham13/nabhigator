import React from "react";
import dayjs from "dayjs";
import { TDocType } from "../page";
import TableView from "./TableView";
import SingleLine from "./SingleLine";
import TwoSectionView from "./TwoSectionView";
import SectionHeading from "./SectionHeading";
import AssignmentSummary from "./AssignmentSummary";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import InsuredVerification from "./Reimbursement/RMInvestigatorFindings/InsuredVerification";

const styles = StyleSheet.create({ txt: { fontSize: 20 } });

type PropTypes = {
  dashboardData: IDashboardData | null;
  caseData: CaseDetail | null;
  docType: TDocType;
  invType?: "Internal" | "External";
};

const FinalInvestigationReport = ({
  dashboardData,
  caseData,
  docType,
  invType,
}: PropTypes) => {
  const findings = caseData?.postQaFindings;
  const rmFindings = caseData?.rmFindingsPostQA;
  const isRM = dashboardData?.claimType === "Reimbursement";

  const preAuthInvestigationSummary = [
    {
      key: "Date of Visit to Insured",
      value: isRM
        ? rmFindings?.["Insured Verification"]?.dateOfVisitToInsured
          ? dayjs(
              rmFindings?.["Insured Verification"]?.dateOfVisitToInsured
            ).format("DD-MMM-YYYY")
          : "-"
        : findings?.dateOfVisitToInsured
        ? dayjs(findings?.dateOfVisitToInsured).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Time of Visit to Insured",
      value: isRM
        ? rmFindings?.["Insured Verification"]?.timeOfVisitToInsured
          ? dayjs(
              rmFindings?.["Insured Verification"]?.timeOfVisitToInsured
            ).format("hh:mm:ss a")
          : "-"
        : findings?.timeOfVisitToInsured
        ? dayjs(findings?.timeOfVisitToInsured).format("hh:mm:ss a")
        : "-",
    },
    {
      key: "Date of Visit to Hospital",
      value: isRM
        ? rmFindings?.["Hospital Verification"]?.dateOfVisitToHospital
          ? dayjs(
              rmFindings?.["Hospital Verification"]?.dateOfVisitToHospital
            ).format("DD-MMM-YYYY")
          : "-"
        : findings?.dateOfVisitToHospital
        ? dayjs(findings?.dateOfVisitToHospital).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Time of Visit to Hospital",
      value: isRM
        ? rmFindings?.["Hospital Verification"]?.timeOfVisitToHospital
          ? dayjs(
              rmFindings?.["Hospital Verification"]?.timeOfVisitToHospital
            ).format("hh:mm:ss a")
          : "-"
        : findings?.timeOfVisitToHospital
        ? dayjs(findings?.timeOfVisitToHospital).format("hh:mm:ss a")
        : "-",
    },
    ...(isRM
      ? [
          {
            key: "Hospital Infrastructure",
            value:
              rmFindings?.["Hospital Verification"]?.hospitalInfrastructure
                ?.value || "-",
          },
        ]
      : [
          {
            key: "Hospitalization Status",
            value: findings?.hospitalizationStatus?.value || "-",
          },
        ]),
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
                  findings?.hospitalizationDetails?.tentativeDateOfDischarge
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
            value: findings?.attendantDetails?.name || "-",
          },
          {
            key: "Attendant Gender",
            value: findings?.attendantDetails?.gender || "-",
          },
          {
            key: "Relationship",
            value: findings?.attendantDetails?.relationship || "-",
          },
          {
            key: "Attendant Mobile No.",
            value: findings?.attendantDetails?.mobileNo || "-",
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
    ...(findings?.discrepancies?.status &&
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

  const mappedHabitTable = isRM
    ? rmFindings?.["Insured Verification"]?.personalOrSocialHabits?.map(
        (element) => {
          return {
            Habit: element.habit,
            Frequency: element.frequency,
            Quantity: element.quantity,
            Duration: element.duration,
          };
        }
      )
    : findings?.patientHabit.map((element) => {
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

  const investigationFooter = [
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

  const investigationConclusion = [
    {
      key: "FRCU Recommendation on Claim",
      value:
        caseData?.postQARecommendation?.frcuRecommendationOnClaims?.value ||
        "-",
    },
    {
      key: "Claim Ground of Repudiation",
      value:
        caseData?.postQARecommendation?.claimsGroundOfRepudiation?.join(", ") ||
        "-",
    },
    {
      key: "FRCU Ground of Repudiation",
      value:
        caseData?.postQARecommendation?.frcuGroundOfRepudiation &&
        caseData?.postQARecommendation?.frcuGroundOfRepudiation?.length > 0
          ? caseData?.postQARecommendation?.frcuGroundOfRepudiation
              ?.map((el) => el?.value)
              ?.join(", ")
          : "-",
    },
    {
      key: "Queries to Raise",
      value: caseData?.postQARecommendation?.queriesToRaise || "-",
    },
    {
      key: "Provider Recommendation",
      value: caseData?.postQARecommendation?.providerRecommendation || "-",
    },
    {
      key: "Policy Recommendation",
      value: caseData?.postQARecommendation?.policyRecommendation || "-",
    },
    {
      key: "Sourcing Recommendation",
      value: caseData?.postQARecommendation?.sourcingRecommendation || "-",
    },
    {
      key: "Regulatory Reporting Recommendation",
      value:
        caseData?.postQARecommendation?.regulatoryReportingRecommendation ||
        "-",
    },
  ];

  return (
    <View>
      <AssignmentSummary
        data={dashboardData}
        caseData={caseData}
        title="Final Investigation Report"
        docType={docType}
        invType={invType}
      />
      {!isRM || (isRM && !!rmFindings?.["Insured Verification"]) ? (
        <TwoSectionView
          data={preAuthInvestigationSummary}
          topic={`${!isRM ? "Pre-auth" : ""} Investigation Summary`}
          customStyle={{ marginTop: 100 }}
        />
      ) : null}
      {!isRM && (
        <TwoSectionView
          data={hospitalizationDetails}
          topic="Hospitalization Details"
        />
      )}
      {isRM ? (
        !!rmFindings?.["Insured Verification"] ? (
          <InsuredVerification values={rmFindings?.["Insured Verification"]} />
        ) : null
      ) : (
        <TwoSectionView data={patientDetails} topic="Patient Details" />
      )}
      {!isRM ||
      (isRM &&
        !!rmFindings?.["Insured Verification"]?.personalOrSocialHabits &&
        rmFindings?.["Insured Verification"]?.personalOrSocialHabits?.length >
          0) ? (
        <>
          <SectionHeading>Habit Details</SectionHeading>
          <TableView tableData={habitTableData} />
        </>
      ) : null}
      <SingleLine>Summary of investigation</SingleLine>
      <Text style={styles.txt}>
        {isRM
          ? rmFindings?.investigationSummary
          : caseData?.postQARecommendation?.summaryOfInvestigation}
      </Text>
      <TwoSectionView
        data={investigationConclusion}
        topic="Investigation Conclusion"
      />
      <TwoSectionView data={investigationFooter} topic="" />
    </View>
  );
};

export default FinalInvestigationReport;
