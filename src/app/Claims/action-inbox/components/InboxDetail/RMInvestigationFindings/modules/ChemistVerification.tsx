import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IoClose } from "react-icons/io5";
import { useAxios } from "@/lib/hooks/useAxios";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import {
  IChemist,
  IChemistVerification,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";
import { billsVerifiedOptions } from "@/lib/utils/constants/options";

const taskName = "Chemist Verification";

const chemistInitials: IChemist = {
  name: "",
  address: "",
  billsVerified: "",
  city: "",
  state: "",
};

const initialFormValues: IChemistVerification = {
  chemists: [chemistInitials],
  verificationSummary: "",
};

type PropTypes = {
  formPart?: "Insured" | "Hospital";
  isQa?: boolean;
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const ChemistVerification = ({
  formPart,
  isQa,
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] = useState<IChemistVerification>(initialFormValues);

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

  const handleChemistChange = ({
    key,
    value,
    ind,
  }: {
    key: keyof IChemist;
    value: string;
    ind: number;
  }) => {
    const chemists = values?.chemists;
    chemists[ind][key] = value;
    setValues((prev) => ({ ...prev, chemists }));
  };

  const handleBlur = ({ key, value }: { key: string; value: any }) => {
    const payload: Record<string, any> = {
      id: caseId,
      userId: user?._id,
      name: taskName,
      isQa,
      formPart,
    };

    if (payload?.id && payload?.userId && !!value) {
      payload.payload = { key, value };
      submit(payload);
    }
  };

  const handleChemistBlur = () => {
    handleBlur({ key: "chemists", value: values?.chemists });
  };

  const handleAddMore = () => {
    const chemists =
      values?.chemists?.length > 0
        ? [...values?.chemists, chemistInitials]
        : [chemistInitials];
    setValues((prev) => ({
      ...prev,
      chemists,
    }));
    handleBlur({ key: "chemists", value: chemists });
  };

  const handleRemoveForm = (index: number) => {
    const chemists =
      values?.chemists?.length > 0
        ? values?.chemists?.filter((_, ind) => ind !== index)
        : [];

    setValues((prev) => ({ ...prev, chemists }));
    handleBlur({ key: "chemists", value: chemists });
  };

  useEffect(() => {
    if (!!findings && !!findings[taskName]) {
      Object.entries(findings[taskName]).map(([key, value]: any) => {
        setValues((prev) => ({ ...prev, [key]: value }));
      });
    }
  }, [findings]);

  return (
    <Grid>
      <Grid.Col span={12}>
        {values?.chemists?.length > 0 &&
          values?.chemists?.map((chemist, ind) => (
            <Grid className="w-full relative pt-8 border-b pb-2" key={ind}>
              <div className="absolute right-4 top-4">
                <ActionIcon onClick={() => handleRemoveForm(ind)}>
                  <IoClose />
                </ActionIcon>
              </div>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Name of Chemist"
                  placeholder="Name of Chemist"
                  value={chemist?.name || ""}
                  withAsterisk
                  required
                  onBlur={handleChemistBlur}
                  onChange={(e) =>
                    handleChemistChange({
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
                  value={chemist?.address || ""}
                  withAsterisk
                  required
                  onBlur={handleChemistBlur}
                  onChange={(e) =>
                    handleChemistChange({
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
                  value={chemist?.city || ""}
                  withAsterisk
                  required
                  onBlur={handleChemistBlur}
                  onChange={(e) =>
                    handleChemistChange({
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
                  value={chemist?.state || ""}
                  withAsterisk
                  required
                  onBlur={handleChemistBlur}
                  onChange={(e) =>
                    handleChemistChange({
                      key: "state",
                      value: e.target.value,
                      ind,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Bills verified?"
                  placeholder="Bills verified?"
                  value={chemist?.billsVerified || ""}
                  withAsterisk
                  required
                  onBlur={handleChemistBlur}
                  data={billsVerifiedOptions}
                  onChange={(value) =>
                    handleChemistChange({
                      key: "billsVerified",
                      value: value as string,
                      ind,
                    })
                  }
                />
              </Grid.Col>
            </Grid>
          ))}
      </Grid.Col>
      <Grid.Col span={12}>
        <Button fullWidth onClick={handleAddMore} variant="subtle">
          Add{values?.chemists?.length > 0 ? " more " : " "}Chemist
        </Button>
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea
          label="Verification Summary"
          placeholder="Verification Summary"
          name="verificationSummary"
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
          onBlur={(e) =>
            handleBlur({
              key: "verificationSummary",
              value: e.target.value,
            })
          }
        />
      </Grid.Col>
    </Grid>
  );
};

export default ChemistVerification;
