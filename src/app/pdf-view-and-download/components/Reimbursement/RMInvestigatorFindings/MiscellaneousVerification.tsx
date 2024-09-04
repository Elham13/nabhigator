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
      isLongText: true,
    },
    {
      key: "Verification Summary",
      value: values?.verificationSummary || "-",
      isLongText: true,
    },
  ];

  return <ThreeSectionView data={data} topic="Miscellaneous Verification" />;
};

export default MiscellaneousVerification;
