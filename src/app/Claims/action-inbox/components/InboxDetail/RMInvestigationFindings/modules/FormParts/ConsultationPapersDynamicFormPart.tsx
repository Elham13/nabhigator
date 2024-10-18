import React, { Dispatch, Fragment, SetStateAction } from "react";
import {
  consultationIsRelatedToDiagnosisOptions,
  consultationOrFollowupOptions,
  yesNAOptions,
} from "@/lib/utils/constants/options";
import {
  Divider,
  Grid,
  Select,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IConsultationPaperAndDoctorDetail,
  IPrePostVerification,
} from "@/lib/utils/types/rmDataTypes";

interface IProps {
  values: IPrePostVerification;
  setValues: Dispatch<SetStateAction<IPrePostVerification>>;
  onBlur: ({}: { key: keyof IPrePostVerification; value: any }) => void;
}

const ConsultationPapersDynamicFormPart = ({
  values,
  setValues,
  onBlur,
}: IProps) => {
  const handleCPChange = (
    name: keyof IConsultationPaperAndDoctorDetail,
    value: any
  ) => {
    const consultationPaperAndDoctorDetail: any =
      values?.consultationPaperAndDoctorDetail || {};
    consultationPaperAndDoctorDetail[name] = value;
    setValues((prev) => ({ ...prev, consultationPaperAndDoctorDetail }));
  };

  return (
    <Fragment>
      <Divider my="md" />
      <Grid.Col span={12}>
        <Title order={5}>
          Consultation Paper and Doctor Verification Summary
        </Title>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Consultation Papers and Doctor Verified?"
          placeholder="Consultation Papers and Doctor Verified?"
          withAsterisk
          required
          data={yesNAOptions}
          clearable
          searchable
          value={values?.consultationPaperAndDoctorVerified || ""}
          onChange={(val) =>
            setValues((prev) => ({
              ...prev,
              consultationPaperAndDoctorVerified: val || "",
            }))
          }
          onBlur={() =>
            onBlur({
              key: "consultationPaperAndDoctorVerified",
              value: values?.consultationPaperAndDoctorVerified,
            })
          }
        />
      </Grid.Col>
      {values?.consultationPaperAndDoctorVerified === "Yes" && (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Doctor Name"
              placeholder="Doctor Name"
              withAsterisk
              required
              value={values?.consultationPaperAndDoctorDetail?.doctorName || ""}
              onChange={(e) => handleCPChange("doctorName", e.target.value)}
              onBlur={() =>
                onBlur({
                  key: "consultationPaperAndDoctorDetail",
                  value: values?.consultationPaperAndDoctorDetail,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Consultation/Followup confirmation"
              placeholder="Consultation/Followup confirmation"
              withAsterisk
              required
              clearable
              searchable
              data={consultationOrFollowupOptions}
              value={
                values?.consultationPaperAndDoctorDetail
                  ?.consultationOrFollowUpConfirmation || ""
              }
              onChange={(val) =>
                handleCPChange("consultationOrFollowUpConfirmation", val || "")
              }
              onBlur={() =>
                onBlur({
                  key: "consultationPaperAndDoctorDetail",
                  value: values?.consultationPaperAndDoctorDetail,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Whether Consultations/ Follow-up is related to Diagnosis/Procedure for which hospitalization was necessitated"
              placeholder="Whether Consultations/ Follow-up is related to Diagnosis/Procedure for which hospitalization was necessitated"
              withAsterisk
              required
              clearable
              searchable
              data={consultationIsRelatedToDiagnosisOptions}
              value={
                values?.consultationPaperAndDoctorDetail
                  ?.consultationIsRelatedToDiagnosis || ""
              }
              onChange={(val) =>
                handleCPChange("consultationIsRelatedToDiagnosis", val || "")
              }
              onBlur={() =>
                onBlur({
                  key: "consultationPaperAndDoctorDetail",
                  value: values?.consultationPaperAndDoctorDetail,
                })
              }
            />
          </Grid.Col>
          <Grid.Col>
            <Textarea
              label="Observation"
              placeholder="Observation"
              resize="vertical"
              required
              withAsterisk
              value={
                values?.consultationPaperAndDoctorDetail?.observation || ""
              }
              onChange={(e) =>
                handleCPChange("observation", e.target.value || "")
              }
              onBlur={() =>
                onBlur({
                  key: "consultationPaperAndDoctorDetail",
                  value: values?.consultationPaperAndDoctorDetail,
                })
              }
            />
          </Grid.Col>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ConsultationPapersDynamicFormPart;
