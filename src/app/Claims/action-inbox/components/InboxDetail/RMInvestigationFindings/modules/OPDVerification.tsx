import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAxios } from "@/lib/hooks/useAxios";
import { Grid, Textarea } from "@mantine/core";
import {
  IOPDVerificationPart,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";

const taskName = "OPD Verification Part";

const initialFormValues: IOPDVerificationPart = {
  finalObservation: "",
};

type PropTypes = {
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const OPDVerification = ({ findings, caseId, setCaseDetail }: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const [values, setValues] = useState<IOPDVerificationPart>(initialFormValues);

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
    key: keyof IOPDVerificationPart;
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

export default OPDVerification;