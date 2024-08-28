import React from "react";
import { IAHCVerificationPart } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: IAHCVerificationPart;
};
const AHCVerificationPart = ({ values }: PropTypes) => {
  const labs =
    values?.labVerified === "Yes" && values?.labs && values?.labs?.length > 0
      ? values?.labs?.flatMap((lab, ind) => [
          {
            title: `${ind + 1}`,
            key: "Name of the lab",
            value: lab?.name || "-",
          },
          { key: "Address", value: lab?.address || "-" },
          { key: "City", value: lab?.city || "-" },
          {
            key: "QR Code Available on bill?",
            value: lab?.qrCodeAvailableOnBill || "-",
          },
          ...(lab?.qrCodeAvailableOnBill === "Yes"
            ? [
                {
                  key: "Scan Result",
                  value: lab?.codeScanResult || "-",
                },
                {
                  key: "Bills & reports verified?",
                  value: lab?.billsVerified || "-",
                },
                ...(lab?.billsVerified === "No"
                  ? [
                      {
                        key: "Reason for bill not verified",
                        value: lab?.reasonOfBillsNotVerified || "-",
                      },
                    ]
                  : lab?.billsVerified === "Yes"
                  ? [
                      {
                        key: "Discrepancy Status",
                        value: lab?.discrepancyStatus || "-",
                      },
                      ...(lab?.discrepancyStatus === "Discrepant" &&
                      lab?.codeScanResult === "Scan- discrepant bill"
                        ? [
                            {
                              key: "Bill Verification Result",
                              value:
                                lab?.billVerificationResult &&
                                lab?.billVerificationResult?.length > 0
                                  ? lab?.billVerificationResult?.join(", ")
                                  : "-",
                            },
                            ...(lab?.billVerificationResult?.includes("Others")
                              ? [
                                  {
                                    key: "Remark",
                                    value:
                                      lab?.billVerificationResultRemark || "-",
                                  },
                                ]
                              : []),
                            ...(!!lab?.billVerificationResult &&
                            lab?.billVerificationResult?.length > 0
                              ? [
                                  {
                                    key: "Brief Summary of Discrepancy",
                                    value:
                                      lab?.briefSummaryOfDiscrepancy || "-",
                                  },
                                  {
                                    key: "Observation",
                                    value: lab?.observation || "-",
                                  },
                                ]
                              : []),
                          ]
                        : []),
                    ]
                  : []),
              ]
            : []),
          { key: "Final Observation", value: lab?.finalObservation || "-" },
        ])
      : [];

  const data = [
    { key: "Lab Verified", value: values?.labVerified || "-" },
    ...labs,
  ];
  return <ThreeSectionView data={data} topic="AHC Verification" />;
};

export default AHCVerificationPart;
