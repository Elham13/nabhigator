import React, { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import {
  anesthesiaOptions,
  attendantDetailsAtTheTimeOfAdmissionOptions,
  disclosedNotDisclosedOptions,
  firstConsultationOptions,
  firstConsultationReferralSlipOptions,
  genderOptions,
  medicinesOptions,
  occupationOptions,
  otherPolicyWithNBHIOptions,
  paymentMethodOptions,
  policyTypeOptions,
  previousInsurersOptions,
  refundInvoiceOptions,
  rmClassOfAccommodationOptions,
  rmRelationshipOptions,
  treatmentTypeOptions,
  typeOfAnesthesiaOptions,
  yesNoNAOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";
import PolicyOtherThanNBHIFormPart from "./PolicyOtherThanNBHIFormPart";
import PatientHabitFormParts from "../FormParts/PatientHabitFormParts";
import AilmentFormParts from "../FormParts/AilmentFormParts";
import {
  Grid,
  MultiSelect,
  NumberInput,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import TimePicker from "@/components/TimePicker";
import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";
import FileUpload from "@/components/ClaimsComponents/FileUpload";

interface IOnChangeParams {
  name: string | (number | string)[];
  value: any;
  isArrayOfObjects?: boolean;
}

type PropTypes = {
  values: IInsuredVerification;
  claimId: number;
  setValues: Dispatch<SetStateAction<IInsuredVerification>>;
  handleBlur: ({}: {
    key: keyof IInsuredVerification;
    value: any;
    isBulk?: boolean;
  }) => void;
};

const InsuredVisitDoneForm = ({
  values,
  claimId,
  setValues,
  handleBlur,
}: PropTypes) => {
  const onChange = ({ name, value, isArrayOfObjects }: IOnChangeParams) => {
    setValues((prev) => {
      // Helper function to set value in nested object
      const setNestedValue = (
        obj: any,
        keys: (number | string)[],
        val: any
      ) => {
        const lastKey = keys.pop(); // Get the last key
        const nestedObj = keys.reduce((acc, key) => {
          if (!acc[key]) {
            acc[key] = {}; // Initialize if it doesn't exist
          }
          return acc[key];
        }, obj);
        nestedObj[lastKey!] = val; // Set the value at the last key
      };

      if (typeof name === "string") {
        return { ...prev, [name]: value };
      } else {
        // Handle nested properties
        const newState: any = { ...prev }; // Create a copy of the previous state

        if (isArrayOfObjects) {
          // Case for array of objects
          const [arrayKey, indexKey, objectKey] = name as [
            string,
            number,
            string
          ];
          const array = newState[arrayKey] || [];

          if (!array[indexKey]) {
            array[indexKey] = {}; // Initialize the object if it doesn't exist
          }
          array[indexKey][objectKey] = value; // Set the value

          newState[arrayKey] = array; // Update the nested array in the state
        } else {
          // Case for other nested properties
          setNestedValue(newState, name as (number | string)[], value);
        }

        return newState; // Return the updated state
      }
    });
  };

  useEffect(() => {
    const costOfMedicineBill = parseInt(
      values?.medicinesDetail?.costOfMedicineBill
        ? values?.medicinesDetail?.costOfMedicineBill?.toString()
        : "0"
    );
    const amountRefunded = parseInt(
      values?.medicinesDetail?.amountRefunded
        ? values?.medicinesDetail?.amountRefunded?.toString()
        : "0"
    );
    const amountPaidToHospital = parseInt(
      values?.amountPaidToHospital?.value
        ? values?.amountPaidToHospital?.value?.toString()
        : "0"
    );
    const amountPaidForDiagnosticTests = parseInt(
      values?.amountPaidForDiagnosticTests?.value
        ? values?.amountPaidForDiagnosticTests?.value?.toString()
        : "0"
    );
    const anyOtherAmountPaid = parseInt(
      values?.anyOtherAmountPaid?.amount
        ? values?.anyOtherAmountPaid?.amount?.toString()
        : "0"
    );

    const total =
      costOfMedicineBill +
      amountPaidToHospital +
      amountPaidForDiagnosticTests +
      anyOtherAmountPaid -
      amountRefunded;
    setValues((prev) => ({ ...prev, totalAmountPaid: total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values?.medicinesDetail?.amountRefunded,
    values?.medicinesDetail?.costOfMedicineBill,
    values?.amountPaidToHospital?.value,
    values?.amountPaidForDiagnosticTests?.value,
    values?.anyOtherAmountPaid?.amount,
  ]);

  // useEffect(() => {
  //   handleBlur({ key: "totalAmountPaid", value: total });
  // }, [total]);

  return (
    <Fragment>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <DateInput
          label="Date of visit to insured"
          placeholder="Date of visit to insured"
          required
          withAsterisk
          maxDate={new Date()}
          value={
            values?.dateOfVisitToInsured
              ? dayjs(values?.dateOfVisitToInsured).toDate()
              : null
          }
          onChange={(date) =>
            onChange({ name: "dateOfVisitToInsured", value: date })
          }
          onBlur={() =>
            handleBlur({
              key: "dateOfVisitToInsured",
              value: values?.dateOfVisitToInsured,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TimePicker
          label="Time of visit to insured"
          value={
            values?.timeOfVisitToInsured
              ? dayjs(values?.timeOfVisitToInsured).format("HH:mm:ss")
              : ""
          }
          onChange={(time) => {
            onChange({
              name: "timeOfVisitToInsured",
              value: dayjs(time, "HH:mm:ss").toDate(),
            });
          }}
          onBlur={() =>
            handleBlur({
              key: "timeOfVisitToInsured",
              value: values?.timeOfVisitToInsured,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Name of patient (System Fetch)"
          placeholder="Name of patient (System Fetch)"
          value={values?.nameOfPatientSystem || ""}
          disabled
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Name of patient (User feed)"
          placeholder="Name of patient (User feed)"
          required
          withAsterisk
          value={values?.nameOfPatientUser || ""}
          onChange={(e) =>
            onChange({ name: "nameOfPatientUser", value: e.target.value })
          }
          onBlur={() =>
            handleBlur({
              key: "nameOfPatientUser",
              value: values?.nameOfPatientUser,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Age of patient (System Fetch)"
          placeholder="Age of patient (System Fetch)"
          value={values?.ageOfPatientSystem || ""}
          disabled
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Age of patient (User feed)"
          placeholder="Age of patient (User feed)"
          required
          withAsterisk
          value={values?.ageOfPatientUser || ""}
          onChange={(e) =>
            onChange({ name: "ageOfPatientUser", value: e.target.value })
          }
          onBlur={() =>
            handleBlur({
              key: "ageOfPatientUser",
              value: values?.ageOfPatientUser,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Gender of patient (System Fetch)"
          placeholder="Gender of patient (System Fetch)"
          value={values?.genderOfPatientSystem || ""}
          disabled
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Gender of patient (User feed)"
          placeholder="Gender of patient (User feed)"
          required
          withAsterisk
          data={genderOptions}
          value={values?.genderOfPatientUser || ""}
          onChange={(value) => onChange({ name: "genderOfPatientUser", value })}
          onBlur={() =>
            handleBlur({
              key: "genderOfPatientUser",
              value: values?.genderOfPatientUser,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <NumberInput
          label="Mobile Number"
          placeholder="Mobile Number"
          required
          withAsterisk
          value={values?.mobileNumber || ""}
          onChange={(e) => onChange({ name: "mobileNumber", value: e })}
          onBlur={() =>
            handleBlur({
              key: "mobileNumber",
              value: values?.mobileNumber,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Occupation of Insured"
          placeholder="Occupation of Insured"
          required
          withAsterisk
          data={occupationOptions}
          value={values?.occupationOfInsured || ""}
          onChange={(e) => onChange({ name: "occupationOfInsured", value: e })}
          onBlur={() =>
            handleBlur({
              key: "occupationOfInsured",
              value: values?.occupationOfInsured,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Work place details"
          placeholder="Work place details"
          required
          withAsterisk
          value={values?.workPlaceDetail || ""}
          onChange={(e) =>
            onChange({ name: "workPlaceDetail", value: e.target.value })
          }
          onBlur={() =>
            handleBlur({
              key: "workPlaceDetail",
              value: values?.workPlaceDetail,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Any Other Policy with NBHI?"
          placeholder="Any Other Policy with NBHI?"
          required
          withAsterisk
          data={otherPolicyWithNBHIOptions}
          value={values?.anyOtherPolicyWithNBHI || ""}
          onChange={(e) =>
            onChange({ name: "anyOtherPolicyWithNBHI", value: e })
          }
          onBlur={() =>
            handleBlur({
              key: "anyOtherPolicyWithNBHI",
              value: values?.anyOtherPolicyWithNBHI,
            })
          }
        />
      </Grid.Col>
      {values?.anyOtherPolicyWithNBHI === "Yes" && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Policy Number"
            placeholder="Policy Number"
            required
            withAsterisk
            value={values?.policyNo || ""}
            onChange={(e) =>
              onChange({ name: "policyNo", value: e.target.value })
            }
            onBlur={() =>
              handleBlur({
                key: "policyNo",
                value: values?.policyNo,
              })
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Any Previous claim with NBHI"
          placeholder="Any Previous claim with NBHI"
          required
          withAsterisk
          data={yesNoOptions}
          value={values?.anyPreviousClaimWithNBHI || ""}
          onChange={(e) =>
            onChange({ name: "anyPreviousClaimWithNBHI", value: e })
          }
          onBlur={() =>
            handleBlur({
              key: "anyPreviousClaimWithNBHI",
              value: values?.anyPreviousClaimWithNBHI,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Any Insurance policy other than NBHI?"
          placeholder="Any Insurance policy other than NBHI?"
          required
          withAsterisk
          data={yesNoOptions}
          value={values?.anyInsurancePolicyOtherThanNBHI?.value || ""}
          onChange={(e) =>
            onChange({
              name: ["anyInsurancePolicyOtherThanNBHI", "value"],
              value: e,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "anyInsurancePolicyOtherThanNBHI",
              value: values?.anyInsurancePolicyOtherThanNBHI,
            })
          }
        />
      </Grid.Col>
      {values?.anyInsurancePolicyOtherThanNBHI?.value === "Yes" && (
        <PolicyOtherThanNBHIFormPart
          values={values}
          claimId={claimId}
          onChange={onChange}
          handleBlur={handleBlur}
        />
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Coverage Under Any Gov Scheme"
          placeholder="Coverage Under Any Gov Scheme"
          required
          withAsterisk
          data={yesNoOptions}
          value={values?.coverageUnderAnyGovSchema || ""}
          onChange={(e) =>
            onChange({
              name: "coverageUnderAnyGovSchema",
              value: e,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "coverageUnderAnyGovSchema",
              value: values?.coverageUnderAnyGovSchema,
            })
          }
        />
      </Grid.Col>
      {!!values?.coverageUnderAnyGovSchema && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Remarks"
            placeholder="Remarks"
            required
            withAsterisk
            value={values?.coverageUnderAnyGovSchemaRemark || ""}
            onChange={(e) =>
              onChange({
                name: "coverageUnderAnyGovSchemaRemark",
                value: e.target.value,
              })
            }
            onBlur={() =>
              handleBlur({
                key: "coverageUnderAnyGovSchemaRemark",
                value: values?.coverageUnderAnyGovSchemaRemark,
              })
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Policy Type"
          placeholder="Policy Type"
          required
          withAsterisk
          data={policyTypeOptions}
          value={values?.policyType?.value || ""}
          onChange={(e) =>
            onChange({
              name: ["policyType", "value"],
              value: e,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "policyType",
              value: values?.policyType,
            })
          }
        />
      </Grid.Col>
      {values?.policyType?.value === "Port" && (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Ported From"
              placeholder="Ported From"
              required
              withAsterisk
              data={previousInsurersOptions}
              value={values?.policyType?.portedFrom || ""}
              onChange={(e) =>
                onChange({
                  name: ["policyType", "portedFrom"],
                  value: e,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "policyType",
                  value: values?.policyType,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Reason of portability"
              placeholder="Reason of portability"
              required
              withAsterisk
              value={values?.policyType?.reasonOfPortability || ""}
              onChange={(e) =>
                onChange({
                  name: ["policyType", "reasonOfPortability"],
                  value: e.target.value,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "policyType",
                  value: values?.policyType,
                })
              }
            />
          </Grid.Col>
        </Fragment>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Text>Previous Insurance Policy Copy</Text>
        <FileUpload
          claimId={claimId}
          doc={{
            _id: "",
            docUrl: !!values?.prevInsurancePolicyCopy
              ? [values?.prevInsurancePolicyCopy]
              : [],
            name: "",
            location: null,
            hiddenDocUrls: [],
            replacedDocUrls: [],
          }}
          docName="doc"
          getUrl={(id, name, url, action) => {
            onChange({
              name: "prevInsurancePolicyCopy",
              value: action === "Add" ? url : "",
            });
            handleBlur({
              key: "prevInsurancePolicyCopy",
              value: action === "Add" ? url : "",
            });
          }}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Any claim with previous Insurance Company?"
          placeholder="Any claim with previous Insurance Company?"
          required
          withAsterisk
          data={yesNoOptions}
          value={values?.anyClaimWithPrevInsurance || ""}
          onChange={(e) =>
            onChange({
              name: "anyClaimWithPrevInsurance",
              value: e,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "anyClaimWithPrevInsurance",
              value: values?.anyClaimWithPrevInsurance,
            })
          }
        />
      </Grid.Col>
      {values?.anyClaimWithPrevInsurance === "Yes" && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Claim Details"
            placeholder="Claim Details"
            required
            withAsterisk
            value={values?.claimDetailsOfPreviousInsurance || ""}
            onChange={(e) =>
              onChange({
                name: "claimDetailsOfPreviousInsurance",
                value: e.target.value,
              })
            }
            onBlur={() =>
              handleBlur({
                key: "claimDetailsOfPreviousInsurance",
                value: values?.claimDetailsOfPreviousInsurance,
              })
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Symptoms with duration insured presented with"
          placeholder="Symptoms with duration insured presented with"
          required
          withAsterisk
          value={values?.symptomsWithDuration || ""}
          onChange={(e) =>
            onChange({
              name: "symptomsWithDuration",
              value: e.target.value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "symptomsWithDuration",
              value: values?.symptomsWithDuration,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="First Consultation Details"
          placeholder="First Consultation Details"
          required
          withAsterisk
          searchable
          data={firstConsultationOptions}
          value={values?.firstConsultationDetails?.value || ""}
          onChange={(e) =>
            onChange({
              name: ["firstConsultationDetails", "value"],
              value: e,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "firstConsultationDetails",
              value: values?.firstConsultationDetails,
            })
          }
        />
      </Grid.Col>
      {!!values?.firstConsultationDetails?.value && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Remark"
            placeholder="Remark"
            required
            withAsterisk
            value={values?.firstConsultationDetails?.remark || ""}
            onChange={(e) =>
              onChange({
                name: ["firstConsultationDetails", "remark"],
                value: e.target.value,
              })
            }
            onBlur={() =>
              handleBlur({
                key: "firstConsultationDetails",
                value: values?.firstConsultationDetails,
              })
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="First Consultation/Referral slip"
          placeholder="First Consultation/Referral slip"
          required
          withAsterisk
          searchable
          data={firstConsultationReferralSlipOptions}
          value={values?.firstConsultationOrReferralSlip?.value || ""}
          onChange={(e) =>
            onChange({
              name: ["firstConsultationOrReferralSlip", "value"],
              value: e,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "firstConsultationOrReferralSlip",
              value: values?.firstConsultationOrReferralSlip,
            })
          }
        />
      </Grid.Col>
      {!!values?.firstConsultationOrReferralSlip?.value && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Remark"
            placeholder="Remark"
            required
            withAsterisk
            value={values?.firstConsultationOrReferralSlip?.remark || ""}
            onChange={(e) =>
              onChange({
                name: ["firstConsultationOrReferralSlip", "remark"],
                value: e.target.value,
              })
            }
            onBlur={() =>
              handleBlur({
                key: "firstConsultationOrReferralSlip",
                value: values?.firstConsultationOrReferralSlip,
              })
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Name of hospital (System Fetch)"
          placeholder="Name of hospital (System Fetch)"
          value={values?.nameOfHospitalSystem || ""}
          disabled
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Name of hospital (User feed)"
          placeholder="Name of hospital (User feed)"
          required
          withAsterisk
          value={values?.nameOfHospitalUser || ""}
          onChange={(e) =>
            onChange({
              name: "nameOfHospitalUser",
              value: e.target.value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "nameOfHospitalUser",
              value: values?.nameOfHospitalUser,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <DateInput
          label="Date of Admission (System Fetch)"
          placeholder="Date of Admission (System Fetch)"
          value={
            values?.dateOfAdmissionSystem
              ? dayjs(values?.dateOfAdmissionSystem).toDate()
              : null
          }
          disabled
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <DateInput
          label="Date of Admission (User feed)"
          placeholder="Date of Admission (User feed)"
          required
          withAsterisk
          maxDate={new Date()}
          value={
            values?.dateOfAdmissionUser
              ? dayjs(values?.dateOfAdmissionUser).toDate()
              : null
          }
          onChange={(date) =>
            onChange({ name: "dateOfAdmissionUser", value: date })
          }
          onBlur={() =>
            handleBlur({
              key: "dateOfAdmissionUser",
              value: values?.dateOfAdmissionUser,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Time of Admission"
          placeholder="Time of Admission"
          required
          withAsterisk
          searchable
          data={disclosedNotDisclosedOptions}
          value={values?.timeOfAdmission?.value || ""}
          onChange={(e) =>
            onChange({
              name: ["timeOfAdmission", "value"],
              value: e,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "timeOfAdmission",
              value: values?.timeOfAdmission,
            })
          }
        />
      </Grid.Col>
      {values?.timeOfAdmission?.value === "Disclosed" && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TimePicker
            label="At what time Admitted?"
            value={
              values?.timeOfAdmission?.time
                ? dayjs(values?.timeOfAdmission?.time).format("HH:mm:ss")
                : ""
            }
            onChange={(time) => {
              onChange({
                name: ["timeOfAdmission", "time"],
                value: dayjs(time, "HH:mm:ss").toDate(),
              });
            }}
            onBlur={() =>
              handleBlur({
                key: "timeOfAdmission",
                value: values?.timeOfAdmission,
              })
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <DateInput
          label="Date of Discharge (System Fetch)"
          placeholder="Date of Discharge (System Fetch)"
          value={
            values?.dateOfAdmissionUser
              ? dayjs(values?.dateOfAdmissionUser).toDate()
              : null
          }
          disabled
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <DateInput
          label="Date of Discharge (User feed)"
          placeholder="Date of Discharge (User feed)"
          required
          withAsterisk
          clearable
          maxDate={new Date()}
          value={
            values?.dateOfDischargeUser
              ? dayjs(values?.dateOfDischargeUser).toDate()
              : null
          }
          onChange={(date) =>
            onChange({ name: "dateOfDischargeUser", value: date })
          }
          onBlur={() =>
            handleBlur({
              key: "dateOfDischargeUser",
              value: values?.dateOfDischargeUser,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Time of Discharge"
          placeholder="Time of Discharge"
          required
          withAsterisk
          searchable
          data={disclosedNotDisclosedOptions}
          value={values?.timeOfDischarge?.value || ""}
          onChange={(e) =>
            onChange({
              name: ["timeOfDischarge", "value"],
              value: e,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "timeOfDischarge",
              value: values?.timeOfDischarge,
            })
          }
        />
      </Grid.Col>
      {values?.timeOfDischarge?.value === "Disclosed" && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TimePicker
            label="At what time Discharged?"
            value={
              values?.timeOfDischarge?.time
                ? dayjs(values?.timeOfDischarge?.time).format("HH:mm:ss")
                : ""
            }
            onChange={(time) => {
              onChange({
                name: ["timeOfDischarge", "time"],
                value: dayjs(time, "HH:mm:ss").toDate(),
              });
            }}
            onBlur={() =>
              handleBlur({
                key: "timeOfDischarge",
                value: values?.timeOfDischarge,
              })
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Name of Doctor attended"
          placeholder="Name of Doctor attended"
          required
          withAsterisk
          value={values?.nameOfDoctorAttended || ""}
          onChange={(e) =>
            onChange({
              name: "nameOfDoctorAttended",
              value: e.target.value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "nameOfDoctorAttended",
              value: values?.nameOfDoctorAttended,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Number of visits of Doctor"
          placeholder="Number of visits of Doctor"
          required
          withAsterisk
          value={values?.numberOfVisitsOfDoctor || ""}
          onChange={(e) =>
            onChange({
              name: "numberOfVisitsOfDoctor",
              value: e.target.value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "numberOfVisitsOfDoctor",
              value: values?.numberOfVisitsOfDoctor,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Treatment Type"
          placeholder="Treatment Type"
          required
          withAsterisk
          searchable
          data={treatmentTypeOptions}
          value={values?.treatmentType || ""}
          onChange={(e) =>
            onChange({
              name: "treatmentType",
              value: e,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "treatmentType",
              value: values?.treatmentType,
            })
          }
        />
      </Grid.Col>
      {values?.treatmentType === "Surgical" && (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Name of procedure"
              placeholder="Name of procedure"
              required
              withAsterisk
              value={values?.surgicalTreatmentType?.nameOfProcedure || ""}
              onChange={(e) =>
                onChange({
                  name: ["surgicalTreatmentType", "nameOfProcedure"],
                  value: e.target.value,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "surgicalTreatmentType",
                  value: values?.surgicalTreatmentType,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateInput
              label="Date of Surgery"
              placeholder="Date of Surgery"
              required
              withAsterisk
              clearable
              maxDate={new Date()}
              value={
                values?.surgicalTreatmentType?.dateOfSurgery
                  ? dayjs(values?.surgicalTreatmentType?.dateOfSurgery).toDate()
                  : null
              }
              onChange={(date) =>
                onChange({
                  name: ["surgicalTreatmentType", "dateOfSurgery"],
                  value: date,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "surgicalTreatmentType",
                  value: values?.surgicalTreatmentType,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TimePicker
              label="Time of Surgery"
              value={
                values?.surgicalTreatmentType?.timeOfSurgery
                  ? dayjs(values?.surgicalTreatmentType?.timeOfSurgery).format(
                      "HH:mm:ss"
                    )
                  : ""
              }
              onChange={(time) => {
                onChange({
                  name: ["surgicalTreatmentType", "timeOfSurgery"],
                  value: dayjs(time, "HH:mm:ss").toDate(),
                });
              }}
              onBlur={() =>
                handleBlur({
                  key: "surgicalTreatmentType",
                  value: values?.surgicalTreatmentType,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Anesthesia Given?"
              placeholder="Anesthesia Given?"
              required
              withAsterisk
              searchable
              data={anesthesiaOptions}
              value={values?.surgicalTreatmentType?.anesthesiaGiven || ""}
              onChange={(e) =>
                onChange({
                  name: ["surgicalTreatmentType", "anesthesiaGiven"],
                  value: e,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "surgicalTreatmentType",
                  value: values?.surgicalTreatmentType,
                })
              }
            />
          </Grid.Col>
          {values?.surgicalTreatmentType?.anesthesiaGiven === "Yes" && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Type of Anesthesia"
                placeholder="Type of Anesthesia"
                required
                withAsterisk
                searchable
                data={typeOfAnesthesiaOptions}
                value={values?.surgicalTreatmentType?.typeOfAnesthesia || ""}
                onChange={(e) =>
                  onChange({
                    name: ["surgicalTreatmentType", "typeOfAnesthesia"],
                    value: e,
                  })
                }
                onBlur={() =>
                  handleBlur({
                    key: "surgicalTreatmentType",
                    value: values?.surgicalTreatmentType,
                  })
                }
              />
            </Grid.Col>
          )}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Name of surgeon"
              placeholder="Name of surgeon"
              required
              withAsterisk
              value={values?.surgicalTreatmentType?.nameOfSurgeon || ""}
              onChange={(e) =>
                onChange({
                  name: ["surgicalTreatmentType", "nameOfSurgeon"],
                  value: e.target.value,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "surgicalTreatmentType",
                  value: values?.surgicalTreatmentType,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Name of Anesthetist"
              placeholder="Name of Anesthetist"
              required
              withAsterisk
              value={values?.surgicalTreatmentType?.nameOfAnesthetist || ""}
              onChange={(e) =>
                onChange({
                  name: ["surgicalTreatmentType", "nameOfAnesthetist"],
                  value: e.target.value,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "surgicalTreatmentType",
                  value: values?.surgicalTreatmentType,
                })
              }
            />
          </Grid.Col>
        </Fragment>
      )}

      <Grid.Col span={{ base: 12, md: 6 }}>
        <MultiSelect
          label="Class of accommodation"
          placeholder="Class of accommodation"
          required
          withAsterisk
          searchable
          data={rmClassOfAccommodationOptions}
          hidePickedOptions
          value={values?.classOfAccommodation || []}
          onChange={(value) => {
            onChange({
              name: "classOfAccommodationDetails",
              value: value?.map((v) => ({ name: v })),
            });
            onChange({
              name: "classOfAccommodation",
              value,
            });
          }}
          onBlur={() => {
            handleBlur({
              key: "surgicalTreatmentType",
              value: {
                classOfAccommodationDetails:
                  values?.classOfAccommodationDetails,
                classOfAccommodation: values?.classOfAccommodation,
              },
              isBulk: true,
            });
          }}
        />
      </Grid.Col>
      {values?.classOfAccommodation &&
        values?.classOfAccommodation?.length > 0 &&
        values?.classOfAccommodation?.map((el, ind) => (
          <Fragment key={ind}>
            {el === "Other" && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Specify Other"
                  placeholder="Specify Other"
                  required
                  withAsterisk
                  value={
                    values?.classOfAccommodationDetails?.[ind]?.othersSpecify ||
                    ""
                  }
                  onChange={(e) =>
                    onChange({
                      name: [
                        "classOfAccommodationDetails",
                        ind,
                        "nameOfSurgeon",
                      ],
                      value: e.target.value,
                      isArrayOfObjects: true,
                    })
                  }
                  onBlur={() =>
                    handleBlur({
                      key: "classOfAccommodationDetails",
                      value: values?.classOfAccommodationDetails,
                    })
                  }
                />
              </Grid.Col>
            )}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput
                label={`From Date in ${el}`}
                placeholder={`From Date in ${el}`}
                required
                withAsterisk
                clearable
                maxDate={new Date()}
                value={
                  values?.classOfAccommodationDetails?.[ind]?.fromDate
                    ? dayjs(
                        values?.classOfAccommodationDetails?.[ind]?.fromDate
                      ).toDate()
                    : null
                }
                onChange={(date) =>
                  onChange({
                    name: ["classOfAccommodationDetails", ind, "fromDate"],
                    value: date,
                    isArrayOfObjects: true,
                  })
                }
                onBlur={() =>
                  handleBlur({
                    key: "classOfAccommodationDetails",
                    value: values?.classOfAccommodationDetails,
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput
                label={`To Date in ${el}`}
                placeholder={`To Date in ${el}`}
                required
                withAsterisk
                clearable
                maxDate={new Date()}
                value={
                  values?.classOfAccommodationDetails?.[ind]?.toDate
                    ? dayjs(
                        values?.classOfAccommodationDetails?.[ind]?.toDate
                      ).toDate()
                    : null
                }
                onChange={(date) =>
                  onChange({
                    name: ["classOfAccommodationDetails", ind, "toDate"],
                    value: date,
                    isArrayOfObjects: true,
                  })
                }
                onBlur={() =>
                  handleBlur({
                    key: "classOfAccommodationDetails",
                    value: values?.classOfAccommodationDetails,
                  })
                }
              />
            </Grid.Col>
          </Fragment>
        ))}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Attendant details at the time of Admission"
          placeholder="Attendant details at the time of Admission"
          required
          withAsterisk
          searchable
          data={attendantDetailsAtTheTimeOfAdmissionOptions}
          value={values?.attendantDetailsAtTheTimeOfAdmission || ""}
          onChange={(e) =>
            onChange({
              name: "attendantDetailsAtTheTimeOfAdmission",
              value: e,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "attendantDetailsAtTheTimeOfAdmission",
              value: values?.attendantDetailsAtTheTimeOfAdmission,
            })
          }
        />
      </Grid.Col>
      {values?.attendantDetailsAtTheTimeOfAdmission === "Shared" && (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Name of attendant"
              placeholder="Name of attendant"
              required
              withAsterisk
              value={values?.attendantDetails?.name || ""}
              onChange={(e) =>
                onChange({
                  name: ["attendantDetails", "name"],
                  value: e.target.value,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "attendantDetails",
                  value: values?.attendantDetails,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Gender"
              placeholder="Gender"
              required
              withAsterisk
              data={genderOptions}
              value={values?.attendantDetails?.gender || ""}
              onChange={(value) =>
                onChange({
                  name: ["attendantDetails", "gender"],
                  value,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "attendantDetails",
                  value: values?.attendantDetails,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Relationship"
              placeholder="Relationship"
              required
              withAsterisk
              searchable
              data={rmRelationshipOptions}
              value={values?.attendantDetails?.relationship || ""}
              onChange={(e) =>
                onChange({
                  name: ["attendantDetails", "relationship"],
                  value: e,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "attendantDetails",
                  value: values?.attendantDetails,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Mobile Number"
              placeholder="Mobile Number"
              required
              withAsterisk
              value={values?.attendantDetails?.mobileNo || ""}
              onChange={(e) =>
                onChange({
                  name: ["attendantDetails", "mobileNo"],
                  value: e,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "attendantDetails",
                  value: values?.attendantDetails,
                })
              }
            />
          </Grid.Col>
        </Fragment>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Medicine"
          placeholder="Medicine"
          required
          withAsterisk
          searchable
          data={medicinesOptions}
          value={values?.medicines || ""}
          onChange={(e) =>
            onChange({
              name: "medicines",
              value: e,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "medicines",
              value: values?.medicines,
            })
          }
        />
      </Grid.Col>
      {!!values?.medicines && (
        <Fragment>
          {values?.medicines === "Outsourced" && (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Cost of Medicine Bills"
                  placeholder="Cost of Medicine Bills"
                  required
                  withAsterisk
                  value={values?.medicinesDetail?.costOfMedicineBill || ""}
                  onChange={(value) =>
                    onChange({
                      name: ["medicinesDetail", "costOfMedicineBill"],
                      value,
                    })
                  }
                  onBlur={() =>
                    handleBlur({
                      key: "medicinesDetail",
                      value: values?.medicinesDetail,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Payment Mode"
                  placeholder="Payment Mode"
                  required
                  withAsterisk
                  searchable
                  data={paymentMethodOptions}
                  value={values?.medicinesDetail?.paymentMode || ""}
                  onChange={(value) =>
                    onChange({
                      name: ["medicinesDetail", "paymentMode"],
                      value,
                    })
                  }
                  onBlur={() =>
                    handleBlur({
                      key: "medicinesDetail",
                      value: values?.medicinesDetail,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Remark"
                  placeholder="Remark"
                  required
                  withAsterisk
                  value={values?.medicinesDetail?.remark || ""}
                  onChange={(e) =>
                    onChange({
                      name: ["medicinesDetail", "remark"],
                      value: e.target.value,
                    })
                  }
                  onBlur={() =>
                    handleBlur({
                      key: "medicinesDetail",
                      value: values?.medicinesDetail,
                    })
                  }
                />
              </Grid.Col>
            </Fragment>
          )}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Medicine Returned?"
              placeholder="Medicine Returned?"
              required
              withAsterisk
              searchable
              data={yesNoOptions}
              value={values?.medicinesDetail?.medicinesReturned || ""}
              onChange={(value) =>
                onChange({
                  name: ["medicinesDetail", "medicinesReturned"],
                  value,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "medicinesDetail",
                  value: values?.medicinesDetail,
                })
              }
            />
          </Grid.Col>
          {values?.medicinesDetail?.medicinesReturned === "Yes" && (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Amount Refunded"
                  placeholder="Amount Refunded"
                  required
                  withAsterisk
                  value={values?.medicinesDetail?.amountRefunded || ""}
                  onChange={(value) =>
                    onChange({
                      name: ["medicinesDetail", "amountRefunded"],
                      value,
                    })
                  }
                  onBlur={() =>
                    handleBlur({
                      key: "medicinesDetail",
                      value: values?.medicinesDetail,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Refund Invoice"
                  placeholder="Medicine Returned?"
                  required
                  withAsterisk
                  searchable
                  data={refundInvoiceOptions}
                  value={values?.medicinesDetail?.refundInvoice || ""}
                  onChange={(value) =>
                    onChange({
                      name: ["medicinesDetail", "refundInvoice"],
                      value,
                    })
                  }
                  onBlur={() =>
                    handleBlur({
                      key: "medicinesDetail",
                      value: values?.medicinesDetail,
                    })
                  }
                />
              </Grid.Col>
            </Fragment>
          )}
        </Fragment>
      )}

      <Grid.Col span={{ base: 12, md: 6 }}>
        <NumberInput
          label="Amount Paid to Hospital"
          placeholder="Amount Paid to Hospital"
          required
          withAsterisk
          value={values?.amountPaidToHospital?.value || ""}
          onChange={(value) =>
            onChange({
              name: ["amountPaidToHospital", "value"],
              value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "amountPaidToHospital",
              value: values?.amountPaidToHospital,
            })
          }
        />
      </Grid.Col>
      {values?.amountPaidToHospital?.value && (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Payment Mode"
              placeholder="Payment Mode"
              required
              withAsterisk
              searchable
              data={paymentMethodOptions}
              value={values?.amountPaidToHospital?.paymentMode || ""}
              onChange={(value) =>
                onChange({
                  name: ["amountPaidToHospital", "paymentMode"],
                  value,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "amountPaidToHospital",
                  value: values?.amountPaidToHospital,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Remark"
              placeholder="Remark"
              required
              withAsterisk
              value={values?.amountPaidToHospital?.remark || ""}
              onChange={(e) =>
                onChange({
                  name: ["amountPaidToHospital", "remark"],
                  value: e.target.value,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "amountPaidToHospital",
                  value: values?.amountPaidToHospital,
                })
              }
            />
          </Grid.Col>
        </Fragment>
      )}

      <Grid.Col span={{ base: 12, md: 6 }}>
        <NumberInput
          label="Amount Paid to Diagnostic Tests"
          placeholder="Amount Paid to Diagnostic Tests"
          required
          withAsterisk
          value={values?.amountPaidForDiagnosticTests?.value || ""}
          onChange={(value) =>
            onChange({
              name: ["amountPaidForDiagnosticTests", "value"],
              value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "amountPaidForDiagnosticTests",
              value: values?.amountPaidForDiagnosticTests,
            })
          }
        />
      </Grid.Col>
      {!!values?.amountPaidForDiagnosticTests?.value && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Payment Mode"
            placeholder="Payment Mode"
            required
            withAsterisk
            searchable
            data={paymentMethodOptions}
            value={values?.amountPaidForDiagnosticTests?.paymentMode || ""}
            onChange={(value) =>
              onChange({
                name: ["amountPaidForDiagnosticTests", "paymentMode"],
                value,
              })
            }
            onBlur={() =>
              handleBlur({
                key: "amountPaidForDiagnosticTests",
                value: values?.amountPaidForDiagnosticTests,
              })
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Any other amount paid?"
          placeholder="Any other amount paid?"
          required
          withAsterisk
          searchable
          data={yesNoNAOptions}
          value={values?.anyOtherAmountPaid?.value || ""}
          onChange={(value) =>
            onChange({
              name: ["anyOtherAmountPaid", "value"],
              value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "anyOtherAmountPaid",
              value: values?.anyOtherAmountPaid,
            })
          }
        />
      </Grid.Col>
      {values?.anyOtherAmountPaid?.value === "Yes" && (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Amount Paid"
              placeholder="Amount Paid"
              required
              withAsterisk
              value={values?.anyOtherAmountPaid?.amount || ""}
              onChange={(value) =>
                onChange({
                  name: ["anyOtherAmountPaid", "amount"],
                  value,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "anyOtherAmountPaid",
                  value: values?.anyOtherAmountPaid,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Payment Mode"
              placeholder="Payment Mode"
              required
              withAsterisk
              searchable
              data={paymentMethodOptions}
              value={values?.anyOtherAmountPaid?.paymentMode || ""}
              onChange={(value) =>
                onChange({
                  name: ["anyOtherAmountPaid", "paymentMode"],
                  value,
                })
              }
              onBlur={() =>
                handleBlur({
                  key: "anyOtherAmountPaid",
                  value: values?.anyOtherAmountPaid,
                })
              }
            />
          </Grid.Col>
        </Fragment>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <NumberInput
          label="Total amount paid"
          placeholder="Total amount paid"
          value={values?.totalAmountPaid || "0"}
          disabled
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Remark"
          placeholder="Remark"
          required
          withAsterisk
          value={values?.remarks || ""}
          onChange={(e) =>
            onChange({
              name: "remarks",
              value: e.target.value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "remarks",
              value: values?.remarks,
            })
          }
        />
      </Grid.Col>
      <PatientHabitFormParts
        values={values}
        onChange={(vals) => setValues(vals as IInsuredVerification)}
        handleBlur={handleBlur}
      />
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="PED/Non-Disclosure"
          placeholder="PED/Non-Disclosure"
          data={yesNoNAOptions}
          searchable
          clearable
          required
          withAsterisk
          value={values?.pedOrNonDisclosure?.value || ""}
          onChange={(val) => {
            setValues((prev) => ({
              ...prev,
              pedOrNonDisclosure: {
                ...prev?.pedOrNonDisclosure,
                value: val || "",
              },
            }));
          }}
          onBlur={() =>
            handleBlur({
              key: "pedOrNonDisclosure",
              value: values?.pedOrNonDisclosure,
            })
          }
        />
      </Grid.Col>
      {values?.pedOrNonDisclosure?.value === "Yes" && (
        <AilmentFormParts
          values={values}
          onChange={(vals) => setValues(vals as IInsuredVerification)}
          handleBlur={handleBlur}
        />
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Insured/Attendant Co-operation"
          placeholder="Insured/Attendant Co-operation"
          data={yesNoOptions}
          searchable
          clearable
          required
          withAsterisk
          value={values?.insuredOrAttendantCooperation || ""}
          onChange={(val) => {
            onChange({ name: "insuredOrAttendantCooperation", value: val });
          }}
          onBlur={() =>
            handleBlur({
              key: "insuredOrAttendantCooperation",
              value: values?.insuredOrAttendantCooperation,
            })
          }
        />
      </Grid.Col>
      {values?.insuredOrAttendantCooperation === "No" && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Reason for insured not co-operating"
            placeholder="Reason for insured not co-operating"
            required
            withAsterisk
            value={values?.reasonForInsuredNotCooperating || ""}
            onChange={(e) =>
              onChange({
                name: "reasonForInsuredNotCooperating",
                value: e.target.value,
              })
            }
            onBlur={() =>
              handleBlur({
                key: "reasonForInsuredNotCooperating",
                value: values?.reasonForInsuredNotCooperating,
              })
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Textarea
          label="Verification Summary"
          placeholder="Verification Summary"
          required
          withAsterisk
          resize="vertical"
          value={values?.verificationSummary || ""}
          onChange={(e) =>
            onChange({
              name: "verificationSummary",
              value: e.target.value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "verificationSummary",
              value: values?.verificationSummary,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Textarea
          label="Discrepancies/Irregularities Observed"
          placeholder="Discrepancies/Irregularities Observed"
          required
          withAsterisk
          resize="vertical"
          value={values?.discrepanciesOrIrregularitiesObserved || ""}
          onChange={(e) =>
            onChange({
              name: "discrepanciesOrIrregularitiesObserved",
              value: e.target.value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "discrepanciesOrIrregularitiesObserved",
              value: values?.discrepanciesOrIrregularitiesObserved,
            })
          }
        />
      </Grid.Col>
    </Fragment>
  );
};

export default InsuredVisitDoneForm;
