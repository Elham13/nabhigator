import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Grid,
  MultiSelect,
  NumberInput,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import {
  CaseDetail,
  IDashboardData,
  IInvestigationFindings,
  RevisedInvestigationFindings,
  SingleResponseType,
  TGender,
  TYesNo,
} from "@/lib/utils/types/fniDataTypes";
import { useLocalStorage } from "@mantine/hooks";
import { getSelectOption } from "@/lib/helpers";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import {
  ailmentOptions,
  attendantDetailsOptions,
  cancelledAdmissionOptions,
  classOfAccommodationOptions,
  differedAdmissionOptions,
  genderOptions,
  hospitalizationStatusOptions,
  nonCooperationOfOptions,
  occupationOptions,
  otherPolicyWithNBHIOptions,
  otherRecommendationDetailsOptions,
  otherRecommendationOptions,
  personalHabitOptions,
  relationshipOptions,
  yesNoNAOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";
import { useAxios } from "@/lib/hooks/useAxios";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import TimePicker from "@/components/TimePicker";
import FileUploadFooter from "@/components/ClaimsComponents/FileUpload/FileUploadFooter";
import FileUpload from "@/components/ClaimsComponents/FileUpload";
import { tempDocInitials } from "@/lib/utils/constants";

const initialValues: IInvestigationFindings = {
  dateOfVisitToInsured: null,
  dateOfVisitToHospital: null,
  hospitalizationStatus: {
    value: "",
    differedAdmission: "",
    cancelledAdmission: "",
  },
  hospitalizationDetails: {
    dateOfAdmission: null,
    timeOfAdmission: null,
    dateOfDischarge: null,
    timeOfDischarge: null,
    tentativeDateOfAdmission: null,
    tentativeDateOfDischarge: null,
    proposedDateOfAdmission: null,
    proposedDateOfDischarge: null,
  },
  patientDetails: {
    patientName: "",
    patientAge: 0,
    patientGender: "",
    revisedPatientName: "",
    revisedPatientAge: 0,
    revisedPatientGender: "",
  },
  attendantDetails: {
    name: "",
  },
  occupationOfInsured: "",
  workPlaceDetails: "",
  anyOtherPolicyWithNBHI: "",
  anyPreviousClaimWithNBHI: "",
  insurancePolicyOtherThanNBHI: {
    hasPolicy: "",
  },
  classOfAccommodation: {
    status: "",
  },
  changeInClassOfAccommodation: {
    status: "",
  },
  patientOnActiveLineOfTreatment: {
    status: "",
  },
  mismatchInDiagnosis: {
    status: "",
  },
  discrepancies: {
    status: "",
  },
  patientHabit: [],
  ailment: [],
  port: "",
  investigationSummary: "",
  recommendation: { value: "", code: "" },
  otherRecommendation: [],
  frcuGroundOfRepudiation: [],
  evidenceDocs: [],
};

type PropTypes = {
  formPart?: "Insured" | "Hospital";
  isQa?: boolean;
  findings: RevisedInvestigationFindings | null;
  dashboardData: IDashboardData | null;
  caseId: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const InvestigationFindings = ({
  formPart,
  isQa,
  findings,
  dashboardData,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const firstReqDone = useRef<boolean>(false);
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const [values, setValues] = useState<IInvestigationFindings>(initialValues);

  const { refetch: submit } = useAxios<SingleResponseType<CaseDetail | null>>({
    config: { url: EndPoints.CAPTURE_INVESTIGATION_FINDINGS, method: "POST" },
    dependencyArr: [],
    isMutation: true,
    onDone: (res) => {
      if (res?.data) setCaseDetail(res?.data);
    },
  });

  const handleBlur = async (
    name: keyof IInvestigationFindings,
    providedValue?: any,
    shouldSetValues?: boolean
  ) => {
    if (!user?._id || !caseId) return;
    let value = values[name] as any;

    const payload = {
      id: caseId,
      key: name,
      value: providedValue || value,
      userId: user?._id,
      isQa,
      formPart,
    };
    submit(payload);
    if (shouldSetValues)
      setValues((prev) => ({ ...prev, [name]: providedValue }));
  };

  const onDateChange = (
    date: Date | null,
    name: keyof IInvestigationFindings
  ) => {
    setValues((prev) => ({ ...prev, [name]: date }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSelectChange = (
    value: string,
    name: keyof IInvestigationFindings
  ) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetUrl = (
    id: string,
    name: string,
    url: string,
    action: "Add" | "Remove"
  ) => {
    let docArr = values?.evidenceDocs;

    if (docArr && Array.isArray(docArr) && docArr?.length > 0) {
      docArr = [...docArr, url];
    } else {
      docArr = [url];
    }
    setValues((prev) => ({
      ...prev,
      evidenceDocs: docArr,
    }));
    handleBlur("evidenceDocs", docArr);
  };

  const handleRemove = (index: number) => {
    const docArr = values?.evidenceDocs?.filter((_, ind) => ind !== index);
    setValues((prev) => ({
      ...prev,
      evidenceDocs: docArr,
    }));
    handleBlur("evidenceDocs", docArr);
  };

  useEffect(() => {
    if (
      ((!findings?.patientDetails?.patientAge &&
        findings?.patientDetails?.patientAge !== 0) ||
        !findings?.patientDetails?.patientGender ||
        !findings?.patientDetails?.patientName) &&
      !!dashboardData?._id &&
      !firstReqDone.current
    ) {
      const patientDetails = {
        patientName: dashboardData?.insuredDetails?.insuredName || "Not Found",
        patientAge: dashboardData?.insuredDetails?.age || 0,
        patientGender:
          (dashboardData?.insuredDetails?.gender as TGender) || "Not Found",
        revisedPatientName:
          dashboardData?.insuredDetails?.insuredName || "Not Found",
        revisedPatientAge: dashboardData?.insuredDetails?.age || 0,
        revisedPatientGender:
          (dashboardData?.insuredDetails?.gender as TGender) || "Not Found",
      };

      handleBlur("patientDetails", patientDetails, true);
      firstReqDone.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardData, findings]);

  useEffect(() => {
    if (!!findings) {
      Object.entries(findings).map(([key, value]) => {
        setValues((prev) => ({ ...prev, [key]: value }));
      });
    }
  }, [findings]);

  return (
    <Box py={4}>
      <Title order={3} ta="center" mb={10}>
        Investigation Findings
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateInput
            label="Date of Visit to Insured"
            placeholder="Date of Visit to Insured"
            required
            withAsterisk
            clearable
            maxDate={new Date()}
            value={
              values?.dateOfVisitToInsured
                ? dayjs(values?.dateOfVisitToInsured).toDate()
                : null
            }
            onChange={(date) => onDateChange(date, "dateOfVisitToInsured")}
            onBlur={() => handleBlur("dateOfVisitToInsured")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TimePicker
            label="Time of Visit to Insured"
            value={
              values.timeOfVisitToInsured
                ? dayjs(values.timeOfVisitToInsured).format("HH:mm:ss")
                : ""
            }
            onChange={(time) => {
              onDateChange(
                dayjs(time, "HH:mm:ss").toDate(),
                "timeOfVisitToInsured"
              );
            }}
            onBlur={() => {
              handleBlur("timeOfVisitToInsured");
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DateInput
            label="Date of Visit to Hospital"
            placeholder="Date of Visit to Hospital"
            required
            withAsterisk
            clearable
            maxDate={new Date()}
            value={
              values?.dateOfVisitToHospital
                ? dayjs(values?.dateOfVisitToHospital).toDate()
                : null
            }
            onChange={(date) => onDateChange(date, "dateOfVisitToHospital")}
            onBlur={() => handleBlur("dateOfVisitToHospital")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TimePicker
            label="Time of Visit to Hospital"
            value={
              values.timeOfVisitToHospital
                ? dayjs(values.timeOfVisitToHospital).format("HH:mm:ss")
                : ""
            }
            onChange={(time) => {
              onDateChange(
                dayjs(time, "HH:mm:ss").toDate(),
                "timeOfVisitToHospital"
              );
            }}
            onBlur={() => {
              handleBlur("timeOfVisitToHospital");
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Hospitalization Status"
            placeholder="Hospitalization Status"
            required
            withAsterisk
            searchable
            clearable
            data={hospitalizationStatusOptions}
            value={values.hospitalizationStatus?.value || ""}
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                hospitalizationStatus: {
                  ...prev.hospitalizationStatus,
                  value: val || "",
                },
              }))
            }
            onBlur={() => handleBlur("hospitalizationStatus")}
          />
        </Grid.Col>
        {values?.hospitalizationStatus?.value === "Differed Admission" ? (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Differed Admission"
              placeholder="Differed Admission"
              required
              withAsterisk
              searchable
              clearable
              data={differedAdmissionOptions}
              value={values.hospitalizationStatus?.differedAdmission || ""}
              onChange={(val) =>
                setValues((prev) => ({
                  ...prev,
                  hospitalizationStatus: {
                    ...prev.hospitalizationStatus,
                    differedAdmission: val || "",
                  },
                }))
              }
              onBlur={() => handleBlur("hospitalizationStatus")}
            />
          </Grid.Col>
        ) : values?.hospitalizationStatus?.value === "Cancelled Admission" ? (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Cancelled Admission"
              placeholder="Cancelled Admission"
              required
              withAsterisk
              searchable
              clearable
              data={cancelledAdmissionOptions}
              value={values.hospitalizationStatus?.cancelledAdmission || ""}
              onChange={(val) =>
                setValues((prev) => ({
                  ...prev,
                  hospitalizationStatus: {
                    ...prev.hospitalizationStatus,
                    cancelledAdmission: val || "",
                  },
                }))
              }
              onBlur={() => handleBlur("hospitalizationStatus")}
            />
          </Grid.Col>
        ) : null}

        {values?.hospitalizationStatus?.cancelledAdmission === "Other" ? (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Specify Other"
              placeholder="Specify Other for cancelled admission"
              required
              withAsterisk
              value={
                values?.hospitalizationStatus?.cancelledAdmissionOther || ""
              }
              onChange={(e) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalizationStatus: {
                    ...prev.hospitalizationStatus,
                    cancelledAdmissionOther: e.target.value,
                  },
                }));
              }}
              onBlur={() => handleBlur("hospitalizationStatus")}
            />
          </Grid.Col>
        ) : null}
      </Grid>
      {!!values.hospitalizationStatus?.value ? (
        <Grid>
          <Grid.Col span={12}>
            <Title order={3} ta="center" mb={10}>
              Hospitalization Details
            </Title>
          </Grid.Col>

          {["Admitted", "Discharged"].includes(
            values.hospitalizationStatus?.value
          ) && (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Date of admission"
                  placeholder="Date of admission"
                  required
                  withAsterisk
                  clearable
                  maxDate={new Date()}
                  value={
                    values?.hospitalizationDetails?.dateOfAdmission
                      ? dayjs(
                          values?.hospitalizationDetails?.dateOfAdmission
                        ).toDate()
                      : null
                  }
                  onChange={(date) =>
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        dateOfAdmission: dayjs(date),
                      },
                    }))
                  }
                  onBlur={() => handleBlur("hospitalizationDetails")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TimePicker
                  label="Time of Admission"
                  value={
                    values.hospitalizationDetails?.timeOfAdmission
                      ? dayjs(
                          values.hospitalizationDetails?.timeOfAdmission
                        ).format("HH:mm:ss")
                      : ""
                  }
                  onChange={(time) => {
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        timeOfAdmission: dayjs(time, "HH:mm:ss"),
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("hospitalizationDetails")}
                />
              </Grid.Col>
            </Fragment>
          )}

          {values?.hospitalizationStatus?.value === "Discharged" && (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Date of Discharge"
                  placeholder="Date of Discharge"
                  required
                  withAsterisk
                  clearable
                  maxDate={new Date()}
                  value={
                    values?.hospitalizationDetails?.dateOfDischarge
                      ? dayjs(
                          values?.hospitalizationDetails?.dateOfDischarge
                        ).toDate()
                      : null
                  }
                  onChange={(date) =>
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        dateOfDischarge: dayjs(date),
                      },
                    }))
                  }
                  onBlur={() => handleBlur("hospitalizationDetails")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TimePicker
                  label="Time of Discharge"
                  value={
                    values.hospitalizationDetails?.timeOfDischarge
                      ? dayjs(
                          values.hospitalizationDetails?.timeOfDischarge
                        ).format("HH:mm:ss")
                      : ""
                  }
                  onChange={(time) => {
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        timeOfDischarge: dayjs(time, "HH:mm:ss"),
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("hospitalizationDetails")}
                />
              </Grid.Col>
            </Fragment>
          )}

          {["Planned Admission", "Differed Admission"].includes(
            values.hospitalizationStatus?.value
          ) && (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Tentative Date of Admission"
                  placeholder="Tentative Date of Admission"
                  required
                  withAsterisk
                  clearable
                  maxDate={new Date()}
                  value={
                    values?.hospitalizationDetails?.tentativeDateOfAdmission
                      ? dayjs(
                          values?.hospitalizationDetails
                            ?.tentativeDateOfAdmission
                        ).toDate()
                      : null
                  }
                  onChange={(date) =>
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        tentativeDateOfAdmission: dayjs(date),
                      },
                    }))
                  }
                  onBlur={() => handleBlur("hospitalizationDetails")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Tentative Date of Discharge"
                  placeholder="Tentative Date of Discharge"
                  required
                  withAsterisk
                  clearable
                  maxDate={new Date()}
                  value={
                    values?.hospitalizationDetails?.tentativeDateOfDischarge
                      ? dayjs(
                          values?.hospitalizationDetails
                            ?.tentativeDateOfDischarge
                        ).toDate()
                      : null
                  }
                  onChange={(date) =>
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        tentativeDateOfDischarge: dayjs(date),
                      },
                    }))
                  }
                  onBlur={() => handleBlur("hospitalizationDetails")}
                />
              </Grid.Col>
            </Fragment>
          )}

          {["Cancelled Admission", "Roaming around in/out Hospital"].includes(
            values.hospitalizationStatus?.value
          ) && (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Proposed Date of Admission"
                  placeholder="Proposed Date of Admission"
                  required
                  withAsterisk
                  clearable
                  maxDate={new Date()}
                  value={
                    values?.hospitalizationDetails?.proposedDateOfAdmission
                      ? dayjs(
                          values?.hospitalizationDetails
                            ?.proposedDateOfAdmission
                        ).toDate()
                      : null
                  }
                  onChange={(date) =>
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        proposedDateOfAdmission: dayjs(date),
                      },
                    }))
                  }
                  onBlur={() => handleBlur("hospitalizationDetails")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Proposed Date of Discharge"
                  placeholder="Proposed Date of Discharge"
                  required
                  withAsterisk
                  clearable
                  maxDate={new Date()}
                  value={
                    values?.hospitalizationDetails?.proposedDateOfDischarge
                      ? dayjs(
                          values?.hospitalizationDetails
                            ?.proposedDateOfDischarge
                        ).toDate()
                      : null
                  }
                  onChange={(date) =>
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        proposedDateOfDischarge: dayjs(date),
                      },
                    }))
                  }
                  onBlur={() => handleBlur("hospitalizationDetails")}
                />
              </Grid.Col>
            </Fragment>
          )}
        </Grid>
      ) : null}

      <Grid>
        <Grid.Col span={12}>
          <Title order={3} ta="center" mb={10}>
            Patient Details
          </Title>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Name of Patient"
            placeholder="Name of Patient"
            value={values.patientDetails?.patientName || ""}
            disabled
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Age of Patient"
            placeholder="Age of Patient"
            value={values.patientDetails?.patientAge || ""}
            disabled
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Gender of Patient"
            placeholder="Gender of Patient"
            data={genderOptions}
            value={values.patientDetails?.patientGender || ""}
            disabled
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Revised Name of Patient"
            placeholder="Revised Name of Patient"
            required
            withAsterisk
            value={values.patientDetails?.revisedPatientName || ""}
            onChange={(e) => {
              setValues((prev) => ({
                ...prev,
                patientDetails: {
                  ...prev.patientDetails,
                  revisedPatientName: e.target.value,
                },
              }));
            }}
            onBlur={() => handleBlur("patientDetails")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Revised Age of Patient"
            placeholder="Revised Age of Patient"
            required
            withAsterisk
            maxLength={3}
            value={values.patientDetails?.revisedPatientAge || ""}
            onChange={(val) => {
              setValues((prev) => ({
                ...prev,
                patientDetails: {
                  ...prev.patientDetails,
                  revisedPatientAge: val as number,
                },
              }));
            }}
            onBlur={() => handleBlur("patientDetails")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Revised Gender of Patient"
            placeholder="Revised Gender of Patient"
            required
            withAsterisk
            searchable
            clearable
            data={genderOptions}
            value={values.patientDetails?.revisedPatientGender || ""}
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                patientDetails: {
                  ...prev.patientDetails,
                  revisedPatientGender: val as TGender,
                },
              }))
            }
            onBlur={() => handleBlur("patientDetails")}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={12}>
          <Title order={3} ta="center" mb={10}>
            Details of Attendant
          </Title>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Details of attendant"
            placeholder="Details of attendant"
            required
            withAsterisk
            searchable
            clearable
            data={attendantDetailsOptions}
            value={values.attendantDetails?.status || ""}
            onChange={(val: any) =>
              setValues((prev) => ({
                ...prev,
                attendantDetails: {
                  ...prev.attendantDetails,
                  status: val,
                },
              }))
            }
            onBlur={() => handleBlur("attendantDetails")}
          />
        </Grid.Col>

        {values?.attendantDetails?.status === "Available" ? (
          <Fragment>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Name of Attendant"
                placeholder="Name of Attendant"
                required
                withAsterisk
                value={values.attendantDetails?.name || ""}
                onChange={(e) => {
                  setValues((prev) => ({
                    ...prev,
                    attendantDetails: {
                      ...prev.attendantDetails,
                      name: e.target.value,
                    },
                  }));
                }}
                onBlur={() => handleBlur("attendantDetails")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Gender of Attendant"
                placeholder="Gender of Attendant"
                required
                withAsterisk
                searchable
                clearable
                data={genderOptions}
                value={values.attendantDetails?.gender || ""}
                onChange={(val) =>
                  setValues((prev) => ({
                    ...prev,
                    attendantDetails: {
                      ...prev.attendantDetails,
                      gender: val as TGender,
                    },
                  }))
                }
                onBlur={() => handleBlur("attendantDetails")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Relationship"
                placeholder="Relationship"
                required
                withAsterisk
                searchable
                clearable
                data={relationshipOptions}
                value={values.attendantDetails?.relationship || ""}
                onChange={(val) =>
                  setValues((prev) => ({
                    ...prev,
                    attendantDetails: {
                      ...prev.attendantDetails,
                      relationship: val || "",
                    },
                  }))
                }
                onBlur={() => handleBlur("attendantDetails")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Mobile Number"
                placeholder="Mobile Number"
                required
                withAsterisk
                maxLength={10}
                max={10}
                min={10}
                minLength={10}
                value={values.attendantDetails?.mobileNo || ""}
                onChange={(val) => {
                  setValues((prev) => ({
                    ...prev,
                    attendantDetails: {
                      ...prev.attendantDetails,
                      mobileNo: val?.toString(),
                    },
                  }));
                }}
                onBlur={() => handleBlur("attendantDetails")}
              />
            </Grid.Col>
          </Fragment>
        ) : null}
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Occupation of Insured"
            placeholder="Occupation of Insured"
            required
            withAsterisk
            searchable
            clearable
            data={occupationOptions}
            value={values.occupationOfInsured || ""}
            onChange={(val) => onSelectChange(val || "", "occupationOfInsured")}
            onBlur={() => handleBlur("occupationOfInsured")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Work Place Details"
            placeholder="Work Place Details"
            required
            withAsterisk
            name="workPlaceDetails"
            value={values.workPlaceDetails || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("workPlaceDetails")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Any other policy with NBHI?"
            placeholder="Any other policy with NBHI?"
            required
            withAsterisk
            searchable
            clearable
            data={otherPolicyWithNBHIOptions}
            value={values.anyOtherPolicyWithNBHI || ""}
            onChange={(val) =>
              onSelectChange(val || "", "anyOtherPolicyWithNBHI")
            }
            onBlur={() => handleBlur("anyOtherPolicyWithNBHI")}
          />
        </Grid.Col>

        {values?.anyOtherPolicyWithNBHI === "Yes" && (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Other policy with NBHI"
              placeholder="Other policy with NBHI"
              required
              withAsterisk
              name="otherPolicyNoWithNBHI"
              value={values.otherPolicyNoWithNBHI || ""}
              onChange={handleChange}
              onBlur={() => handleBlur("otherPolicyNoWithNBHI")}
            />
          </Grid.Col>
        )}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Any previous claim with NBHI?"
            placeholder="Any previous claim with NBHI?"
            required
            withAsterisk
            searchable
            clearable
            data={yesNoNAOptions}
            value={values.anyPreviousClaimWithNBHI || ""}
            onChange={(val) =>
              onSelectChange(val || "", "anyPreviousClaimWithNBHI")
            }
            onBlur={() => handleBlur("anyPreviousClaimWithNBHI")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Any insurance policy other than NBHI?"
            placeholder="Any insurance policy other than NBHI?"
            required
            withAsterisk
            searchable
            clearable
            data={yesNoNAOptions}
            value={values?.insurancePolicyOtherThanNBHI?.hasPolicy || ""}
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                insurancePolicyOtherThanNBHI: {
                  ...prev.insurancePolicyOtherThanNBHI,
                  hasPolicy: val as TYesNo,
                },
              }))
            }
            onBlur={() => handleBlur("insurancePolicyOtherThanNBHI")}
          />
        </Grid.Col>

        {values?.insurancePolicyOtherThanNBHI?.hasPolicy === "Yes" && (
          <Fragment>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Name of insured company"
                placeholder="Name of insured company"
                required
                withAsterisk
                value={
                  values.insurancePolicyOtherThanNBHI?.nameOfInsuranceCompany ||
                  ""
                }
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    insurancePolicyOtherThanNBHI: {
                      ...prev.insurancePolicyOtherThanNBHI,
                      nameOfInsuranceCompany: e.target.value,
                    },
                  }))
                }
                onBlur={() => handleBlur("insurancePolicyOtherThanNBHI")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Policy Number"
                placeholder="Policy Number"
                required
                withAsterisk
                value={values.insurancePolicyOtherThanNBHI?.policyNumber || ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    insurancePolicyOtherThanNBHI: {
                      ...prev.insurancePolicyOtherThanNBHI,
                      policyNumber: e.target.value,
                    },
                  }))
                }
                onBlur={() => handleBlur("insurancePolicyOtherThanNBHI")}
              />
            </Grid.Col>
          </Fragment>
        )}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Class of accommodation"
            placeholder="Class of accommodation"
            required
            withAsterisk
            searchable
            clearable
            data={classOfAccommodationOptions}
            value={values?.classOfAccommodation?.status || ""}
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                classOfAccommodation: {
                  ...prev.classOfAccommodation,
                  status: val || "",
                },
              }))
            }
            onBlur={() => handleBlur("classOfAccommodation")}
          />
        </Grid.Col>

        {values.classOfAccommodation?.status === "Other" && (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Remarks for other class of accommodation"
              placeholder="Remarks for other class of accommodation"
              required
              withAsterisk
              value={values.classOfAccommodation?.remark || ""}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  classOfAccommodation: {
                    ...prev.classOfAccommodation,
                    remark: e.target.value,
                  },
                }))
              }
              onBlur={() => handleBlur("classOfAccommodation")}
            />
          </Grid.Col>
        )}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Any Change in class of accommodation"
            placeholder="Any Change in class of accommodation"
            required
            withAsterisk
            searchable
            clearable
            data={yesNoNAOptions}
            value={values.changeInClassOfAccommodation?.status || ""}
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                changeInClassOfAccommodation: {
                  ...prev.changeInClassOfAccommodation,
                  status: val || "",
                },
              }))
            }
            onBlur={() => handleBlur("changeInClassOfAccommodation")}
          />
        </Grid.Col>

        {!!values?.changeInClassOfAccommodation?.status &&
          ["Yes", "NA"].includes(
            values?.changeInClassOfAccommodation?.status
          ) && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Remarks for change in class of accommodation"
                placeholder="Remarks for change in class of accommodation"
                required
                withAsterisk
                value={values.changeInClassOfAccommodation?.remark || ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    changeInClassOfAccommodation: {
                      ...prev.changeInClassOfAccommodation,
                      remark: e.target.value,
                    },
                  }))
                }
                onBlur={() => handleBlur("changeInClassOfAccommodation")}
              />
            </Grid.Col>
          )}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Weather patient was on active line of treatment"
            placeholder="Weather patient was on active line of treatment"
            required
            withAsterisk
            searchable
            clearable
            data={yesNoNAOptions}
            value={values.patientOnActiveLineOfTreatment?.status || ""}
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                patientOnActiveLineOfTreatment: {
                  ...prev.patientOnActiveLineOfTreatment,
                  status: val || "",
                },
              }))
            }
            onBlur={() => handleBlur("patientOnActiveLineOfTreatment")}
          />
        </Grid.Col>

        {!!values.patientOnActiveLineOfTreatment?.status &&
          ["No", "NA"].includes(
            values.patientOnActiveLineOfTreatment?.status
          ) && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Remarks for patient on active line of treatment"
                placeholder="Remarks for patient on active line of treatment"
                required
                withAsterisk
                value={values.patientOnActiveLineOfTreatment?.remark || ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    patientOnActiveLineOfTreatment: {
                      ...prev.patientOnActiveLineOfTreatment,
                      remark: e.target.value,
                    },
                  }))
                }
                onBlur={() => handleBlur("patientOnActiveLineOfTreatment")}
              />
            </Grid.Col>
          )}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Mismatch in symptoms/investigation/diagnosis"
            placeholder="Mismatch in symptoms/investigation/diagnosis"
            required
            withAsterisk
            searchable
            clearable
            data={yesNoNAOptions}
            value={values.mismatchInDiagnosis?.status || ""}
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                mismatchInDiagnosis: {
                  ...prev.mismatchInDiagnosis,
                  status: val || "",
                },
              }))
            }
            onBlur={() => handleBlur("mismatchInDiagnosis")}
          />
        </Grid.Col>

        {!!values.mismatchInDiagnosis?.status &&
          ["Yes", "NA"].includes(values.mismatchInDiagnosis?.status) && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Remarks for mismatch in symptoms"
                placeholder="Remarks for mismatch in symptoms"
                required
                withAsterisk
                value={values.mismatchInDiagnosis?.remark || ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    mismatchInDiagnosis: {
                      ...prev.mismatchInDiagnosis,
                      remark: e.target.value,
                    },
                  }))
                }
                onBlur={() => handleBlur("mismatchInDiagnosis")}
              />
            </Grid.Col>
          )}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Any Discrepancies observed"
            placeholder="Any Discrepancies observed"
            required
            withAsterisk
            searchable
            clearable
            data={yesNoNAOptions}
            value={values.discrepancies?.status || ""}
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                discrepancies: {
                  ...prev.discrepancies,
                  status: val || "",
                },
              }))
            }
            onBlur={() => handleBlur("discrepancies")}
          />
        </Grid.Col>

        {!!values.discrepancies?.status &&
          ["Yes", "NA"].includes(values.discrepancies?.status) && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Remarks for Discrepancies"
                placeholder="Remarks for Discrepancies"
                required
                withAsterisk
                value={values.discrepancies?.remark || ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    discrepancies: {
                      ...prev.discrepancies,
                      remark: e.target.value,
                    },
                  }))
                }
                onBlur={() => handleBlur("discrepancies")}
              />
            </Grid.Col>
          )}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <MultiSelect
            label="Personal/Social habit details"
            placeholder="Personal/Social habit details"
            required
            withAsterisk
            searchable
            data={personalHabitOptions}
            hidePickedOptions
            value={values.patientHabit?.map((el) => el.habit) || []}
            onChange={(val) => {
              setValues((prev) => ({
                ...prev,
                patientHabit: val?.includes("NA")
                  ? [{ habit: "NA" }]
                  : val.map((v) => ({ habit: v })),
              }));
            }}
            onBlur={() => {
              handleBlur("patientHabit");
            }}
          />
        </Grid.Col>

        {!!values.patientHabit && values.patientHabit?.length > 0
          ? values.patientHabit.map((el, ind) => {
              if (el?.habit === "NA") return null;
              return (
                <Fragment key={ind}>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label={`Frequency of ${el.habit}`}
                      placeholder={`Frequency of ${el.habit}`}
                      required
                      withAsterisk
                      value={el.frequency || ""}
                      onChange={(e) => {
                        const newPatientHabits = !!values.patientHabit
                          ? [...values.patientHabit]
                          : [];
                        newPatientHabits[ind].frequency = e.target.value;
                        setValues((prev) => ({
                          ...prev,
                          patientHabit: newPatientHabits,
                        }));
                      }}
                      onBlur={() => handleBlur("patientHabit")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label={`Quantity of ${el.habit}`}
                      placeholder={`Quantity of ${el.habit}`}
                      required
                      withAsterisk
                      value={el.quantity || ""}
                      onChange={(e) => {
                        const newPatientHabits = !!values.patientHabit
                          ? [...values.patientHabit]
                          : [];
                        newPatientHabits[ind].quantity = e.target.value;
                        setValues((prev) => ({
                          ...prev,
                          patientHabit: newPatientHabits,
                        }));
                      }}
                      onBlur={() => handleBlur("patientHabit")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label={`Duration of ${el.habit}`}
                      placeholder={`Duration of ${el.habit}`}
                      required
                      withAsterisk
                      value={el.duration || ""}
                      onChange={(e) => {
                        const newPatientHabits = !!values.patientHabit
                          ? [...values.patientHabit]
                          : [];
                        newPatientHabits[ind].duration = e.target.value;
                        setValues((prev) => ({
                          ...prev,
                          patientHabit: newPatientHabits,
                        }));
                      }}
                      onBlur={() => handleBlur("patientHabit")}
                    />
                  </Grid.Col>
                </Fragment>
              );
            })
          : null}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="PED/Non-Disclosure"
            placeholder="PED/Non-Disclosure"
            required
            withAsterisk
            searchable
            clearable
            data={yesNoNAOptions}
            value={values.pedOrNoneDisclosure || ""}
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                pedOrNoneDisclosure: val as TYesNo,
              }))
            }
            onBlur={() => handleBlur("pedOrNoneDisclosure")}
          />
        </Grid.Col>

        {values.pedOrNoneDisclosure === "Yes" && (
          <Fragment>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <MultiSelect
                label="Ailment"
                placeholder="Ailment"
                required
                withAsterisk
                searchable
                data={ailmentOptions}
                hidePickedOptions
                value={values.ailment?.map((ail) => ail.ailment) || []}
                onChange={(val) => {
                  setValues((prev) => ({
                    ...prev,
                    ailment: val.map((a) => ({ ailment: a })),
                  }));
                }}
                onBlur={() => {
                  handleBlur("ailment");
                }}
              />
            </Grid.Col>

            {!!values.ailment && values.ailment?.length > 0
              ? values.ailment.map((el, ind) => {
                  return (
                    <Fragment key={ind}>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label={`Diagnosis of ${el.ailment}`}
                          placeholder={`Diagnosis of ${el.ailment}`}
                          required
                          withAsterisk
                          value={el.diagnosis || ""}
                          onChange={(e) => {
                            const newAilment = !!values.ailment
                              ? [...values.ailment]
                              : [];
                            newAilment[ind].diagnosis = e.target.value;
                            setValues((prev) => ({
                              ...prev,
                              ailment: newAilment,
                            }));
                          }}
                          onBlur={() => handleBlur("ailment")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label={`Duration of ${el?.ailment}`}
                          placeholder={`Duration of ${el?.ailment}`}
                          required
                          withAsterisk
                          value={el.duration || ""}
                          onChange={(e) => {
                            const newAilment = !!values.ailment
                              ? [...values.ailment]
                              : [];
                            newAilment[ind].duration = e.target.value;
                            setValues((prev) => ({
                              ...prev,
                              ailment: newAilment,
                            }));
                          }}
                          onBlur={() => handleBlur("ailment")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                          label={`On Medication ${el?.ailment}`}
                          placeholder={`On Medication ${el?.ailment}`}
                          required
                          withAsterisk
                          data={yesNoOptions}
                          value={el.onMedication || ""}
                          onChange={(val) => {
                            const newAilment = !!values.ailment
                              ? [...values.ailment]
                              : [];
                            newAilment[ind].onMedication = val as TYesNo;
                            setValues((prev) => ({
                              ...prev,
                              ailment: newAilment,
                            }));
                          }}
                          onBlur={() => handleBlur("ailment")}
                        />
                      </Grid.Col>
                    </Fragment>
                  );
                })
              : null}
          </Fragment>
        )}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Insured/Attendant Cooperation"
            placeholder="Insured/Attendant Cooperation"
            required
            withAsterisk
            data={yesNoOptions}
            value={values?.insuredOrAttendantCooperation || ""}
            onChange={(val) => {
              onSelectChange(val || "", "insuredOrAttendantCooperation");
            }}
            onBlur={() => handleBlur("insuredOrAttendantCooperation")}
          />
        </Grid.Col>

        {values?.insuredOrAttendantCooperation === "No" && (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Reason of insured/attendant not cooperating"
              placeholder="Reason of insured/attendant not cooperating"
              required
              withAsterisk
              value={values.reasonForInsuredNotCooperation || ""}
              name="reasonForInsuredNotCooperation"
              onChange={handleChange}
              onBlur={() => handleBlur("reasonForInsuredNotCooperation")}
            />
          </Grid.Col>
        )}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Provider Cooperation"
            placeholder="Provider Cooperation"
            required
            withAsterisk
            data={yesNoOptions}
            value={values?.providerCooperation || ""}
            onChange={(val) => {
              onSelectChange(val || "", "providerCooperation");
            }}
            onBlur={() => handleBlur("providerCooperation")}
          />
        </Grid.Col>

        {values?.providerCooperation === "No" && (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Reason of provider not cooperating"
              placeholder="Reason of provider not cooperating"
              required
              withAsterisk
              value={values.reasonForProviderNotCooperation || ""}
              name="reasonForProviderNotCooperation"
              onChange={handleChange}
              onBlur={() => handleBlur("reasonForProviderNotCooperation")}
            />
          </Grid.Col>
        )}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Is Ported?"
            placeholder="Is Ported?"
            required
            withAsterisk
            data={yesNoOptions}
            value={values.port || ""}
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                port: val || "",
              }))
            }
            onBlur={() => handleBlur("port")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Investigation Summary"
            placeholder="Investigation Summary"
            required
            withAsterisk
            resize="vertical"
            value={values.investigationSummary || ""}
            name="investigationSummary"
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                investigationSummary: e.target.value,
              }))
            }
            onBlur={() => handleBlur("investigationSummary")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Recommendation"
            placeholder="Recommendation"
            required
            withAsterisk
            data={getSelectOption("recommendations")}
            value={
              !!values?.recommendation?.value && !!values?.recommendation?.code
                ? `${values?.recommendation?.value}_${values?.recommendation?.code}`
                : values?.recommendation?.value || ""
            }
            onChange={(val) => {
              const tempVal = val || "";
              const valArr = tempVal?.split("_");
              setValues((prev) => ({
                ...prev,
                recommendation: {
                  value: valArr[0] || "",
                  code: valArr[1] || "",
                },
              }));
            }}
            onBlur={() => handleBlur("recommendation")}
          />
        </Grid.Col>

        {values.recommendation?.value === "Repudiation" && (
          <Fragment>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text className="font-semibold">Upload Evidence: </Text>
              {!!values?.evidenceDocs &&
                values?.evidenceDocs?.length > 0 &&
                values?.evidenceDocs?.map((el, ind) => (
                  <FileUploadFooter
                    key={ind}
                    url={el}
                    onDelete={() => handleRemove(ind)}
                  />
                ))}
              <FileUpload
                doc={tempDocInitials}
                docName="doc"
                getUrl={handleGetUrl}
                claimId={dashboardData?.claimId || 0}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <MultiSelect
                label="Ground of Repudiation"
                placeholder="Ground of Repudiation"
                required
                withAsterisk
                searchable
                data={getSelectOption("FRCUGroundOfRep")}
                hidePickedOptions
                value={
                  values.frcuGroundOfRepudiation?.map((el) => el?.value) || []
                }
                onChange={(val) => {
                  if (val) {
                    const tempArr = val?.map((v) => {
                      const strArr = v?.split("_");
                      return { value: strArr[0] || "", code: strArr[1] || "" };
                    });
                    setValues((prev) => ({
                      ...prev,
                      frcuGroundOfRepudiation: tempArr,
                    }));
                  }
                }}
                onBlur={() => {
                  handleBlur("frcuGroundOfRepudiation");
                }}
              />
            </Grid.Col>

            {values.frcuGroundOfRepudiation
              ?.map((v) => v?.value)
              ?.includes("Non Co-Operation") && (
              <Fragment>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Non Cooperation of"
                    placeholder="Non Cooperation of"
                    required
                    withAsterisk
                    data={nonCooperationOfOptions}
                    value={values?.groundOfRepudiationNonCooperationOf || ""}
                    onChange={(val) =>
                      onSelectChange(
                        val || "",
                        "groundOfRepudiationNonCooperationOf"
                      )
                    }
                    onBlur={() =>
                      handleBlur("groundOfRepudiationNonCooperationOf")
                    }
                  />
                </Grid.Col>

                {!!values.groundOfRepudiationNonCooperationOf && (
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label={`Specify non-cooperation of ${values.groundOfRepudiationNonCooperationOf}`}
                      placeholder={`Specify non-cooperation of ${values.groundOfRepudiationNonCooperationOf}`}
                      required
                      withAsterisk
                      name="nonCooperationDetails"
                      value={values.nonCooperationDetails || ""}
                      onChange={handleChange}
                      onBlur={() => handleBlur("nonCooperationDetails")}
                    />
                  </Grid.Col>
                )}
              </Fragment>
            )}
          </Fragment>
        )}

        {values.recommendation?.value === "Inconclusive" && (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Inconclusive Remark"
              placeholder="Inconclusive Remark"
              required
              withAsterisk
              name="inconclusiveRemark"
              value={values.inconclusiveRemark || ""}
              onChange={handleChange}
              onBlur={() => handleBlur("inconclusiveRemark")}
            />
          </Grid.Col>
        )}

        <Grid.Col span={{ base: 12, md: 6 }}>
          <MultiSelect
            label="Other Recommendations"
            placeholder="Other Recommendations"
            required
            withAsterisk
            searchable
            data={otherRecommendationOptions}
            hidePickedOptions
            value={values?.otherRecommendation?.map((or) => or.value) || []}
            onChange={(val) => {
              setValues((prev) => ({
                ...prev,
                otherRecommendation: val?.includes("NA")
                  ? [{ value: "NA", detail: [] }]
                  : val.map((v) => ({
                      value: v,
                      detail: [],
                    })),
              }));
            }}
            onBlur={() => {
              handleBlur("otherRecommendation");
            }}
          />
        </Grid.Col>

        {!!values.otherRecommendation && values.otherRecommendation?.length > 0
          ? values.otherRecommendation?.map((el, ind) => {
              if (el?.value === "NA") return null;
              return (
                <Fragment key={ind}>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <MultiSelect
                      label={`Detail of ${el.value}`}
                      placeholder={`Detail of ${el.value}`}
                      required
                      withAsterisk
                      searchable
                      data={otherRecommendationDetailsOptions}
                      hidePickedOptions
                      value={
                        values?.otherRecommendation?.[ind]?.detail?.map(
                          (ord) => ord.value
                        ) || []
                      }
                      onChange={(val) => {
                        const newValue = !!values.otherRecommendation
                          ? [...values.otherRecommendation]
                          : [];
                        newValue[ind].detail = val?.includes("NA")
                          ? [{ value: "NA", remark: "" }]
                          : val.map((v) => ({
                              value: v,
                              remark: "",
                            }));
                        setValues((prev) => ({
                          ...prev,
                          otherRecommendation: newValue,
                        }));
                      }}
                      onBlur={() => {
                        handleBlur("otherRecommendation");
                      }}
                    />
                  </Grid.Col>

                  {!!values?.otherRecommendation?.[ind]?.detail &&
                  values?.otherRecommendation?.[ind]?.detail?.length > 0
                    ? values?.otherRecommendation?.[ind]?.detail?.map(
                        (od, index) => {
                          if (od?.value === "NA") return null;
                          return (
                            <Grid.Col span={{ base: 12, md: 6 }} key={index}>
                              <TextInput
                                label={`Remarks for ${od.value}`}
                                placeholder={`Remarks for ${od.value}`}
                                required
                                withAsterisk
                                value={
                                  values?.otherRecommendation?.[ind]?.detail[
                                    index
                                  ]?.remark || ""
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const newValue = !!values.otherRecommendation
                                    ? [...values.otherRecommendation]
                                    : [];
                                  newValue[ind].detail[index].remark = val;
                                  setValues((prev) => ({
                                    ...prev,
                                    otherRecommendation: newValue,
                                  }));
                                }}
                                onBlur={() => handleBlur("otherRecommendation")}
                              />
                            </Grid.Col>
                          );
                        }
                      )
                    : null}
                </Fragment>
              );
            })
          : null}
        {dashboardData?.isReInvestigated ? (
          <Grid.Col span={12}>
            <Textarea
              label="Re-Investigation Findings"
              placeholder="Re-Investigation Findings"
              resize="vertical"
              required
              withAsterisk
              value={values?.reInvestigationFindings || ""}
              onBlur={(e) => handleBlur("reInvestigationFindings")}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  reInvestigationFindings: e.target?.value,
                }))
              }
            />
          </Grid.Col>
        ) : null}
      </Grid>
    </Box>
  );
};

export default InvestigationFindings;
