import React, { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import dayjs from "dayjs";
import {
  Divider,
  Grid,
  Select,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import TimePicker from "@/components/TimePicker";
import {
  IHospitalCooperationDetail,
  IHospitalDailyCashPart,
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
const HospitalVisitSummary = ({ values, setValues, onBlur }: PropTypes) => {
  const cooperation =
    values?.hospitalCooperationDetail || ({} as IHospitalCooperationDetail);

  const handleChange = (name: keyof IHospitalCooperationDetail, value: any) => {
    setValues((prev) => ({
      ...prev,
      hospitalCooperationDetail: {
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
      dateOfAdmission?: any,
      timeOfDischarge?: any
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

    setValues((prev) => ({
      ...prev,
      hospitalCooperationDetail: updatedDetail,
    }));
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
        <Title order={5}>Hospital Visit Summary</Title>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Hospital Visited?"
          placeholder="Hospital Visited?"
          required
          withAsterisk
          searchable
          clearable
          data={yesNAOptions}
          value={values?.hospitalVisit || ""}
          onChange={(val) =>
            setValues((prev) => ({ ...prev, hospitalVisit: val || "" }))
          }
          onBlur={() =>
            onBlur({ key: "hospitalVisit", value: values?.hospitalVisit })
          }
        />
      </Grid.Col>

      {values?.hospitalVisit === "Yes" && (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Hospital Cooperating?"
              placeholder="Hospital Cooperating?"
              required
              withAsterisk
              searchable
              clearable
              data={yesNoOptions}
              value={values?.hospitalCooperation || ""}
              onChange={(val) =>
                setValues((prev) => ({
                  ...prev,
                  hospitalCooperation: val || "",
                }))
              }
              onBlur={() =>
                onBlur({
                  key: "hospitalCooperation",
                  value: values?.hospitalCooperation,
                })
              }
            />
          </Grid.Col>

          {values?.hospitalCooperation === "No" ? (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Remarks on hospital not cooperating"
                placeholder="Remarks on hospital not cooperating"
                required
                withAsterisk
                value={values?.hospitalNotCooperatingReason || ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    hospitalNotCooperatingReason: e.target.value || "",
                  }))
                }
                onBlur={() =>
                  onBlur({
                    key: "hospitalNotCooperatingReason",
                    value: values?.hospitalNotCooperatingReason,
                  })
                }
              />
            </Grid.Col>
          ) : values?.insuredCooperation === "Yes" ? (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Date of visit to hospital"
                  placeholder="Date of visit to hospital"
                  required
                  withAsterisk
                  clearable
                  maxDate={new Date()}
                  value={
                    cooperation?.dateOfVisitToHospital
                      ? dayjs(cooperation?.dateOfVisitToHospital).toDate()
                      : null
                  }
                  onChange={(date) =>
                    handleChange("dateOfVisitToHospital", date)
                  }
                  onBlur={() =>
                    onBlur({
                      key: "hospitalCooperationDetail",
                      value: cooperation,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TimePicker
                  label="Time of visit to hospital"
                  value={
                    cooperation?.timeOfVisitToHospital
                      ? dayjs(cooperation?.timeOfVisitToHospital).format(
                          "HH:mm:ss"
                        )
                      : ""
                  }
                  onChange={(time) => {
                    handleChange(
                      "timeOfVisitToHospital",
                      dayjs(time, "HH:mm:ss").toDate()
                    );
                  }}
                  onBlur={() => {
                    onBlur({
                      key: "hospitalCooperationDetail",
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
                      key: "hospitalCooperationDetail",
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
                      key: "hospitalCooperationDetail",
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
                      key: "hospitalCooperationDetail",
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
                      key: "hospitalCooperationDetail",
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
                      key: "hospitalCooperationDetail",
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

export default HospitalVisitSummary;
