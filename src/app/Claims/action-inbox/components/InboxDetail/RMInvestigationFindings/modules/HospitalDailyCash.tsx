import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import InsuredVisitSummary from "./FormParts/HospitalDailyCaseFormParts/InsuredVisitSummary";
import HospitalVisitSummary from "./FormParts/HospitalDailyCaseFormParts/HospitalVisitSummary";
import { Grid, Textarea } from "@mantine/core";
import {
  IHospitalDailyCashPart,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";
import {
  CaseDetail,
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { useLocalStorage } from "@mantine/hooks";

const taskName = "Hospital Daily Cash Part";

const initialFormValues: IHospitalDailyCashPart = {
  insuredVisit: "",
  insuredCooperation: "",
  insuredNotCooperatingReason: "",
  insuredCooperationDetail: {
    dateOfVisitToInsured: null,
    timeOfVisitToInsured: null,
    nameOfInsuredSystem: "",
    nameOfInsuredUser: "",
    dateOfAdmissionSystem: "",
    dateOfAdmissionUser: "",
    timeOfDischargeSystem: "",
    timeOfDischargeUser: "",
    durationOfHospitalizationSystem: "",
    durationOfHospitalizationUser: "",
    diagnosis: "",
    classOfAccommodation: "",
    discrepanciesObserved: "",
  },
  hospitalVisit: "",
  hospitalCooperation: "",
  hospitalNotCooperatingReason: "",
  hospitalCooperationDetail: {
    dateOfVisitToHospital: null,
    timeOfVisitToHospital: null,
    dateOfAdmissionSystem: null,
    dateOfAdmissionUser: null,
    timeOfDischargeSystem: null,
    timeOfDischargeUser: null,
    durationOfHospitalizationSystem: "",
    durationOfHospitalizationUser: "",
    diagnosis: "",
    classOfAccommodation: "",
    discrepanciesObserved: "",
  },
  finalObservation: "",
};

type PropTypes = {
  data: IDashboardData | null;
  caseId?: string;
  findings: IRMFindings | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const HospitalDailyCash = ({
  data,
  findings,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const isFirstRender = useRef<boolean>(true);
  const [values, setValues] =
    useState<IHospitalDailyCashPart>(initialFormValues);

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
    key: keyof IHospitalDailyCashPart;
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
    if (isFirstRender?.current) {
      const tempValues: any = {};

      const updateCooperationDetail = (
        detailType: string,
        field: string,
        value: any
      ) => {
        if (!value) return;

        tempValues[detailType] = {
          ...(tempValues[detailType] || {}),
          [`${field}System`]: value,
          [`${field}User`]: value,
        };
      };

      if (!!findings && !!findings[taskName]) {
        if (
          !findings[taskName]?.insuredCooperationDetail?.nameOfInsuredSystem &&
          data?.insuredDetails?.insuredName
        ) {
          updateCooperationDetail(
            "insuredCooperationDetail",
            "nameOfInsured",
            data.insuredDetails.insuredName
          );
        }
        const admissionDate = data?.hospitalizationDetails?.dateOfAdmission;
        const dischargeDate = data?.hospitalizationDetails?.dateOfDischarge;

        if (
          (!findings[taskName]?.insuredCooperationDetail
            ?.dateOfAdmissionSystem ||
            !findings[taskName]?.hospitalCooperationDetail
              ?.dateOfAdmissionSystem) &&
          admissionDate
        ) {
          updateCooperationDetail(
            "insuredCooperationDetail",
            "dateOfAdmission",
            admissionDate
          );
          updateCooperationDetail(
            "hospitalCooperationDetail",
            "dateOfAdmission",
            admissionDate
          );
        }

        if (
          (!findings[taskName]?.insuredCooperationDetail
            ?.timeOfDischargeSystem ||
            !findings[taskName]?.hospitalCooperationDetail
              ?.timeOfDischargeSystem) &&
          dischargeDate
        ) {
          updateCooperationDetail(
            "insuredCooperationDetail",
            "timeOfDischarge",
            dischargeDate
          );
          updateCooperationDetail(
            "hospitalCooperationDetail",
            "timeOfDischarge",
            dischargeDate
          );
        }

        setValues((prev) => ({ ...prev, ...tempValues }));

        handleBlur({ key: "_id", value: tempValues, isBulk: true });

        isFirstRender.current = false;
      }
    }
  }, [data?.insuredDetails, data?.hospitalizationDetails, findings]);

  useEffect(() => {
    if (!!findings && !!findings[taskName]) {
      Object.entries(findings[taskName]).map(([key, value]) => {
        if (!!value) setValues((prev) => ({ ...prev, [key]: value }));
      });
    }
  }, [findings]);

  return (
    <Grid>
      <InsuredVisitSummary
        values={values}
        setValues={setValues}
        onBlur={handleBlur}
      />

      <HospitalVisitSummary
        values={values}
        setValues={setValues}
        onBlur={handleBlur}
      />

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Textarea
          label="Final Observation"
          placeholder="Final Observation"
          required
          withAsterisk
          resize="vertical"
          value={values?.finalObservation || ""}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              finalObservation: e.target?.value,
            }))
          }
          onBlur={(e) =>
            handleBlur({
              key: "finalObservation",
              value: e?.target?.value,
            })
          }
        />
      </Grid.Col>
    </Grid>
  );
};

export default HospitalDailyCash;
