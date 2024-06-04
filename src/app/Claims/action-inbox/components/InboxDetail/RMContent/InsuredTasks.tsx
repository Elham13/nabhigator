import React, { Fragment } from "react";
import KeyValueContainer from "../KeyValueContainer";
import { ActionIcon, Box, Flex, Grid, GridCol, Title } from "@mantine/core";
import { BiLink } from "react-icons/bi";
import dayjs from "dayjs";
import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IInsuredVerification;
};

const OPDTasks = ({ values }: PropTypes) => {
  return (
    <>
      <Title order={3} c="cyan" my={10}>
        Insured Verification
      </Title>
      <KeyValueContainer
        label="Insured Visit"
        value={values?.insuredVisit || "-"}
      />
      {values?.insuredVisit === "Not Done" ? (
        <>
          <KeyValueContainer
            label="Why Insured not visited?"
            value={values?.reasonOfInsuredNotVisit?.value || "-"}
          />
          {values?.reasonOfInsuredNotVisit?.reason ? (
            <KeyValueContainer
              label="Remarks"
              value={values?.reasonOfInsuredNotVisit?.reason || "-"}
            />
          ) : null}

          {values?.reasonOfInsuredNotVisit?.untraceableBasis ? (
            <KeyValueContainer
              label="Specify Untraceable"
              value={values?.reasonOfInsuredNotVisit?.untraceableBasis || "-"}
            />
          ) : null}

          {values?.reasonOfInsuredNotVisit?.proof &&
          values?.reasonOfInsuredNotVisit?.proof?.length > 0 ? (
            <Box>
              <Title order={5} c="orange">
                Proofs
              </Title>
              <Flex>
                {values?.reasonOfInsuredNotVisit?.proof?.map((url, ind) => (
                  <ActionIcon
                    key={ind}
                    disabled={!url}
                    variant="light"
                    onClick={() => {
                      window.open(
                        `/Claims/action-inbox/documents?url=${url}&name=Insured Not Visit Proof`,
                        "_blank"
                      );
                    }}
                  >
                    <BiLink />
                  </ActionIcon>
                ))}
              </Flex>
            </Box>
          ) : null}
        </>
      ) : values?.insuredVisit === "Done" ? (
        <Grid>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Date of visit to insured"
              value={
                values?.dateOfVisitToInsured
                  ? dayjs(values?.dateOfVisitToInsured).format("DD-MMM-YYYY")
                  : "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Time of visit to insured"
              value={
                values?.timeOfVisitToInsured
                  ? dayjs(values?.timeOfVisitToInsured).format("hh:mm:ss A")
                  : "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Name of patient (System Fetch)"
              value={values?.nameOfPatientSystem || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Name of patient (User Feed)"
              value={values?.nameOfPatientUser || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Age of patient (System Fetch)"
              value={values?.ageOfPatientSystem}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Age of patient (User Feed)"
              value={values?.ageOfPatientUser}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Gender of patient (System Fetch)"
              value={values?.genderOfPatientSystem || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Gender of patient (User Feed)"
              value={values?.genderOfPatientUser || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Mobile Number"
              value={values?.mobileNumber || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Occupation of Insured"
              value={values?.occupationOfInsured || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Work place details"
              value={values?.workPlaceDetail || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Any Other Policy with NBHI?"
              value={values?.anyOtherPolicyWithNBHI || "-"}
            />
          </GridCol>
          {values?.anyOtherPolicyWithNBHI === "Yes" ? (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Policy Number"
                value={values?.policyNo || "-"}
              />
            </GridCol>
          ) : null}
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Any Previous claim with NBHI"
              value={values?.anyPreviousClaimWithNBHI || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Any Insurance policy other than NBHI?"
              value={values?.anyInsurancePolicyOtherThanNBHI?.value || "-"}
            />
          </GridCol>
          {values?.anyInsurancePolicyOtherThanNBHI?.value === "Yes" ? (
            <>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Policy Number"
                  value={
                    values?.anyInsurancePolicyOtherThanNBHI?.policyNo || "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of Insured Company"
                  value={
                    values?.anyInsurancePolicyOtherThanNBHI
                      ?.nameOfInsuranceCompany || "-"
                  }
                />
              </GridCol>

              {values?.anyInsurancePolicyOtherThanNBHI?.documents &&
              values?.anyInsurancePolicyOtherThanNBHI?.documents?.length > 0 ? (
                <GridCol span={{ sm: 12 }}>
                  <Title order={5} c="orange">
                    Documents
                  </Title>
                  <Flex gap={10}>
                    {values?.anyInsurancePolicyOtherThanNBHI?.documents?.map(
                      (url, ind) => (
                        <ActionIcon
                          key={ind}
                          disabled={!url}
                          variant="light"
                          onClick={() => {
                            window.open(
                              `/Claims/action-inbox/documents?url=${url}&name=Insurance Policy Other Than NBHI Document`,
                              "_blank"
                            );
                          }}
                        >
                          <BiLink />
                        </ActionIcon>
                      )
                    )}
                  </Flex>
                </GridCol>
              ) : null}
            </>
          ) : null}

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Coverage Under Any Gov Scheme"
              value={values?.coverageUnderAnyGovSchema || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Remark"
              value={values?.coverageUnderAnyGovSchemaRemark || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Policy Type"
              value={values?.policyType?.value || "-"}
            />
          </GridCol>
          {values?.policyType?.value === "Port" ? (
            <>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Ported From"
                  value={values?.policyType?.portedFrom || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Reason of portability"
                  value={values?.policyType?.reasonOfPortability || "-"}
                />
              </GridCol>
            </>
          ) : null}

          {values?.prevInsurancePolicyCopy ? (
            <Box>
              <Title order={5} c="orange">
                Previous Insurance Policy Copy
              </Title>
              <ActionIcon
                variant="light"
                onClick={() => {
                  window.open(
                    `/Claims/action-inbox/documents?url=${values?.prevInsurancePolicyCopy}&name=Previous Insurance Policy Copy`,
                    "_blank"
                  );
                }}
              >
                <BiLink />
              </ActionIcon>
            </Box>
          ) : null}

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Any claim with previous Insurance Company?"
              value={values?.anyClaimWithPrevInsurance || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Symptoms with duration insured presented with"
              value={values?.symptomsWithDuration || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="First Consultation Details"
              value={values?.firstConsultationDetails?.value || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Remark"
              value={values?.firstConsultationDetails?.remark || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="First Consultation/Referral slip"
              value={values?.firstConsultationOrReferralSlip?.value || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Remark"
              value={values?.firstConsultationOrReferralSlip?.remark || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Name of hospital (System Fetch)"
              value={values?.nameOfHospitalSystem || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Name of hospital (User Feed)"
              value={values?.nameOfHospitalUser || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Date of Admission (System Fetch)"
              value={
                values?.dateOfAdmissionSystem
                  ? dayjs(values?.dateOfAdmissionSystem).format("DD-MMM-YYYY")
                  : "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Date of Admission (User Feed)"
              value={
                values?.dateOfAdmissionUser
                  ? dayjs(values?.dateOfAdmissionUser).format("DD-MMM-YYYY")
                  : "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Time of Admission"
              value={values?.timeOfAdmission?.value || "-"}
            />
          </GridCol>

          {values?.timeOfAdmission?.value === "Disclosed" ? (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="At what time Admitted?"
                value={
                  values?.timeOfAdmission?.time
                    ? dayjs(values?.timeOfAdmission?.time).format("hh:mm:ss A")
                    : "-"
                }
              />
            </GridCol>
          ) : null}

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Date of Discharge (System Fetch)"
              value={
                values?.dateOfDischargeSystem
                  ? dayjs(values?.dateOfDischargeSystem).format("DD-MMM-YYYY")
                  : "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Date of Discharge (User Feed)"
              value={
                values?.dateOfDischargeUser
                  ? dayjs(values?.dateOfDischargeUser).format("DD-MMM-YYYY")
                  : "-"
              }
            />
          </GridCol>

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Time of Discharge"
              value={values?.timeOfDischarge?.value || "-"}
            />
          </GridCol>

          {values?.timeOfDischarge?.value === "Disclosed" ? (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="At what time Discharged?"
                value={
                  values?.timeOfDischarge?.time
                    ? dayjs(values?.timeOfDischarge?.time).format("hh:mm:ss A")
                    : "-"
                }
              />
            </GridCol>
          ) : null}

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Name of Doctor attended"
              value={values?.nameOfDoctorAttended || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Number of visits of Doctor"
              value={values?.numberOfVisitsOfDoctor || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Treatment Type"
              value={values?.treatmentType || "-"}
            />
          </GridCol>

          {values?.classOfAccommodation &&
          values?.classOfAccommodation?.length > 0
            ? values?.classOfAccommodation?.map((el, ind) => (
                <Fragment key={ind}>
                  <GridCol span={{ sm: 12, md: 4 }}>
                    <KeyValueContainer
                      label="Class of Accommodation"
                      value={el || "-"}
                    />
                  </GridCol>
                  <GridCol span={{ sm: 12, md: 4 }}>
                    <KeyValueContainer
                      label={`From Date in ${el}`}
                      value={
                        values?.classOfAccommodationDetails?.[ind]?.fromDate
                          ? dayjs(
                              values?.classOfAccommodationDetails?.[ind]
                                ?.fromDate
                            ).format("DD-MMM-YYYY")
                          : "-"
                      }
                    />
                  </GridCol>
                  <GridCol span={{ sm: 12, md: 4 }}>
                    <KeyValueContainer
                      label={`To Date in ${el}`}
                      value={
                        values?.classOfAccommodationDetails?.[ind]?.toDate
                          ? dayjs(
                              values?.classOfAccommodationDetails?.[ind]?.toDate
                            ).format("DD-MMM-YYYY")
                          : "-"
                      }
                    />
                  </GridCol>
                </Fragment>
              ))
            : null}

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Attendant details at the time of Admission"
              value={values?.attendantDetailsAtTheTimeOfAdmission || "-"}
            />
          </GridCol>

          {values?.attendantDetailsAtTheTimeOfAdmission === "Shared" ? (
            <>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of attendant"
                  value={values?.attendantDetails?.name || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Gender"
                  value={values?.attendantDetails?.gender || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Relationship"
                  value={values?.attendantDetails?.relationship || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Mobile Number"
                  value={values?.attendantDetails?.mobileNo || "-"}
                />
              </GridCol>
            </>
          ) : null}
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Medicine"
              value={values?.medicines || "-"}
            />
          </GridCol>

          {values?.medicines === "Outsourced" ? (
            <>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Cost of Medicine Bills"
                  value={values?.medicinesDetail?.costOfMedicineBill || 0}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Payment Mode"
                  value={values?.medicinesDetail?.paymentMode || ""}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Remark"
                  value={values?.medicinesDetail?.remark || ""}
                />
              </GridCol>
            </>
          ) : null}

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Medicine Returned?"
              value={values?.medicinesDetail?.medicinesReturned || "-"}
            />
          </GridCol>
          {values?.medicinesDetail?.medicinesReturned === "Yes" ? (
            <>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Amount Refunded"
                  value={values?.medicinesDetail?.amountRefunded || 0}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Refund Invoice"
                  value={values?.medicinesDetail?.refundInvoice || ""}
                />
              </GridCol>
            </>
          ) : null}

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Amount Paid to Hospital"
              value={values?.amountPaidToHospital?.value || 0}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Payment Mode"
              value={values?.amountPaidToHospital?.paymentMode || 0}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Remark"
              value={values?.amountPaidToHospital?.remark || 0}
            />
          </GridCol>

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Amount Paid for Diagnostic Tests"
              value={values?.amountPaidForDiagnosticTests?.value || 0}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Payment Mode"
              value={values?.amountPaidForDiagnosticTests?.paymentMode || 0}
            />
          </GridCol>

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Any other amount Paid?"
              value={values?.anyOtherAmountPaid?.value || "-"}
            />
          </GridCol>

          {values?.anyOtherAmountPaid?.value === "Yes" ? (
            <>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="How much other amount Paid?"
                  value={values?.anyOtherAmountPaid?.amount || 0}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Payment Mode"
                  value={values?.anyOtherAmountPaid.paymentMode || 0}
                />
              </GridCol>
            </>
          ) : null}

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Total amount paid"
              value={values?.totalAmountPaid || 0}
            />
          </GridCol>

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer label="Remarks" value={values?.remarks || 0} />
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
              label="Claimed NEFT details verified"
              value={values?.claimNEFTDetail || "-"}
            />
          </GridCol>

          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Insured/Attendant Co-operation"
              value={values?.insuredOrAttendantCooperation || "-"}
            />
          </GridCol>

          {values?.insuredOrAttendantCooperation === "No" ? (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Reason for insured/attendant not co-operating"
                value={values?.reasonForInsuredNotCooperating || "-"}
              />
            </GridCol>
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
      ) : null}
    </>
  );
};

export default OPDTasks;
