import React from "react";
import { IRMFindings } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values?: IRMFindings | null;
};

const CommonTasks = ({ values }: PropTypes) => {
  const otherRecommendations =
    values?.otherRecommendation && values?.otherRecommendation?.length > 0
      ? values?.otherRecommendation?.flatMap((el, ind) => [
          {
            title: `Other Recommendation ${ind + 1}`,
            key: "Recommendation",
            value: el?.value || "-",
          },
          {
            key: "Recommendation for",
            value:
              el?.recommendationFor?.length > 0
                ? el?.recommendationFor?.map((rf) => rf?.value)?.join(", ")
                : "-",
          },
        ])
      : [];
  const data = [
    {
      key: "Investigation Summary",
      value: values?.investigationSummary || "-",
    },
    {
      key: "Discrepancies Or Irregularities Observed",
      value: values?.discrepanciesOrIrregularitiesObserved || "-",
    },
    {
      key: "Recommendation",
      value: values?.recommendation?.value || "-",
    },
    ...(values?.recommendation?.value === "Repudiation"
      ? [
          {
            key: "Ground of Repudiation",
            value:
              values?.recommendation?.groundOfRepudiation &&
              values?.recommendation?.groundOfRepudiation?.length > 0
                ? values?.recommendation?.groundOfRepudiation?.join(", ")
                : "-",
          },
        ]
      : []),
    ...(values?.recommendation?.groundOfRepudiation &&
    values?.recommendation?.groundOfRepudiation?.length > 0 &&
    values?.recommendation?.groundOfRepudiation?.includes("Non Co-Operation")
      ? [
          {
            key: "Non Cooperation of",
            value: values?.recommendation?.nonCooperationOf || "-",
          },
        ]
      : []),
    {
      key: "Has Evidence?",
      value: values?.recommendation?.hasEvidence || "-",
    },
    ...(values?.recommendation?.hasEvidence === "No"
      ? [
          {
            key: "Reason of evidence not available?",
            value: values?.recommendation?.reasonOfEvidenceNotAvailable || "-",
          },
        ]
      : []),
    ...(values?.recommendation?.groundOfRepudiation &&
    values?.recommendation?.groundOfRepudiation?.length > 0 &&
    values?.recommendation?.groundOfRepudiation?.includes("Inconclusive")
      ? [
          {
            key: "Inconclusive Remark",
            value: values?.recommendation?.inconclusiveRemark || "-",
          },
        ]
      : []),
    ...otherRecommendations,
  ];
  return <ThreeSectionView data={data} topic="Common Tasks" />;
};

export default CommonTasks;
