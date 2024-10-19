import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Grid, Textarea } from "@mantine/core";
import { useAxios } from "@/lib/hooks/useAxios";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import {
  IRandomVicinityVerification,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";

const taskName = "Random Vicinity Hospital/Lab/Doctor/Chemist Verification";

const initialFormValues: IRandomVicinityVerification = {
  verificationSummary: "",
};

type PropTypes = {
  isQa?: boolean;
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const RandomVicinityVerification = ({
  isQa,
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] =
    useState<IRandomVicinityVerification>(initialFormValues);

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
    key: keyof IRandomVicinityVerification;
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

  useEffect(() => {
    if (!!findings && !!findings[taskName]) {
      Object.entries(findings[taskName]).map(([key, value]) => {
        if (!!value) setValues((prev) => ({ ...prev, [key]: value }));
      });
    }
  }, [findings]);

  return (
    <Grid>
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

export default RandomVicinityVerification;
