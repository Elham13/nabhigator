import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  labReportsOptions,
  meetingStatusOptions,
  reportsSignedByOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";
import {
  ActionIcon,
  Button,
  Divider,
  Grid,
  Select,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IoClose } from "react-icons/io5";
import { useAxios } from "@/lib/hooks/useAxios";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import {
  ILabOrPathologistVerification,
  ILabs,
  IPathologistDetail,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";

const taskName = "Lab Part/Pathologist Verification";

const pathologistInitials: IPathologistDetail = {
  name: "",
  meetingStatus: "",
  qualification: "",
  registrationNo: "",
  cooperation: "",
  reasonForUntraceable: "",
};

const labInitials: ILabs = {
  name: "",
  address: "",
  city: "",
  labBills: "",
  labReports: "",
  reportsSigned: "",
  state: "",
  pathologistDetails: pathologistInitials,
};
const initialFormValues: ILabOrPathologistVerification = {
  labs: [labInitials],
  verificationSummary: "",
};

type PropTypes = {
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const LabOrPathologistVerification = ({
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] =
    useState<ILabOrPathologistVerification>(initialFormValues);

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

  const handleBlur = ({ key, value }: { key: string; value: any }) => {
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

  const handleAddMore = () => {
    const labs =
      values?.labs?.length > 0 ? [...values?.labs, labInitials] : [labInitials];
    setValues((prev) => ({
      ...prev,
      labs,
    }));
    handleBlur({ key: "labs", value: labs });
  };

  const handleRemoveForm = (index: number) => {
    const labs =
      values?.labs?.length > 0
        ? values?.labs?.filter((_, ind) => ind !== index)
        : [];

    setValues((prev) => ({ ...prev, labs }));
    handleBlur({ key: "labs", value: labs });
  };

  const handleLabChange = ({
    key,
    value,
    ind,
  }: {
    key: keyof ILabs;
    value: any;
    ind: number;
  }) => {
    const labs = values?.labs;
    labs[ind][key] = value;
    setValues((prev) => ({ ...prev, labs }));
  };

  const handlePathologistChange = ({
    key,
    value,
    ind,
  }: {
    key: keyof IPathologistDetail;
    value: any;
    ind: number;
  }) => {
    const labs = values?.labs;
    labs[ind]["pathologistDetails"][key] = value;
    setValues((prev) => ({ ...prev, labs }));
  };

  const handleLabBlur = () => {
    handleBlur({ key: "labs", value: values?.labs });
  };

  useEffect(() => {
    if (!!findings && findings[taskName]) {
      Object.entries(findings[taskName]).map(([key, value]: any) => {
        setValues((prev) => ({ ...prev, [key]: value }));
      });
    }
  }, [findings]);

  return (
    <Grid>
      {values?.labs?.length > 0 &&
        values?.labs?.map((lab, ind) => (
          <Grid className="w-full relative pt-8 border-b pb-2" key={ind}>
            <div className="absolute right-4 top-4">
              <ActionIcon onClick={() => handleRemoveForm(ind)}>
                <IoClose />
              </ActionIcon>
            </div>
            <Grid.Col span={12}>
              <Title order={5}>Lab Details</Title>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Name of Lab"
                placeholder="Name of Lab"
                value={lab?.name || ""}
                withAsterisk
                required
                onBlur={handleLabBlur}
                onChange={(e) =>
                  handleLabChange({
                    key: "name",
                    value: e.target.value,
                    ind,
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Address"
                placeholder="Address"
                value={lab?.address || ""}
                withAsterisk
                required
                onBlur={handleLabBlur}
                onChange={(e) =>
                  handleLabChange({
                    key: "address",
                    value: e.target.value,
                    ind,
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="City"
                placeholder="City"
                value={lab?.city || ""}
                withAsterisk
                required
                onBlur={handleLabBlur}
                onChange={(e) =>
                  handleLabChange({
                    key: "city",
                    value: e.target.value,
                    ind,
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="State"
                placeholder="State"
                value={lab?.state || ""}
                withAsterisk
                required
                onBlur={handleLabBlur}
                onChange={(e) =>
                  handleLabChange({
                    key: "state",
                    value: e.target.value,
                    ind,
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Reports signed by"
                placeholder="Reports signed by"
                value={lab?.reportsSigned || ""}
                withAsterisk
                required
                onBlur={handleLabBlur}
                data={reportsSignedByOptions}
                onChange={(value) =>
                  handleLabChange({
                    key: "reportsSigned",
                    value: value as string,
                    ind,
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Lab Reports"
                placeholder="Lab Reports"
                value={lab?.labReports || ""}
                withAsterisk
                required
                onBlur={handleLabBlur}
                data={labReportsOptions}
                onChange={(value) =>
                  handleLabChange({
                    key: "labReports",
                    value: value as string,
                    ind,
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Lab Bills"
                placeholder="Lab Bills"
                value={lab?.labBills || ""}
                withAsterisk
                required
                onBlur={handleLabBlur}
                data={labReportsOptions}
                onChange={(value) =>
                  handleLabChange({
                    key: "labBills",
                    value: value as string,
                    ind,
                  })
                }
              />
            </Grid.Col>
            <Divider my="md" />
            <Grid.Col span={12}>
              <Title order={5}>Pathologist Details</Title>
            </Grid.Col>
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Name of Pathologist"
                  placeholder="Name of Pathologist"
                  value={lab?.pathologistDetails?.name || ""}
                  withAsterisk
                  required
                  onBlur={handleLabBlur}
                  onChange={(e) =>
                    handlePathologistChange({
                      key: "name",
                      value: e.target.value,
                      ind,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Qualification"
                  placeholder="Qualification"
                  value={lab?.pathologistDetails?.qualification || ""}
                  withAsterisk
                  required
                  onBlur={handleLabBlur}
                  onChange={(e) =>
                    handlePathologistChange({
                      key: "qualification",
                      value: e.target.value,
                      ind,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Registration Number"
                  placeholder="Registration Number"
                  value={lab?.pathologistDetails?.registrationNo || ""}
                  withAsterisk
                  required
                  onBlur={handleLabBlur}
                  onChange={(e) =>
                    handlePathologistChange({
                      key: "registrationNo",
                      value: e.target.value,
                      ind,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Pathologist Meeting Status"
                  placeholder="Pathologist Meeting Status"
                  value={lab?.pathologistDetails?.meetingStatus || ""}
                  withAsterisk
                  required
                  data={meetingStatusOptions}
                  onBlur={handleLabBlur}
                  onChange={(val) =>
                    handlePathologistChange({
                      key: "meetingStatus",
                      value: val,
                      ind,
                    })
                  }
                />
              </Grid.Col>
              {lab?.pathologistDetails?.meetingStatus === "Untraceable" ? (
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Reason for Untraceable"
                    placeholder="Reason for Untraceable"
                    value={lab?.pathologistDetails?.reasonForUntraceable || ""}
                    withAsterisk
                    required
                    onBlur={handleLabBlur}
                    onChange={(e) =>
                      handlePathologistChange({
                        key: "reasonForUntraceable",
                        value: e.target.value,
                        ind,
                      })
                    }
                  />
                </Grid.Col>
              ) : lab?.pathologistDetails?.meetingStatus === "Traceable" ? (
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Co-Operation"
                    placeholder="Co-Operation"
                    value={lab?.pathologistDetails?.cooperation || ""}
                    withAsterisk
                    required
                    onBlur={handleLabBlur}
                    data={yesNoOptions}
                    onChange={(val) =>
                      handlePathologistChange({
                        key: "cooperation",
                        value: val || "",
                        ind,
                      })
                    }
                  />
                </Grid.Col>
              ) : null}
            </Fragment>
          </Grid>
        ))}
      <Grid.Col span={12}>
        <Button fullWidth onClick={handleAddMore} variant="subtle">
          Add{values?.labs?.length > 0 ? " more " : " "}Lab
        </Button>
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea
          label="Verification Summary"
          placeholder="Verification Summary"
          value={values?.verificationSummary || ""}
          withAsterisk
          required
          onBlur={() =>
            handleBlur({
              key: "verificationSummary",
              value: values?.verificationSummary,
            })
          }
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              verificationSummary: e.target.value,
            }))
          }
        />
      </Grid.Col>
    </Grid>
  );
};

export default LabOrPathologistVerification;
