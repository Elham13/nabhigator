import React from "react";
import { IOPDVerificationPart } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: IOPDVerificationPart;
};

const OPDVerificationPart = ({ values }: PropTypes) => {
  const data = [
    {
      key: "Final Observation",
      value: values?.finalObservation || "-",
      isLongText: true,
    },
  ];
  return <ThreeSectionView data={data} topic="OPD Verification Part" />;
};

export default OPDVerificationPart;
