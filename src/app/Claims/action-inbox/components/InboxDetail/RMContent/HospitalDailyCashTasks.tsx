import React, { Fragment } from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import dayjs from "dayjs";
import { IHospitalDailyCashPart } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IHospitalDailyCashPart;
};

const HospitalDailyCashTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          Hospital Daily Cash Part
        </Title>
      </GridCol>

      <GridCol span={{ sm: 12 }}>
        <Title order={5} c="orange">
          Insured Visit Summary
        </Title>
      </GridCol>

      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Insured Visited?"
          value={values?.insuredVisit || "-"}
        />
      </GridCol>

      {values?.insuredVisit === "Yes" ? (
        <Fragment>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Insured Cooperating?"
              value={values?.insuredCooperation || "-"}
            />
          </GridCol>

          {values?.insuredCooperation === "No" ? (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Remarks on insured not cooperating"
                value={values?.insuredNotCooperatingReason || "-"}
              />
            </GridCol>
          ) : values?.insuredCooperation === "Yes" ? (
            <Fragment>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Date of visit to insured"
                  value={
                    values?.insuredCooperationDetail?.dateOfVisitToInsured
                      ? dayjs(
                          values?.insuredCooperationDetail?.dateOfVisitToInsured
                        ).format("DD-MMM-YYYY")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Time of visit to insured"
                  value={
                    values?.insuredCooperationDetail?.timeOfVisitToInsured
                      ? dayjs(
                          values?.insuredCooperationDetail?.timeOfVisitToInsured
                        ).format("hh:mm:ss A")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of insured (System Fetch)"
                  value={
                    values?.insuredCooperationDetail?.nameOfInsuredSystem || "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of insured (User Feed)"
                  value={
                    values?.insuredCooperationDetail?.nameOfInsuredUser || "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Date of Admission (System Fetch)"
                  value={
                    values?.insuredCooperationDetail?.dateOfAdmissionSystem
                      ? dayjs(
                          values?.insuredCooperationDetail
                            ?.dateOfAdmissionSystem
                        ).format("DD-MMM-YYYY")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Date of Admission (User Feed)"
                  value={
                    values?.insuredCooperationDetail?.dateOfAdmissionUser
                      ? dayjs(
                          values?.insuredCooperationDetail?.dateOfAdmissionUser
                        ).format("DD-MMM-YYYY")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Time of Discharge (System Fetch)"
                  value={
                    values?.insuredCooperationDetail?.timeOfDischargeSystem
                      ? dayjs(
                          values?.insuredCooperationDetail
                            ?.timeOfDischargeSystem
                        ).format("hh:mm:ss A")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Time of Discharge (System Fetch)"
                  value={
                    values?.insuredCooperationDetail?.timeOfDischargeUser
                      ? dayjs(
                          values?.insuredCooperationDetail?.timeOfDischargeUser
                        ).format("hh:mm:ss A")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12 }}>
                <KeyValueContainer
                  wrapLabel
                  label="Number of days and hours of Hospitalization (System Fetch)"
                  value={
                    values?.insuredCooperationDetail
                      ?.durationOfHospitalizationSystem || "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12 }}>
                <KeyValueContainer
                  wrapLabel
                  label="Number of days and hours of Hospitalization (User Feed)"
                  value={
                    values?.insuredCooperationDetail
                      ?.durationOfHospitalizationUser || "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Diagnosis"
                  value={values?.insuredCooperationDetail?.diagnosis || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Class of accommodation"
                  value={
                    values?.insuredCooperationDetail?.classOfAccommodation ||
                    "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Discrepancies Observed"
                  value={
                    values?.insuredCooperationDetail?.discrepanciesObserved ||
                    "-"
                  }
                />
              </GridCol>
            </Fragment>
          ) : null}
        </Fragment>
      ) : null}

      <GridCol span={{ sm: 12 }}>
        <Title order={5} c="orange">
          Hospital Visit Summary
        </Title>
      </GridCol>

      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Hospital Visited?"
          value={values.hospitalVisit || "-"}
        />
      </GridCol>

      {values?.hospitalVisit === "Yes" ? (
        <Fragment>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Hospital Cooperating?"
              value={values?.hospitalCooperation || "-"}
            />
          </GridCol>

          {values?.hospitalCooperation === "No" ? (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Remarks on hospital not cooperating"
                value={values?.hospitalNotCooperatingReason || "-"}
              />
            </GridCol>
          ) : values?.hospitalCooperation === "Yes" ? (
            <Fragment>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Date of visit to hospital"
                  value={
                    values?.hospitalCooperationDetail?.dateOfVisitToHospital
                      ? dayjs(
                          values?.hospitalCooperationDetail
                            ?.dateOfVisitToHospital
                        ).format("DD-MMM-YYYY")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Time of visit to hospital"
                  value={
                    values?.hospitalCooperationDetail?.timeOfVisitToHospital
                      ? dayjs(
                          values?.hospitalCooperationDetail
                            ?.timeOfVisitToHospital
                        ).format("hh:mm:ss A")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Date of Admission (System Fetch)"
                  value={
                    values?.hospitalCooperationDetail?.dateOfAdmissionSystem
                      ? dayjs(
                          values?.hospitalCooperationDetail
                            ?.dateOfAdmissionSystem
                        ).format("DD-MMM-YYYY")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Date of Admission (User Feed)"
                  value={
                    values?.hospitalCooperationDetail?.dateOfAdmissionUser
                      ? dayjs(
                          values?.hospitalCooperationDetail?.dateOfAdmissionUser
                        ).format("DD-MMM-YYYY")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Time of Discharge (System Fetch)"
                  value={
                    values?.hospitalCooperationDetail?.timeOfDischargeSystem
                      ? dayjs(
                          values?.hospitalCooperationDetail
                            ?.timeOfDischargeSystem
                        ).format("hh:mm:ss A")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Time of Discharge (User Feed)"
                  value={
                    values?.hospitalCooperationDetail?.timeOfDischargeUser
                      ? dayjs(
                          values?.hospitalCooperationDetail?.timeOfDischargeUser
                        ).format("hh:mm:ss A")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Diagnosis"
                  value={values?.hospitalCooperationDetail?.diagnosis || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Class of accommodation"
                  value={
                    values?.hospitalCooperationDetail?.classOfAccommodation ||
                    "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Discrepancies Observed"
                  value={
                    values?.hospitalCooperationDetail?.discrepanciesObserved ||
                    "-"
                  }
                />
              </GridCol>
            </Fragment>
          ) : null}
        </Fragment>
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

export default HospitalDailyCashTasks;
