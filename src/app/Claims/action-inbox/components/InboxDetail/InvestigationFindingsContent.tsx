import React from "react";
import { Grid, GridCol, Text, Title } from "@mantine/core";
import KeyValueContainer from "./KeyValueContainer";
import dayjs from "dayjs";
import { RevisedInvestigationFindings } from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  findings?: RevisedInvestigationFindings;
};

const InvestigationFindingsContent = ({ findings }: PropTypes) => {
  return (
    <Grid>
      {findings ? (
        <>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Date of visit to insured"
              value={
                findings?.dateOfVisitToInsured
                  ? dayjs(findings?.dateOfVisitToInsured).format("DD-MMM-YYYY")
                  : "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Time of visit to insured"
              value={
                findings?.timeOfVisitToInsured
                  ? dayjs(findings?.timeOfVisitToInsured).format("hh-mm-ss a")
                  : "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Date of visit to hospital"
              value={
                findings?.dateOfVisitToHospital
                  ? dayjs(findings?.dateOfVisitToHospital).format("DD-MMM-YYYY")
                  : "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Time of visit to hospital"
              value={
                findings?.timeOfVisitToHospital
                  ? dayjs(findings?.timeOfVisitToHospital).format("hh-mm-ss a")
                  : "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Hospitalization Status"
              value={findings?.hospitalizationStatus?.value || "-"}
            />
          </GridCol>
          {findings?.hospitalizationStatus?.differedAdmission && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Differed Admission"
                value={
                  findings?.hospitalizationStatus?.differedAdmission || "-"
                }
              />
            </GridCol>
          )}
          {findings?.hospitalizationStatus?.cancelledAdmission && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Cancelled Admission"
                value={
                  findings?.hospitalizationStatus?.cancelledAdmission || "-"
                }
              />
            </GridCol>
          )}
          {findings?.hospitalizationStatus?.cancelledAdmissionOther && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Cancelled Admission Other"
                value={
                  findings?.hospitalizationStatus?.cancelledAdmissionOther ||
                  "-"
                }
              />
            </GridCol>
          )}
          {findings?.hospitalizationDetails?.dateOfAdmission && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Date of admission"
                value={dayjs(
                  findings?.hospitalizationDetails?.dateOfAdmission
                ).format("DD-MMM-YYYY")}
              />
            </GridCol>
          )}
          {findings?.hospitalizationDetails?.timeOfAdmission && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Time of admission"
                value={dayjs(
                  findings?.hospitalizationDetails?.timeOfAdmission
                ).format("hh-mm-ss a")}
              />
            </GridCol>
          )}
          {findings?.hospitalizationDetails?.dateOfDischarge && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Date of discharge"
                value={dayjs(
                  findings?.hospitalizationDetails?.dateOfDischarge
                ).format("DD-MMM-YYYY")}
              />
            </GridCol>
          )}
          {findings?.hospitalizationDetails?.timeOfDischarge && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Time of discharge"
                value={dayjs(
                  findings?.hospitalizationDetails?.timeOfDischarge
                ).format("hh-mm-ss a")}
              />
            </GridCol>
          )}
          {findings?.hospitalizationDetails?.tentativeDateOfAdmission && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Tentative date of admission"
                value={dayjs(
                  findings?.hospitalizationDetails?.tentativeDateOfAdmission
                ).format("DD-MMM-YYYY")}
              />
            </GridCol>
          )}
          {findings?.hospitalizationDetails?.tentativeDateOfDischarge && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Tentative date of discharge"
                value={dayjs(
                  findings?.hospitalizationDetails?.tentativeDateOfDischarge
                ).format("DD-MMM-YYYY")}
              />
            </GridCol>
          )}
          {findings?.hospitalizationDetails?.proposedDateOfAdmission && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Proposed date of admission"
                value={dayjs(
                  findings?.hospitalizationDetails?.proposedDateOfAdmission
                ).format("DD-MMM-YYYY")}
              />
            </GridCol>
          )}
          {findings?.hospitalizationDetails?.proposedDateOfDischarge && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Proposed date of discharge"
                value={dayjs(
                  findings?.hospitalizationDetails?.proposedDateOfDischarge
                ).format("DD-MMM-YYYY")}
              />
            </GridCol>
          )}
          {findings?.patientDetails?.patientName && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Patient name"
                value={findings?.patientDetails?.patientName}
              />
            </GridCol>
          )}
          {findings?.patientDetails?.patientAge && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Patient age"
                value={findings?.patientDetails?.patientAge}
              />
            </GridCol>
          )}
          {findings?.patientDetails?.patientGender && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Patient gender"
                value={findings?.patientDetails?.patientGender}
              />
            </GridCol>
          )}
          {findings?.patientDetails?.revisedPatientName && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Revised Patient name"
                value={findings?.patientDetails?.revisedPatientName}
              />
            </GridCol>
          )}
          {findings?.patientDetails?.revisedPatientAge && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Revised Patient age"
                value={findings?.patientDetails?.revisedPatientAge}
              />
            </GridCol>
          )}
          {findings?.patientDetails?.revisedPatientGender && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Revised Patient gender"
                value={findings?.patientDetails?.revisedPatientGender}
              />
            </GridCol>
          )}
          {findings?.attendantDetails?.status && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Attendant available?"
                value={findings?.attendantDetails?.status}
              />
            </GridCol>
          )}
          {findings?.attendantDetails?.name && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Attendant name"
                value={findings?.attendantDetails?.name}
              />
            </GridCol>
          )}
          {findings?.attendantDetails?.gender && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Attendant gender"
                value={findings?.attendantDetails?.gender}
              />
            </GridCol>
          )}
          {findings?.attendantDetails?.mobileNo && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Attendant mobileNo"
                value={findings?.attendantDetails?.mobileNo}
              />
            </GridCol>
          )}
          {findings?.attendantDetails?.relationship && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Attendant relationship"
                value={findings?.attendantDetails?.relationship}
              />
            </GridCol>
          )}
          {findings?.occupationOfInsured && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Occupation of insured"
                value={findings?.occupationOfInsured}
              />
            </GridCol>
          )}
          {findings?.workPlaceDetails && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Workplace details"
                value={findings?.workPlaceDetails}
              />
            </GridCol>
          )}
          {findings?.anyOtherPolicyWithNBHI && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Any other policy other than NBHI?"
                value={findings?.anyOtherPolicyWithNBHI}
              />
            </GridCol>
          )}
          {findings?.otherPolicyNoWithNBHI && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Other policy number with NBHI?"
                value={findings?.otherPolicyNoWithNBHI}
              />
            </GridCol>
          )}
          {findings?.policyNumber && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Policy Number"
                value={findings?.policyNumber}
              />
            </GridCol>
          )}
          {findings?.anyPreviousClaimWithNBHI && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Any Previous claim with NBHI?"
                value={findings?.anyPreviousClaimWithNBHI}
              />
            </GridCol>
          )}
          {findings?.insurancePolicyOtherThanNBHI?.hasPolicy && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Has insurance policy other than NBHI"
                value={findings?.insurancePolicyOtherThanNBHI?.hasPolicy}
              />
            </GridCol>
          )}
          {findings?.insurancePolicyOtherThanNBHI?.nameOfInsuranceCompany && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Name of insurance company"
                value={
                  findings?.insurancePolicyOtherThanNBHI?.nameOfInsuranceCompany
                }
              />
            </GridCol>
          )}
          {findings?.insurancePolicyOtherThanNBHI?.policyNumber && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Policy number"
                value={findings?.insurancePolicyOtherThanNBHI?.policyNumber}
              />
            </GridCol>
          )}
          {findings?.classOfAccommodation?.status && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Class of accommodation"
                value={findings?.classOfAccommodation?.status}
              />
            </GridCol>
          )}
          {findings?.classOfAccommodation?.remark && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Class of accommodation remark"
                value={findings?.classOfAccommodation?.remark}
              />
            </GridCol>
          )}
          {findings?.changeInClassOfAccommodation?.status && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Change in Class of accommodation"
                value={findings?.changeInClassOfAccommodation?.status}
              />
            </GridCol>
          )}
          {findings?.changeInClassOfAccommodation?.remark && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Change in Class of accommodation remark"
                value={findings?.changeInClassOfAccommodation?.remark}
              />
            </GridCol>
          )}
          {findings?.patientOnActiveLineOfTreatment?.status && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Patient on active line of treatment"
                value={findings?.patientOnActiveLineOfTreatment?.status}
              />
            </GridCol>
          )}
          {findings?.patientOnActiveLineOfTreatment?.remark && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Patient on active line of treatment remark"
                value={findings?.patientOnActiveLineOfTreatment?.remark}
              />
            </GridCol>
          )}
          {findings?.mismatchInDiagnosis?.status && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Mismatch in diagnosis"
                value={findings?.mismatchInDiagnosis?.status}
              />
            </GridCol>
          )}
          {findings?.mismatchInDiagnosis?.remark && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Mismatch in diagnosis remark"
                value={findings?.mismatchInDiagnosis?.remark}
              />
            </GridCol>
          )}
          {findings?.discrepancies?.status && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Discrepancies"
                value={findings?.discrepancies?.status}
              />
            </GridCol>
          )}
          {findings?.discrepancies?.remark && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Discrepancies remark"
                value={findings?.discrepancies?.remark}
              />
            </GridCol>
          )}

          {findings?.pedOrNoneDisclosure && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="PED/None-Disclosure"
                value={findings?.pedOrNoneDisclosure}
              />
            </GridCol>
          )}

          {findings?.insuredOrAttendantCooperation && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Insured or attendant cooperation"
                value={findings?.insuredOrAttendantCooperation}
              />
            </GridCol>
          )}
          {findings?.reasonForInsuredNotCooperation && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Reason for Insured or attendant not cooperating"
                value={findings?.reasonForInsuredNotCooperation}
              />
            </GridCol>
          )}
          {findings?.providerCooperation && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Provider cooperation"
                value={findings?.providerCooperation}
              />
            </GridCol>
          )}
          {findings?.reasonForProviderNotCooperation && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Reason for provider not cooperating"
                value={findings?.reasonForProviderNotCooperation}
              />
            </GridCol>
          )}
          {findings?.investigationSummary && (
            <GridCol span={{ sm: 12, md: 12 }}>
              <KeyValueContainer
                label="Investigation summary"
                value={findings?.investigationSummary}
              />
            </GridCol>
          )}
          {findings?.nonCooperationDetails && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Non cooperation details"
                value={findings?.nonCooperationDetails}
              />
            </GridCol>
          )}
          {findings?.createdAt && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Created At"
                value={dayjs(findings?.createdAt).format("DD-MMM-YYYY")}
              />
            </GridCol>
          )}

          {!!findings?.patientHabit && findings?.patientHabit?.length > 0
            ? findings?.patientHabit?.map((el, ind) => (
                <GridCol span={{ sm: 12, md: 6 }} my={12} key={ind}>
                  <Title order={6} c="orange" my={4}>
                    Habit {ind + 1}
                  </Title>
                  <KeyValueContainer label="Habit" value={el?.habit} />
                  <KeyValueContainer
                    label={`Duration of ${el?.habit}`}
                    value={el?.duration}
                  />
                  <KeyValueContainer
                    label={`Frequency of ${el?.habit}`}
                    value={el?.frequency}
                  />
                  <KeyValueContainer
                    label={`Quantity of ${el?.habit}`}
                    value={el?.quantity}
                  />
                </GridCol>
              ))
            : null}

          {!!findings?.ailment && findings?.ailment?.length > 0
            ? findings?.ailment?.map((el, ind) => (
                <GridCol span={{ sm: 12, md: 6 }} my={12} key={ind}>
                  <Title order={6} c="orange" my={4}>
                    Ailment {ind + 1}
                  </Title>
                  <KeyValueContainer label="Ailment" value={el?.ailment} />
                  <KeyValueContainer
                    label={`Duration of ${el?.ailment}`}
                    value={el?.duration}
                  />
                  <KeyValueContainer
                    label={`Diagnosis of ${el?.ailment}`}
                    value={el?.diagnosis}
                  />
                  <KeyValueContainer
                    label={`On medication of ${el?.ailment}`}
                    value={el?.onMedication}
                  />
                </GridCol>
              ))
            : null}
        </>
      ) : (
        <GridCol span={12}>
          <Text ta="center" c="red">
            No Data
          </Text>
        </GridCol>
      )}
    </Grid>
  );
};

export default InvestigationFindingsContent;
