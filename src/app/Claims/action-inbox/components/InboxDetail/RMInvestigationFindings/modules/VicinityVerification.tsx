import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Grid, Select, Textarea } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import {
  IRMFindings,
  IVicinityVerification,
} from "@/lib/utils/types/rmDataTypes";
import { doneNotDoneOptions } from "@/lib/utils/constants/options";

const taskName = "Vicinity Verification";

const initialFormValues: IVicinityVerification = {
  status: "",
  verificationSummary: "",
};

type PropTypes = {
  formPart?: "Insured" | "Hospital";
  isQa?: boolean;
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const VicinityVerification = ({
  isQa,
  formPart,
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] =
    useState<IVicinityVerification>(initialFormValues);

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
      isQa,
      formPart,
    };

    if (payload?.id && payload?.userId && !!value) {
      payload.payload = { key, value };
      submit(payload);
    }
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
        <Select
          label="status"
          placeholder="status"
          required
          withAsterisk
          data={[...doneNotDoneOptions, { value: "NA", label: "NA" }]}
          value={values?.status || ""}
          onChange={(val) =>
            setValues((prev) => ({ ...prev, status: val || "" }))
          }
          onBlur={(e) =>
            handleBlur({
              key: "status",
              value: values?.status,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
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
              verificationSummary: e.target?.value,
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

export default VicinityVerification;
