import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import PrePostDynamicFormParts from "./FormParts/PrePostDynamicFormParts";
import { Button, Grid, Select, Textarea, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import {
  IAHCVerificationPart,
  ILab,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { yesNAOptions } from "@/lib/utils/constants/options";

const taskName = "AHC Verification Part";

const labInitials: ILab = {
  name: "",
  address: "",
  billsVerified: "",
  city: "",
  qrCodeAvailableOnBill: "",
  finalObservation: "",
};

const initialFormValues: IAHCVerificationPart = {
  labVerified: "",
  labs: [],
  finalObservation: "",
};

type PropTypes = {
  formPart?: "Insured" | "Hospital";
  isQa?: boolean;
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const AHCVerification = ({
  isQa,
  formPart,
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] = useState<IAHCVerificationPart>(initialFormValues);

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
    key: keyof IAHCVerificationPart;
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

  const handleListChange = (name: keyof ILab, index: number, value: any) => {
    const newItems: ILab[] =
      values?.labs && values?.labs?.length > 0
        ? (values?.labs?.map((el, ind) =>
            ind === index ? { ...el, [name]: value } : el
          ) as ILab[])
        : ([{ [name]: value }] as ILab[]);

    setValues((prev) => ({ ...prev, labs: newItems }));
  };

  const handleRemove = (ind: number) => {
    const newItems =
      values?.labs && values?.labs?.length > 0
        ? values?.labs?.filter((_, index) => index !== ind)
        : [];

    setValues((prev) => ({ ...prev, labs: newItems }));
    handleBlur({ key: "labs", value: newItems });
  };

  const handleAddMore = () => {
    const newItems =
      !!values?.labs && values?.labs?.length > 0
        ? [...values?.labs, labInitials]
        : [labInitials];
    setValues((prev) => ({
      ...prev,
      labs: newItems,
    }));
    handleBlur({ key: "labs", value: newItems });
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
        <Title order={5}>Lab Verification Summary</Title>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Lab Verified?"
          placeholder="Lab Verified?"
          required
          withAsterisk
          clearable
          searchable
          data={yesNAOptions}
          value={values?.labVerified || ""}
          onChange={(val) =>
            setValues((prev) => ({ ...prev, labVerified: val || "" }))
          }
          onBlur={() =>
            handleBlur({ key: "labVerified", value: values?.labVerified })
          }
        />
      </Grid.Col>

      {values?.labVerified === "Yes" && (
        <Fragment>
          {!!values?.labs &&
            values?.labs?.length > 0 &&
            values?.labs?.map((lab, index) => (
              <PrePostDynamicFormParts
                key={index}
                el={lab}
                index={index}
                listName="labs"
                onChange={(name, ind, val) => handleListChange(name, ind, val)}
                remove={(ind) => handleRemove(ind)}
                onBlur={() => {
                  handleBlur({
                    key: "labs",
                    value: values?.labs,
                  });
                }}
              />
            ))}
          <Grid.Col span={12}>
            <Button fullWidth onClick={handleAddMore} variant="outline">
              Add
              {!!values?.labs && values?.labs?.length > 0 ? " more " : " "}
              Lab
            </Button>
          </Grid.Col>
        </Fragment>
      )}

      <Grid.Col>
        <Textarea
          label="Final Observation"
          placeholder="Final Observation"
          resize="vertical"
          required
          withAsterisk
          value={values?.finalObservation || ""}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, finalObservation: e.target.value }))
          }
          onBlur={() =>
            handleBlur({
              key: "finalObservation",
              value: values?.finalObservation,
            })
          }
        />
      </Grid.Col>
    </Grid>
  );
};

export default AHCVerification;
