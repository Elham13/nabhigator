import React, { Fragment } from "react";
import ThreeSectionView from "../ThreeSectionView";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";
import SingleLine from "../SingleLine";
import dayjs from "dayjs";

type PropTypes = {
  data: IDashboardData | null;
};
const ClaimDetails = ({ data }: PropTypes) => {
  const insuredDetailsData = [
    { key: "Insured Name", value: data?.insuredDetails?.insuredName || "-" },
    { key: "Gender", value: data?.insuredDetails?.gender || "-" },
    { key: "Age", value: data?.insuredDetails?.age || "-" },
    { key: "Address", value: data?.insuredDetails?.address || "-" },
    { key: "City", value: data?.insuredDetails?.city || "-" },
    { key: "State", value: data?.insuredDetails?.state || "-" },
    { key: "Contact No", value: data?.insuredDetails?.contactNo || "-" },
    { key: "Email ID", value: data?.insuredDetails?.emailId || "-" },
    { key: "Member Type", value: data?.insuredDetails?.memberType || "-" },
    { key: "Member ID", value: data?.insuredDetails?.memberId || "-" },
    {
      key: "Pivotal Customer ID",
      value: data?.insuredDetails?.pivotalCustomerId || "-",
    },
    { key: "Height", value: data?.insuredDetails?.height || "-" },
    { key: "Weight", value: data?.insuredDetails?.weight || "-" },
    { key: "Occupation", value: data?.insuredDetails?.occupation || "-" },
    {
      key: "Member Fraud Status",
      value: data?.claimDetails?.fraudStatus || "-",
    },
  ];

  const claimDetailsData = [
    { key: "Referred From", value: data?.contractDetails?.sourcing || "-" },
    { key: "Referral Type", value: data?.claimDetails?.claimTrigger || "-" },
    { key: "Claim Number", value: data?.claimDetails?.claimNo || "-" },
    { key: "Submitted By", value: data?.claimDetails?.submittedBy || "-" },
    {
      key: "Received Date",
      value: data?.claimDetails?.receivedAt
        ? dayjs(data?.claimDetails?.receivedAt).format("DD-MMM-YYYY")
        : "-",
    },
    { key: "Pay To", value: data?.claimDetails?.payTo || "-" },
    { key: "Claim Type", value: data?.claimDetails?.claimType || "-" },
    {
      key: "Pre-Post Indicator",
      value: data?.claimDetails?.prePostIndicator || "-",
    },
    { key: "Main Claim No", value: data?.claimDetails?.mainClaim || "-" },
    {
      key: "Hospitalization Type",
      value: data?.claimDetails?.hospitalizationType || "-",
    },
    { key: "Diagnosis", value: data?.claimDetails?.diagnosis || "-" },
    { key: "ICD Code", value: data?.claimDetails?.icdCode || "-" },
    {
      key: "Line of Treatment",
      value: data?.claimDetails?.lineOfTreatment || "-",
    },
    { key: "Billed amount", value: data?.claimDetails?.billedAmount || "-" },
    {
      key: "Exclusion Remarks",
      value: data?.claimDetails?.exclusionRemark || "-",
    },
  ];

  const hospitalizationDetailsData = [
    { key: "Provider Number", value: data?.hospitalDetails?.providerNo || "-" },
    { key: "Provider Name", value: data?.hospitalDetails?.providerName || "-" },
    { key: "Provider Type", value: data?.hospitalDetails?.providerType || "-" },
    {
      key: "Provider Address",
      value: data?.hospitalDetails?.providerAddress || "-",
    },
    { key: "Provider City", value: data?.hospitalDetails?.providerCity || "-" },
    {
      key: "Provider State",
      value: data?.hospitalDetails?.providerState || "-",
    },
    { key: "Provider PinCode", value: data?.hospitalDetails?.pinCode || "-" },
    {
      key: "Treating Doctor Name",
      value: data?.hospitalizationDetails?.treatingDoctorName || "-",
    },
    {
      key: "Treating Doctor Registration No",
      value: data?.hospitalizationDetails?.treatingDoctorRegNo || "-",
    },
    {
      key: "Admission Date",
      value: data?.hospitalizationDetails?.dateOfAdmission
        ? dayjs(data?.hospitalizationDetails?.dateOfAdmission).format(
            "DD-MMM-YYYY"
          )
        : "-",
    },
    {
      key: "Discharge Date",
      value: data?.hospitalizationDetails?.dateOfDischarge
        ? dayjs(data?.hospitalizationDetails?.dateOfDischarge).format(
            "DD-MMM-YYYY"
          )
        : "-",
    },
    { key: "LOS", value: data?.hospitalizationDetails?.LOS || "-" },
  ];
  return (
    <Fragment>
      <SingleLine>Claim Details:</SingleLine>
      <ThreeSectionView data={insuredDetailsData} topic="Insured Details" />
      <ThreeSectionView data={claimDetailsData} topic="Claim Details" />
      <ThreeSectionView
        data={hospitalizationDetailsData}
        topic="Hospital & Hospitalization Details"
      />
    </Fragment>
  );
};

export default ClaimDetails;
