import React, { Fragment, useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  FileButton,
  Grid,
  MultiSelect,
  NumberInput,
  Progress,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput, DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import axios from "axios";
import { RiUploadCloudLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import {
  CaseDetail,
  IDashboardData,
  IInvestigationFindings,
  SingleResponseType,
  TGender,
  TYesNo,
} from "@/lib/utils/types/fniDataTypes";
import { getSelectOption, showError, uploadFile } from "@/lib/helpers";
import { EndPoints } from "@/lib/utils/types/enums";
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
    patientGender: "Male",
    revisedPatientName: "",
    revisedPatientAge: 0,
    revisedPatientGender: "Male",
  },
  attendantDetails: {
    status: "NA",
    name: "",
  },
  occupationOfInsured: "",
  workPlaceDetails: "",
  anyOtherPolicyWithNBHI: "",
  anyPreviousClaimWithNBHI: "No",
  insurancePolicyOtherThanNBHI: {
    hasPolicy: "No",
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
  pedOrNoneDisclosure: "NA",
  ailment: [],
  insuredOrAttendantCooperation: "No",
  providerCooperation: "No",
  investigationSummary: "",
  recommendation: "",
  otherRecommendation: [],
  frcuGroundOfRepudiation: [],
  evidenceDocs: [],
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  dashboardData: IDashboardData | null;
  onClose: () => void;
};

const InvestigationFindings = ({
  caseDetail,
  dashboardData,
  onClose,
}: PropTypes) => {
  const [values, setValues] = useState<IInvestigationFindings>(initialValues);
  const [updatedValues, setUpdatedValues] = useState<Record<string, any>>({});
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBlur = async (
    name: keyof IInvestigationFindings,
    providedValue?: any,
    shouldSetValues?: boolean
  ) => {
    // if (!caseDetail?._id) return;
    // let value = values[name] as any;
    // if (!value && !providedValue) return;
    // if (name === "frcuGroundOfRepudiation" && Array.isArray(value)) {
    //   value = value?.map((el) => ({
    //     value: el?.split("_")[0] || "",
    //     code: el?.split("_")[1] || "",
    //   }));
    // }
    // if (name === "recommendation") {
    //   value = {
    //     value: value?.split("_")[0] || "",
    //     code: value?.split("_")[1] || "",
    //   };
    // }
    // try {
    //   const { data } = await axios.post(
    //     EndPoints.CAPTURE_INVESTIGATION_FINDINGS,
    //     {
    //       id: caseDetail?._id,
    //       key: name,
    //       value: providedValue || value,
    //       isPostQa: true,
    //     }
    //   );
    //   if (data?.success && shouldSetValues) {
    //     setValues((prev) => ({ ...prev, [name]: providedValue }));
    //   }
    // } catch (error: any) {
    //   showError(error);
    // }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setUpdatedValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSelectChange = (
    value: string,
    name: keyof IInvestigationFindings
  ) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setUpdatedValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadEvidence = async (file: File | null) => {
    if (!file) return;

    try {
      setProgress(10);
      //  TODO: Need to increase the progress from 0 to 100 somehow
      const docKey = await uploadFile(file, dashboardData?.claimId || 0);

      if (
        values.evidenceDocs &&
        Array.isArray(values.evidenceDocs) &&
        values?.evidenceDocs?.length > 0
      ) {
        handleBlur("evidenceDocs", [...values.evidenceDocs, docKey], true);
        setUpdatedValues((prev) => ({
          ...prev,
          evidenceDocs: [...prev.evidenceDocs, docKey],
        }));
      } else {
        handleBlur("evidenceDocs", [docKey], true);
        setUpdatedValues((prev) => ({
          ...prev,
          evidenceDocs: [docKey],
        }));
      }
      setProgress(100);
    } catch (error: any) {
      showError(error);
    } finally {
      setProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (Object.values(updatedValues)?.length === 0) return onClose(); // Unchanged

      if (!caseDetail?._id) return;

      const preparedValues: Record<string, any> = {
        ...values,
        ...updatedValues,
      };

      if (preparedValues?.hasOwnProperty("frcuGroundOfRepudiation")) {
        preparedValues["frcuGroundOfRepudiation"] = preparedValues[
          "frcuGroundOfRepudiation"
        ]?.map((el: string) => ({
          value: el?.split("_")[0] || "",
          code: el?.split("_")[1] || "",
        }));
      }

      if (preparedValues.hasOwnProperty("recommendation")) {
        preparedValues["recommendation"] = {
          value: preparedValues["recommendation"]?.split("_")[0] || "",
          code: preparedValues["recommendation"]?.split("_")[1] || "",
        };
      }

      const { data } = await axios.post<
        SingleResponseType<Record<string, string>>
      >(EndPoints.CAPTURE_QA_FINDINGS, {
        id: caseDetail?._id,
        payload: preparedValues,
      });

      toast.success(data?.message);
      onClose();
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseDetail?.postQaFindings) {
      setValues({
        ...caseDetail?.postQaFindings,
        recommendation:
          caseDetail?.postQaFindings?.recommendation?.value +
          (caseDetail?.postQaFindings?.recommendation?.code
            ? `_${caseDetail?.postQaFindings?.recommendation?.code}`
            : ""),
        frcuGroundOfRepudiation:
          caseDetail?.postQaFindings?.frcuGroundOfRepudiation?.map(
            (el) => `${el?.value}${el?.code ? `_${el?.code}` : ""}`
          ),
      });
    }
  }, [caseDetail]);

  useEffect(() => {
    if (
      ((!values?.patientDetails?.patientAge &&
        values?.patientDetails?.patientAge !== 0) ||
        !values?.patientDetails?.patientGender ||
        !values?.patientDetails?.patientName) &&
      dashboardData?._id
    ) {
      const patientDetails = {
        patientName: dashboardData?.insuredDetails?.insuredName,
        patientAge: dashboardData?.insuredDetails?.age,
        patientGender: dashboardData?.insuredDetails?.gender as TGender,
        revisedPatientName:
          caseDetail?.postQaFindings?.patientDetails?.revisedPatientName || "",
        revisedPatientAge:
          caseDetail?.postQaFindings?.patientDetails?.revisedPatientAge || 0,
        revisedPatientGender: caseDetail?.postQaFindings?.patientDetails
          ?.revisedPatientGender as TGender,
      };
      setValues((prev) => ({
        ...prev,
        patientDetails: patientDetails,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardData, caseDetail]);

  return (
    <Box mt={16}>
      <Divider />
      <Title order={2} ta="center" c="green" my={20}>
        Investigation Findings
      </Title>
      <ActionIcon className="float-right" onClick={onClose}>
        <IoMdClose />
      </ActionIcon>
      <form onSubmit={handleSubmit} className="py-4">
        <Grid>
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <DateInput
              label="Date of Visit to Insured"
              placeholder="Date of Visit to Insured"
              maxDate={new Date()}
              value={
                values.dateOfVisitToInsured
                  ? dayjs(values.dateOfVisitToInsured).toDate()
                  : undefined
              }
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  dateOfVisitToInsured: dayjs(val),
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  dateOfVisitToInsured: dayjs(val),
                }));
              }}
              onBlur={() => handleBlur("dateOfVisitToInsured")}
              required
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <DateTimePicker
              label="Time of Visit to Insured"
              placeholder="Time of Visit to Insured"
              maxDate={new Date()}
              value={
                values.timeOfVisitToInsured
                  ? dayjs(values.timeOfVisitToInsured).toDate()
                  : undefined
              }
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  timeOfVisitToInsured: dayjs(val),
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  timeOfVisitToInsured: dayjs(val),
                }));
              }}
              onBlur={() => handleBlur("timeOfVisitToInsured")}
              required
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <DateInput
              label="Date of Visit to Hospital"
              placeholder="Date of Visit to Hospital"
              maxDate={new Date()}
              value={
                values.dateOfVisitToHospital
                  ? dayjs(values.dateOfVisitToHospital).toDate()
                  : undefined
              }
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  dateOfVisitToHospital: dayjs(val),
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  dateOfVisitToHospital: dayjs(val),
                }));
              }}
              onBlur={() => handleBlur("dateOfVisitToHospital")}
              required
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <DateTimePicker
              label="Time of Visit to Hospital"
              placeholder="Time of Visit to Hospital"
              maxDate={new Date()}
              value={
                values.timeOfVisitToHospital
                  ? dayjs(values.timeOfVisitToHospital).toDate()
                  : undefined
              }
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  timeOfVisitToHospital: dayjs(val),
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  timeOfVisitToHospital: dayjs(val),
                }));
              }}
              onBlur={() => handleBlur("timeOfVisitToHospital")}
              required
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Hospitalization Status"
              placeholder="Hospitalization Status"
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalizationStatus: {
                    ...prev.hospitalizationStatus,
                    value: val || "",
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  hospitalizationStatus: {
                    ...prev.hospitalizationStatus,
                    value: val || "",
                  },
                }));
              }}
              onBlur={() => handleBlur("hospitalizationStatus")}
              value={values.hospitalizationStatus?.value}
              className="w-full"
              data={hospitalizationStatusOptions}
              required
              withAsterisk
              clearable
            />
          </Grid.Col>

          {values?.hospitalizationStatus?.value === "Differed Admission" ? (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <Select
                label="Differed Admission"
                placeholder="Differed Admission"
                onChange={(val) => {
                  setValues((prev) => ({
                    ...prev,
                    hospitalizationStatus: {
                      ...prev.hospitalizationStatus,
                      differedAdmission: val || "",
                    },
                  }));
                  setUpdatedValues((prev) => ({
                    ...prev,
                    hospitalizationStatus: {
                      ...prev.hospitalizationStatus,
                      differedAdmission: val || "",
                    },
                  }));
                }}
                onBlur={() => handleBlur("hospitalizationStatus")}
                value={values.hospitalizationStatus?.differedAdmission || ""}
                className="w-full"
                data={differedAdmissionOptions}
                clearable
              />
            </Grid.Col>
          ) : values?.hospitalizationStatus?.value === "Cancelled Admission" ? (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <Select
                label="Cancelled Admission"
                placeholder="Cancelled Admission"
                onChange={(val) => {
                  setUpdatedValues((prev) => ({
                    ...prev,
                    hospitalizationStatus: {
                      ...prev.hospitalizationStatus,
                      cancelledAdmission: val || "",
                    },
                  }));
                }}
                onBlur={() => handleBlur("hospitalizationStatus")}
                value={values.hospitalizationStatus?.cancelledAdmission || ""}
                className="w-full"
                data={cancelledAdmissionOptions}
                clearable
              />
            </Grid.Col>
          ) : null}

          {values?.hospitalizationStatus?.cancelledAdmission === "Other" ? (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <TextInput
                label="Specify Other for cancelled admission"
                placeholder="Specify Other for cancelled admission"
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
                  setUpdatedValues((prev) => ({
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

          {["Admitted", "Discharged"].includes(
            values.hospitalizationStatus?.value
          ) && (
            <>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <DateInput
                  label="Date of admission"
                  placeholder="Date of admission"
                  maxDate={new Date()}
                  value={
                    values?.hospitalizationDetails?.dateOfAdmission
                      ? dayjs(
                          values.hospitalizationDetails?.dateOfAdmission
                        ).toDate()
                      : undefined
                  }
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        dateOfAdmission: dayjs(val),
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        dateOfAdmission: dayjs(val),
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("hospitalizationDetails")}
                  required
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <DateTimePicker
                  label="Time of Admission"
                  placeholder="Time of Admission"
                  maxDate={new Date()}
                  value={
                    values.hospitalizationDetails?.timeOfAdmission
                      ? dayjs(
                          values.hospitalizationDetails?.timeOfAdmission
                        ).toDate()
                      : undefined
                  }
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        timeOfAdmission: dayjs(val),
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        timeOfAdmission: dayjs(val),
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("hospitalizationDetails")}
                  required
                  withAsterisk
                />
              </Grid.Col>
            </>
          )}

          {values.hospitalizationStatus?.value === "Discharged" && (
            <>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <DateInput
                  label="Date of discharge"
                  placeholder="Date of discharge"
                  maxDate={new Date()}
                  value={
                    values?.hospitalizationDetails?.dateOfDischarge
                      ? dayjs(
                          values.hospitalizationDetails?.dateOfDischarge
                        ).toDate()
                      : undefined
                  }
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        dateOfDischarge: dayjs(val),
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        dateOfDischarge: dayjs(val),
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("hospitalizationDetails")}
                  required
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <DateTimePicker
                  label="Time of Discharge"
                  placeholder="Time of Discharge"
                  maxDate={new Date()}
                  value={
                    values.hospitalizationDetails?.timeOfDischarge
                      ? dayjs(
                          values.hospitalizationDetails?.timeOfDischarge
                        ).toDate()
                      : undefined
                  }
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        timeOfDischarge: dayjs(val),
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        timeOfDischarge: dayjs(val),
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("hospitalizationDetails")}
                  required
                  withAsterisk
                />
              </Grid.Col>
            </>
          )}

          {["Planned Admission", "Differed Admission"].includes(
            values.hospitalizationStatus?.value
          ) && (
            <>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <DateInput
                  label="Tentative Date of Admission"
                  placeholder="Tentative Date of Admission"
                  value={
                    values?.hospitalizationDetails?.tentativeDateOfAdmission
                      ? dayjs(
                          values.hospitalizationDetails
                            ?.tentativeDateOfAdmission
                        ).toDate()
                      : undefined
                  }
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        tentativeDateOfAdmission: dayjs(val),
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        tentativeDateOfAdmission: dayjs(val),
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("hospitalizationDetails")}
                  required
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <DateInput
                  label="Tentative Date of Discharge"
                  placeholder="Tentative Date of Discharge"
                  value={
                    values?.hospitalizationDetails?.tentativeDateOfDischarge
                      ? dayjs(
                          values.hospitalizationDetails
                            ?.tentativeDateOfDischarge
                        ).toDate()
                      : undefined
                  }
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        tentativeDateOfDischarge: dayjs(val),
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        tentativeDateOfDischarge: dayjs(val),
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("hospitalizationDetails")}
                  required
                  withAsterisk
                />
              </Grid.Col>
            </>
          )}

          {["Cancelled Admission", "Roaming around in/out Hospital"].includes(
            values.hospitalizationStatus?.value
          ) && (
            <>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <DateInput
                  label="Proposed Date of Admission"
                  placeholder="Proposed Date of Admission"
                  value={
                    values?.hospitalizationDetails?.proposedDateOfAdmission
                      ? dayjs(
                          values.hospitalizationDetails?.proposedDateOfAdmission
                        ).toDate()
                      : undefined
                  }
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        proposedDateOfAdmission: dayjs(val),
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        proposedDateOfAdmission: dayjs(val),
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("hospitalizationDetails")}
                  required
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <DateInput
                  label="Proposed Date of Discharge"
                  placeholder="Proposed Date of Discharge"
                  value={
                    values?.hospitalizationDetails?.proposedDateOfDischarge
                      ? dayjs(
                          values.hospitalizationDetails?.proposedDateOfDischarge
                        ).toDate()
                      : undefined
                  }
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        proposedDateOfDischarge: dayjs(val),
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      hospitalizationDetails: {
                        ...prev.hospitalizationDetails,
                        proposedDateOfDischarge: dayjs(val),
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("hospitalizationDetails")}
                  required
                  withAsterisk
                />
              </Grid.Col>
            </>
          )}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <TextInput
              disabled
              label="Enter Patient name"
              placeholder="Enter Patient name"
              value={values.patientDetails?.patientName}
              onChange={(e) => {
                setValues((prev) => ({
                  ...prev,
                  patientDetails: {
                    ...prev.patientDetails,
                    patientName: e.target.value,
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  patientDetails: {
                    ...prev.patientDetails,
                    patientName: e.target.value,
                  },
                }));
              }}
              onBlur={() => handleBlur("patientDetails")}
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <NumberInput
              disabled
              label="Enter Patient age"
              placeholder="Enter Patient age"
              value={values.patientDetails?.patientAge}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  patientDetails: {
                    ...prev.patientDetails,
                    patientAge: val as number,
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  patientDetails: {
                    ...prev.patientDetails,
                    patientAge: val as number,
                  },
                }));
              }}
              onBlur={() => handleBlur("patientDetails")}
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              disabled
              label="Gender of patient"
              placeholder="Gender of patient"
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  patientDetails: {
                    ...prev.patientDetails,
                    patientGender: val as TGender,
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  patientDetails: {
                    ...prev.patientDetails,
                    patientGender: val as TGender,
                  },
                }));
              }}
              onBlur={() => handleBlur("patientDetails")}
              value={values?.patientDetails?.patientGender || ""}
              data={genderOptions}
              required
              withAsterisk
              clearable
            />
          </Grid.Col>

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <TextInput
              label="Enter Patient name Revised"
              placeholder="Enter Patient name Revised"
              value={values?.patientDetails?.revisedPatientName || ""}
              onChange={(e) => {
                setValues((prev) => ({
                  ...prev,
                  patientDetails: {
                    ...prev.patientDetails,
                    revisedPatientName: e.target.value,
                  },
                }));
                setUpdatedValues((prev) => ({
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
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <NumberInput
              label="Enter Patient age Revised"
              placeholder="Enter Patient age Revised"
              value={values.patientDetails?.revisedPatientAge || ""}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  patientDetails: {
                    ...prev.patientDetails,
                    revisedPatientAge: val as number,
                  },
                }));
                setUpdatedValues((prev) => ({
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
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Gender of patient Revised"
              placeholder="Gender of patient Revised"
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  patientDetails: {
                    ...prev.patientDetails,
                    revisedPatientGender: val as TGender,
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  patientDetails: {
                    ...prev.patientDetails,
                    revisedPatientGender: val as TGender,
                  },
                }));
              }}
              onBlur={() => handleBlur("patientDetails")}
              value={values?.patientDetails?.revisedPatientGender || ""}
              data={genderOptions}
              required
              withAsterisk
              clearable
            />
          </Grid.Col>

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Details of attendant"
              placeholder="Details of attendant"
              value={values?.attendantDetails?.status || ""}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  attendantDetails: {
                    ...prev.attendantDetails,
                    status: val as typeof values.attendantDetails.status,
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  attendantDetails: {
                    ...prev.attendantDetails,
                    status: val as typeof values.attendantDetails.status,
                  },
                }));
              }}
              onBlur={() => handleBlur("attendantDetails")}
              data={attendantDetailsOptions}
              required
              withAsterisk
              clearable
            />
          </Grid.Col>

          {values?.attendantDetails?.status === "Available" ? (
            <>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <TextInput
                  label="Name of Attendant"
                  placeholder="Enter Attendant name"
                  value={values.attendantDetails.name || ""}
                  onChange={(e) => {
                    setValues((prev) => ({
                      ...prev,
                      attendantDetails: {
                        ...prev.attendantDetails,
                        name: e.target.value,
                      },
                    }));
                    setUpdatedValues((prev) => ({
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

              <Grid.Col span={{ sm: 12, md: 6 }}>
                <Select
                  label="Gender of Attendant"
                  placeholder="Enter Attendant gender"
                  value={values.attendantDetails?.gender || ""}
                  data={genderOptions}
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      attendantDetails: {
                        ...prev.attendantDetails,
                        gender: val as TGender,
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      attendantDetails: {
                        ...prev.attendantDetails,
                        gender: val as TGender,
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("attendantDetails")}
                  clearable
                />
              </Grid.Col>

              <Grid.Col span={{ sm: 12, md: 6 }}>
                <Select
                  label="Relationship"
                  placeholder="Select Relationship"
                  value={values.attendantDetails?.relationship || ""}
                  data={relationshipOptions}
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      attendantDetails: {
                        ...prev.attendantDetails,
                        relationship: val || "",
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      attendantDetails: {
                        ...prev.attendantDetails,
                        relationship: val || "",
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("attendantDetails")}
                  clearable
                />
              </Grid.Col>

              <Grid.Col span={{ sm: 12, md: 6 }}>
                <TextInput
                  label="Mobile Number"
                  placeholder="Mobile Number"
                  value={values.attendantDetails.mobileNo || ""}
                  onChange={(e) => {
                    setValues((prev) => ({
                      ...prev,
                      attendantDetails: {
                        ...prev.attendantDetails,
                        mobileNo: e.target.value,
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      attendantDetails: {
                        ...prev.attendantDetails,
                        mobileNo: e.target.value,
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("attendantDetails")}
                />
              </Grid.Col>
            </>
          ) : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Occupation of insured"
              placeholder="Select Occupation"
              value={values.occupationOfInsured || ""}
              data={occupationOptions}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  occupationOfInsured: val || "",
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  occupationOfInsured: val || "",
                }));
              }}
              onBlur={() => handleBlur("occupationOfInsured")}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <TextInput
              label="Work Place Details"
              placeholder="Enter Work Place Details"
              value={values.workPlaceDetails || ""}
              name="workPlaceDetails"
              onChange={handleChange}
              onBlur={() => handleBlur("workPlaceDetails")}
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Any other policy with NBHI"
              placeholder="Any other policy with NBHI"
              value={values.anyOtherPolicyWithNBHI || ""}
              data={otherPolicyWithNBHIOptions}
              onChange={(val) =>
                onSelectChange(val || "", "anyOtherPolicyWithNBHI")
              }
              onBlur={() => handleBlur("anyOtherPolicyWithNBHI")}
              clearable
            />
          </Grid.Col>
          {values?.anyOtherPolicyWithNBHI === "Yes" && (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <TextInput
                label="Other policy number with NBHI"
                placeholder="Enter Other policy number with NBHI"
                value={values.otherPolicyNoWithNBHI || ""}
                name="otherPolicyNoWithNBHI"
                onChange={handleChange}
                onBlur={() => handleBlur("otherPolicyNoWithNBHI")}
              />
            </Grid.Col>
          )}
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Any insurance policy other than NBHI"
              placeholder="Any insurance policy other than NBHI"
              value={values?.insurancePolicyOtherThanNBHI?.hasPolicy || ""}
              data={yesNoNAOptions}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  insurancePolicyOtherThanNBHI: {
                    ...prev.insurancePolicyOtherThanNBHI,
                    hasPolicy: val as TYesNo,
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  insurancePolicyOtherThanNBHI: {
                    ...prev.insurancePolicyOtherThanNBHI,
                    hasPolicy: val as TYesNo,
                  },
                }));
              }}
              onBlur={() => handleBlur("insurancePolicyOtherThanNBHI")}
              clearable
            />
          </Grid.Col>

          {values?.insurancePolicyOtherThanNBHI?.hasPolicy === "Yes" ? (
            <>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <TextInput
                  label="Name of insured company"
                  placeholder="Name of insured company"
                  value={
                    values.insurancePolicyOtherThanNBHI
                      ?.nameOfInsuranceCompany || ""
                  }
                  onChange={(e) => {
                    setValues((prev) => ({
                      ...prev,
                      insurancePolicyOtherThanNBHI: {
                        ...prev.insurancePolicyOtherThanNBHI,
                        nameOfInsuranceCompany: e.target.value,
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      insurancePolicyOtherThanNBHI: {
                        ...prev.insurancePolicyOtherThanNBHI,
                        nameOfInsuranceCompany: e.target.value,
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("insurancePolicyOtherThanNBHI")}
                />
              </Grid.Col>

              <Grid.Col span={{ sm: 12, md: 6 }}>
                <TextInput
                  label="Policy Number"
                  placeholder="Policy Number"
                  value={
                    values.insurancePolicyOtherThanNBHI?.policyNumber || ""
                  }
                  onChange={(e) => {
                    setValues((prev) => ({
                      ...prev,
                      insurancePolicyOtherThanNBHI: {
                        ...prev.insurancePolicyOtherThanNBHI,
                        policyNumber: e.target.value,
                      },
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      insurancePolicyOtherThanNBHI: {
                        ...prev.insurancePolicyOtherThanNBHI,
                        policyNumber: e.target.value,
                      },
                    }));
                  }}
                  onBlur={() => handleBlur("insurancePolicyOtherThanNBHI")}
                />
              </Grid.Col>
            </>
          ) : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Class of accommodation"
              placeholder="Class of accommodation"
              value={values.classOfAccommodation?.status || ""}
              data={classOfAccommodationOptions}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  classOfAccommodation: {
                    ...prev.classOfAccommodation,
                    status: val || "",
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  classOfAccommodation: {
                    ...prev.classOfAccommodation,
                    status: val || "",
                  },
                }));
              }}
              onBlur={() => handleBlur("classOfAccommodation")}
              clearable
            />
          </Grid.Col>

          {values.classOfAccommodation?.status === "Other" ? (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <TextInput
                label="Enter Remarks for other class of accommodation"
                placeholder="Enter Remarks for other class of accommodation"
                value={values.classOfAccommodation?.remark || ""}
                onChange={(e) => {
                  setValues((prev) => ({
                    ...prev,
                    classOfAccommodation: {
                      ...prev.classOfAccommodation,
                      remark: e.target.value,
                    },
                  }));
                  setUpdatedValues((prev) => ({
                    ...prev,
                    classOfAccommodation: {
                      ...prev.classOfAccommodation,
                      remark: e.target.value,
                    },
                  }));
                }}
                onBlur={() => handleBlur("classOfAccommodation")}
              />
            </Grid.Col>
          ) : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Any Change in class of accommodation"
              placeholder="Any Change in class of accommodation"
              value={values.changeInClassOfAccommodation?.status || ""}
              data={yesNoNAOptions}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  changeInClassOfAccommodation: {
                    ...prev.changeInClassOfAccommodation,
                    status: val || "",
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  changeInClassOfAccommodation: {
                    ...prev.changeInClassOfAccommodation,
                    status: val || "",
                  },
                }));
              }}
              onBlur={() => handleBlur("changeInClassOfAccommodation")}
              clearable
            />
          </Grid.Col>

          {["Yes", "NA"].includes(
            values.changeInClassOfAccommodation?.status
          ) ? (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <TextInput
                label="Remarks for change in class of accommodation"
                placeholder="Enter Remarks for change in class of accommodation"
                value={values.changeInClassOfAccommodation?.remark || ""}
                onChange={(e) => {
                  setValues((prev) => ({
                    ...prev,
                    changeInClassOfAccommodation: {
                      ...prev.changeInClassOfAccommodation,
                      remark: e.target.value,
                    },
                  }));
                  setUpdatedValues((prev) => ({
                    ...prev,
                    changeInClassOfAccommodation: {
                      ...prev.changeInClassOfAccommodation,
                      remark: e.target.value,
                    },
                  }));
                }}
                onBlur={() => handleBlur("changeInClassOfAccommodation")}
              />
            </Grid.Col>
          ) : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Weather patient was on active line of treatment"
              placeholder="Weather patient was on active line of treatment"
              value={values.patientOnActiveLineOfTreatment?.status || ""}
              data={yesNoNAOptions}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  patientOnActiveLineOfTreatment: {
                    ...prev.patientOnActiveLineOfTreatment,
                    status: val || "",
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  patientOnActiveLineOfTreatment: {
                    ...prev.patientOnActiveLineOfTreatment,
                    status: val || "",
                  },
                }));
              }}
              onBlur={() => handleBlur("patientOnActiveLineOfTreatment")}
              clearable
            />
          </Grid.Col>

          {["No", "NA"].includes(
            values.patientOnActiveLineOfTreatment?.status
          ) ? (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <TextInput
                label="Remarks for patient on active line of treatment"
                placeholder="Enter Remarks for patient on active line of treatment"
                value={values.patientOnActiveLineOfTreatment?.remark || ""}
                onChange={(e) => {
                  setValues((prev) => ({
                    ...prev,
                    patientOnActiveLineOfTreatment: {
                      ...prev.patientOnActiveLineOfTreatment,
                      remark: e.target.value,
                    },
                  }));
                  setUpdatedValues((prev) => ({
                    ...prev,
                    patientOnActiveLineOfTreatment: {
                      ...prev.patientOnActiveLineOfTreatment,
                      remark: e.target.value,
                    },
                  }));
                }}
                onBlur={() => handleBlur("patientOnActiveLineOfTreatment")}
              />
            </Grid.Col>
          ) : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Mismatch in symptoms/investigation/diagnosis"
              placeholder="Mismatch in symptoms/investigation/diagnosis"
              value={values.mismatchInDiagnosis?.status || ""}
              data={yesNoNAOptions}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  mismatchInDiagnosis: {
                    ...prev.mismatchInDiagnosis,
                    status: val || "",
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  mismatchInDiagnosis: {
                    ...prev.mismatchInDiagnosis,
                    status: val || "",
                  },
                }));
              }}
              onBlur={() => handleBlur("mismatchInDiagnosis")}
              clearable
            />
          </Grid.Col>

          {["Yes", "NA"].includes(values.mismatchInDiagnosis?.status) ? (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <TextInput
                label="Remarks for mismatch in symptoms"
                placeholder="Enter Remarks for mismatch in symptoms"
                value={values.mismatchInDiagnosis?.remark || ""}
                onChange={(e) => {
                  setValues((prev) => ({
                    ...prev,
                    mismatchInDiagnosis: {
                      ...prev.mismatchInDiagnosis,
                      remark: e.target.value,
                    },
                  }));
                  setUpdatedValues((prev) => ({
                    ...prev,
                    mismatchInDiagnosis: {
                      ...prev.mismatchInDiagnosis,
                      remark: e.target.value,
                    },
                  }));
                }}
                onBlur={() => handleBlur("mismatchInDiagnosis")}
              />
            </Grid.Col>
          ) : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Any Discrepancies observed"
              placeholder="Any Discrepancies observed"
              value={values.discrepancies?.status || ""}
              data={yesNoNAOptions}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  discrepancies: {
                    ...prev.discrepancies,
                    status: val || "",
                  },
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  discrepancies: {
                    ...prev.discrepancies,
                    status: val || "",
                  },
                }));
              }}
              onBlur={() => handleBlur("discrepancies")}
              clearable
            />
          </Grid.Col>

          {["Yes", "NA"].includes(values.discrepancies?.status) ? (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <TextInput
                label="Remarks for Discrepancies"
                placeholder="Enter Remarks for Discrepancies"
                value={values.discrepancies?.remark || ""}
                onChange={(e) => {
                  setValues((prev) => ({
                    ...prev,
                    discrepancies: {
                      ...prev.discrepancies,
                      remark: e.target.value,
                    },
                  }));
                  setUpdatedValues((prev) => ({
                    ...prev,
                    discrepancies: {
                      ...prev.discrepancies,
                      remark: e.target.value,
                    },
                  }));
                }}
                onBlur={() => handleBlur("discrepancies")}
              />
            </Grid.Col>
          ) : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <MultiSelect
              hidePickedOptions
              clearable
              label="Personal/Social habit details"
              placeholder="Personal/Social habit details"
              value={values.patientHabit?.map((el) => el.habit) || []}
              data={personalHabitOptions}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  patientHabit: val?.includes("NA")
                    ? [{ habit: "NA" }]
                    : val.map((v) => ({ habit: v })),
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  patientHabit: val?.includes("NA")
                    ? [{ habit: "NA" }]
                    : val.map((v) => ({ habit: v })),
                }));
              }}
              onBlur={() => handleBlur("patientHabit")}
            />
          </Grid.Col>

          {values.patientHabit?.length > 0
            ? values.patientHabit.map((el, ind) => {
                return !values.patientHabit.some((ha) => ha.habit === "NA") ? (
                  <Fragment key={ind}>
                    <Grid.Col span={{ sm: 12, md: 6 }}>
                      <TextInput
                        label={`Frequency of ${el.habit}`}
                        placeholder={`Enter frequency of ${el.habit}`}
                        value={el.frequency || ""}
                        onChange={(e) => {
                          const newPatientHabits = [...values.patientHabit];
                          newPatientHabits[ind].frequency = e.target.value;
                          setValues((prev) => ({
                            ...prev,
                            patientHabit: newPatientHabits,
                          }));
                          setUpdatedValues((prev) => ({
                            ...prev,
                            patientHabit: newPatientHabits,
                          }));
                        }}
                        onBlur={() => handleBlur("patientHabit")}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 12, md: 6 }}>
                      <TextInput
                        label={`Quantity of ${el.habit}`}
                        placeholder={`Enter quantity of ${el.habit}`}
                        value={el.quantity || ""}
                        onChange={(e) => {
                          const newPatientHabits = [...values.patientHabit];
                          newPatientHabits[ind].quantity = e.target.value;
                          setValues((prev) => ({
                            ...prev,
                            patientHabit: newPatientHabits,
                          }));
                          setUpdatedValues((prev) => ({
                            ...prev,
                            patientHabit: newPatientHabits,
                          }));
                        }}
                        onBlur={() => handleBlur("patientHabit")}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ sm: 12, md: 6 }}>
                      <TextInput
                        label={`Duration of ${el.habit}`}
                        placeholder={`Enter duration of ${el.habit}`}
                        value={el.duration || ""}
                        onChange={(e) => {
                          const newPatientHabits = [...values.patientHabit];
                          newPatientHabits[ind].duration = e.target.value;
                          setValues((prev) => ({
                            ...prev,
                            patientHabit: newPatientHabits,
                          }));
                          setUpdatedValues((prev) => ({
                            ...prev,
                            patientHabit: newPatientHabits,
                          }));
                        }}
                        onBlur={() => handleBlur("patientHabit")}
                      />
                    </Grid.Col>
                  </Fragment>
                ) : null;
              })
            : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="PED/Non-Disclosure"
              placeholder="PED/Non-Disclosure"
              value={values.pedOrNoneDisclosure || ""}
              data={yesNoNAOptions}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  pedOrNoneDisclosure: val as TYesNo,
                }));
                setUpdatedValues((prev) => ({
                  ...prev,
                  pedOrNoneDisclosure: val as TYesNo,
                }));
              }}
              onBlur={() => handleBlur("pedOrNoneDisclosure")}
              clearable
            />
          </Grid.Col>

          {values.pedOrNoneDisclosure === "Yes" ? (
            <>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <MultiSelect
                  label="Ailment"
                  placeholder="Ailment"
                  value={values.ailment?.map((ail) => ail.ailment) || []}
                  data={ailmentOptions}
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      ailment: val.map((a) => ({ ailment: a })),
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      ailment: val.map((a) => ({ ailment: a })),
                    }));
                  }}
                  onBlur={() => handleBlur("ailment")}
                />
              </Grid.Col>

              {values.ailment?.length > 0
                ? values.ailment.map((el, ind) => {
                    return (
                      <Fragment key={ind}>
                        <Grid.Col span={{ sm: 12, md: 6 }}>
                          <TextInput
                            label={`Diagnosis of ${el.ailment}`}
                            placeholder={`Enter diagnosis of ${el.ailment}`}
                            value={el.diagnosis || ""}
                            onChange={(e) => {
                              const newAilment = [...values.ailment];
                              newAilment[ind].diagnosis = e.target.value;
                              setValues((prev) => ({
                                ...prev,
                                ailment: newAilment,
                              }));
                              setUpdatedValues((prev) => ({
                                ...prev,
                                ailment: newAilment,
                              }));
                            }}
                            onBlur={() => handleBlur("ailment")}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ sm: 12, md: 6 }}>
                          <TextInput
                            label={`Duration of ${el.ailment}`}
                            placeholder={`Enter duration of ${el.ailment}`}
                            value={el.duration || ""}
                            onChange={(e) => {
                              const newAilment = [...values.ailment];
                              newAilment[ind].duration = e.target.value;
                              setValues((prev) => ({
                                ...prev,
                                ailment: newAilment,
                              }));
                              setUpdatedValues((prev) => ({
                                ...prev,
                                ailment: newAilment,
                              }));
                            }}
                            onBlur={() => handleBlur("ailment")}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ sm: 12, md: 6 }}>
                          <Select
                            label={`On Medication of ${el.ailment}`}
                            placeholder={`Select on medication of ${el.ailment}`}
                            value={el.onMedication || ""}
                            data={yesNoOptions}
                            onChange={(val) => {
                              const newAilment = [...values.ailment];
                              newAilment[ind].onMedication = val as TYesNo;
                              setValues((prev) => ({
                                ...prev,
                                ailment: newAilment,
                              }));
                              setUpdatedValues((prev) => ({
                                ...prev,
                                ailment: newAilment,
                              }));
                            }}
                            onBlur={() => handleBlur("ailment")}
                            clearable
                          />
                        </Grid.Col>
                      </Fragment>
                    );
                  })
                : null}
            </>
          ) : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Insured/Attendant Cooperation"
              placeholder="Insured/Attendant Cooperation"
              value={values.insuredOrAttendantCooperation || ""}
              data={yesNoOptions}
              onChange={(val) =>
                onSelectChange(val || "", "insuredOrAttendantCooperation")
              }
              onBlur={() => handleBlur("insuredOrAttendantCooperation")}
              clearable
            />
          </Grid.Col>

          {values?.insuredOrAttendantCooperation === "No" ? (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <TextInput
                label="Reason of insured/attendant not cooperating"
                placeholder="Enter Reason of insured/attendant not cooperating"
                value={values.reasonForInsuredNotCooperation || ""}
                name="reasonForInsuredNotCooperation"
                onChange={handleChange}
                onBlur={() => handleBlur("reasonForInsuredNotCooperation")}
              />
            </Grid.Col>
          ) : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Provider Cooperation"
              placeholder="Provider Cooperation"
              value={values.providerCooperation || ""}
              data={yesNoOptions}
              onChange={(val) =>
                onSelectChange(val || "", "providerCooperation")
              }
              onBlur={() => handleBlur("providerCooperation")}
              clearable
            />
          </Grid.Col>

          {values?.providerCooperation === "No" ? (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <TextInput
                label="Reason of provider not cooperating"
                placeholder="Enter Reason of provider not cooperating"
                value={values.reasonForProviderNotCooperation || ""}
                name="reasonForProviderNotCooperation"
                onChange={handleChange}
                onBlur={() => handleBlur("reasonForProviderNotCooperation")}
              />
            </Grid.Col>
          ) : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <TextInput
              label="Investigation Summary"
              placeholder="Enter Investigation Summary"
              value={values.investigationSummary || ""}
              name="investigationSummary"
              onChange={handleChange}
              onBlur={() => handleBlur("investigationSummary")}
            />
          </Grid.Col>

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Select
              label="Recommendation"
              placeholder="Recommendation"
              value={values?.recommendation}
              data={getSelectOption("recommendations")}
              onChange={(val) => onSelectChange(val || "", "recommendation")}
              onBlur={() => handleBlur("recommendation")}
              clearable
            />
          </Grid.Col>

          {values.recommendation === "Repudiation" ? (
            <>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                {values?.evidenceDocs && values?.evidenceDocs?.length > 0
                  ? values?.evidenceDocs?.map((doc, ind) => (
                      <Text key={ind}>{doc}</Text>
                    ))
                  : null}
                <FileButton onChange={handleUploadEvidence}>
                  {(props) => (
                    <Button {...props} color="cyan">
                      Upload Evidence&nbsp;
                      <RiUploadCloudLine />
                    </Button>
                  )}
                </FileButton>
                {progress > 0 ? (
                  <Progress striped animated value={progress} />
                ) : null}
              </Grid.Col>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <MultiSelect
                  label="Ground of Repudiation"
                  placeholder="Ground of Repudiation"
                  value={values.frcuGroundOfRepudiation || []}
                  data={getSelectOption("FRCUGroundOfRep")}
                  onChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      frcuGroundOfRepudiation: val,
                    }));
                    setUpdatedValues((prev) => ({
                      ...prev,
                      frcuGroundOfRepudiation: val,
                    }));
                  }}
                  onBlur={() => handleBlur("frcuGroundOfRepudiation")}
                />
              </Grid.Col>
              {values.frcuGroundOfRepudiation?.includes(
                "Non Co-Operation_DN"
              ) ||
              values.frcuGroundOfRepudiation?.includes(
                "Non Co-Operation_NC"
              ) ? (
                <>
                  <Grid.Col span={{ sm: 12, md: 6 }}>
                    <Select
                      label="Non Cooperation of"
                      placeholder="Non Cooperation of"
                      value={values.groundOfRepudiationNonCooperationOf}
                      data={nonCooperationOfOptions}
                      onChange={(val) =>
                        onSelectChange(
                          val || "",
                          "groundOfRepudiationNonCooperationOf"
                        )
                      }
                      onBlur={() =>
                        handleBlur("groundOfRepudiationNonCooperationOf")
                      }
                      clearable
                    />
                  </Grid.Col>
                  {!!values.groundOfRepudiationNonCooperationOf ? (
                    <Grid.Col span={{ sm: 12, md: 6 }}>
                      <TextInput
                        label={`Specify non-cooperation of ${values.groundOfRepudiationNonCooperationOf}`}
                        placeholder={`Specify non-cooperation of ${values.groundOfRepudiationNonCooperationOf}`}
                        value={values.nonCooperationDetails || ""}
                        name="nonCooperationDetails"
                        onChange={handleChange}
                        onBlur={() => handleBlur("nonCooperationDetails")}
                      />
                    </Grid.Col>
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}

          {["Inconclusive_PD", "Inconclusive_AD"].includes(
            values.recommendation
          ) ? (
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <TextInput
                label="Inconclusive Remark"
                placeholder="Enter Inconclusive Remark"
                value={values.inconclusiveRemark || ""}
                name="inconclusiveRemark"
                onChange={handleChange}
                onBlur={() => handleBlur("inconclusiveRemark")}
              />
            </Grid.Col>
          ) : null}

          <Grid.Col span={{ sm: 12, md: 6 }}>
            <MultiSelect
              label="Other Recommendations"
              placeholder="Other Recommendations"
              value={values.otherRecommendation.map((or) => or.value)}
              data={otherRecommendationOptions}
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
                setUpdatedValues((prev) => ({
                  ...prev,
                  otherRecommendation: val?.includes("NA")
                    ? [{ value: "NA", detail: [] }]
                    : val.map((v) => ({
                        value: v,
                        detail: [],
                      })),
                }));
              }}
              onBlur={() => handleBlur("otherRecommendation")}
            />
          </Grid.Col>

          {values.otherRecommendation?.length > 0
            ? values.otherRecommendation?.map((el, ind) => {
                return el?.value === "NA" ? null : (
                  <Fragment key={ind}>
                    <Grid.Col span={{ sm: 12, md: 6 }}>
                      <MultiSelect
                        label={`Detail of ${el.value}`}
                        placeholder={`Detail of ${el.value}`}
                        value={values.otherRecommendation[ind].detail?.map(
                          (ord) => ord.value
                        )}
                        data={otherRecommendationDetailsOptions}
                        onChange={(val) => {
                          const newValue = [...values.otherRecommendation];
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
                          setUpdatedValues((prev) => ({
                            ...prev,
                            otherRecommendation: newValue,
                          }));
                        }}
                        onBlur={() => handleBlur("otherRecommendation")}
                      />
                    </Grid.Col>

                    {values?.otherRecommendation?.[ind]?.detail?.length > 0
                      ? values?.otherRecommendation?.[ind]?.detail?.map(
                          (od, index) => {
                            return od?.value !== "NA" ? (
                              <Grid.Col
                                span={{ sm: 12, md: 6 }}
                                key={index}
                                className="mt-4"
                              >
                                <TextInput
                                  label={`Remarks for ${od.value}`}
                                  placeholder={`Remarks for ${od.value}`}
                                  value={
                                    values.otherRecommendation[ind]?.detail[
                                      index
                                    ]?.remark || ""
                                  }
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const newValue = [
                                      ...values.otherRecommendation,
                                    ];
                                    newValue[ind].detail[index].remark = val;
                                    setValues((prev) => ({
                                      ...prev,
                                      otherRecommendation: newValue,
                                    }));
                                    setUpdatedValues((prev) => ({
                                      ...prev,
                                      otherRecommendation: newValue,
                                    }));
                                  }}
                                  onBlur={() =>
                                    handleBlur("otherRecommendation")
                                  }
                                />
                              </Grid.Col>
                            ) : null;
                          }
                        )
                      : null}
                  </Fragment>
                );
              })
            : null}
        </Grid>
        <Button type="submit" mt={20} loading={loading}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default InvestigationFindings;
