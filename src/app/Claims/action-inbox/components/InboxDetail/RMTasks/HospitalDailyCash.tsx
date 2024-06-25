import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Col, Form, Input, Row } from "antd";
import InsuredVisitSummary from "./FormParts/HospitalDailyCaseFormParts/InsuredVisitSummary";
import dayjs from "dayjs";
import HospitalVisitSummary from "./FormParts/HospitalDailyCaseFormParts/HospitalVisitSummary";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import { IHospitalDailyCashPart } from "@/lib/utils/types/rmDataTypes";
import {
  CaseDetail,
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";

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
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const HospitalDailyCash = ({ data, caseDetail, setCaseDetail }: PropTypes) => {
  const [form] = Form.useForm<IHospitalDailyCashPart>();

  const { refetch: submit, loading } = useAxios<SingleResponseType<CaseDetail>>(
    {
      config: {
        url: EndPoints.CAPTURE_RM_INVESTIGATION_FINDINGS,
        method: "POST",
      },
      dependencyArr: [],
      isMutation: true,
      onDone: (res) => {
        toast.success(res.message);
        setCaseDetail(res?.data);
      },
    }
  );

  useEffect(() => {
    const findings = caseDetail?.rmFindingsPostQA?.[taskName];
    if (
      !findings?.insuredCooperationDetail?.nameOfInsuredSystem &&
      data?.insuredDetails?.insuredName
    ) {
      form?.setFieldValue(
        ["insuredCooperationDetail", "nameOfInsuredSystem"],
        data?.insuredDetails?.insuredName
      );
      form?.setFieldValue(
        ["insuredCooperationDetail", "nameOfInsuredUser"],
        data?.insuredDetails?.insuredName
      );
    }

    if (
      (!findings?.insuredCooperationDetail?.dateOfAdmissionSystem ||
        !findings?.hospitalCooperationDetail?.dateOfAdmissionSystem) &&
      data?.hospitalizationDetails?.dateOfAdmission
    ) {
      form?.setFieldValue(
        ["insuredCooperationDetail", "dateOfAdmissionSystem"],
        dayjs(data?.hospitalizationDetails?.dateOfAdmission)
      );
      form?.setFieldValue(
        ["insuredCooperationDetail", "dateOfAdmissionUser"],
        dayjs(data?.hospitalizationDetails?.dateOfAdmission)
      );
      form?.setFieldValue(
        ["hospitalCooperationDetail", "dateOfAdmissionSystem"],
        dayjs(data?.hospitalizationDetails?.dateOfAdmission)
      );
      form?.setFieldValue(
        ["hospitalCooperationDetail", "dateOfAdmissionUser"],
        dayjs(data?.hospitalizationDetails?.dateOfAdmission)
      );
    }

    if (
      (!findings?.insuredCooperationDetail?.timeOfDischargeSystem ||
        !findings?.hospitalCooperationDetail?.timeOfDischargeSystem) &&
      data?.hospitalizationDetails?.dateOfDischarge
    ) {
      form?.setFieldValue(
        ["insuredCooperationDetail", "timeOfDischargeSystem"],
        dayjs(data?.hospitalizationDetails?.dateOfDischarge)
      );
      form?.setFieldValue(
        ["insuredCooperationDetail", "timeOfDischargeUser"],
        dayjs(data?.hospitalizationDetails?.dateOfDischarge)
      );
      form?.setFieldValue(
        ["hospitalCooperationDetail", "timeOfDischargeSystem"],
        dayjs(data?.hospitalizationDetails?.dateOfDischarge)
      );
      form?.setFieldValue(
        ["hospitalCooperationDetail", "timeOfDischargeUser"],
        dayjs(data?.hospitalizationDetails?.dateOfDischarge)
      );
    }
  }, [
    data?.insuredDetails,
    data?.hospitalizationDetails,
    caseDetail?.rmFindingsPostQA,
    form,
  ]);

  useEffect(() => {
    if (caseDetail?.rmFindingsPostQA?.[taskName]) {
      const obj = caseDetail?.rmFindingsPostQA?.[taskName];
      Object.entries(obj).map(([key, value]: any) => {
        if (typeof value === "object") {
          Object.entries(value).map(([innerKey, innerValue]: any) => {
            if (dayjs(innerValue).isValid()) {
              form.setFieldValue([key, innerKey], dayjs(innerValue));
            } else {
              form.setFieldValue([key, innerKey], innerValue);
            }
          });
        } else {
          form.setFieldValue(key, value);
        }
      });
    }
  }, [caseDetail?.rmFindingsPostQA, form]);

  return (
    <FormContainer<IHospitalDailyCashPart>
      form={form}
      handleSave={(payload) =>
        submit({ payload, id: caseDetail?._id, name: taskName })
      }
      submitting={loading}
      values={initialFormValues}
      formName={taskName}
    >
      <InsuredVisitSummary form={form} />

      <HospitalVisitSummary form={form} />

      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IHospitalDailyCashPart>
            label="Final Observation"
            name="finalObservation"
            rules={[{ required: true, message: "Please select" }]}
          >
            <Input.TextArea placeholder="Final Observation" />
          </Form.Item>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default HospitalDailyCash;
