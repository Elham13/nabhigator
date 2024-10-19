import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  ActionIcon,
  Button,
  Grid,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IoClose } from "react-icons/io5";
import { DateInput } from "@mantine/dates";
import { useAxios } from "@/lib/hooks/useAxios";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import {
  IEmployer,
  IEmployerVerification,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";
import dayjs from "dayjs";
import { yesNoNAOptions } from "@/lib/utils/constants/options";

const taskName = "Employer Verification";

const employerInitials: IEmployer = {
  nameOfEmployer: "",
  address: "",
  anyGroupHealthPolicy: "",
  dateOfJoining: null,
  claimDetails: "",
};

const initialFormValues: IEmployerVerification = {
  employers: [employerInitials],
  verificationSummary: "",
};

type PropTypes = {
  isQa?: boolean;
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const EmployerVerification = ({
  isQa,
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] =
    useState<IEmployerVerification>(initialFormValues);

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
    key: keyof IEmployerVerification;
    value: any;
    isBulk?: boolean;
  }) => {
    const payload: Record<string, any> = {
      id: caseId,
      userId: user?._id,
      name: taskName,
      isBulk,
      isQa,
    };

    if (payload?.id && payload?.userId && !!value) {
      payload.payload = { key, value };
      submit(payload);
    }
  };

  const handleAddMore = () => {
    const newItems =
      !!values?.employers && values?.employers?.length > 0
        ? [...values?.employers, employerInitials]
        : [employerInitials];

    setValues((prev) => ({
      ...prev,
      employers: newItems,
    }));

    handleBlur({ key: "employers", value: newItems });
  };

  const handleRemove = (ind: number) => {
    const newItems =
      values?.employers && values?.employers?.length > 0
        ? values?.employers?.filter((_, index) => index !== ind)
        : [];

    setValues((prev) => ({ ...prev, employers: newItems }));
    handleBlur({ key: "employers", value: newItems });
  };

  const handleListChange = (
    name: keyof IEmployer,
    index: number,
    value: any
  ) => {
    const newItems: IEmployer[] =
      values?.employers && values?.employers?.length > 0
        ? (values?.employers?.map((el, ind) =>
            ind === index ? { ...el, [name]: value } : el
          ) as IEmployer[])
        : ([{ [name]: value }] as IEmployer[]);

    setValues((prev) => ({ ...prev, employers: newItems }));
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
      {!!values?.employers &&
        values?.employers?.length > 0 &&
        values?.employers?.map((employer, index) => (
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
                label="Name of Employer"
                placeholder="Name of Employer"
                withAsterisk
                required
                value={employer?.nameOfEmployer || ""}
                onChange={(e) =>
                  handleListChange("nameOfEmployer", index, e.target.value)
                }
                onBlur={() =>
                  handleBlur({
                    key: "employers",
                    value: values?.employers,
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
                value={employer?.address || ""}
                onChange={(e) =>
                  handleListChange("address", index, e.target.value)
                }
                onBlur={() =>
                  handleBlur({
                    key: "employers",
                    value: values?.employers,
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput
                label="Date of Joining"
                placeholder="Date of Joining"
                required
                withAsterisk
                clearable
                maxDate={new Date()}
                value={
                  employer?.dateOfJoining
                    ? dayjs(employer?.dateOfJoining).toDate()
                    : null
                }
                onChange={(date) =>
                  handleListChange("dateOfJoining", index, dayjs(date).toDate())
                }
                onBlur={() =>
                  handleBlur({
                    key: "employers",
                    value: values?.employers,
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Any Group Health Policy"
                placeholder="Any Group Health Policy"
                withAsterisk
                required
                searchable
                clearable
                data={yesNoNAOptions}
                value={employer?.anyGroupHealthPolicy || ""}
                onChange={(val) =>
                  handleListChange("anyGroupHealthPolicy", index, val || "")
                }
                onBlur={() =>
                  handleBlur({
                    key: "employers",
                    value: values?.employers,
                  })
                }
              />
            </Grid.Col>
            {employer?.anyGroupHealthPolicy === "Yes" && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Claim Details"
                  placeholder="Claim Details"
                  withAsterisk
                  required
                  value={employer?.claimDetails || ""}
                  onChange={(e) =>
                    handleListChange("claimDetails", index, e.target.value)
                  }
                  onBlur={() =>
                    handleBlur({
                      key: "employers",
                      value: values?.employers,
                    })
                  }
                />
              </Grid.Col>
            )}
          </Fragment>
        ))}
      <Grid.Col span={12}>
        <Button fullWidth onClick={handleAddMore} variant="subtle">
          Add
          {!!values?.employers && values?.employers?.length > 0
            ? " more "
            : " "}
          Employer
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

export default EmployerVerification;
