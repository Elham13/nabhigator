import React, { Fragment } from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import { IAHCVerificationPart } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IAHCVerificationPart;
};

const AHCTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          AHC Verification Part
        </Title>
      </GridCol>

      <GridCol span={{ sm: 12 }}>
        <KeyValueContainer
          label="Lab Verified?"
          value={values?.labVerified || "-"}
        />
      </GridCol>

      {values?.labVerified === "Yes" && values?.labs && values?.labs?.length > 0
        ? values?.labs?.map((lab, ind) => (
            <Fragment key={lab?._id}>
              <GridCol span={{ sm: 12 }}>
                <Title order={5} c="orange">
                  Lab {ind + 1}
                </Title>
              </GridCol>

              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of Lab"
                  value={lab?.name || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Address"
                  value={lab?.address || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer label="City" value={lab?.city || "-"} />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="QR Code Available On Bill?"
                  value={lab?.qrCodeAvailableOnBill || "-"}
                />
              </GridCol>

              {lab?.qrCodeAvailableOnBill === "Yes" ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Scan Result"
                    value={lab?.codeScanResult || "-"}
                  />
                </GridCol>
              ) : null}
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Bills and Reports Verified"
                  value={lab?.billsVerified || "-"}
                />
              </GridCol>

              {lab?.billsVerified === "No" ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Reason for bill not verified"
                    value={lab?.reasonOfBillsNotVerified || "-"}
                  />
                </GridCol>
              ) : lab?.billsVerified === "No" ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Discrepancy Status"
                    value={lab?.discrepancyStatus || "-"}
                  />
                </GridCol>
              ) : null}
              <GridCol span={{ sm: 12 }}>
                <KeyValueContainer
                  wrapLabel
                  label="Bill Verification Result"
                  value={
                    lab?.billVerificationResult &&
                    lab?.billVerificationResult?.length > 0
                      ? lab?.billVerificationResult?.join(", ")
                      : "-"
                  }
                />
              </GridCol>

              {lab?.billVerificationResult?.includes("Others") ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Remark"
                    value={lab?.billVerificationResultRemark || "-"}
                  />
                </GridCol>
              ) : null}

              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Brief Summary of Discrepancy"
                  value={lab?.briefSummaryOfDiscrepancy || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Observation"
                  value={lab?.observation || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Final Observation"
                  value={lab?.finalObservation || "-"}
                />
              </GridCol>
            </Fragment>
          ))
        : null}

      <GridCol span={{ sm: 12 }}>
        <KeyValueContainer
          label="Final Observation"
          value={values?.finalObservation || "-"}
        />
      </GridCol>
    </Grid>
  );
};

export default AHCTasks;
