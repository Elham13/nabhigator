import React from "react";
import ThreeSectionView from "../ThreeSectionView";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";
import dayjs from "dayjs";

type PropTypes = {
  data: IDashboardData | null;
  invType?: "Internal" | "External";
};

const ContractDetails = ({ data, invType }: PropTypes) => {
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
      value: data?.contractDetails?.mbrRegDate
        ? dayjs(data?.contractDetails?.mbrRegDate).format("DD-MMM-YYYY")
        : "-",
    },
    {
      key: "Inception Date",
      value: data?.contractDetails?.inceptionDate
        ? dayjs(data?.contractDetails?.inceptionDate).format("DD-MMM-YYYY")
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
    ...(invType !== "External"
      ? [
          {
            key: "Sourcing",
            value: data?.claimDetails?.claimTrigger,
          },
        ]
      : []),
    {
      key: "Agent Name",
      value: data?.contractDetails?.agentName,
    },
    ...(invType !== "External"
      ? [
          {
            key: "Agent Code",
            value: data?.contractDetails?.agentCode,
          },
          {
            key: "Branch Location",
            value: data?.contractDetails?.branchLocation,
          },
        ]
      : []),
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
  return (
    <ThreeSectionView data={contractDetailsData} topic="Contract Details:" />
  );
};

export default ContractDetails;
