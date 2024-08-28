import React from "react";
import { IPrePostVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: IPrePostVerification;
};

const PrePostVerification = ({ values }: PropTypes) => {
  const pharmacies =
    values?.pharmacies && values?.pharmacies?.length > 0
      ? values?.pharmacies?.flatMap((pharmacy, ind) => [
          {
            title: `Pharmacy ${ind + 1}`,
            key: "Name of Pharmacy",
            value: pharmacy?.name || "-",
          },
          {
            key: "Address",
            value: pharmacy?.address || "-",
          },
          {
            key: "City",
            value: pharmacy?.city || "-",
          },
          {
            key: "QR Code Available On Bill?",
            value: pharmacy?.qrCodeAvailableOnBill || "-",
          },
          ...(pharmacy?.qrCodeAvailableOnBill === "Yes"
            ? [{ key: "Scan Result", value: pharmacy?.codeScanResult || "-" }]
            : []),
          {
            key: "Bills Verified?",
            value: pharmacy?.billsVerified || "-",
          },
          ...(pharmacy?.billsVerified === "No"
            ? [
                {
                  key: "Reason for bill not verified",
                  value: pharmacy?.reasonOfBillsNotVerified || "-",
                },
              ]
            : pharmacy?.billsVerified === "Yes"
            ? [
                {
                  key: "Discrepancy Status",
                  value: pharmacy?.discrepancyStatus || "-",
                },
                ...(pharmacy?.discrepancyStatus === "Discrepant" &&
                pharmacy?.codeScanResult === "Scan- discrepant bill"
                  ? [
                      {
                        key: "Bill Verification Result",
                        value: pharmacy?.billVerificationResult || "-",
                      },
                      ...(pharmacy?.billVerificationResult === "Others"
                        ? [
                            {
                              key: "Remark",
                              value:
                                pharmacy?.billVerificationResultRemark || "-",
                            },
                          ]
                        : []),
                      ...(!!pharmacy?.billVerificationResult
                        ? [
                            {
                              key: "Brief Summary of Discrepancy",
                              value: pharmacy?.briefSummaryOfDiscrepancy || "-",
                            },
                            {
                              key: "Observation",
                              value: pharmacy?.observation || "-",
                            },
                          ]
                        : []),
                    ]
                  : []),
              ]
            : []),
        ])
      : [];
  const data = [
    {
      title: "Pharmacy Bill Verification Summary",
      key: "Pharmacy Bill Verified?",
      value: values?.pharmacyBillVerified || "-",
    },
    ...(values?.pharmacyBillVerified === "Yes"
      ? [
          {
            key: "Pharmacy Bill Verified?",
            value: values?.pharmacyBillVerified || "-",
          },
        ]
      : []),
  ];
  return <ThreeSectionView data={data} topic="Pre-Post Verification" />;
};

export default PrePostVerification;
