import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { DateInput } from "@mantine/dates";
import { INPSVerification, IRMFindings } from "@/lib/utils/types/rmDataTypes";
import {
  CaseDetail,
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { useAxios } from "@/lib/hooks/useAxios";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { useLocalStorage } from "@mantine/hooks";
import { Grid, Select, TextInput } from "@mantine/core";
import { doneNotDoneOptions } from "@/lib/utils/constants/options";
import dayjs from "dayjs";

const taskName = "NPS Confirmation";

const initialFormValues: INPSVerification = {
  insuredVisit: "",
  insuredMobileNo: "",
  insuredVisitDate: null,
};

type PropTypes = {
  data: IDashboardData | null;
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const NPSConfirmation = ({
  data,
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] = useState<INPSVerification>(initialFormValues);

  const [systemFetch, setSystemFetch] = useState({ insuredMobileNo: "" });

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

  useEffect(() => {
    if (data?.insuredDetails?.contactNo) {
      setSystemFetch((prev) => ({
        ...prev,
        insuredMobileNo: data?.insuredDetails?.contactNo,
      }));
      setValues((prev) => ({
        ...prev,
        insuredMobileNo: data?.insuredDetails?.contactNo,
      }));
    }
  }, [data?.insuredDetails?.contactNo]);

  useEffect(() => {
    if (findings) {
      Object.entries(findings).map(([key, value]: any) => {
        setValues((prev) => ({
          ...prev,
          [key]: value,
        }));
      });
    }
  }, [findings]);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Insured Visit"
          placeholder="Insured Visit"
          required
          withAsterisk
          data={doneNotDoneOptions}
          value={values?.insuredVisit || ""}
          onChange={(val) =>
            setValues((prev) => ({ ...prev, insuredVisit: val || "" }))
          }
          onBlur={() =>
            handleBlur({
              key: "insuredVisit",
              value: values?.insuredVisit,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="System Fetch Insured Mobile No"
          placeholder="System Fetch Insured Mobile No"
          disabled
          value={systemFetch?.insuredMobileNo || ""}
        />
      </Grid.Col>
      {values?.insuredVisit === "Done" ? (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="User Feed Insured Mobile No"
              placeholder="User Feed Insured Mobile No"
              required
              withAsterisk
              value={values?.insuredMobileNo || ""}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  insuredMobileNo: e.target.value,
                }))
              }
              onBlur={(e) =>
                handleBlur({
                  key: "insuredMobileNo",
                  value: e.target.value,
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateInput
              label="Date of visit to hospital"
              placeholder="Date of visit to hospital"
              required
              withAsterisk
              clearable
              maxDate={new Date()}
              value={
                values?.insuredVisitDate
                  ? dayjs(values?.insuredVisitDate).toDate()
                  : null
              }
              onChange={(date) =>
                setValues((prev) => ({
                  ...prev,
                  insuredVisitDate: dayjs(date).toDate(),
                }))
              }
              onBlur={() =>
                handleBlur({
                  key: "insuredVisitDate",
                  value: values?.insuredVisitDate,
                })
              }
            />
          </Grid.Col>
        </Fragment>
      ) : null}
    </Grid>
  );
};

export default NPSConfirmation;
