import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Grid, Textarea } from "@mantine/core";
import { IClaimVerification, IRMFindings } from "@/lib/utils/types/rmDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";

const taskName = "Claim Verification";

const initialFormValues: IClaimVerification = {
  finalObservation: "",
};

type PropTypes = {
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const ClaimVerification = ({ findings, caseId, setCaseDetail }: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] = useState<IClaimVerification>(initialFormValues);

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
    key: keyof IClaimVerification;
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
          label="Final Observation"
          placeholder="Final Observation"
          required
          withAsterisk
          resize="vertical"
          value={values?.finalObservation}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, finalObservation: e.target.value }))
          }
          onBlur={(e) =>
            handleBlur({ key: "finalObservation", value: e.target.value })
          }
        />
      </Grid.Col>
    </Grid>
  );
};

export default ClaimVerification;
