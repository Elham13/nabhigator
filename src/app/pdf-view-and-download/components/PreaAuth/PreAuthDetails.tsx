import React from "react";
import ThreeSectionView from "../ThreeSectionView";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";
import { convertToIndianFormat } from "@/lib/helpers";
import dayjs from "dayjs";

type PropTypes = {
  data: IDashboardData | null;
  invType?: "Internal" | "External";
};

const PreAuthDetails = ({ data, invType }: PropTypes) => {
  const preAuthDetailsData = [
    ...(invType !== "External"
      ? [
          {
            key: "Referral Type",
            value: data?.claimType,
          },
        ]
      : []),
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
  return (
    <ThreeSectionView data={preAuthDetailsData} topic="Pre-Auth Details" />
  );
};

export default PreAuthDetails;
