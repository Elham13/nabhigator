import React from "react";
import { IVicinityVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: IVicinityVerification;
};

const VicinityVerification = ({ values }: PropTypes) => {
  const data = [
    { key: "Status", value: values?.status || "-" },
    {
      key: "Verification Summary",
      value: values?.verificationSummary || "-",
      isLongText: true,
    },
  ];
  return <ThreeSectionView data={data} topic="Vicinity Verification" />;
};

export default VicinityVerification;
