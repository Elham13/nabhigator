import React, { Fragment } from "react";
import { IAHCVerificationPart } from "@/lib/utils/types/rmDataTypes";
import KeyValueView from "../../KeyValueView";

type PropTypes = {
  values: IAHCVerificationPart;
};
const AHCVerificationPart = ({ values }: PropTypes) => {
  const ahcData = [{ key: "", value: "" }];

  return (
    <>
      <KeyValueView left="Lab Verified" right={values?.labVerified || "-"} />
      {values?.labVerified === "Yes" && values?.labs && values?.labs?.length > 0
        ? values?.labs?.map((lab, ind) => (
            <Fragment key={ind}>
              <KeyValueView left="Name of the lab" right={lab?.name || "-"} />
              <KeyValueView left="Address" right={lab?.address || "-"} />
              <KeyValueView left="City" right={lab?.city || "-"} />
              <KeyValueView
                left="QR Code Available on bill?"
                right={lab?.qrCodeAvailableOnBill || "-"}
              />
              {lab?.qrCodeAvailableOnBill === "Yes" ? (
                <>
                  <KeyValueView
                    left="Scan Result"
                    right={lab?.codeScanResult || "-"}
                  />
                  <KeyValueView
                    left="Bills & reports verified?"
                    right={lab?.billsVerified || "-"}
                  />

                  {lab?.billsVerified === "No" ? (
                    <KeyValueView
                      left="Reason for bill not verified"
                      right={lab?.reasonOfBillsNotVerified || "-"}
                    />
                  ) : lab?.billsVerified === "Yes" ? (
                    <Fragment>
                      <KeyValueView
                        left="Discrepancy Status"
                        right={lab?.discrepancyStatus || "-"}
                      />
                      {lab?.discrepancyStatus === "Discrepant" &&
                      lab?.codeScanResult === "Scan- discrepant bill" ? (
                        <Fragment>
                          <KeyValueView
                            left="Bill Verification Result"
                            right={
                              lab?.billVerificationResult &&
                              lab?.billVerificationResult?.length > 0
                                ? lab?.billVerificationResult?.join(", ")
                                : "-"
                            }
                          />

                          {lab?.billVerificationResult?.includes("Others") ? (
                            <KeyValueView
                              left="Remark"
                              right={lab?.billVerificationResultRemark || "-"}
                            />
                          ) : null}

                          {!!lab?.billVerificationResult &&
                          lab?.billVerificationResult?.length > 0 ? (
                            <Fragment>
                              <KeyValueView
                                left="Brief Summary of Discrepancy"
                                right={lab?.briefSummaryOfDiscrepancy || "-"}
                              />
                              <KeyValueView
                                left="Observation"
                                right={lab?.observation || "-"}
                              />
                            </Fragment>
                          ) : null}
                        </Fragment>
                      ) : null}
                    </Fragment>
                  ) : null}
                </>
              ) : null}
            </Fragment>
          ))
        : null}
      <KeyValueView
        left="Final Observation"
        right={values?.finalObservation || "-"}
      />
    </>
  );
};

export default AHCVerificationPart;
