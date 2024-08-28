import React from "react";
import { IRandomVicinityVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: IRandomVicinityVerification;
};

const RandomVicinityVerification = ({ values }: PropTypes) => {
  const data = [
    { key: "Verification Summary", value: values?.verificationSummary || "-" },
  ];
  return (
    <ThreeSectionView
      data={data}
      topic="Random Vicinity Hospital/Lab/Doctor/Chemist Verification"
    />
  );
};

export default RandomVicinityVerification;
