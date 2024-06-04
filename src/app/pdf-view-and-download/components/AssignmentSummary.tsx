import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import SingleLine from "./SingleLine";
import ThreeSectionView from "./ThreeSectionView";
import dayjs from "dayjs";
import SectionHeading from "./SectionHeading";
import FraudIndicatorTable from "./FraudIndicatorTable";
import TwoSectionView from "./TwoSectionView";
import Heading from "./Heading";
import { TDocType } from "../page";
import {
  CaseDetail,
  IDashboardData,
  ResponseDoc,
} from "@/lib/utils/types/fniDataTypes";
import { convertToIndianFormat } from "@/lib/helpers";

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

const extractTasksAndDocuments = (caseData: CaseDetail | null) => {
  if (!caseData || !caseData?.documents) return [];

  // Extract tasksAssigned into a comma-separated string
  const tasks = caseData?.tasksAssigned?.map((task) => task.name).join(", ");

  // Extract documents for 'Insured Part' into a comma-separated string
  const documents = caseData?.documents
    ? Object?.keys(caseData?.documents)
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
};

const AssignmentSummary = ({ data, caseData, docType, title }: PropTypes) => {
  const preAuthDetailsData = [
    {
      key: "Referral Type",
      value: data?.claimType,
    },
    {
      key: "Claim Amount",
      value: data?.claimDetails?.claimAmount
        ? convertToIndianFormat(
            parseInt(data?.claimDetails?.claimAmount?.toString()),
            true
          )
        : "-",
    },
    {
      key: "DOB",
      value: data?.insuredDetails?.dob
        ? dayjs(data?.insuredDetails?.dob).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: data?.claimType === "PreAuth" ? "Pre-Auth" : "Claim" + " Number",
      value: data?.claimId,
    },
    {
      key: "Insured Name",
      value: data?.insuredDetails?.insuredName,
    },
    {
      key: "Age",
      value: `${data?.insuredDetails?.age} Years`,
    },
    {
      key: "Relation",
      value: data?.insuredDetails?.insuredType,
    },
    {
      key: "Address",
      value: data?.insuredDetails?.address,
    },
    {
      key: "City",
      value: data?.insuredDetails?.city,
    },
    {
      key: "State",
      value: data?.insuredDetails?.state,
    },
    {
      key: "Mobile Number",
      value: data?.insuredDetails?.contactNo,
    },
    {
      key: "Provider Name",
      value: data?.hospitalDetails?.providerName,
    },
    {
      key: "Provider Code",
      value: data?.hospitalDetails?.providerNo,
    },
    {
      key: "Provider Address",
      value: data?.hospitalDetails?.providerAddress,
    },
    {
      key: "Provider City",
      value: data?.hospitalDetails?.providerCity,
    },
    {
      key: "Provider State",
      value: data?.hospitalDetails?.providerState,
    },
    {
      key: "Pre-Auth Status",
      value: data?.claimDetails?.claimStatus,
    },
    {
      key: "Diagnosis",
      value: data?.claimDetails?.diagnosis,
    },
    {
      key: "Treatment Type",
      value: data?.claimDetails?.claimType || "-",
    },
    {
      key: "Request Amount",
      value: data?.claimDetails?.billedAmount
        ? convertToIndianFormat(
            parseInt(data?.claimDetails?.billedAmount),
            true
          )
        : "0",
    },
    {
      key: "Date of Admission",
      value: data?.hospitalizationDetails?.dateOfAdmission
        ? dayjs(data?.hospitalizationDetails?.dateOfAdmission).format(
            "DD-MMM-YYYY"
          )
        : "-",
    },
    {
      key: "Date of Discharge",
      value: data?.hospitalizationDetails?.dateOfDischarge
        ? dayjs(data?.hospitalizationDetails?.dateOfDischarge).format(
            "DD-MMM-YYYY"
          )
        : "-",
    },
    {
      key: "Pre-Auth Received Date",
      value: data?.claimDetails?.receivedAt
        ? dayjs(data?.claimDetails?.receivedAt).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Intimation Date",
      value: data?.intimationDate
        ? dayjs(data?.intimationDate).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Admission Type",
      value: data?.hospitalizationDetails?.admissionType,
    },
  ];

  const contractDetailsData = [
    {
      key: "Contract Number",
      value: data?.contractDetails?.contractNo,
    },
    {
      key: "Product",
      value: data?.contractDetails?.product,
    },
    {
      key: "Contract Renewal Date",
      value: data?.contractDetails?.policyStartDate
        ? dayjs(data?.contractDetails?.policyStartDate).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Policy End Date",
      value: data?.contractDetails?.policyEndDate
        ? dayjs(data?.contractDetails?.policyEndDate).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Port",
      value: data?.contractDetails?.port,
    },
    {
      key: "Previous Insurance Company",
      value: data?.contractDetails?.prevInsuranceCompany,
    },
    {
      key: "Mbr Reg.Date",
      value: data?.contractDetails?.insuredSince
        ? dayjs(data?.contractDetails?.insuredSince).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "NBHI Policy Start Date",
      value: data?.contractDetails?.NBHIPolicyStartDate
        ? dayjs(data?.contractDetails?.NBHIPolicyStartDate).format(
            "DD-MMM-YYYY"
          )
        : "-",
    },
    {
      key: "Members Covered",
      value: data?.contractDetails?.membersCovered.toString(),
    },
    {
      key: "Sourcing",
      value: data?.claimDetails?.claimTrigger,
    },
    {
      key: "Agent Name",
      value: data?.contractDetails?.agentName,
    },
    {
      key: "Agent Code",
      value: data?.contractDetails?.agentCode,
    },
    {
      key: "Branch Location",
      value: data?.contractDetails?.branchLocation,
    },
    {
      key: "Banca Details",
      value: data?.contractDetails?.bancaDetails,
    },
    {
      key: "Membership Number",
      value: data?.claimDetails?.memberNo,
    },
    {
      key: "Member Name",
      value: data?.insuredDetails?.insuredName,
    },
    {
      key: "DOB",
      value: dayjs(data?.insuredDetails?.dob).format("DD-MMM-YYYY"),
    },
    {
      key: "Relation",
      value: data?.insuredDetails?.insuredType,
    },
  ];

  const acceptedTriageDetails = extractAcceptedTriageSummary(data, caseData);

  const tasksAndDocuments = extractTasksAndDocuments(caseData);

  return (
    <View>
      <View style={styles.container}>
        <Heading>{title}</Heading>
        <SingleLine>
          {data?.claimType === "PreAuth" ? "Pre-Auth ID" : "Claim ID"}:{" "}
          {data?.claimId}
        </SingleLine>

        <ThreeSectionView
          data={preAuthDetailsData}
          topic={`${
            data?.claimType === "PreAuth" ? "Pre-Auth" : "Reimbursement"
          } Details`}
        />

        <SingleLine>
          Exclusion Remarks: {data?.claimDetails?.exclusionRemark}
        </SingleLine>
        <SingleLine>
          Member Fraud Status: {data?.claimDetails?.fraudStatus || "-"}
        </SingleLine>
        <SingleLine>
          Pre-Qc Observations: {caseData?.preQcObservation || "-"}
        </SingleLine>
        <ThreeSectionView
          data={contractDetailsData}
          topic="Contract Details:"
        />
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

        <FraudIndicatorTable
          indicatorsList={data?.fraudIndicators?.indicatorsList || []}
        />

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
