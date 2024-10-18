import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  empRelationshipOptions,
  establishmentStatusOptions,
  establishmentTypeOptions,
  establishmentVerificationOptions,
  icpsCollectedOptions,
  refundInvoiceOptions,
} from "@/lib/utils/constants/options";
import { Grid, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { useAxios } from "@/lib/hooks/useAxios";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import {
  IEmploymentAndEstablishmentVerification,
  IEstablishmentVerification,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";

const taskName = "Employment & Establishment Verification";

const establishmentInitials: IEstablishmentVerification = {
  value: "",
  status: {
    value: "",
    address: "",
    city: "",
    state: "",
    typeOfEstablishments: "",
  },
};

const initialFormValues: IEmploymentAndEstablishmentVerification = {
  nameOfEstablishment: "",
  address: "",
  city: "",
  state: "",
  establishmentVerification: establishmentInitials,
  employeeAndEmployerRelationship: "",
  employeeIdCard: "",
  listOfEmpMatchWithMembersEnrolled: "",
  listOfWorkingEmployees: "",
  natureOfWork: "",
  salaryProof: "",
  totalNoOfEmployeesWorking: 0,
  investigationSummary: "",
  discrepanciesObserved: "",
};

type PropTypes = {
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const EmploymentAndEstablishmentVerification = ({
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] =
    useState<IEmploymentAndEstablishmentVerification>(initialFormValues);

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
    isBulk,
  }: {
    key: keyof IEmploymentAndEstablishmentVerification;
    value: any;
    isBulk?: boolean;
  }) => {
    const payload: Record<string, any> = {
      id: caseId,
      userId: user?._id,
      name: taskName,
      isBulk,
    };

    if (payload?.id && payload?.userId && !!value) {
      payload.payload = { key, value };
      submit(payload);
    }
  };

  const handleChange = (
    name: keyof IEmploymentAndEstablishmentVerification,
    value: any
  ) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!!findings && !!findings[taskName]) {
      Object.entries(findings[taskName]).map(([key, value]) => {
        if (!!value) setValues((prev) => ({ ...prev, [key]: value }));
      });
    }
  }, [findings]);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Name of Establishment"
          placeholder="Name of Establishment"
          withAsterisk
          required
          value={values?.nameOfEstablishment || ""}
          onChange={(e) => handleChange("nameOfEstablishment", e.target.value)}
          onBlur={() =>
            handleBlur({
              key: "nameOfEstablishment",
              value: values?.nameOfEstablishment,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Address"
          placeholder="Address"
          withAsterisk
          required
          value={values?.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          onBlur={() =>
            handleBlur({
              key: "address",
              value: values?.address,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="City"
          placeholder="City"
          withAsterisk
          required
          value={values?.city || ""}
          onChange={(e) => handleChange("city", e.target.value)}
          onBlur={() =>
            handleBlur({
              key: "city",
              value: values?.city,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="State"
          placeholder="State"
          withAsterisk
          required
          value={values?.state || ""}
          onChange={(e) => handleChange("state", e.target.value)}
          onBlur={() =>
            handleBlur({
              key: "state",
              value: values?.state,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Establishment Verification"
          placeholder="Establishment Verification"
          withAsterisk
          required
          searchable
          clearable
          data={establishmentVerificationOptions}
          value={values?.establishmentVerification?.value || ""}
          onChange={(val) =>
            setValues((prev) => ({
              ...prev,
              establishmentVerification: {
                ...prev?.establishmentVerification,
                value: val || "",
              },
            }))
          }
          onBlur={() =>
            handleBlur({
              key: "establishmentVerification",
              value: values?.establishmentVerification,
            })
          }
        />
      </Grid.Col>
      {values?.establishmentVerification?.value ===
      "Does Not Exist on the address as per contract" ? (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Status"
            placeholder="Status"
            withAsterisk
            required
            searchable
            clearable
            data={establishmentStatusOptions}
            value={values?.establishmentVerification?.status?.value || ""}
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                establishmentVerification: {
                  ...prev?.establishmentVerification,
                  status: {
                    ...(!!prev?.establishmentVerification?.status
                      ? prev?.establishmentVerification?.status
                      : {}),
                    value: val || "",
                  },
                },
              }))
            }
            onBlur={() =>
              handleBlur({
                key: "establishmentVerification",
                value: values?.establishmentVerification,
              })
            }
          />
        </Grid.Col>
      ) : values?.establishmentVerification?.value ===
        "Exists on another address" ? (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Address"
              placeholder="Address"
              withAsterisk
              required
              value={values?.establishmentVerification?.status?.address || ""}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  establishmentVerification: {
                    ...prev?.establishmentVerification,
                    status: {
                      ...(!!prev?.establishmentVerification?.status
                        ? prev?.establishmentVerification?.status
                        : { value: "" }),
                      address: e.target.value || "",
                    },
                  },
                }))
              }
              onBlur={() =>
                handleBlur({
                  key: "establishmentVerification",
                  value: values?.establishmentVerification,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="City"
              placeholder="City"
              withAsterisk
              required
              value={values?.establishmentVerification?.status?.city || ""}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  establishmentVerification: {
                    ...prev?.establishmentVerification,
                    status: {
                      ...(!!prev?.establishmentVerification?.status
                        ? prev?.establishmentVerification?.status
                        : { value: "" }),
                      city: e.target.value || "",
                    },
                  },
                }))
              }
              onBlur={() =>
                handleBlur({
                  key: "establishmentVerification",
                  value: values?.establishmentVerification,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="State"
              placeholder="State"
              withAsterisk
              required
              value={values?.establishmentVerification?.status?.state || ""}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  establishmentVerification: {
                    ...prev?.establishmentVerification,
                    status: {
                      ...(!!prev?.establishmentVerification?.status
                        ? prev?.establishmentVerification?.status
                        : { value: "" }),
                      state: e.target.value || "",
                    },
                  },
                }))
              }
              onBlur={() =>
                handleBlur({
                  key: "establishmentVerification",
                  value: values?.establishmentVerification,
                })
              }
            />
          </Grid.Col>
        </Fragment>
      ) : null}

      {(values?.establishmentVerification?.value ===
        "Exist on the address as per contract" ||
        values?.establishmentVerification?.status?.value ===
          "Exists on another address") && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Type of Establishment"
            placeholder="Type of Establishment"
            withAsterisk
            required
            searchable
            clearable
            data={establishmentTypeOptions}
            value={
              values?.establishmentVerification?.status?.typeOfEstablishments ||
              ""
            }
            onChange={(val) =>
              setValues((prev) => ({
                ...prev,
                establishmentVerification: {
                  ...prev?.establishmentVerification,
                  status: {
                    ...(!!prev?.establishmentVerification?.status
                      ? prev?.establishmentVerification?.status
                      : { value: "" }),
                    typeOfEstablishments: val || "",
                  },
                },
              }))
            }
            onBlur={() =>
              handleBlur({
                key: "establishmentVerification",
                value: values?.establishmentVerification,
              })
            }
          />
        </Grid.Col>
      )}

      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Nature of work"
          placeholder="Nature of work"
          withAsterisk
          required
          value={values?.natureOfWork || ""}
          onChange={(e) => handleChange("natureOfWork", e.target.value)}
          onBlur={(e) =>
            handleBlur({
              key: "natureOfWork",
              value: e.target.value,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <NumberInput
          label="Total Number of Employees working"
          placeholder="Total Number of Employees working"
          withAsterisk
          required
          value={values?.totalNoOfEmployeesWorking || ""}
          onChange={(val) => handleChange("totalNoOfEmployeesWorking", val)}
          onBlur={() =>
            handleBlur({
              key: "totalNoOfEmployeesWorking",
              value: values?.totalNoOfEmployeesWorking,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="List of working employees"
          placeholder="List of working employees"
          withAsterisk
          required
          searchable
          clearable
          data={refundInvoiceOptions.filter(
            (el) => el?.value !== "Not available with insured"
          )}
          value={values?.listOfWorkingEmployees || ""}
          onChange={(val) => handleChange("listOfWorkingEmployees", val || "")}
          onBlur={() =>
            handleBlur({
              key: "listOfWorkingEmployees",
              value: values?.listOfWorkingEmployees,
            })
          }
        />
      </Grid.Col>

      {values?.listOfWorkingEmployees === "Collected" && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Whether list of working employee matches with members enrolled"
            placeholder="Whether list of working employee matches with members enrolled"
            withAsterisk
            required
            value={values?.listOfEmpMatchWithMembersEnrolled || ""}
            onChange={(e) =>
              handleChange("listOfEmpMatchWithMembersEnrolled", e.target.value)
            }
            onBlur={(e) =>
              handleBlur({
                key: "listOfEmpMatchWithMembersEnrolled",
                value: e.target.value,
              })
            }
          />
        </Grid.Col>
      )}

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Employee-Employer relationship"
          placeholder="Employee-Employer relationship"
          withAsterisk
          required
          searchable
          clearable
          data={empRelationshipOptions}
          value={values?.employeeAndEmployerRelationship || ""}
          onChange={(val) =>
            handleChange("employeeAndEmployerRelationship", val || "")
          }
          onBlur={() =>
            handleBlur({
              key: "employeeAndEmployerRelationship",
              value: values?.employeeAndEmployerRelationship,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Employee ID Card"
          placeholder="Employee ID Card"
          withAsterisk
          required
          searchable
          clearable
          data={icpsCollectedOptions.filter((el) => el?.value !== "No Records")}
          value={values?.employeeIdCard || ""}
          onChange={(val) => handleChange("employeeIdCard", val || "")}
          onBlur={() =>
            handleBlur({
              key: "employeeIdCard",
              value: values?.employeeIdCard,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Salary Proof"
          placeholder="Salary Proof"
          withAsterisk
          required
          searchable
          clearable
          data={refundInvoiceOptions.filter(
            (el) => el?.value !== "Not available with insured"
          )}
          value={values?.salaryProof || ""}
          onChange={(val) => handleChange("salaryProof", val || "")}
          onBlur={() =>
            handleBlur({
              key: "salaryProof",
              value: values?.salaryProof,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Textarea
          label="Investigation Summary"
          placeholder="Investigation Summary"
          withAsterisk
          required
          resize="vertical"
          value={values?.investigationSummary || ""}
          onChange={(e) => handleChange("investigationSummary", e.target.value)}
          onBlur={(e) =>
            handleBlur({
              key: "investigationSummary",
              value: e.target.value,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Textarea
          label="Discrepancies Observed"
          placeholder="Discrepancies Observed"
          withAsterisk
          required
          resize="vertical"
          value={values?.discrepanciesObserved || ""}
          onChange={(e) =>
            handleChange("discrepanciesObserved", e.target.value)
          }
          onBlur={(e) =>
            handleBlur({
              key: "discrepanciesObserved",
              value: e.target.value,
            })
          }
        />
      </Grid.Col>
    </Grid>
  );
};

export default EmploymentAndEstablishmentVerification;
