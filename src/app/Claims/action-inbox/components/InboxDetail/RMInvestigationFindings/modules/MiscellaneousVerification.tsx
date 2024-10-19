import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useAxios } from "@/lib/hooks/useAxios";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import {
  IMiscellaneousVerification,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";
import { Grid, Textarea } from "@mantine/core";

const taskName = "Miscellaneous Verification";

const initialFormValues: IMiscellaneousVerification = {
  anyMarketOrIndustryFeedback: "",
  verificationSummary: "",
};
type PropTypes = {
  isQa?: boolean;
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const MiscellaneousVerification = ({
  isQa,
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] =
    useState<IMiscellaneousVerification>(initialFormValues);

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

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value, name } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = ({ key, value }: { key: string; value: any }) => {
    const payload: Record<string, any> = {
      id: caseId,
      userId: user?._id,
      name: taskName,
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
        setValues((prev) => ({ ...prev, [key]: value }));
      });
    }
  }, [findings]);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Textarea
          label="Any Market Or Industry Feedback"
          placeholder="Any Market Or Industry Feedback"
          name="anyMarketOrIndustryFeedback"
          resize="vertical"
          required
          withAsterisk
          value={values?.anyMarketOrIndustryFeedback || ""}
          onChange={handleChange}
          onBlur={(e) =>
            handleBlur({
              key: "anyMarketOrIndustryFeedback",
              value: e.target.value,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Textarea
          label="Verification Summary"
          placeholder="Verification Summary"
          name="verificationSummary"
          resize="vertical"
          required
          withAsterisk
          value={values?.verificationSummary || ""}
          onChange={handleChange}
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

export default MiscellaneousVerification;
