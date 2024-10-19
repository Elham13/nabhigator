import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useAxios } from "@/lib/hooks/useAxios";
import {
  doctorQualificationOptions,
  doctorRegNoOptions,
  meetingStatusOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";
import {
  ActionIcon,
  Button,
  Grid,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IoClose } from "react-icons/io5";
import {
  IRMFindings,
  ITreatingDoctor,
  ITreatingDoctorVerification,
} from "@/lib/utils/types/rmDataTypes";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";

const taskName = "Treating Doctor Verification";

const docInitials: ITreatingDoctor = {
  meetingStatus: "",
  name: "",
  qualification: "",
  registrationNo: { remark: "", value: "" },
};

const initialFormValues: ITreatingDoctorVerification = {
  doctors: [docInitials],
  verificationSummary: "",
};

type PropTypes = {
  formPart?: "Insured" | "Hospital";
  isQa?: boolean;
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const TreatingDoctorVerification = ({
  isQa,
  formPart,
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] =
    useState<ITreatingDoctorVerification>(initialFormValues);

  const { refetch: submit, loading } = useAxios<
    SingleResponseType<CaseDetail | null>
  >({
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
    key: keyof ITreatingDoctorVerification;
    value: any;
    isBulk?: boolean;
  }) => {
    const payload: Record<string, any> = {
      id: caseId,
      userId: user?._id,
      name: taskName,
      isBulk,
      isQa,
      formPart,
    };

    if (payload?.id && payload?.userId && !!value) {
      payload.payload = { key, value };
      submit(payload);
    }
  };

  const handleAddMore = () => {
    const newItems =
      !!values?.doctors && values?.doctors?.length > 0
        ? [...values?.doctors, docInitials]
        : [docInitials];

    setValues((prev) => ({
      ...prev,
      doctors: newItems,
    }));

    handleBlur({ key: "doctors", value: newItems });
  };

  const handleRemove = (ind: number) => {
    const newItems =
      values?.doctors && values?.doctors?.length > 0
        ? values?.doctors?.filter((_, index) => index !== ind)
        : [];

    setValues((prev) => ({ ...prev, doctors: newItems }));
    handleBlur({ key: "doctors", value: newItems });
  };

  const handleListChange = (
    name: keyof ITreatingDoctor,
    index: number,
    value: any
  ) => {
    const newItems: ITreatingDoctor[] =
      values?.doctors && values?.doctors?.length > 0
        ? (values?.doctors?.map((el, ind) =>
            ind === index ? { ...el, [name]: value } : el
          ) as ITreatingDoctor[])
        : ([{ [name]: value }] as ITreatingDoctor[]);

    setValues((prev) => ({ ...prev, doctors: newItems }));
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
      {!!values?.doctors &&
        values?.doctors?.length > 0 &&
        values?.doctors?.map((doctor, index) => (
          <Fragment key={index}>
            <Grid className="w-full relative pt-8 border-b pb-2">
              <div className="absolute right-4 top-4">
                <ActionIcon onClick={() => handleRemove(index)}>
                  <IoClose />
                </ActionIcon>
              </div>
            </Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Name of Treating Doctor"
                placeholder="Name of Treating Doctor"
                withAsterisk
                required
                value={doctor?.name || ""}
                onChange={(e) =>
                  handleListChange("name", index, e.target.value)
                }
                onBlur={() =>
                  handleBlur({
                    key: "doctors",
                    value: values?.doctors,
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Qualification"
                placeholder="Qualification"
                withAsterisk
                required
                searchable
                clearable
                data={doctorQualificationOptions}
                value={doctor?.qualification || ""}
                onChange={(val) =>
                  handleListChange("qualification", index, val || "")
                }
                onBlur={() =>
                  handleBlur({
                    key: "doctors",
                    value: values?.doctors,
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Registration Number"
                placeholder="Registration Number"
                withAsterisk
                required
                searchable
                clearable
                data={doctorRegNoOptions}
                value={doctor?.registrationNo?.value || ""}
                onChange={(val) => {
                  const newItems: ITreatingDoctor[] =
                    values?.doctors && values?.doctors?.length > 0
                      ? (values?.doctors?.map((el, ind) =>
                          ind === index
                            ? { ...el, registrationNo: { value: val || "" } }
                            : el
                        ) as ITreatingDoctor[])
                      : ([
                          { registrationNo: { value: val || "" } },
                        ] as ITreatingDoctor[]);

                  setValues((prev) => ({ ...prev, doctors: newItems }));
                }}
                onBlur={() =>
                  handleBlur({
                    key: "doctors",
                    value: values?.doctors,
                  })
                }
              />
            </Grid.Col>
            {!!doctor?.registrationNo?.value && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Remarks"
                  placeholder="Remarks"
                  withAsterisk
                  required
                  value={doctor?.registrationNo?.remark || ""}
                  onChange={(e) => {
                    const newItems: ITreatingDoctor[] =
                      values?.doctors && values?.doctors?.length > 0
                        ? (values?.doctors?.map((el, ind) =>
                            ind === index
                              ? {
                                  ...el,
                                  registrationNo: {
                                    ...el?.registrationNo,
                                    remark: e.target.value,
                                  },
                                }
                              : el
                          ) as ITreatingDoctor[])
                        : ([
                            {
                              registrationNo: {
                                value: "",
                                remark: e.target.value,
                              },
                            },
                          ] as ITreatingDoctor[]);

                    setValues((prev) => ({ ...prev, doctors: newItems }));
                  }}
                  onBlur={() =>
                    handleBlur({
                      key: "doctors",
                      value: values?.doctors,
                    })
                  }
                />
              </Grid.Col>
            )}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Meeting Status"
                placeholder="Meeting Status"
                withAsterisk
                required
                searchable
                clearable
                data={meetingStatusOptions}
                value={doctor?.meetingStatus || ""}
                onChange={(val) =>
                  handleListChange("meetingStatus", index, val || "")
                }
                onBlur={() =>
                  handleBlur({
                    key: "doctors",
                    value: values?.doctors,
                  })
                }
              />
            </Grid.Col>
            {doctor?.meetingStatus === "Untraceable" ? (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Remarks for Untraceable"
                  placeholder="Remarks for Untraceable"
                  withAsterisk
                  required
                  value={doctor?.remarkForUntraceable || ""}
                  onChange={(e) =>
                    handleListChange(
                      "remarkForUntraceable",
                      index,
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlur({
                      key: "doctors",
                      value: values?.doctors,
                    })
                  }
                />
              </Grid.Col>
            ) : doctor?.meetingStatus === "Traceable" ? (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Co-Operation"
                  placeholder="Co-Operation"
                  withAsterisk
                  required
                  searchable
                  clearable
                  data={yesNoOptions}
                  value={doctor?.cooperation || ""}
                  onChange={(val) =>
                    handleListChange("cooperation", index, val || "")
                  }
                  onBlur={() =>
                    handleBlur({
                      key: "doctors",
                      value: values?.doctors,
                    })
                  }
                />
              </Grid.Col>
            ) : null}
          </Fragment>
        ))}
      <Grid.Col span={12}>
        <Button fullWidth onClick={handleAddMore} variant="subtle">
          Add
          {!!values?.doctors && values?.doctors?.length > 0 ? " more " : " "}
          Doctor
        </Button>
      </Grid.Col>

      <Grid.Col span={12}>
        <Textarea
          label="Verification Summary"
          placeholder="Verification Summary"
          resize="vertical"
          required
          withAsterisk
          value={values?.verificationSummary || ""}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              verificationSummary: e.target.value,
            }))
          }
          onBlur={() =>
            handleBlur({
              key: "verificationSummary",
              value: values?.verificationSummary,
            })
          }
        />
      </Grid.Col>
    </Grid>
  );
};

export default TreatingDoctorVerification;
