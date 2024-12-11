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
import { getTasksAndDocs } from "@/lib/helpers";

import ChemistVerification from "./Reimbursement/RMInvestigatorFindings/ChemistVerification";
import ClaimVerification from "./Reimbursement/RMInvestigatorFindings/ClaimVerification";
import EmployerVerification from "./Reimbursement/RMInvestigatorFindings/EmployerVerification";
import EmploymentAndEstablishmentVerification from "./Reimbursement/RMInvestigatorFindings/EmploymentAndEstablishmentVerification";
import FamilyDoctorPartReferringDoctorVerification from "./Reimbursement/RMInvestigatorFindings/FamilyDoctorPartReferringDoctorVerification";
import HospitalDailyCashPart from "./Reimbursement/RMInvestigatorFindings/HospitalDailyCashPart";
import HospitalVerification from "./Reimbursement/RMInvestigatorFindings/HospitalVerification";
import LabOrPathologistVerification from "./Reimbursement/RMInvestigatorFindings/LabOrPathologistVerification";
import MiscellaneousVerification from "./Reimbursement/RMInvestigatorFindings/MiscellaneousVerification";
import NPSConfirmation from "./Reimbursement/RMInvestigatorFindings/NPSConfirmation";
import OPDVerificationPart from "./Reimbursement/RMInvestigatorFindings/OPDVerificationPart";
import PrePostVerification from "./Reimbursement/RMInvestigatorFindings/PrePostVerification";
import RandomVicinityVerification from "./Reimbursement/RMInvestigatorFindings/RandomVicinityVerification";
import TreatingDoctorVerification from "./Reimbursement/RMInvestigatorFindings/TreatingDoctorVerification";
import VicinityVerification from "./Reimbursement/RMInvestigatorFindings/VicinityVerification";
import CommonTasks from "./Reimbursement/RMInvestigatorFindings/CommonTasks";
import AHCVerificationPart from "./Reimbursement/RMInvestigatorFindings/AHCVerificationPart";

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
  const {
    preAuthFindingsQA,
    preAuthFindings,
    rmFindingsQA,
    rmFindings,
    rmFindingsQAHospital,
    preAuthFindingsQAHospital,
  } = getTasksAndDocs({
    claimType: dashboardData?.claimType,
    claimCase: caseData,
  });

  const isRM = dashboardData?.claimType === "Reimbursement";

  const preAuthInvestigationSummary = [
    {
      key: "Date of Visit to Insured",
      value: isRM
        ? rmFindingsQA?.["Insured Verification"]?.dateOfVisitToInsured
          ? dayjs(
              rmFindingsQA?.["Insured Verification"]?.dateOfVisitToInsured
            ).format("DD-MMM-YYYY")
          : "-"
        : preAuthFindingsQA?.dateOfVisitToInsured
        ? dayjs(preAuthFindingsQA?.dateOfVisitToInsured).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Time of Visit to Insured",
      value: isRM
        ? rmFindingsQA?.["Insured Verification"]?.timeOfVisitToInsured
          ? dayjs(
              rmFindingsQA?.["Insured Verification"]?.timeOfVisitToInsured
            ).format("hh:mm:ss a")
          : "-"
        : preAuthFindingsQA?.timeOfVisitToInsured
        ? dayjs(preAuthFindingsQA?.timeOfVisitToInsured).format("hh:mm:ss a")
        : "-",
    },
    {
      key: "Date of Visit to Hospital",
      value: isRM
        ? rmFindingsQA?.["Hospital Verification"]?.dateOfVisitToHospital
          ? dayjs(
              rmFindingsQA?.["Hospital Verification"]?.dateOfVisitToHospital
            ).format("DD-MMM-YYYY")
          : "-"
        : preAuthFindingsQA?.dateOfVisitToHospital
        ? dayjs(preAuthFindingsQA?.dateOfVisitToHospital).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Time of Visit to Hospital",
      value: isRM
        ? rmFindingsQA?.["Hospital Verification"]?.timeOfVisitToHospital
          ? dayjs(
              rmFindingsQA?.["Hospital Verification"]?.timeOfVisitToHospital
            ).format("hh:mm:ss a")
          : "-"
        : preAuthFindingsQA?.timeOfVisitToHospital
        ? dayjs(preAuthFindingsQA?.timeOfVisitToHospital).format("hh:mm:ss a")
        : "-",
    },
    ...(isRM
      ? [
          {
            key: "Hospital Infrastructure",
            value:
              rmFindingsQA?.["Hospital Verification"]?.hospitalInfrastructure
                ?.value || "-",
          },
        ]
      : [
          {
            key: "Hospitalization Status",
            value: preAuthFindingsQA?.hospitalizationStatus?.value || "-",
          },
        ]),
  ];

  const hospitalizationDetails = [
    ...(preAuthFindingsQA?.hospitalizationStatus?.value === "Differed Admission"
      ? [
          {
            key: "Differed Admission",
            value:
              preAuthFindingsQA?.hospitalizationStatus?.differedAdmission ||
              "-",
          },
        ]
      : []),
    ...(preAuthFindingsQA?.hospitalizationStatus?.value ===
    "Cancelled Admission"
      ? [
          {
            key: "Cancelled Admission",
            value:
              preAuthFindingsQA?.hospitalizationStatus?.differedAdmission ||
              "-",
          },
        ]
      : []),
    ...(preAuthFindingsQA?.hospitalizationStatus?.cancelledAdmission === "Other"
      ? [
          {
            key: "Specify Other for cancelled admission",
            value:
              preAuthFindingsQA?.hospitalizationStatus
                ?.cancelledAdmissionOther || "-",
          },
        ]
      : []),
    ...(preAuthFindingsQA?.hospitalizationStatus?.value &&
    ["Admitted", "Discharged"].includes(
      preAuthFindingsQA?.hospitalizationStatus?.value
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
            value: preAuthFindingsQA?.hospitalizationDetails?.dateOfAdmission
              ? dayjs(
                  preAuthFindingsQA?.hospitalizationDetails?.dateOfAdmission
                ).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Time of Admission",
            value: preAuthFindingsQA?.hospitalizationDetails?.timeOfAdmission
              ? dayjs(
                  preAuthFindingsQA?.hospitalizationDetails?.timeOfAdmission
                ).format("hh:mm:ss a")
              : "-",
          },
          {
            key: "Date of Discharge",
            value: preAuthFindingsQA?.hospitalizationDetails?.dateOfDischarge
              ? dayjs(
                  preAuthFindingsQA?.hospitalizationDetails?.dateOfDischarge
                ).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Time of Discharge",
            value: preAuthFindingsQA?.hospitalizationDetails?.timeOfDischarge
              ? dayjs(
                  preAuthFindingsQA?.hospitalizationDetails?.timeOfDischarge
                ).format("hh:mm:ss a")
              : "-",
          },
        ]
      : []),
    ...(preAuthFindingsQA?.hospitalizationStatus?.value &&
    ["Planned Admission", "Differed Admission"].includes(
      preAuthFindingsQA?.hospitalizationStatus?.value
    )
      ? [
          {
            key: "Tentative Date of Admission",
            value: preAuthFindingsQA?.hospitalizationDetails
              ?.tentativeDateOfAdmission
              ? dayjs(
                  preAuthFindingsQA?.hospitalizationDetails
                    ?.tentativeDateOfAdmission
                ).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Tentative Date of Discharge",
            value: preAuthFindingsQA?.hospitalizationDetails
              ?.tentativeDateOfDischarge
              ? dayjs(
                  preAuthFindingsQA?.hospitalizationDetails
                    ?.tentativeDateOfDischarge
                ).format("DD-MMM-YYYY")
              : "-",
          },
        ]
      : []),
    ...(preAuthFindingsQA?.hospitalizationStatus?.value &&
    ["Cancelled Admission", "Roaming around in/out Hospital"].includes(
      preAuthFindingsQA?.hospitalizationStatus?.value
    )
      ? [
          {
            key: "Proposed Date of Admission",
            value: preAuthFindingsQA?.hospitalizationDetails
              ?.proposedDateOfAdmission
              ? dayjs(
                  preAuthFindingsQA?.hospitalizationDetails
                    ?.proposedDateOfAdmission
                ).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Proposed Date of Discharge",
            value: preAuthFindingsQA?.hospitalizationDetails
              ?.proposedDateOfDischarge
              ? dayjs(
                  preAuthFindingsQA?.hospitalizationDetails
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
      value: preAuthFindingsQA?.patientDetails?.patientName || "-",
    },
    {
      key: "Patient Age",
      value: preAuthFindingsQA?.patientDetails?.patientAge || "-",
    },
    {
      key: "Patient Gender",
      value: preAuthFindingsQA?.patientDetails?.patientGender || "-",
    },
    {
      key: "Revised Patient Name",
      value: preAuthFindingsQA?.patientDetails?.revisedPatientName || "-",
    },
    {
      key: "Revised Patient Age",
      value: preAuthFindingsQA?.patientDetails?.revisedPatientAge || "-",
    },
    {
      key: "Revised Patient Gender",
      value: preAuthFindingsQA?.patientDetails?.revisedPatientGender || "-",
    },
    {
      key: "Attendant Available",
      value: preAuthFindingsQA?.attendantDetails?.status || "-",
    },
    ...(preAuthFindingsQA?.attendantDetails?.status === "Available"
      ? [
          {
            key: "Attendant Name",
            value: preAuthFindingsQA?.attendantDetails?.name || "-",
          },
          {
            key: "Attendant Gender",
            value: preAuthFindingsQA?.attendantDetails?.gender || "-",
          },
          {
            key: "Relationship",
            value: preAuthFindingsQA?.attendantDetails?.relationship || "-",
          },
          {
            key: "Attendant Mobile No.",
            value: preAuthFindingsQA?.attendantDetails?.mobileNo || "-",
          },
        ]
      : []),
    {
      key: "Occupation of Insured",
      value: preAuthFindingsQA?.occupationOfInsured || "-",
    },
    {
      key: "Work Place Details",
      value: preAuthFindingsQA?.workPlaceDetails || "-",
    },
    {
      key: "Any Other Policy with NBHI",
      value: preAuthFindingsQA?.anyOtherPolicyWithNBHI || "-",
    },
    ...(preAuthFindingsQA?.anyOtherPolicyWithNBHI === "Yes"
      ? [
          {
            key: "Other Policy Number with NBHI",
            value: preAuthFindingsQA?.otherPolicyNoWithNBHI || "-",
          },
        ]
      : []),
    {
      key: "Any Previous Claim with NBHI",
      value: preAuthFindingsQA?.anyPreviousClaimWithNBHI || "-",
    },
    {
      key: "Any Insurance Policy Other Than NBHI",
      value: preAuthFindingsQA?.insurancePolicyOtherThanNBHI?.hasPolicy || "-",
    },
    ...(preAuthFindingsQA?.insurancePolicyOtherThanNBHI?.hasPolicy === "Yes"
      ? [
          {
            key: "Name of insurance company",
            value:
              preAuthFindingsQA?.insurancePolicyOtherThanNBHI
                ?.nameOfInsuranceCompany || "-",
          },
          {
            key: "Policy Number",
            value:
              preAuthFindingsQA?.insurancePolicyOtherThanNBHI?.policyNumber ||
              "-",
          },
        ]
      : []),
    {
      key: "Class of Accommodation",
      value: preAuthFindingsQA?.classOfAccommodation?.status || "-",
    },
    ...(preAuthFindingsQA?.classOfAccommodation?.status === "Other"
      ? [
          {
            key: "Remarks for other class of accommodation",
            value: preAuthFindingsQA?.classOfAccommodation?.remark || "-",
          },
        ]
      : []),
    {
      key: "Any Change in Class of Accommodation",
      value: preAuthFindingsQA?.changeInClassOfAccommodation?.status || "-",
    },
    ...(preAuthFindingsQA?.changeInClassOfAccommodation?.status &&
    ["Yes", "NA"].includes(
      preAuthFindingsQA?.changeInClassOfAccommodation?.status
    )
      ? [
          {
            key: "Remarks for change in class of accommodation",
            value:
              preAuthFindingsQA?.changeInClassOfAccommodation?.remark || "-",
          },
        ]
      : []),
    {
      key: "Patient on Active Line of Treatment",
      value: preAuthFindingsQA?.patientOnActiveLineOfTreatment?.status || "-",
    },
    ...(preAuthFindingsQA?.patientOnActiveLineOfTreatment?.status &&
    ["No", "NA"].includes(
      preAuthFindingsQA?.patientOnActiveLineOfTreatment?.status
    )
      ? [
          {
            key: "Remarks for patient on active line of treatment",
            value:
              preAuthFindingsQA?.patientOnActiveLineOfTreatment?.remark || "-",
          },
        ]
      : []),
    {
      key: "Mismatch in Diagnosis",
      value: preAuthFindingsQA?.mismatchInDiagnosis?.status || "-",
    },
    ...(preAuthFindingsQA?.mismatchInDiagnosis?.status &&
    ["Yes", "NA"].includes(preAuthFindingsQA?.mismatchInDiagnosis?.status)
      ? [
          {
            key: "Remarks for mismatch in symptoms",
            value: preAuthFindingsQA?.mismatchInDiagnosis?.remark || "-",
          },
        ]
      : []),
    {
      key: "Discrepancies Observed",
      value: preAuthFindingsQA?.discrepancies?.status || "-",
    },
    ...(preAuthFindingsQA?.discrepancies?.status &&
    ["Yes", "NA"].includes(preAuthFindingsQA?.discrepancies?.status)
      ? [
          {
            key: "Remarks for Discrepancies",
            value: preAuthFindingsQA?.discrepancies?.remark || "-",
          },
        ]
      : []),
    {
      key: "PED/Non-disclosures",
      value: preAuthFindingsQA?.pedOrNoneDisclosure || "-",
    },
    {
      key: "Insured/Attendant Cooperation",
      value: preAuthFindingsQA?.insuredOrAttendantCooperation || "-",
    },
    ...(preAuthFindingsQA?.insuredOrAttendantCooperation === "No"
      ? [
          {
            key: "Reason of insured/attendant not cooperating",
            value: preAuthFindingsQA?.reasonForInsuredNotCooperation || "-",
          },
        ]
      : []),
    {
      key: "Provider Insured/Attendent-cooperation",
      value: preAuthFindingsQA?.providerCooperation || "-",
    },
    ...(preAuthFindingsQA?.providerCooperation === "No"
      ? [
          {
            key: "Reason of provider not cooperating",
            value: preAuthFindingsQA?.reasonForProviderNotCooperation || "-",
          },
        ]
      : []),
  ];

  const mappedHabitTable = isRM
    ? rmFindingsQA?.["Insured Verification"]?.personalOrSocialHabits?.map(
        (element) => {
          return {
            Habit: element.habit,
            Frequency: element.frequency,
            Quantity: element.quantity,
            Duration: element.duration,
          };
        }
      )
    : preAuthFindingsQA?.patientHabit?.map((element) => {
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
      key: "Is Ported?",
      value: preAuthFindings?.port || "-",
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
      {!isRM || (isRM && !!rmFindingsQA?.["Insured Verification"]) ? (
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
        <>
          {!!rmFindingsQA?.["Insured Verification"] ? (
            <InsuredVerification
              values={rmFindingsQA?.["Insured Verification"]}
            />
          ) : null}
          <div>
            {!!rmFindings?.["Hospital Verification"] && (
              <HospitalVerification
                values={rmFindings?.["Hospital Verification"]}
              />
            )}
            {!!rmFindings?.["Claim Verification"] && (
              <ClaimVerification values={rmFindings?.["Claim Verification"]} />
            )}
            {!!rmFindings?.["Treating Doctor Verification"] && (
              <TreatingDoctorVerification
                values={rmFindings?.["Treating Doctor Verification"]}
              />
            )}
            {!!rmFindings?.["Chemist Verification"] && (
              <ChemistVerification
                values={rmFindings?.["Chemist Verification"]}
              />
            )}
            {!!rmFindings?.["OPD Verification Part"] && (
              <OPDVerificationPart
                values={rmFindings?.["OPD Verification Part"]}
              />
            )}
            {!!rmFindings?.["Lab Part/Pathologist Verification"] && (
              <LabOrPathologistVerification
                values={rmFindings?.["Lab Part/Pathologist Verification"]}
              />
            )}
            {!!rmFindings?.["NPS Confirmation"] && (
              <NPSConfirmation values={rmFindings?.["NPS Confirmation"]} />
            )}
            {!!rmFindings?.["AHC Verification Part"] && (
              <AHCVerificationPart
                values={rmFindings?.["AHC Verification Part"]}
              />
            )}
            {!!rmFindings?.["Pre-Post Verification"] && (
              <PrePostVerification
                values={rmFindings?.["Pre-Post Verification"]}
              />
            )}
            {!!rmFindings?.["Employer Verification"] && (
              <EmployerVerification
                values={rmFindings?.["Employer Verification"]}
              />
            )}
            {!!rmFindings?.["Employment & Establishment Verification"] && (
              <EmploymentAndEstablishmentVerification
                values={rmFindings?.["Employment & Establishment Verification"]}
              />
            )}
            {!!rmFindings?.[
              "Family Doctor Part/Referring Doctor Verification"
            ] && (
              <FamilyDoctorPartReferringDoctorVerification
                values={
                  rmFindings?.[
                    "Family Doctor Part/Referring Doctor Verification"
                  ]
                }
              />
            )}
            {!!rmFindings?.["Hospital Daily Cash Part"] && (
              <HospitalDailyCashPart
                values={rmFindings?.["Hospital Daily Cash Part"]}
              />
            )}

            {!!rmFindings?.[
              "Random Vicinity Hospital/Lab/Doctor/Chemist Verification"
            ] && (
              <RandomVicinityVerification
                values={
                  rmFindings?.[
                    "Random Vicinity Hospital/Lab/Doctor/Chemist Verification"
                  ]
                }
              />
            )}

            {!!rmFindings?.["Vicinity Verification"] && (
              <VicinityVerification
                values={rmFindings?.["Vicinity Verification"]}
              />
            )}
            {!!rmFindings?.["Miscellaneous Verification"] && (
              <MiscellaneousVerification
                values={rmFindings?.["Miscellaneous Verification"]}
              />
            )}
            {/* <CommonTasks values={rmFindings} /> */}
          </div>
        </>
      ) : (
        <TwoSectionView data={patientDetails} topic="Patient Details" />
      )}
      {!isRM ? (
        <>
          <SectionHeading>Ailment Details</SectionHeading>
          <TableView tableData={ailmentsTableData} />
        </>
      ) : null}
      {!isRM ||
      (isRM &&
        !!rmFindingsQA?.["Insured Verification"]?.personalOrSocialHabits &&
        rmFindingsQA?.["Insured Verification"]?.personalOrSocialHabits?.length >
          0) ? (
        <>
          <SectionHeading>Habit Details</SectionHeading>
          <TableView tableData={habitTableData} />
        </>
      ) : null}
      <SingleLine>Summary of investigation</SingleLine>
      <Text style={styles.txt}>
        {caseData?.postQARecommendation?.summaryOfInvestigation || "-"}
      </Text>
      {!isRM ? (
        <TwoSectionView
          data={investigationDetailsData}
          topic="Investigation Details"
        />
      ) : null}
      <TwoSectionView
        data={investigationConclusion}
        topic="Investigation Conclusion"
      />
      <TwoSectionView data={investigationFooter} topic="" />
    </View>
  );
};

export default FinalInvestigationReport;
