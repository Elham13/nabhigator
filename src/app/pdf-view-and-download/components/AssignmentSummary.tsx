import React, { Fragment } from "react";
import dayjs from "dayjs";
import Heading from "./Heading";
import { TDocType } from "../page";
import SingleLine from "./SingleLine";
import SectionHeading from "./SectionHeading";
import TwoSectionView from "./TwoSectionView";
import ThreeSectionView from "./ThreeSectionView";
import { convertToIndianFormat, getTasksAndDocs } from "@/lib/helpers";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import PreAuthDetails from "./PreaAuth/PreAuthDetails";
import ContractDetails from "./Reimbursement/ContractDetails";
import ClaimDetails from "./Reimbursement/ClaimDetails";

const styles = StyleSheet.create({
  container: { display: "flex", flexDirection: "column", columnGap: 10 },
  Separator: {
    display: "flex",
    flexDirection: "row",
    gap: "80px",
    marginTop: 5,
    marginBottom: 20,
    width: "100%",
  },
  detailSection: {
    paddingBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexDirection: "row",
    flex: 1,
  },
  keyText: {
    display: "flex",
    flexDirection: "row",
    fontWeight: 700,
    paddingBottom: 1,
    fontSize: 16,
  },
  valueText: {
    display: "flex",
    flexDirection: "row",
    fontWeight: 400,
    paddingBottom: 1,
    fontSize: 16,
    maxWidth: "300px",
  },
  subhead2Text: {
    fontWeight: 700,
    padding: 3,
    fontSize: 20,
    backgroundColor: "#c8cccb",
    width: "100%",
  },
});

const extractAcceptedTriageSummary = (
  dashboardData: IDashboardData | null,
  caseData: CaseDetail | null
) => {
  const triageSummary = dashboardData?.triageSummary;
  if (!triageSummary) return [];

  const acceptedEntries = triageSummary
    .filter((el) => el?.acceptOrReject?.condition)
    .map((el) => ({
      key: el?.variable,
      value: el?.result,
    }));

  // Create a comma-delimited string from the caseType array
  const secondaryTriage = Object.values(caseData?.caseType ?? {}).join(", ");

  // Add the "Secondary Triage" key-value pair
  acceptedEntries.push({
    key: "Secondary Triage",
    value: secondaryTriage,
  });

  return acceptedEntries;
};

const extractTasksAndDocuments = (
  caseData: CaseDetail | null,
  claimType?: "PreAuth" | "Reimbursement"
) => {
  const { tasksAndDocs } = getTasksAndDocs({ claimType, claimCase: caseData });

  // Extract tasksAssigned into a comma-separated string
  const tasks = tasksAndDocs?.tasks?.map((task) => task.name).join(", ");

  // Extract documents for 'Insured Part' into a comma-separated string
  const documents = !!tasksAndDocs?.docs
    ? Object?.keys(tasksAndDocs?.docs)
        ?.map((k) => {
          // @ts-ignore
          return caseData?.documents?.[k]
            ?.map((doc: any) => doc?.name)
            ?.join(", ");
        })
        ?.join(", ")
    : "";

  return [
    {
      key: "Tasks Assigned",
      value: tasks,
    },
    {
      key: "Documents",
      value: documents,
    },
  ];
};

type PropTypes = {
  data: IDashboardData | null;
  caseData: CaseDetail | null;
  docType: TDocType;
  title: string;
  invType?: "Internal" | "External";
};

const AssignmentSummary = ({
  data,
  caseData,
  docType,
  title,
  invType,
}: PropTypes) => {
  const acceptedTriageDetails = extractAcceptedTriageSummary(data, caseData);

  const tasksAndDocuments = extractTasksAndDocuments(caseData, data?.claimType);

  return (
    <View>
      <View style={styles.container}>
        <Heading>{title}</Heading>
        <SingleLine>
          {data?.claimType === "PreAuth" ? "Pre-Auth ID" : "Claim ID"}:{" "}
          {data?.claimId}
        </SingleLine>

        {data?.claimType === "PreAuth" ? (
          <Fragment>
            <PreAuthDetails data={data} invType={invType} />
          </Fragment>
        ) : data?.claimType === "Reimbursement" ? (
          <Fragment>
            <ContractDetails data={data} invType={invType} />
          </Fragment>
        ) : null}

        {data?.claimType === "PreAuth" ? (
          <>
            <SingleLine>
              Exclusion Remarks: {data?.claimDetails?.exclusionRemark || "-"}
            </SingleLine>
            <SingleLine>
              Member Fraud Status: {data?.claimDetails?.fraudStatus || "-"}
            </SingleLine>
          </>
        ) : null}

        {data?.claimType === "PreAuth" ? (
          <ContractDetails data={data} invType={invType} />
        ) : data?.claimType === "Reimbursement" ? (
          <ClaimDetails data={data} />
        ) : null}

        <SectionHeading>Historical Claims Details:</SectionHeading>

        {data?.historicalClaim && data?.historicalClaim?.length > 0
          ? data?.historicalClaim?.map((history, index) => {
              return (
                <View key={index}>
                  <SingleLine>{`History of ${history?.memberName}`}</SingleLine>
                  {history?.history?.length > 0 ? (
                    history?.history?.map((el, ind) => {
                      return (
                        <View key={ind} style={styles.Separator}>
                          <View style={styles.detailSection}>
                            <Text style={styles.keyText}>Hospital :</Text>
                            <Text style={styles.valueText}>{el?.hospital}</Text>
                          </View>
                          <View style={styles.detailSection}>
                            <Text style={styles.keyText}>Diagnosis :</Text>
                            <Text style={styles.valueText}>
                              {el?.diagnosis}
                            </Text>
                          </View>
                          <View style={styles.detailSection}>
                            <Text style={styles.keyText}>DOA :</Text>
                            <Text style={styles.valueText}>
                              {el?.DOA
                                ? dayjs(el?.DOA).format("DD-MMM-YYYY")
                                : "-"}
                            </Text>
                          </View>
                          <View style={styles.detailSection}>
                            <Text style={styles.keyText}>DOD :</Text>
                            <Text style={styles.valueText}>
                              {el?.DOD
                                ? dayjs(el?.DOD).format("DD-MMM-YYYY")
                                : "-"}
                            </Text>
                          </View>
                          {invType !== "External" ? (
                            <View style={styles.detailSection}>
                              <Text style={styles.keyText}>Claim Amount :</Text>
                              <Text style={styles.valueText}>
                                {el?.claimAmount
                                  ? convertToIndianFormat(
                                      parseInt(el?.claimAmount),
                                      true
                                    )
                                  : "-"}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      );
                    })
                  ) : (
                    <Text style={styles.subhead2Text}>-</Text>
                  )}
                </View>
              );
            })
          : null}

        <ThreeSectionView
          data={acceptedTriageDetails}
          topic="Trigger Details:"
        />

        <SingleLine>
          Pre-Qc Observations: {caseData?.preQcObservation || "-"}
        </SingleLine>
        {/* {invType !== "External" ? (
          <FraudIndicatorTable
            indicatorsList={data?.fraudIndicators?.indicatorsList || []}
          />
        ) : null} */}

        {docType === "final-investigation-report" ? (
          <TwoSectionView
            data={tasksAndDocuments}
            topic="Tasks & Documents Details:"
          />
        ) : null}
      </View>
    </View>
  );
};

export default AssignmentSummary;
