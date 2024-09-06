import React from "react";
import { IClaimVerification } from "@/lib/utils/types/rmDataTypes";
import TwoSectionView from "../../TwoSectionView";

type PropTypes = {
  values: IClaimVerification;
};

const ClaimVerification = ({ values }: PropTypes) => {
  return (
    <TwoSectionView
      topic="Claim Verification"
      data={[{ key: "Final Observation", value: values?.finalObservation }]}
    />
  );
};

export default ClaimVerification;
