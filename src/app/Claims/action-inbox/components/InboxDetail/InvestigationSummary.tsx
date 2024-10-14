import React, { Fragment } from "react";
import {
  Accordion,
  Box,
  Button,
  Divider,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import {
  convertToIndianFormat,
  getEncryptClaimId,
  getTasksAndDocs,
} from "@/lib/helpers";
import TasksViewKeyValue from "./TasksViewKeyValue";

interface InvestigationSummaryProps {
  dashboardData: IDashboardData | null;
  caseDetails: CaseDetail | null;
}

export default function InvestigationSummary({
  dashboardData,
  caseDetails,
}: InvestigationSummaryProps) {
  const KeyValueContainer = ({
    label,
    value,
  }: {
    label: string;
    value: any;
  }) => {
    return (
      <Box>
        <Box className="flex items-center justify-between">
          <Text>{label}</Text>
          <Text
            fw={500}
            c={`${
              ["Not Found", "Not Found!"].includes(value) ? "grape" : "green"
            }`}
          >
            {value}
          </Text>
        </Box>
        <Divider />
      </Box>
    );
  };

  function getDocsArr(inputData: Record<string, any> | null | undefined) {
    return Object.entries(inputData ?? {})
      .filter(([key, value]) => Array.isArray(value))
      .map(([key, value]) => ({
        label: key,
        value: value.map((item: any) => item.name),
      }));
  }

  const preAuthData = [
    { label: "Referral Type", value: "Manual" },
    {
      label: "Pre-Auth Number",
      value: dashboardData?.claimId?.toString() || "-",
    },
    {
      label: "Insured Name",
      value: dashboardData?.insuredDetails?.insuredName || "-",
    },
    {
      label: "DOB",
      value: dashboardData?.insuredDetails?.dob
        ? dayjs(dashboardData?.insuredDetails?.dob).format("DD-MMM-YYYY")
        : "-",
    },
    {
      label: "Age",
      value: dashboardData?.insuredDetails?.age?.toString() || "-",
    },
    { label: "Relation", value: "-" },
    { label: "Address", value: dashboardData?.insuredDetails?.address || "-" },
    { label: "City", value: dashboardData?.insuredDetails?.city || "-" },
    { label: "State", value: dashboardData?.insuredDetails?.state || "-" },
    {
      label: "Mobile Number",
      value: dashboardData?.insuredDetails?.contactNo || "-",
    },
    {
      label: "Provider Name",
      value: dashboardData?.hospitalDetails?.providerName || "-",
    },
    {
      label: "Provider Code",
      value: dashboardData?.hospitalDetails?.providerNo || "-",
    },
    {
      label: "Provider Address",
      value: dashboardData?.hospitalDetails?.providerAddress || "-",
    },
    {
      label: "Provider City",
      value: dashboardData?.hospitalDetails?.providerCity || "-",
    },
    {
      label: "Provider State",
      value: dashboardData?.hospitalDetails?.providerState || "-",
    },
    { label: "Provider Status", value: "" },
    {
      label: "Diagnosis",
      value: dashboardData?.claimDetails?.diagnosis || "-",
    },
    { label: "Treatment Type", value: "" },
    {
      label: "Request Amount",
      value: dashboardData?.claimDetails?.claimAmount
        ? convertToIndianFormat(dashboardData?.claimDetails?.claimAmount)
        : "0",
    },
    {
      label: "Date of Admission",
      value: dashboardData?.hospitalizationDetails?.dateOfAdmission
        ? dayjs(dashboardData?.hospitalizationDetails?.dateOfAdmission).format(
            "DD-MMM-YYYY"
          )
        : "-",
    },
    {
      label: "Date of Discharge",
      value: dashboardData?.hospitalizationDetails?.dateOfDischarge
        ? dayjs(dashboardData?.hospitalizationDetails?.dateOfDischarge).format(
            "DD-MMM-YYYY"
          )
        : "-",
    },
    {
      label: "Pre-Auth Received Date",
      value: dashboardData?.claimDetails?.receivedAt
        ? dayjs(dashboardData?.claimDetails?.receivedAt).format("DD-MMM-YYYY")
        : "-",
    },
    {
      label: "Intimation Date",
      value: dashboardData?.intimationDate
        ? dayjs(dashboardData?.intimationDate).format("DD-MMM-YYYY")
        : "-",
    },
    {
      label: "Admission Type",
      value: dashboardData?.hospitalizationDetails?.admissionType || "-",
    },
    {
      label: "Exclusion Remark",
      value: dashboardData?.claimDetails?.exclusionRemark || "-",
    },
    {
      label: "Member Fraud Status",
      value: dashboardData?.claimDetails?.fraudStatus || "-",
    },
  ];

  const { preAuthFindings } = getTasksAndDocs({
    claimType: dashboardData?.claimType,
    claimCase: caseDetails,
  });

  const investigationDataArray = [
    {
      key: "Date of Visit To Insured",
      value: preAuthFindings?.dateOfVisitToInsured || "-",
    },
    {
      key: "Time of Visit To Insured",
      value: preAuthFindings?.timeOfVisitToInsured || "-",
    },
    {
      key: "Date of Visit To Hospital",
      value: preAuthFindings?.dateOfVisitToHospital || "-",
    },
    {
      key: "Time of Visit To Hospital",
      value: preAuthFindings?.timeOfVisitToHospital || "-",
    },
    {
      key: "Hospitalization Status",
      value: preAuthFindings?.hospitalizationStatus?.value || "-",
    },
    {
      key: "Differed Admission",
      value: preAuthFindings?.hospitalizationStatus?.differedAdmission || "-",
    },
    {
      key: "Cancelled Admission Reason",
      value: preAuthFindings?.hospitalizationStatus?.cancelledAdmission || "-",
    },
    {
      key: "Date of Admission",
      value: preAuthFindings?.hospitalizationDetails?.dateOfAdmission || "-",
    },
    {
      key: "Time of Admission",
      value: preAuthFindings?.hospitalizationDetails?.timeOfAdmission || "-",
    },
    {
      key: "Date of Discharge",
      value: preAuthFindings?.hospitalizationDetails?.dateOfDischarge || "-",
    },
    {
      key: "Time of Discharge",
      value: preAuthFindings?.hospitalizationDetails?.timeOfDischarge || "-",
    },
    {
      key: "Tentative Date of Admission",
      value:
        preAuthFindings?.hospitalizationDetails?.tentativeDateOfAdmission ||
        "-",
    },
    {
      key: "Tentative Date of Discharge",
      value:
        preAuthFindings?.hospitalizationDetails?.tentativeDateOfDischarge ||
        "-",
    },
    {
      key: "Proposed Date of Admission",
      value:
        preAuthFindings?.hospitalizationDetails?.proposedDateOfAdmission || "-",
    },
    {
      key: "Proposed Date of Discharge",
      value:
        preAuthFindings?.hospitalizationDetails?.proposedDateOfDischarge || "-",
    },
    {
      key: "Patient Name",
      value: preAuthFindings?.patientDetails?.patientName || "-",
    },
    {
      key: "Patient Age",
      value: preAuthFindings?.patientDetails?.patientAge?.toString() || "-",
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
      value:
        preAuthFindings?.patientDetails?.revisedPatientAge?.toString() || "-",
    },
    {
      key: "Revised Patient Gender",
      value: preAuthFindings?.patientDetails?.revisedPatientGender || "-",
    },
    {
      key: "Attendant Status",
      value: preAuthFindings?.attendantDetails?.status || "-",
    },
    {
      key: "Attendant Name",
      value: preAuthFindings?.attendantDetails?.name || "-",
    },
    {
      key: "Occupation of Insured",
      value: preAuthFindings?.occupationOfInsured || "-",
    },
    {
      key: "Workplace Details",
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
      key: "Insurance Policy Other Than NBHI",
      value: preAuthFindings?.insurancePolicyOtherThanNBHI?.hasPolicy || "-",
    },
    {
      key: "Class of Accommodation",
      value: preAuthFindings?.classOfAccommodation?.status || "-",
    },
    {
      key: "Change in Class of Accommodation",
      value: preAuthFindings?.changeInClassOfAccommodation?.status || "-",
    },
    {
      key: "Patient on Active Line of Treatment",
      value: preAuthFindings?.patientOnActiveLineOfTreatment?.status || "-",
    },
    {
      key: "Mismatch in Diagnosis",
      value: preAuthFindings?.mismatchInDiagnosis?.status || "-",
    },
    {
      key: "Mismatch in Diagnosis Remark",
      value: preAuthFindings?.mismatchInDiagnosis?.remark || "-",
    },
    {
      key: "Discrepancies",
      value: preAuthFindings?.discrepancies?.status || "-",
    },
    {
      key: "Discrepancies Remark",
      value: preAuthFindings?.discrepancies?.remark || "-",
    },
    {
      key: "Patient Habits",
      value:
        preAuthFindings?.patientHabit
          ?.map(
            (habit) =>
              `${habit.habit}: ${habit.frequency}, ${habit.quantity}, ${habit.duration}`
          )
          .join("; ") || "-",
    },
    {
      key: "PED or None Disclosure",
      value: preAuthFindings?.pedOrNoneDisclosure || "-",
    },
    {
      key: "Ailment",
      value:
        preAuthFindings?.ailment
          ?.map(
            (ailment) =>
              `${ailment.ailment}: ${ailment.diagnosis}, ${ailment.duration}, Medication: ${ailment.onMedication}`
          )
          .join("; ") || "-",
    },
    {
      key: "Insured or Attendant Cooperation",
      value: preAuthFindings?.insuredOrAttendantCooperation || "-",
    },
    {
      key: "Provider Cooperation",
      value: preAuthFindings?.providerCooperation || "-",
    },
    {
      key: "Investigation Summary",
      value: preAuthFindings?.investigationSummary || "-",
    },
    {
      key: "Recommendation",
      value: preAuthFindings?.recommendation?.value || "-",
    },
    {
      key: "FRCU Ground of Repudiation",
      value:
        preAuthFindings?.frcuGroundOfRepudiation
          ?.map((el) => el?.value)
          ?.join(", ") || "-",
    },
    {
      key: "Other Recommendations",
      value:
        preAuthFindings?.otherRecommendation
          ?.map(
            (recommendation) =>
              `${recommendation.value}: ${recommendation.detail
                .map((detail) => `${detail.value}: ${detail.remark}`)
                .join(", ")}`
          )
          .join("; ") || "-",
    },
  ];

  const postQARecommendationArray = [
    {
      key: "Summary of Investigation",
      value: caseDetails?.postQARecommendation?.summaryOfInvestigation || "-",
    },
    {
      key: "FRCU Recommendation on Claims",
      value:
        caseDetails?.postQARecommendation?.frcuRecommendationOnClaims?.value,
    },
    {
      key: "Claims Ground of Repudiation",
      value:
        caseDetails?.postQARecommendation?.claimsGroundOfRepudiation || "-",
    },
    {
      key: "FRCU Ground of Repudiation",
      value:
        caseDetails?.postQARecommendation?.frcuGroundOfRepudiation
          ?.map((el) => el?.value)
          ?.join(", ") || "-",
    },
    {
      key: "Queries to Raise",
      value: caseDetails?.postQARecommendation?.queriesToRaise || "-",
    },
    {
      key: "Provider Recommendation",
      value: caseDetails?.postQARecommendation?.providerRecommendation || "-",
    },
    {
      key: "Policy Recommendation",
      value: caseDetails?.postQARecommendation?.policyRecommendation || "-",
    },
    {
      key: "Sourcing Recommendation",
      value: caseDetails?.postQARecommendation?.sourcingRecommendation || "-",
    },
    {
      key: "Regulatory Reporting Recommendation",
      value:
        caseDetails?.postQARecommendation?.regulatoryReportingRecommendation ||
        "-",
    },
  ];

  const documentsAssigned = getDocsArr(
    caseDetails?.singleTasksAndDocs?.preAuthFindings
  );

  let encryptedClaimId: string = "";

  getEncryptClaimId(dashboardData?.claimId).then(
    (str) => (encryptedClaimId = str)
  );

  return (
    <Stack>
      <Accordion>
        <Accordion.Item value={"InvestigationSummary"}>
          <Accordion.Control>
            <Title className="col-span-1 md:col-span-1" order={4} c="blue">
              Investigation Summary
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <Box>
                <Title className="col-span-1 md:col-span-1" order={5} c="blue">
                  Pre-Auth Details
                </Title>
                <Box>
                  {preAuthData.map(({ label, value }) => (
                    <KeyValueContainer
                      key={label}
                      label={label}
                      value={value}
                    />
                  ))}
                </Box>
              </Box>
              <Box>
                <Title className="col-span-1 md:col-span-1" order={5} c="blue">
                  Tasks Assigned
                </Title>
                <Box>
                  {caseDetails?.allocationType === "Single" ? (
                    <TasksViewKeyValue
                      tasksAndDocs={caseDetails?.singleTasksAndDocs}
                    />
                  ) : caseDetails?.allocationType === "Dual" ? (
                    <Fragment>
                      <TasksViewKeyValue
                        tasksAndDocs={caseDetails?.insuredTasksAndDocs}
                        part="Insured"
                      />
                      <TasksViewKeyValue
                        tasksAndDocs={caseDetails?.hospitalTasksAndDocs}
                        part="Hospital"
                      />
                    </Fragment>
                  ) : null}
                </Box>
              </Box>
              <Box>
                <Title className="col-span-1 md:col-span-1" order={5} c="blue">
                  Documents Assigned
                </Title>
                <Box>
                  {documentsAssigned.map(({ label, value }) => (
                    <Box key={label}>
                      <Box className="flex items-center justify-between">
                        <Text>{label}</Text>
                        <Text fw={500} c="green">
                          {value.map((item: any) => (
                            <span key={item}>{item}</span>
                          ))}
                        </Text>
                      </Box>
                      <Divider />
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box>
                <Title className="col-span-1 md:col-span-1" order={5} c="blue">
                  Investigator Recommendation
                </Title>
                <Box>
                  <KeyValueContainer
                    label="recommendation"
                    value={preAuthFindings?.recommendation?.value || "-"}
                  />
                </Box>
              </Box>
              <Box>
                <Title className="col-span-1 md:col-span-1" order={5} c="blue">
                  Pre-Auth Investigator Findings
                </Title>
                <Box>
                  {investigationDataArray.map((item) => {
                    return (
                      <KeyValueContainer
                        key={item.key}
                        label={item.key}
                        value={item.value}
                      />
                    );
                  })}
                </Box>
              </Box>
              <Box>
                <Title className="col-span-1 md:col-span-1" order={5} c="blue">
                  Post-QA recommendation
                </Title>
                <Box>
                  {postQARecommendationArray.map((item) => {
                    let returnJsx;
                    if (Array.isArray(item.value)) {
                      returnJsx = (
                        <Box key={item.key}>
                          <Box className="flex items-center justify-between">
                            <Text>{item.key}</Text>
                            <Text fw={500} c="green">
                              {item.value.map((item) => (
                                <span key={item}>{item}</span>
                              ))}
                            </Text>
                          </Box>
                          <Divider />
                        </Box>
                      );
                    } else {
                      returnJsx = (
                        <KeyValueContainer
                          key={item.key}
                          value={item.value}
                          label={item.key}
                        />
                      );
                    }
                    return returnJsx;
                  })}
                  <KeyValueContainer
                    value={caseDetails?.postQaComment || "-"}
                    label="Post Qa comment"
                  />
                </Box>
              </Box>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Button
        onClick={() => {
          window.open(
            `/pdf-view-and-download?claimId=${encryptedClaimId}&docType=investigation`
          );
        }}
      >
        Investigation Summary PDF
      </Button>
    </Stack>
  );
}
