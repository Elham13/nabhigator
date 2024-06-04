import React, { Fragment } from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import dayjs from "dayjs";
import { IHospitalVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IHospitalVerification;
};

const HospitalTasks = ({ values }: PropTypes) => {
  return (
    <>
      <Title order={3} c="cyan" my={10}>
        Hospital Verification
      </Title>
      <Grid>
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Date of visit to hospital"
            value={
              values?.dateOfVisitToHospital
                ? dayjs(values?.dateOfVisitToHospital).format("DD-MMM-YYYY")
                : "-"
            }
          />
        </GridCol>
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Time of visit to hospital"
            value={
              values?.timeOfVisitToHospital
                ? dayjs(values?.timeOfVisitToHospital).format("hh:mm:ss A")
                : "-"
            }
          />
        </GridCol>
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Provider Co-operation"
            value={values?.providerCooperation || "-"}
          />
        </GridCol>
        {values?.providerCooperation === "No" ? (
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Reason for provider not cooperating"
              value={values?.reasonOfProviderNotCooperating || "-"}
            />
          </GridCol>
        ) : null}

        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Hospital Infrastructure"
            value={values?.hospitalInfrastructure?.value || "-"}
          />
        </GridCol>

        {["Poor Setup", "Primary Care"].includes(
          values?.hospitalInfrastructure?.value
        ) ? (
          <>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="No of beds"
                value={values?.hospitalInfrastructure?.noOfBeds || 0}
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="OT"
                value={values?.hospitalInfrastructure?.OT || "-"}
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="ICU"
                value={values?.hospitalInfrastructure?.ICU || "-"}
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Specialty"
                value={values?.hospitalInfrastructure?.specialty || "-"}
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Round the clock RMO"
                value={values?.hospitalInfrastructure?.roundOfClockRMO || "-"}
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Pharmacy"
                value={values?.hospitalInfrastructure?.pharmacy || "-"}
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Pathology"
                value={values?.hospitalInfrastructure?.pathology || "-"}
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Hospital Operations"
                value={
                  values?.hospitalInfrastructure?.hospitalOperations || "-"
                }
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Patient Lifts Available?"
                value={
                  values?.hospitalInfrastructure?.patientLifts?.available || "-"
                }
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Is Patient Lifts Operational?"
                value={
                  values?.hospitalInfrastructure?.patientLifts?.operational ||
                  "-"
                }
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Hospital Registration"
                value={
                  values?.hospitalInfrastructure?.hospitalRegistration
                    ?.registered || "-"
                }
              />
            </GridCol>

            {values?.hospitalInfrastructure?.hospitalRegistration
              ?.registered === "Yes" ? (
              <>
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Registered From"
                    value={
                      values?.hospitalInfrastructure?.hospitalRegistration
                        ?.registeredFrom
                        ? dayjs(
                            values?.hospitalInfrastructure?.hospitalRegistration
                              ?.registeredFrom
                          ).format("DD-MMM-YYYY")
                        : "-"
                    }
                  />
                </GridCol>
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Registered To"
                    value={
                      values?.hospitalInfrastructure?.hospitalRegistration
                        ?.registeredTo
                        ? dayjs(
                            values?.hospitalInfrastructure?.hospitalRegistration
                              ?.registeredTo
                          ).format("DD-MMM-YYYY")
                        : "-"
                    }
                  />
                </GridCol>
              </>
            ) : null}

            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Record Keeping Available?"
                value={
                  values?.hospitalInfrastructure?.recordKeeping?.value || "-"
                }
              />
            </GridCol>

            {values?.hospitalInfrastructure?.recordKeeping?.value === "Yes" ? (
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Record Keeping Type"
                  value={
                    values?.hospitalInfrastructure?.recordKeeping?.type || "-"
                  }
                />
              </GridCol>
            ) : null}
          </>
        ) : null}

        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Remark/Observation"
            value={values?.remarks || "-"}
          />
        </GridCol>

        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="ICPs Collected?"
            value={values?.icpsCollected?.value || "-"}
          />
        </GridCol>

        {values?.icpsCollected?.value &&
        ["No", "No Records", "Not Shared"].includes(
          values?.icpsCollected?.value
        ) ? (
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="ICPs Collected Remarks"
              value={values?.icpsCollected?.remark || "-"}
            />
          </GridCol>
        ) : null}

        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Indoor Entry"
            value={values?.indoorEntry?.value || "-"}
          />
        </GridCol>

        {values?.indoorEntry?.value === "Verified" ? (
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Period of Hospitalization Matching"
              value={
                values?.indoorEntry?.periodOfHospitalizationMatching || "-"
              }
            />
          </GridCol>
        ) : null}
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Old records checked?"
            value={values?.oldRecordCheck?.value || "-"}
          />
        </GridCol>
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Remarks"
            value={values?.oldRecordCheck?.remark || "-"}
          />
        </GridCol>
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Bill Verification"
            value={values?.billVerification || "-"}
          />
        </GridCol>
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Payment Receipts"
            value={values?.paymentReceipts || "-"}
          />
        </GridCol>

        {values?.personalOrSocialHabits &&
        values?.personalOrSocialHabits?.length > 0 ? (
          <>
            <GridCol span={{ sm: 12 }}>
              <Title order={5} c="orange">
                Personal/Social Habits
              </Title>
            </GridCol>
            {values?.personalOrSocialHabits?.map((el) => (
              <Fragment key={el?._id}>
                <GridCol span={{ sm: 12 }}>
                  <KeyValueContainer label="Habit" value={el?.habit || "-"} />
                </GridCol>
                <GridCol span={{ sm: 12 }}>
                  <KeyValueContainer
                    label={`Frequency of ${el?.habit}`}
                    value={el?.frequency || "-"}
                  />
                </GridCol>
                <GridCol span={{ sm: 12 }}>
                  <KeyValueContainer
                    label={`Quantity of ${el?.habit}`}
                    value={el?.quantity || "-"}
                  />
                </GridCol>
                <GridCol span={{ sm: 12 }}>
                  <KeyValueContainer
                    label={`Duration of ${el?.habit}`}
                    value={el?.duration || "-"}
                  />
                </GridCol>
              </Fragment>
            ))}
          </>
        ) : null}

        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="PED/Non-Disclosure"
            value={values?.pedOrNonDisclosure?.value || "-"}
          />
        </GridCol>

        {values?.pedOrNonDisclosure?.ailmentDetail &&
        values?.pedOrNonDisclosure?.ailmentDetail?.length > 0 ? (
          <>
            <GridCol span={{ sm: 12 }}>
              <Title order={5} c="orange">
                Ailments
              </Title>
            </GridCol>
            {values?.pedOrNonDisclosure?.ailmentDetail?.map((el) => (
              <Fragment key={el?._id}>
                <GridCol span={{ sm: 12 }}>
                  <KeyValueContainer
                    label="Ailment"
                    value={el?.ailment || "-"}
                  />
                </GridCol>
                <GridCol span={{ sm: 12 }}>
                  <KeyValueContainer
                    label={`Diagnosis of ${el?.ailment}`}
                    value={el?.diagnosis || "-"}
                  />
                </GridCol>
                <GridCol span={{ sm: 12 }}>
                  <KeyValueContainer
                    label={`Duration of ${el?.ailment}`}
                    value={el?.duration || "-"}
                  />
                </GridCol>
                <GridCol span={{ sm: 12 }}>
                  <KeyValueContainer
                    label={`On Medication of ${el?.ailment}`}
                    value={el?.onMedication || "-"}
                  />
                </GridCol>
              </Fragment>
            ))}
          </>
        ) : null}

        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Verification Summary"
            value={values?.verificationSummary || "-"}
          />
        </GridCol>
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Discrepancies/Irregularities Observed"
            value={values?.discrepanciesOrIrregularitiesObserved || "-"}
          />
        </GridCol>
      </Grid>
    </>
  );
};

export default HospitalTasks;
