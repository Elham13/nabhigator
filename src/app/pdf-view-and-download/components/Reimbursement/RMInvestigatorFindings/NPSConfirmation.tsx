import React from "react";
import { INPSVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: INPSVerification;
};

const NPSConfirmation = ({ values }: PropTypes) => {
  const insuredVisitDetails =
    values?.insuredVisit === "Done"
      ? [
          { key: "Insured Visit", value: values?.insuredVisit || "-" },
          {
            key: "Insured Visit Date",
            value: values?.insuredMobileNo || "-",
          },
        ]
      : [];
  const data = [
    {
      key: "Insured Visit",
      value: values?.insuredVisit || "-",
      ...insuredVisitDetails,
    },
  ];
  return <ThreeSectionView data={data} topic="NPS Confirmation" />;
};

export default NPSConfirmation;
