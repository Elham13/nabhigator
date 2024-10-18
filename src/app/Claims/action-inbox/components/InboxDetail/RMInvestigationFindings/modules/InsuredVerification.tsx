import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import dayjs from "dayjs";
import { Grid, Select, Text } from "@mantine/core";
import CommonFormPart from "./InsuredVerificationParts/CommonFormPart";
import dynamic from "next/dynamic";
import { BiCog } from "react-icons/bi";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import {
  CaseDetail,
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import {
  IInsuredVerification,
  IReasonOfInsuredNotVisit,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";
import {
  doneNotDoneOptions,
  reasonOfInsuredNotVisitOptions,
  untraceableBasisOptions,
} from "@/lib/utils/constants/options";
import FileUploadFooter from "@/components/ClaimsComponents/FileUpload/FileUploadFooter";
import FileUpload from "@/components/ClaimsComponents/FileUpload";

const InsuredVisitDoneForm = dynamic(
  () => import("./InsuredVerificationParts/InsuredVisitDoneForm"),
  { ssr: false, loading: () => <BiCog className="animate-spin" /> }
);

const tempDoc = {
  _id: "",
  docUrl: [],
  name: "",
  location: null,
  hiddenDocUrls: [],
  replacedDocUrls: [],
};

const taskName = "Insured Verification";

const initialFormValues: IInsuredVerification = {
  insuredVisit: "",
  verificationSummary: "",
};

type PropTypes = {
  data: IDashboardData | null;
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const InsuredVerification = ({
  data,
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const isFirstRender = useRef<boolean>(true);
  const [values, setValues] = useState<IInsuredVerification>(initialFormValues);

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
    key: keyof IInsuredVerification;
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

  const handleInsuredNotVisitChange = (
    name: string,
    value: string | string[]
  ) => {
    const reasonOfInsuredNotVisit: IReasonOfInsuredNotVisit =
      values?.reasonOfInsuredNotVisit || { value: "", proof: [], reason: "" };
    setValues((prev) => ({
      ...prev,
      reasonOfInsuredNotVisit: {
        ...reasonOfInsuredNotVisit,
        [name]: value,
      },
    }));
  };

  const handleRemove = (index: number) => {
    const docArr =
      values?.reasonOfInsuredNotVisit?.proof &&
      values?.reasonOfInsuredNotVisit?.proof?.length > 0
        ? values?.reasonOfInsuredNotVisit?.proof?.filter((_, i) => i !== index)
        : [];
    handleInsuredNotVisitChange("proof", docArr);
    handleBlur({
      key: "reasonOfInsuredNotVisit",
      value: { ...values?.reasonOfInsuredNotVisit, proof: docArr },
    });
  };

  const handleGetUrl = (
    id: string,
    name: string,
    url: string,
    action: "Add" | "Remove"
  ) => {
    const docArr = values?.reasonOfInsuredNotVisit?.proof || [];
    docArr.push(url);
    handleInsuredNotVisitChange("proof", docArr);
    handleBlur({
      key: "reasonOfInsuredNotVisit",
      value: { ...values?.reasonOfInsuredNotVisit, proof: docArr },
    });
  };

  useEffect(() => {
    if (isFirstRender?.current && !!findings && !!findings[taskName]) {
      const tempValues: any = {};
      if (
        data?.insuredDetails?.insuredName &&
        !findings[taskName]?.nameOfPatientSystem
      ) {
        const name = data?.insuredDetails?.insuredName;
        tempValues.nameOfPatientSystem = name;
        tempValues.nameOfPatientUser = name;
      }
      if (
        data?.insuredDetails?.age &&
        !findings[taskName]?.ageOfPatientSystem
      ) {
        const age = data?.insuredDetails?.age;
        tempValues.ageOfPatientSystem = age;
        tempValues.ageOfPatientUser = age;
      }
      if (
        data?.insuredDetails?.gender &&
        !findings[taskName]?.genderOfPatientSystem
      ) {
        const gender = data?.insuredDetails?.gender;
        tempValues.genderOfPatientSystem = gender;
        tempValues.genderOfPatientUser = gender;
      }
      if (
        data?.hospitalDetails?.providerName &&
        !findings[taskName]?.nameOfHospitalSystem
      ) {
        const name = data?.hospitalDetails?.providerName;
        tempValues.nameOfHospitalSystem = name;
        tempValues.nameOfHospitalUser = name;
      }
      if (
        data?.hospitalizationDetails?.dateOfAdmission &&
        !findings[taskName]?.dateOfAdmissionSystem
      ) {
        const date = dayjs(
          data?.hospitalizationDetails?.dateOfAdmission
        ).toDate();
        tempValues.dateOfAdmissionSystem = date;
        tempValues.dateOfAdmissionUser = date;
      }
      if (
        data?.hospitalizationDetails?.dateOfDischarge &&
        !findings[taskName]?.dateOfDischargeSystem
      ) {
        const date = dayjs(
          data?.hospitalizationDetails?.dateOfDischarge
        ).toDate();
        tempValues.dateOfDischargeSystem = date;
        tempValues.dateOfDischargeUser = date;
      }

      setValues(tempValues);
      handleBlur({ key: "_id", value: tempValues, isBulk: true });
      isFirstRender.current = false;
    }
  }, [data, values, findings]);

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
          label="Insured Visit"
          placeholder="Insured Visit"
          required
          withAsterisk
          clearable
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
      {values?.insuredVisit === "Done" ? (
        <InsuredVisitDoneForm
          setValues={setValues}
          values={values}
          handleBlur={handleBlur}
          claimId={data?.claimId || 0}
        />
      ) : values?.insuredVisit === "Not Done" ? (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Why Insured not visited?"
              placeholder="Why Insured not visited?"
              required
              withAsterisk
              clearable
              data={reasonOfInsuredNotVisitOptions}
              value={values?.reasonOfInsuredNotVisit?.value || ""}
              onChange={(val) =>
                handleInsuredNotVisitChange("value", val || "")
              }
              onBlur={() =>
                handleBlur({
                  key: "reasonOfInsuredNotVisit",
                  value: values?.reasonOfInsuredNotVisit,
                })
              }
            />
          </Grid.Col>
          {values?.reasonOfInsuredNotVisit?.value === "Non Contactable" ? (
            <CommonFormPart
              claimId={data?.claimId || 0}
              title="Non Contactable"
              values={values}
              onChange={handleInsuredNotVisitChange}
              handleBlur={(name, value) => {
                handleBlur({
                  key: "reasonOfInsuredNotVisit",
                  value: { ...values?.reasonOfInsuredNotVisit, [name]: value },
                });
              }}
            />
          ) : values?.reasonOfInsuredNotVisit?.value === "Non Co-operation" ? (
            <CommonFormPart
              claimId={data?.claimId || 0}
              title="Non Co-operation"
              values={values}
              onChange={handleInsuredNotVisitChange}
              handleBlur={(name, value) => {
                handleBlur({
                  key: "reasonOfInsuredNotVisit",
                  value: { ...values?.reasonOfInsuredNotVisit, [name]: value },
                });
              }}
            />
          ) : values?.reasonOfInsuredNotVisit?.value === "Untraceable" ? (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Specify Untraceable"
                  placeholder="Specify Untraceable"
                  required
                  withAsterisk
                  clearable
                  data={untraceableBasisOptions}
                  value={
                    values?.reasonOfInsuredNotVisit?.untraceableBasis || ""
                  }
                  onChange={(val) =>
                    handleInsuredNotVisitChange("untraceableBasis", val || "")
                  }
                  onBlur={() =>
                    handleBlur({
                      key: "reasonOfInsuredNotVisit",
                      value: values?.reasonOfInsuredNotVisit,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text className="font-semibold">Proof: </Text>
                {!!values?.reasonOfInsuredNotVisit?.proof &&
                  values?.reasonOfInsuredNotVisit?.proof?.length > 0 &&
                  values?.reasonOfInsuredNotVisit?.proof?.map((el, ind) => (
                    <FileUploadFooter
                      key={ind}
                      url={el}
                      onDelete={() => handleRemove(ind)}
                    />
                  ))}
                <FileUpload
                  doc={tempDoc}
                  docName="doc"
                  getUrl={handleGetUrl}
                  claimId={data?.claimId || 0}
                />
              </Grid.Col>
            </Fragment>
          ) : null}
        </Fragment>
      ) : null}
    </Grid>
  );
};

export default InsuredVerification;
