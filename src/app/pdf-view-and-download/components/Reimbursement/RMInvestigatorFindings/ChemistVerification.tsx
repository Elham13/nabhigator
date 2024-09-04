import React from "react";
import { IChemistVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: IChemistVerification;
};
const ChemistVerification = ({ values }: PropTypes) => {
  const chemists =
    values?.chemists && values?.chemists?.length > 0
      ? values?.chemists?.flatMap((chemist, ind) => [
          {
            title: `Chemist ${ind + 1}`,
            key: "Name of Chemist",
            value: chemist?.name || "-",
            shouldWrap: true,
          },
          { key: "Address", value: chemist?.address || "-" },
          { key: "City", value: chemist?.city || "-" },
          { key: "State", value: chemist?.state || "-" },
          { key: "Bills Verified?", value: chemist?.billsVerified || "-" },
        ])
      : [];

  const data = [
    ...chemists,
    {
      key: "Verification Summary",
      value: values?.verificationSummary || "-",
      isLongText: true,
    },
  ];

  return <ThreeSectionView data={data} topic="Chemist Verification" />;
};

export default ChemistVerification;
