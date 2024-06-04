import React, { Fragment } from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import { IPrePostVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IPrePostVerification;
};

const PrePostTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          Pre Post Verification
        </Title>
      </GridCol>

      <GridCol span={{ sm: 12 }}>
        <Title order={5} c="orange">
          Pharmacy Bill Verification Summary
        </Title>
      </GridCol>

      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Pharmacy Bill Verified?"
          value={values?.pharmacyBillVerified || "-"}
        />
      </GridCol>

      {values?.pharmacyBillVerified === "Yes" &&
      values?.pharmacies &&
      values?.pharmacies?.length > 0
        ? values?.pharmacies?.map((el, ind) => (
            <Fragment key={el?._id}>
              <GridCol span={{ sm: 12 }}>
                <Title order={5} c="orange">
                  Pharmacy {ind + 1}
                </Title>
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of Pharmacy"
                  value={el?.name || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer label="Address" value={el?.address || "-"} />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer label="City" value={el?.city || "-"} />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="QR Code Available On Bill?"
                  value={el?.qrCodeAvailableOnBill || "-"}
                />
              </GridCol>

              {el?.qrCodeAvailableOnBill === "Yes" ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Scan Result"
                    value={el?.codeScanResult || "-"}
                  />
                </GridCol>
              ) : null}

              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Bills Verified"
                  value={el?.billsVerified || "-"}
                />
              </GridCol>

              {el?.billsVerified === "No" ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Reason for bill not verified"
                    value={el?.reasonOfBillsNotVerified || "-"}
                  />
                </GridCol>
              ) : el?.billsVerified === "Yes" ? (
                <>
                  <GridCol span={{ sm: 12, md: 6 }}>
                    <KeyValueContainer
                      label="Discrepancy Status"
                      value={el?.discrepancyStatus || "-"}
                    />
                  </GridCol>
                  {el?.discrepancyStatus === "Discrepant" &&
                  el?.codeScanResult === "Scan- discrepant bill" ? (
                    <>
                      <GridCol span={{ sm: 12, md: 6 }}>
                        <KeyValueContainer
                          label="Bill Verification Result"
                          value={el?.billVerificationResult || "-"}
                        />
                      </GridCol>
                      {el?.billVerificationResult === "Others" ? (
                        <GridCol span={{ sm: 12, md: 6 }}>
                          <KeyValueContainer
                            label="Remark"
                            value={el?.billVerificationResultRemark || "-"}
                          />
                        </GridCol>
                      ) : null}

                      <GridCol span={{ sm: 12, md: 6 }}>
                        <KeyValueContainer
                          label="Brief Summary of Discrepancy"
                          value={el?.briefSummaryOfDiscrepancy || "-"}
                        />
                      </GridCol>
                      <GridCol span={{ sm: 12, md: 6 }}>
                        <KeyValueContainer
                          label="Observation"
                          value={el?.observation || "-"}
                        />
                      </GridCol>
                    </>
                  ) : null}
                </>
              ) : null}
            </Fragment>
          ))
        : null}

      <GridCol span={{ sm: 12 }}>
        <Title order={5} c="orange">
          Lab Verification Summary
        </Title>
      </GridCol>

      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Lab Verified?"
          value={values?.labVerified || "-"}
        />
      </GridCol>

      {values?.labVerified === "Yes" && values?.labs && values?.labs?.length > 0
        ? values?.labs?.map((el, ind) => (
            <Fragment key={el?._id}>
              <GridCol span={{ sm: 12 }}>
                <Title order={5} c="orange">
                  Lab {ind + 1}
                </Title>
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of Lab"
                  value={el?.name || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer label="Address" value={el?.address || "-"} />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer label="City" value={el?.city || "-"} />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="QR Code Available On Bill?"
                  value={el?.qrCodeAvailableOnBill || "-"}
                />
              </GridCol>

              {el?.qrCodeAvailableOnBill === "Yes" ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Scan Result"
                    value={el?.codeScanResult || "-"}
                  />
                </GridCol>
              ) : null}

              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Bills and Reports Verified"
                  value={el?.billsVerified || "-"}
                />
              </GridCol>

              {el?.billsVerified === "No" ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Reason for bill not verified"
                    value={el?.reasonOfBillsNotVerified || "-"}
                  />
                </GridCol>
              ) : el?.billsVerified === "Yes" ? (
                <>
                  <GridCol span={{ sm: 12, md: 6 }}>
                    <KeyValueContainer
                      label="Discrepancy Status"
                      value={el?.discrepancyStatus || "-"}
                    />
                  </GridCol>
                  {el?.discrepancyStatus === "Discrepant" &&
                  el?.codeScanResult === "Scan- discrepant bill" ? (
                    <>
                      <GridCol span={{ sm: 12, md: 6 }}>
                        <KeyValueContainer
                          label="Bill Verification Result"
                          value={
                            el?.billVerificationResult &&
                            el?.billVerificationResult?.length > 0
                              ? el?.billVerificationResult?.join(", ")
                              : "-"
                          }
                        />
                      </GridCol>
                      {el?.billVerificationResult?.includes("Others") ? (
                        <GridCol span={{ sm: 12, md: 6 }}>
                          <KeyValueContainer
                            label="Remark"
                            value={el?.billVerificationResultRemark || "-"}
                          />
                        </GridCol>
                      ) : null}

                      <GridCol span={{ sm: 12, md: 6 }}>
                        <KeyValueContainer
                          label="Brief Summary of Discrepancy"
                          value={el?.briefSummaryOfDiscrepancy || "-"}
                        />
                      </GridCol>
                      <GridCol span={{ sm: 12, md: 6 }}>
                        <KeyValueContainer
                          label="Observation"
                          value={el?.observation || "-"}
                        />
                      </GridCol>
                      <GridCol span={{ sm: 12, md: 6 }}>
                        <KeyValueContainer
                          label="Final Observation"
                          value={el?.finalObservation || "-"}
                        />
                      </GridCol>
                    </>
                  ) : null}
                </>
              ) : null}
            </Fragment>
          ))
        : null}

      <GridCol span={{ sm: 12 }}>
        <Title order={5} c="orange">
          Other bill Verification Summary
        </Title>
      </GridCol>

      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Other bills Verified?"
          value={values?.otherBillVerified || "-"}
        />
      </GridCol>

      {values?.otherBillVerified === "Yes" &&
      values?.otherBills &&
      values?.otherBills?.length > 0
        ? values?.otherBills?.map((el) => (
            <Fragment key={el?._id}>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of Entity"
                  value={el?.nameOfEntity || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Type of Entity"
                  value={el?.typeOfEntity || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Bill & Reports Verified?"
                  value={el?.billsAndReportsVerified || "-"}
                />
              </GridCol>

              {el?.billsAndReportsVerified === "No" ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Reason why bills not verified"
                    value={el?.billsAndReportsVerified || "-"}
                  />
                </GridCol>
              ) : el?.billsAndReportsVerified === "Yes" ? (
                <>
                  <GridCol span={{ sm: 12, md: 6 }}>
                    <KeyValueContainer
                      label="Discrepancy Status"
                      value={el?.discrepancyStatus || "-"}
                    />
                  </GridCol>
                  {el?.discrepancyStatus === "Discrepant" ? (
                    <GridCol span={{ sm: 12, md: 6 }}>
                      <KeyValueContainer
                        label="Bill Verification Result"
                        value={
                          el?.billVerificationResult &&
                          el?.billVerificationResult?.length > 0
                            ? el?.billVerificationResult?.join(", ")
                            : "-"
                        }
                      />
                    </GridCol>
                  ) : null}

                  {el?.billVerificationResult?.includes("Others") ? (
                    <GridCol span={{ sm: 12, md: 6 }}>
                      <KeyValueContainer
                        label="Remarks"
                        value={el?.billVerificationResultRemark || "-"}
                      />
                    </GridCol>
                  ) : null}

                  <GridCol span={{ sm: 12, md: 6 }}>
                    <KeyValueContainer
                      label="Brief Summary of Discrepancy"
                      value={el?.briefSummaryOfDiscrepancy || "-"}
                    />
                  </GridCol>
                  <GridCol span={{ sm: 12, md: 6 }}>
                    <KeyValueContainer
                      label="Observation"
                      value={el?.observation || "-"}
                    />
                  </GridCol>
                </>
              ) : null}
            </Fragment>
          ))
        : null}

      <GridCol span={{ sm: 12 }}>
        <Title order={5} c="orange">
          Consultation Paper and Doctor Verification Summary
        </Title>
      </GridCol>

      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Consultation Papers and Doctor Verified?"
          value={values?.consultationPaperAndDoctorVerified || "-"}
        />
      </GridCol>

      {values?.consultationPaperAndDoctorVerified === "Yes" ? (
        <Fragment>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Doctor Name"
              value={
                values?.consultationPaperAndDoctorDetail?.doctorName || "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Consultation/Followup confirmation"
              value={
                values?.consultationPaperAndDoctorDetail
                  ?.consultationOrFollowUpConfirmation || "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Whether Consultations/ Follow-up is related to Diagnosis/Procedure for which hospitalization was necessitated"
              value={
                values?.consultationPaperAndDoctorDetail
                  ?.consultationIsRelatedToDiagnosis || "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Observation"
              value={
                values?.consultationPaperAndDoctorDetail?.observation || "-"
              }
            />
          </GridCol>
        </Fragment>
      ) : null}

      <GridCol span={{ sm: 12 }}>
        <Title order={5} c="orange">
          Main Claim Verification Summary
        </Title>
      </GridCol>

      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Main Claim Verified?"
          value={values?.mainClaimIsVerified || "-"}
        />
      </GridCol>

      {values?.mainClaimIsVerified === "Yes" ? (
        <>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Discrepancy Status"
              value={values?.mainClaimDetail?.discrepancyStatus || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Observation"
              value={values?.mainClaimDetail?.observation || "-"}
            />
          </GridCol>
        </>
      ) : null}

      <GridCol span={{ sm: 12 }}>
        <Title order={5} c="orange">
          Insured Verification Summary
        </Title>
      </GridCol>

      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Insured Verified?"
          value={values?.insuredIsVerified || "-"}
        />
      </GridCol>

      {values?.insuredIsVerified === "Yes" ? (
        <>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Discrepancy Status"
              value={
                values?.insuredVerificationDetail?.discrepancyStatus || "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Observation"
              value={values?.insuredVerificationDetail?.observation || "-"}
            />
          </GridCol>
        </>
      ) : null}

      <GridCol span={{ sm: 12 }}>
        <KeyValueContainer
          label="Final Observation"
          value={values?.finalObservation || "-"}
        />
      </GridCol>
    </Grid>
  );
};

export default PrePostTasks;
