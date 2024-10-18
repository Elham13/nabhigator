import React, { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import dayjs from "dayjs";
import {
  Grid,
  Title,
  Divider,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import TimePicker from "@/components/TimePicker";
import {
  IHospitalDailyCashPart,
  IInsuredCooperationDetails,
} from "@/lib/utils/types/rmDataTypes";
import {
  classOfAccommodationOptions,
  yesNAOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";

type PropTypes = {
  values: IHospitalDailyCashPart;
  setValues: Dispatch<SetStateAction<IHospitalDailyCashPart>>;
  onBlur: ({}: { key: keyof IHospitalDailyCashPart; value: any }) => void;
};
const InsuredVisitSummary = ({ values, setValues, onBlur }: PropTypes) => {
  const cooperation =
    values?.insuredCooperationDetail || ({} as IInsuredCooperationDetails);

  const handleChange = (name: keyof IInsuredCooperationDetails, value: any) => {
    setValues((prev) => ({
      ...prev,
      insuredCooperationDetail: {
        ...cooperation,
        [name]: value,
      },
    }));
  };

  useEffect(() => {
    const dateOfAdmissionSystem = cooperation?.dateOfAdmissionSystem;
    const dateOfAdmissionUser = cooperation?.dateOfAdmissionUser;
    const timeOfDischargeSystem = cooperation?.timeOfDischargeSystem;
    const timeOfDischargeUser = cooperation?.timeOfDischargeUser;

    const calculateDuration = (
      dateOfAdmission?: string,
      timeOfDischarge?: string
    ) => {
      if (!dateOfAdmission || !timeOfDischarge) return "";

      const dateDuration = dayjs().diff(dayjs(dateOfAdmission));
      const timeDuration = dayjs().diff(dayjs(timeOfDischarge));

      const days = Math.floor(dateDuration / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      return `${days} days and ${hours} hours`;
    };

    const updatedDetail = {
      ...cooperation,
      durationOfHospitalizationSystem: calculateDuration(
        dateOfAdmissionSystem,
        timeOfDischargeSystem
      ),
      durationOfHospitalizationUser: calculateDuration(
        dateOfAdmissionUser,
        timeOfDischargeUser
      ),
    };

    setValues((prev) => ({ ...prev, insuredCooperationDetail: updatedDetail }));
  }, [
    cooperation?.dateOfAdmissionSystem,
    cooperation?.timeOfDischargeSystem,
    cooperation?.dateOfAdmissionUser,
    cooperation?.timeOfDischargeUser,
  ]);

  return (
    <Fragment>
      <Divider my="md" />
      <Grid.Col span={12}>
        <Title order={5}>Insured Visit Summary</Title>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Insured Visited?"
          placeholder="Insured Visited?"
          required
          withAsterisk
          searchable
          clearable
          data={yesNAOptions}
          value={values?.insuredVisit || ""}
          onChange={(val) =>
            setValues((prev) => ({ ...prev, insuredVisit: val || "" }))
          }
          onBlur={() =>
            onBlur({ key: "insuredVisit", value: values?.insuredVisit })
          }
        />
      </Grid.Col>
      {values?.insuredVisit === "Yes" && (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Insured Cooperating?"
              placeholder="Insured Cooperating?"
              required
              withAsterisk
              searchable
              clearable
              data={yesNoOptions}
              value={values?.insuredCooperation || ""}
              onChange={(val) =>
                setValues((prev) => ({
                  ...prev,
                  insuredCooperation: val || "",
                }))
              }
              onBlur={() =>
                onBlur({
                  key: "insuredCooperation",
                  value: values?.insuredCooperation,
                })
              }
            />
          </Grid.Col>
          {values?.insuredCooperation === "No" ? (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Remarks on insured not cooperating"
                placeholder="Remarks on insured not cooperating"
                required
                withAsterisk
                value={values?.insuredNotCooperatingReason || ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    insuredNotCooperatingReason: e.target.value || "",
                  }))
                }
                onBlur={() =>
                  onBlur({
                    key: "insuredNotCooperatingReason",
                    value: values?.insuredNotCooperatingReason,
                  })
                }
              />
            </Grid.Col>
          ) : values?.insuredCooperation === "Yes" ? (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Date of visit to insured"
                  placeholder="Date of visit to insured"
                  required
                  withAsterisk
                  clearable
                  maxDate={new Date()}
                  value={
                    cooperation?.dateOfVisitToInsured
                      ? dayjs(cooperation?.dateOfVisitToInsured).toDate()
                      : null
                  }
                  onChange={(date) =>
                    handleChange("dateOfVisitToInsured", date)
                  }
                  onBlur={() =>
                    onBlur({
                      key: "insuredCooperationDetail",
                      value: cooperation,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TimePicker
                  label="Time of visit to insured"
                  value={
                    cooperation?.timeOfVisitToInsured
                      ? dayjs(cooperation?.timeOfVisitToInsured).format(
                          "HH:mm:ss"
                        )
                      : ""
                  }
                  onChange={(time) => {
                    handleChange(
                      "timeOfVisitToInsured",
                      dayjs(time, "HH:mm:ss").toDate()
                    );
                  }}
                  onBlur={() => {
                    onBlur({
                      key: "insuredCooperationDetail",
                      value: cooperation,
                    });
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Name of insured (System Fetch)"
                  disabled
                  value={cooperation?.nameOfInsuredSystem || ""}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Name of insured (User Feed)"
                  placeholder="Name of insured (User Feed)"
                  required
                  withAsterisk
                  value={cooperation?.nameOfInsuredUser || ""}
                  onChange={(e) => {
                    handleChange("nameOfInsuredUser", e.target.value);
                  }}
                  onBlur={() => {
                    onBlur({
                      key: "insuredCooperationDetail",
                      value: cooperation,
                    });
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Date of Admission (System Fetch)"
                  placeholder="Date of Admission (System Fetch)"
                  maxDate={new Date()}
                  disabled
                  value={
                    cooperation?.dateOfAdmissionSystem
                      ? dayjs(cooperation?.dateOfAdmissionSystem).toDate()
                      : null
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Date of Admission (User Feed)"
                  placeholder="Date of Admission (User Feed)"
                  required
                  withAsterisk
                  clearable
                  maxDate={new Date()}
                  value={
                    cooperation?.dateOfAdmissionUser
                      ? dayjs(cooperation?.dateOfAdmissionUser).toDate()
                      : null
                  }
                  onChange={(date) => handleChange("dateOfAdmissionUser", date)}
                  onBlur={() =>
                    onBlur({
                      key: "insuredCooperationDetail",
                      value: cooperation,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TimePicker
                  label="Time of Discharge (System Fetch)"
                  disabled
                  value={
                    cooperation?.timeOfDischargeSystem
                      ? dayjs(cooperation?.timeOfDischargeSystem).format(
                          "HH:mm:ss"
                        )
                      : ""
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TimePicker
                  label="Time of Discharge (User Feed)"
                  value={
                    cooperation?.timeOfDischargeUser
                      ? dayjs(cooperation?.timeOfDischargeUser).format(
                          "HH:mm:ss"
                        )
                      : ""
                  }
                  onChange={(time) => {
                    handleChange(
                      "timeOfDischargeUser",
                      dayjs(time, "HH:mm:ss").toDate()
                    );
                  }}
                  onBlur={() => {
                    onBlur({
                      key: "insuredCooperationDetail",
                      value: cooperation,
                    });
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Number of days and hours of Hospitalization (System Fetch)"
                  placeholder="Number of days and hours of Hospitalization (System Fetch)"
                  defaultValue={
                    cooperation?.durationOfHospitalizationSystem || ""
                  }
                  disabled
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Number of days and hours of Hospitalization (User Feed)"
                  placeholder="Number of days and hours of Hospitalization (User Feed)"
                  defaultValue={
                    cooperation?.durationOfHospitalizationUser || ""
                  }
                  disabled
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Diagnosis"
                  placeholder="Diagnosis"
                  required
                  withAsterisk
                  value={cooperation?.diagnosis || ""}
                  onChange={(e) => {
                    handleChange("diagnosis", e.target.value);
                  }}
                  onBlur={() => {
                    onBlur({
                      key: "insuredCooperationDetail",
                      value: cooperation,
                    });
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Class of accommodation"
                  placeholder="Class of accommodation"
                  required
                  withAsterisk
                  searchable
                  clearable
                  data={classOfAccommodationOptions}
                  value={cooperation?.classOfAccommodation || ""}
                  onChange={(val) =>
                    handleChange("classOfAccommodation", val || "")
                  }
                  onBlur={() =>
                    onBlur({
                      key: "insuredCooperationDetail",
                      value: cooperation,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Discrepancies Observed"
                  placeholder="Discrepancies Observed"
                  required
                  withAsterisk
                  resize="vertical"
                  value={cooperation?.discrepanciesObserved || ""}
                  onChange={(e) =>
                    handleChange("discrepanciesObserved", e.target.value || "")
                  }
                  onBlur={() =>
                    onBlur({
                      key: "insuredCooperationDetail",
                      value: cooperation,
                    })
                  }
                />
              </Grid.Col>
            </Fragment>
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
};

export default InsuredVisitSummary;
