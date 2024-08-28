import React from "react";
import { IMiscellaneousVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: IMiscellaneousVerification;
};

const MiscellaneousVerification = ({ values }: PropTypes) => {
  const data = [
    {
      key: "Any Market Or Industry Feedback",
      value: values?.anyMarketOrIndustryFeedback || "-",
    },
    {
      key: "Verification Summary",
      value: values?.verificationSummary || "-",
    },
  ];

  return <ThreeSectionView data={data} topic="Miscellaneous Verification" />;
};

export default MiscellaneousVerification;
