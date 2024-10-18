import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Grid, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { DateInput, DateValue, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import TimePicker from "@/components/TimePicker";
import {
  attendantDetailsOptions,
  billVerificationOptions,
  hospitalInfrastructureOptions,
  hospitalOperationsOptions,
  hospitalSpecialtyOptions,
  icpsCollectedOptions,
  indoorEntryOptions,
  medicinesOptions,
  paymentReceiptsOptions,
  recordKeepingOptions,
  yesNoNAOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";
import PatientHabitFormParts from "./FormParts/PatientHabitFormParts";
import AilmentFormParts from "./FormParts/AilmentFormParts";
import {
  IHospitalInfrastructure,
  IHospitalVerification,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";

const taskName = "Hospital Verification";

const initialFormValues: IHospitalVerification = {
  dateOfVisitToHospital: null,
  timeOfVisitToHospital: null,
  hospitalInfrastructure: { value: "" },
  providerCooperation: "",
  remarks: "",
};

type PropTypes = {
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const HospitalVerification = ({
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const [values, setValues] =
    useState<IHospitalVerification>(initialFormValues);

  const { refetch: submit } = useAxios<SingleResponseType<CaseDetail | null>>({
    config: {
      url: EndPoints.CAPTURE_RM_INVESTIGATION_FINDINGS,
      method: "POST",
    },
    dependencyArr: [],
    isMutation: true,
    onDone: (res) => {
      if (res?.data) setCaseDetail(res?.data);
    },
  });

  const handleBlur = ({
    key,
    value,
  }: {
    key: keyof IHospitalVerification;
    value: any;
  }) => {
    const payload: Record<string, any> = {
      id: caseId,
      userId: user?._id,
      name: taskName,
    };

    if (payload?.id && payload?.userId && !!value) {
      payload.payload = { key, value };
      submit(payload);
    }
  };

  const handleInfrastructureBlur = ({
    key,
    value,
  }: {
    key: keyof IHospitalInfrastructure;
    value: any;
  }) => {
    const hospitalInfrastructure = {
      ...values?.hospitalInfrastructure,
      [key]: value,
    };
    handleBlur({
      key: "hospitalInfrastructure",
      value: hospitalInfrastructure,
    });
  };

  const handleDateChange = (
    date: DateValue,
    key: keyof IHospitalVerification
  ) => {
    setValues((prev) => ({ ...prev, [key]: dayjs(date).toDate() }));
  };

  const handleChange = (key: keyof IHospitalVerification, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!!findings && !!findings[taskName]) {
      Object.entries(findings[taskName]).map(([key, value]) => {
        setValues((prev) => ({ ...prev, [key]: value }));
      });
    }
  }, [findings]);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <DateInput
          value={
            values?.dateOfVisitToHospital
              ? dayjs(values?.dateOfVisitToHospital).toDate()
              : null
          }
          onChange={(date) => handleDateChange(date, "dateOfVisitToHospital")}
          label="Date of visit to hospital"
          placeholder="Date of visit to hospital"
          required
          withAsterisk
          clearable
          maxDate={new Date()}
          onBlur={() =>
            handleBlur({
              key: "dateOfVisitToHospital",
              value: values?.dateOfVisitToHospital,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TimePicker
          label="Time of visit to hospital"
          value={
            values?.timeOfVisitToHospital
              ? dayjs(values?.timeOfVisitToHospital).format("HH:mm:ss")
              : ""
          }
          onChange={(time) => {
            setValues((prev) => ({
              ...prev,
              timeOfVisitToHospital: dayjs(time, "HH:mm:ss").toDate(),
            }));
          }}
          onBlur={() => {
            handleBlur({
              key: "timeOfVisitToHospital",
              value: values?.timeOfVisitToHospital,
            });
          }}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Provider Co-operation"
          placeholder="Provider Co-operation"
          data={yesNoOptions}
          searchable
          clearable
          required
          withAsterisk
          value={values?.providerCooperation || ""}
          onChange={(val) => handleChange("providerCooperation", val || "")}
          onBlur={() =>
            handleBlur({
              key: "providerCooperation",
              value: values?.providerCooperation,
            })
          }
        />
      </Grid.Col>
      {values?.providerCooperation === "No" && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Reason for provider not cooperating"
            placeholder="Reason for provider not cooperating"
            required
            withAsterisk
            value={values?.reasonOfProviderNotCooperating || ""}
            onChange={(e) =>
              handleChange("reasonOfProviderNotCooperating", e.target.value)
            }
            onBlur={() =>
              handleBlur({
                key: "reasonOfProviderNotCooperating",
                value: values?.reasonOfProviderNotCooperating,
              })
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Hospital Infrastructure"
          placeholder="Hospital Infrastructure"
          data={hospitalInfrastructureOptions}
          searchable
          clearable
          required
          withAsterisk
          value={values?.hospitalInfrastructure?.value}
          onChange={(val) => {
            setValues((prev) => ({
              ...prev,
              hospitalInfrastructure: {
                ...prev.hospitalInfrastructure,
                value: val || "",
              },
            }));
          }}
        />
      </Grid.Col>
      {["Poor Setup", "Primary Care"].includes(
        values?.hospitalInfrastructure?.value
      ) && (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="No of beds"
              placeholder="No of beds"
              required
              withAsterisk
              value={values?.hospitalInfrastructure?.noOfBeds || ""}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    noOfBeds: val as number,
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "noOfBeds",
                  value: values?.hospitalInfrastructure?.noOfBeds,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="OT"
              placeholder="OT"
              data={yesNoNAOptions}
              searchable
              clearable
              required
              withAsterisk
              value={values?.hospitalInfrastructure?.OT || ""}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    OT: val || "",
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "OT",
                  value: values?.hospitalInfrastructure?.OT,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="ICU"
              placeholder="ICU"
              data={yesNoNAOptions}
              searchable
              clearable
              required
              withAsterisk
              value={values?.hospitalInfrastructure?.ICU || ""}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    ICU: val || "",
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "ICU",
                  value: values?.hospitalInfrastructure?.ICU,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Specialty"
              placeholder="Specialty"
              data={hospitalSpecialtyOptions}
              searchable
              clearable
              required
              withAsterisk
              value={values?.hospitalInfrastructure?.specialty || ""}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    specialty: val || "",
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "specialty",
                  value: values?.hospitalInfrastructure?.specialty,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Round the clock RMO"
              placeholder="Round the clock RMO"
              data={yesNoNAOptions}
              searchable
              clearable
              required
              withAsterisk
              value={values?.hospitalInfrastructure?.roundOfClockRMO || ""}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    roundOfClockRMO: val || "",
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "roundOfClockRMO",
                  value: values?.hospitalInfrastructure?.roundOfClockRMO,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Pharmacy"
              placeholder="Pharmacy"
              data={medicinesOptions}
              searchable
              clearable
              required
              withAsterisk
              value={values?.hospitalInfrastructure?.pharmacy || ""}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    pharmacy: val || "",
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "pharmacy",
                  value: values?.hospitalInfrastructure?.pharmacy,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Pathology"
              placeholder="Pathology"
              data={medicinesOptions}
              searchable
              clearable
              required
              withAsterisk
              value={values?.hospitalInfrastructure?.pathology || ""}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    pathology: val || "",
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "pathology",
                  value: values?.hospitalInfrastructure?.pathology,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Hospital Operations"
              placeholder="Hospital Operations"
              data={hospitalOperationsOptions}
              searchable
              clearable
              required
              withAsterisk
              value={values?.hospitalInfrastructure?.hospitalOperations || ""}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    hospitalOperations: val || "",
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "hospitalOperations",
                  value: values?.hospitalInfrastructure?.hospitalOperations,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Patient Lifts Available?"
              placeholder="Patient Lifts Available?"
              data={attendantDetailsOptions?.filter((el) => el?.value !== "NA")}
              searchable
              clearable
              required
              withAsterisk
              value={
                values?.hospitalInfrastructure?.patientLifts?.available || ""
              }
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    patientLifts: {
                      ...prev?.hospitalInfrastructure?.patientLifts!,
                      available: val || "",
                    },
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "patientLifts",
                  value: values?.hospitalInfrastructure?.patientLifts,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Is Patient Lifts Operational"
              placeholder="Is Patient Lifts Operational"
              data={yesNoOptions}
              searchable
              clearable
              required
              withAsterisk
              value={
                values?.hospitalInfrastructure?.patientLifts?.operational || ""
              }
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    patientLifts: {
                      ...prev?.hospitalInfrastructure?.patientLifts!,
                      operational: val || "",
                    },
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "patientLifts",
                  value: values?.hospitalInfrastructure?.patientLifts,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Hospital Registration"
              placeholder="Hospital Registration"
              data={[
                ...yesNoOptions,
                { value: "Not shared", label: "Not shared" },
              ]}
              searchable
              clearable
              required
              withAsterisk
              value={
                values?.hospitalInfrastructure?.hospitalRegistration
                  ?.registered || ""
              }
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    hospitalRegistration: {
                      ...prev?.hospitalInfrastructure?.hospitalRegistration!,
                      registered: val || "",
                    },
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "hospitalRegistration",
                  value: values?.hospitalInfrastructure?.hospitalRegistration,
                })
              }
            />
          </Grid.Col>
          {values?.hospitalInfrastructure?.hospitalRegistration?.registered ===
            "Yes" && (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Registered From"
                  placeholder="Registered From"
                  required
                  withAsterisk
                  clearable
                  maxDate={new Date()}
                  value={
                    values?.hospitalInfrastructure?.hospitalRegistration
                      ?.registeredFrom
                      ? dayjs(
                          values?.hospitalInfrastructure?.hospitalRegistration
                            ?.registeredFrom
                        ).toDate()
                      : null
                  }
                  onChange={(date) =>
                    setValues((prev) => ({
                      ...prev,
                      hospitalInfrastructure: {
                        ...prev?.hospitalInfrastructure,
                        hospitalRegistration: {
                          ...prev?.hospitalInfrastructure
                            ?.hospitalRegistration!,
                          registeredFrom: dayjs(date)?.toDate(),
                        },
                      },
                    }))
                  }
                  onBlur={() =>
                    handleInfrastructureBlur({
                      key: "hospitalRegistration",
                      value:
                        values?.hospitalInfrastructure?.hospitalRegistration,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Registered TO"
                  placeholder="Registered TO"
                  required
                  withAsterisk
                  clearable
                  value={
                    values?.hospitalInfrastructure?.hospitalRegistration
                      ?.registeredTo
                      ? dayjs(
                          values?.hospitalInfrastructure?.hospitalRegistration
                            ?.registeredTo
                        ).toDate()
                      : null
                  }
                  onChange={(date) =>
                    setValues((prev) => ({
                      ...prev,
                      hospitalInfrastructure: {
                        ...prev?.hospitalInfrastructure,
                        hospitalRegistration: {
                          ...prev?.hospitalInfrastructure
                            ?.hospitalRegistration!,
                          registeredTo: dayjs(date)?.toDate(),
                        },
                      },
                    }))
                  }
                  onBlur={() =>
                    handleInfrastructureBlur({
                      key: "hospitalRegistration",
                      value:
                        values?.hospitalInfrastructure?.hospitalRegistration,
                    })
                  }
                />
              </Grid.Col>
            </Fragment>
          )}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Record Keeping Available?"
              placeholder="Record Keeping Available?"
              data={yesNoOptions}
              searchable
              clearable
              required
              withAsterisk
              value={values?.hospitalInfrastructure?.recordKeeping?.value || ""}
              onChange={(val) => {
                setValues((prev) => ({
                  ...prev,
                  hospitalInfrastructure: {
                    ...prev.hospitalInfrastructure,
                    recordKeeping: {
                      ...prev?.hospitalInfrastructure?.recordKeeping!,
                      value: val || "",
                    },
                  },
                }));
              }}
              onBlur={() =>
                handleInfrastructureBlur({
                  key: "recordKeeping",
                  value: values?.hospitalInfrastructure?.recordKeeping,
                })
              }
            />
          </Grid.Col>
          {values?.hospitalInfrastructure?.recordKeeping?.value === "Yes" && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Record Keeping Type"
                placeholder="Record Keeping Type"
                data={recordKeepingOptions}
                searchable
                clearable
                required
                withAsterisk
                value={
                  values?.hospitalInfrastructure?.recordKeeping?.type || ""
                }
                onChange={(val) => {
                  setValues((prev) => ({
                    ...prev,
                    hospitalInfrastructure: {
                      ...prev.hospitalInfrastructure,
                      recordKeeping: {
                        ...prev?.hospitalInfrastructure?.recordKeeping!,
                        type: val || "",
                      },
                    },
                  }));
                }}
                onBlur={() =>
                  handleInfrastructureBlur({
                    key: "recordKeeping",
                    value: values?.hospitalInfrastructure?.recordKeeping,
                  })
                }
              />
            </Grid.Col>
          )}
        </Fragment>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Textarea
          label="Remark/Observation"
          placeholder="Remark/Observation"
          required
          withAsterisk
          resize="vertical"
          value={values?.remarks || ""}
          onChange={(e) => handleChange("remarks", e.target.value)}
          onBlur={() => handleBlur({ key: "remarks", value: values?.remarks })}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="ICPs Collected?"
          placeholder="ICPs Collected?"
          data={icpsCollectedOptions}
          searchable
          clearable
          required
          withAsterisk
          value={values?.icpsCollected?.value || ""}
          onChange={(val) => {
            setValues((prev) => ({
              ...prev,
              icpsCollected: {
                ...prev.icpsCollected,
                value: val || "",
              },
            }));
          }}
          onBlur={() =>
            handleBlur({ key: "icpsCollected", value: values?.icpsCollected })
          }
        />
      </Grid.Col>
      {!!values?.icpsCollected?.value &&
        ["No", "No Records", "Not Shared"].includes(
          values?.icpsCollected?.value
        ) && (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="ICPs Collected Remarks"
              placeholder="ICPs Collected Remarks"
              required
              withAsterisk
              value={values?.icpsCollected?.remark || ""}
              onChange={(e) => {
                setValues((prev) => ({
                  ...prev,
                  icpsCollected: {
                    ...prev.icpsCollected!,
                    remark: e.target.value || "",
                  },
                }));
              }}
              onBlur={() =>
                handleBlur({
                  key: "icpsCollected",
                  value: values?.icpsCollected,
                })
              }
            />
          </Grid.Col>
        )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Indoor Entry"
          placeholder="Indoor Entry"
          data={indoorEntryOptions}
          searchable
          clearable
          required
          withAsterisk
          value={values?.indoorEntry?.value || ""}
          onChange={(val) => {
            setValues((prev) => ({
              ...prev,
              indoorEntry: {
                ...prev.indoorEntry,
                value: val || "",
              },
            }));
          }}
          onBlur={() =>
            handleBlur({ key: "indoorEntry", value: values?.indoorEntry })
          }
        />
      </Grid.Col>
      {values?.indoorEntry?.value === "Verified" && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Period of Hospitalization Matching"
            placeholder="Period of Hospitalization Matching"
            data={yesNoOptions}
            searchable
            clearable
            required
            withAsterisk
            value={values?.indoorEntry?.periodOfHospitalizationMatching || ""}
            onChange={(val) => {
              setValues((prev) => ({
                ...prev,
                indoorEntry: {
                  ...prev.indoorEntry!,
                  periodOfHospitalizationMatching: val || "",
                },
              }));
            }}
            onBlur={() =>
              handleBlur({ key: "indoorEntry", value: values?.indoorEntry })
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Old records checked?"
          placeholder="Old records checked?"
          data={yesNoOptions}
          searchable
          clearable
          required
          withAsterisk
          value={values?.oldRecordCheck?.value || ""}
          onChange={(val) => {
            setValues((prev) => ({
              ...prev,
              oldRecordCheck: {
                ...prev.oldRecordCheck!,
                value: val || "",
              },
            }));
          }}
          onBlur={() =>
            handleBlur({ key: "oldRecordCheck", value: values?.oldRecordCheck })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Remarks"
          placeholder="Remarks"
          required
          withAsterisk
          value={values?.oldRecordCheck?.remark || ""}
          onChange={(e) => {
            setValues((prev) => ({
              ...prev,
              oldRecordCheck: {
                ...prev.oldRecordCheck!,
                remark: e.target.value || "",
              },
            }));
          }}
          onBlur={() =>
            handleBlur({ key: "oldRecordCheck", value: values?.oldRecordCheck })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Bill Verification"
          placeholder="Bill Verification"
          data={billVerificationOptions}
          searchable
          clearable
          required
          withAsterisk
          value={values?.billVerification || ""}
          onChange={(val) => {
            handleChange("billVerification", val || "");
          }}
          onBlur={() =>
            handleBlur({
              key: "billVerification",
              value: values?.billVerification,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Payment Receipts"
          placeholder="Payment Receipts"
          data={paymentReceiptsOptions}
          searchable
          clearable
          required
          withAsterisk
          value={values?.paymentReceipts || ""}
          onChange={(val) => {
            handleChange("paymentReceipts", val || "");
          }}
          onBlur={() =>
            handleBlur({
              key: "paymentReceipts",
              value: values?.paymentReceipts,
            })
          }
        />
      </Grid.Col>
      <PatientHabitFormParts
        values={values}
        onChange={(val) => setValues(val as IHospitalVerification)}
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
          handleBlur={handleBlur}
          onChange={(vals) => setValues(vals as IHospitalVerification)}
        />
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Textarea
          label="Verification Summary"
          placeholder="Verification Summary"
          required
          withAsterisk
          resize="vertical"
          value={values?.verificationSummary || ""}
          onChange={(e) => handleChange("verificationSummary", e.target.value)}
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
            handleChange(
              "discrepanciesOrIrregularitiesObserved",
              e.target.value
            )
          }
          onBlur={() =>
            handleBlur({
              key: "discrepanciesOrIrregularitiesObserved",
              value: values?.discrepanciesOrIrregularitiesObserved,
            })
          }
        />
      </Grid.Col>
    </Grid>
  );
};

export default HospitalVerification;
