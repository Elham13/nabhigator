import React, { Fragment } from "react";
import TwoSectionView from "../TwoSectionView";
import SectionHeading from "../SectionHeading";
import TableView from "../TableView";
import SingleLine from "../SingleLine";
import { StyleSheet, Text } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import { getTasksAndDocs } from "@/lib/helpers";

const styles = StyleSheet.create({ txt: { fontSize: 20 } });

type PropTypes = {
  caseData: CaseDetail | null;
  dashboardData: IDashboardData | null;
};

const InvestigatorFindings = ({ caseData, dashboardData }: PropTypes) => {
  const { preAuthFindings, tasksAndDocs } = getTasksAndDocs({
    claimType: dashboardData?.claimType,
    claimCase: caseData,
  });
  const preAuthInvestigationSummary = [
    {
      key: "Date of Visit to Insured",
      value: preAuthFindings?.dateOfVisitToInsured
        ? dayjs(preAuthFindings?.dateOfVisitToInsured).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Time of Visit to Insured",
      value: preAuthFindings?.timeOfVisitToInsured
        ? dayjs(preAuthFindings?.timeOfVisitToInsured).format("hh:mm:ss a")
        : "-",
    },
    {
      key: "Date of Visit to Hospital",
      value: preAuthFindings?.dateOfVisitToHospital
        ? dayjs(preAuthFindings?.dateOfVisitToHospital).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Time of Visit to Hospital",
      value: preAuthFindings?.timeOfVisitToHospital
        ? dayjs(preAuthFindings?.timeOfVisitToHospital).format("hh:mm:ss a")
        : "-",
    },
    {
      key: "Hospitalization Status",
      value: preAuthFindings?.hospitalizationStatus?.value,
    },
  ];

  const hospitalizationDetails = [
    ...(preAuthFindings?.hospitalizationStatus?.value === "Differed Admission"
      ? [
          {
            key: "Differed Admission",
            value:
              preAuthFindings?.hospitalizationStatus?.differedAdmission || "-",
          },
        ]
      : []),
    ...(preAuthFindings?.hospitalizationStatus?.value === "Cancelled Admission"
      ? [
          {
            key: "Cancelled Admission",
            value:
              preAuthFindings?.hospitalizationStatus?.differedAdmission || "-",
          },
        ]
      : []),
    ...(preAuthFindings?.hospitalizationStatus?.cancelledAdmission === "Other"
      ? [
          {
            key: "Specify Other for cancelled admission",
            value:
              preAuthFindings?.hospitalizationStatus?.cancelledAdmissionOther ||
              "-",
          },
        ]
      : []),
    ...(preAuthFindings?.hospitalizationStatus?.value &&
    ["Admitted", "Discharged"].includes(
      preAuthFindings?.hospitalizationStatus?.value
    )
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
            value: preAuthFindings?.hospitalizationDetails?.dateOfAdmission
              ? dayjs(
                  preAuthFindings?.hospitalizationDetails?.dateOfAdmission
                ).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Time of Admission",
            value: preAuthFindings?.hospitalizationDetails?.timeOfAdmission
              ? dayjs(
                  preAuthFindings?.hospitalizationDetails?.timeOfAdmission
                ).format("hh:mm:ss a")
              : "-",
          },
          {
            key: "Date of Discharge",
            value: preAuthFindings?.hospitalizationDetails?.dateOfDischarge
              ? dayjs(
                  preAuthFindings?.hospitalizationDetails?.dateOfDischarge
                ).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Time of Discharge",
            value: preAuthFindings?.hospitalizationDetails?.timeOfDischarge
              ? dayjs(
                  preAuthFindings?.hospitalizationDetails?.timeOfDischarge
                ).format("hh:mm:ss a")
              : "-",
          },
        ]
      : []),
    ...(preAuthFindings?.hospitalizationStatus?.value &&
    ["Planned Admission", "Differed Admission"].includes(
      preAuthFindings?.hospitalizationStatus?.value
    )
      ? [
          {
            key: "Tentative Date of Admission",
            value: preAuthFindings?.hospitalizationDetails
              ?.tentativeDateOfAdmission
              ? dayjs(
                  preAuthFindings?.hospitalizationDetails
                    ?.tentativeDateOfAdmission
                ).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Tentative Date of Discharge",
            value: preAuthFindings?.hospitalizationDetails
              ?.tentativeDateOfDischarge
              ? dayjs(
                  preAuthFindings?.hospitalizationDetails
                    ?.tentativeDateOfAdmission
                ).format("DD-MMM-YYYY")
              : "-",
          },
        ]
      : []),
    ...(preAuthFindings?.hospitalizationStatus?.value &&
    ["Cancelled Admission", "Roaming around in/out Hospital"].includes(
      preAuthFindings?.hospitalizationStatus?.value
    )
      ? [
          {
            key: "Proposed Date of Admission",
            value: preAuthFindings?.hospitalizationDetails
              ?.proposedDateOfAdmission
              ? dayjs(
                  preAuthFindings?.hospitalizationDetails
                    ?.proposedDateOfAdmission
                ).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Proposed Date of Discharge",
            value: preAuthFindings?.hospitalizationDetails
              ?.proposedDateOfDischarge
              ? dayjs(
                  preAuthFindings?.hospitalizationDetails
                    ?.proposedDateOfDischarge
                ).format("DD-MMM-YYYY")
              : "-",
          },
        ]
      : []),
  ];

  const patientDetails = [
    {
      key: "Patient Name",
      value: preAuthFindings?.patientDetails?.patientName || "-",
    },
    {
      key: "Patient Age",
      value: preAuthFindings?.patientDetails?.patientAge || "-",
    },
    {
      key: "Patient Gender",
      value: preAuthFindings?.patientDetails?.patientGender || "-",
    },
    {
      key: "Revised Patient Name",
      value: preAuthFindings?.patientDetails?.revisedPatientName || "-",
    },
    {
      key: "Revised Patient Age",
      value: preAuthFindings?.patientDetails?.revisedPatientAge || "-",
    },
    {
      key: "Revised Patient Gender",
      value: preAuthFindings?.patientDetails?.revisedPatientGender || "-",
    },
    {
      key: "Attendant Available",
      value: preAuthFindings?.attendantDetails?.status || "-",
    },
    ...(preAuthFindings?.attendantDetails?.status === "Available"
      ? [
          {
            key: "Attendant Name",
            value: preAuthFindings?.attendantDetails?.name,
          },
          {
            key: "Attendant Gender",
            value: preAuthFindings?.attendantDetails?.gender,
          },
          {
            key: "Relationship",
            value: preAuthFindings?.attendantDetails?.relationship,
          },
          {
            key: "Attendant Mobile No.",
            value: preAuthFindings?.attendantDetails?.mobileNo,
          },
        ]
      : []),
    {
      key: "Occupation of Insured",
      value: preAuthFindings?.occupationOfInsured || "-",
    },
    {
      key: "Work Place Details",
      value: preAuthFindings?.workPlaceDetails || "-",
    },
    {
      key: "Any Other Policy with NBHI",
      value: preAuthFindings?.anyOtherPolicyWithNBHI || "-",
    },
    ...(preAuthFindings?.anyOtherPolicyWithNBHI === "Yes"
      ? [
          {
            key: "Other Policy Number with NBHI",
            value: preAuthFindings?.otherPolicyNoWithNBHI || "-",
          },
        ]
      : []),
    {
      key: "Any Previous Claim with NBHI",
      value: preAuthFindings?.anyPreviousClaimWithNBHI || "-",
    },
    {
      key: "Any Insurance Policy Other Than NBHI",
      value: preAuthFindings?.insurancePolicyOtherThanNBHI?.hasPolicy || "-",
    },
    ...(preAuthFindings?.insurancePolicyOtherThanNBHI?.hasPolicy === "Yes"
      ? [
          {
            key: "Name of insurance company",
            value:
              preAuthFindings?.insurancePolicyOtherThanNBHI
                ?.nameOfInsuranceCompany || "-",
          },
          {
            key: "Policy Number",
            value:
              preAuthFindings?.insurancePolicyOtherThanNBHI?.policyNumber ||
              "-",
          },
        ]
      : []),
    {
      key: "Class of Accommodation",
      value: preAuthFindings?.classOfAccommodation?.status || "-",
    },
    ...(preAuthFindings?.classOfAccommodation?.status === "Other"
      ? [
          {
            key: "Remarks for other class of accommodation",
            value: preAuthFindings?.classOfAccommodation?.remark || "-",
          },
        ]
      : []),
    {
      key: "Any Change in Class of Accommodation",
      value: preAuthFindings?.changeInClassOfAccommodation?.status || "-",
    },
    ...(preAuthFindings?.changeInClassOfAccommodation?.status &&
    ["Yes", "NA"].includes(
      preAuthFindings?.changeInClassOfAccommodation?.status
    )
      ? [
          {
            key: "Remarks for change in class of accommodation",
            value: preAuthFindings?.changeInClassOfAccommodation?.remark || "-",
          },
        ]
      : []),
    {
      key: "Patient on Active Line of Treatment",
      value: preAuthFindings?.patientOnActiveLineOfTreatment?.status || "-",
    },
    ...(preAuthFindings?.patientOnActiveLineOfTreatment?.status &&
    ["No", "NA"].includes(
      preAuthFindings?.patientOnActiveLineOfTreatment?.status
    )
      ? [
          {
            key: "Remarks for patient on active line of treatment",
            value:
              preAuthFindings?.patientOnActiveLineOfTreatment?.remark || "-",
          },
        ]
      : []),
    {
      key: "Mismatch in Diagnosis",
      value: preAuthFindings?.mismatchInDiagnosis?.status || "-",
    },
    ...(preAuthFindings?.mismatchInDiagnosis?.status &&
    ["Yes", "NA"].includes(preAuthFindings?.mismatchInDiagnosis?.status)
      ? [
          {
            key: "Remarks for mismatch in symptoms",
            value: preAuthFindings?.mismatchInDiagnosis?.remark || "-",
          },
        ]
      : []),
    {
      key: "Discrepancies Observed",
      value: preAuthFindings?.discrepancies?.status || "-",
    },
    ...(preAuthFindings?.discrepancies &&
    !!preAuthFindings?.discrepancies?.status &&
    ["Yes", "NA"].includes(preAuthFindings?.discrepancies?.status)
      ? [
          {
            key: "Remarks for Discrepancies",
            value: preAuthFindings?.discrepancies?.remark || "-",
          },
        ]
      : []),
    {
      key: "PED/Non-disclosures",
      value: preAuthFindings?.pedOrNoneDisclosure || "-",
    },
    {
      key: "Insured/Attendant Cooperation",
      value: preAuthFindings?.insuredOrAttendantCooperation || "-",
    },
    ...(preAuthFindings?.insuredOrAttendantCooperation === "No"
      ? [
          {
            key: "Reason of insured/attendant not cooperating",
            value: preAuthFindings?.reasonForInsuredNotCooperation || "-",
          },
        ]
      : []),
    {
      key: "Provider Insured/Attendent-cooperation",
      value: preAuthFindings?.providerCooperation || "-",
    },
    ...(preAuthFindings?.providerCooperation === "No"
      ? [
          {
            key: "Reason of provider not cooperating",
            value: preAuthFindings?.reasonForProviderNotCooperation || "-",
          },
        ]
      : []),
  ];

  const mappedAilmentData = preAuthFindings?.ailment?.map((element) => {
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

  const mappedHabitTable = preAuthFindings?.patientHabit?.map((element) => {
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
      value: preAuthFindings?.recommendation?.value || "-",
    },
    {
      key: "Ground of Repudiation from Investigator",
      value:
        preAuthFindings?.frcuGroundOfRepudiation
          ?.map((el) => el.value)
          ?.join(", ") || "-",
    },
    {
      key: "Flag For",
      value:
        preAuthFindings?.otherRecommendation
          ?.map((el) => el?.value)
          ?.join(", ") || "-",
    },
    {
      key: "Flag Category",
      value:
        preAuthFindings?.otherRecommendation
          ?.map((el) => el?.detail?.map((e) => e.value)?.join(", "))
          ?.join(", ") || "-",
    },
    {
      key: "Flag Category Remark",
      value:
        preAuthFindings?.otherRecommendation
          ?.map((el) => el?.detail?.map((e) => e.remark)?.join(", "))
          ?.join(", ") || "-",
    },
    {
      key: "Re-Investigation Findings",
      value: preAuthFindings?.reInvestigationFindings || "-",
    },
    {
      key: "Is Ported?",
      value: preAuthFindings?.port || "-",
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
      value: dayjs(tasksAndDocs?.invReportReceivedDate).format(
        "DD-MMM-YYYY hh:mm:ss a"
      ),
    },
  ];

  return (
    <Fragment>
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
      <Text style={styles.txt}>{preAuthFindings?.investigationSummary}</Text>
      <TwoSectionView
        data={investigationDetailsData}
        topic="Investigation Details"
      />
      <TwoSectionView data={investigationFooter} topic="" />
    </Fragment>
  );
};

export default InvestigatorFindings;
