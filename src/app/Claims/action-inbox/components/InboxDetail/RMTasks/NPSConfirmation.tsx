import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import { INPSVerification } from "@/lib/utils/types/rmDataTypes";
import {
  CaseDetail,
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import { doneNotDoneOptions } from "@/lib/utils/constants/options";
import { disableFuture } from "@/lib/helpers";

const taskName = "NPS Confirmation";

const initialFormValues: INPSVerification = {
  insuredVisit: "",
  insuredMobileNo: "",
  insuredVisitDate: null,
};

type PropTypes = {
  data: IDashboardData | null;
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const NPSConfirmation = ({ data, caseDetail, setCaseDetail }: PropTypes) => {
  const [systemFetch, setSystemFetch] = useState({ insuredMobileNo: "" });
  const [form] = Form.useForm();

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
    if (data?.insuredDetails?.contactNo) {
      setSystemFetch((prev) => ({
        ...prev,
        insuredMobileNo: data?.insuredDetails?.contactNo,
      }));
      form.setFieldValue("insuredMobileNo", data?.insuredDetails?.contactNo);
    }
  }, [data?.insuredDetails?.contactNo, form]);

  useEffect(() => {
    if (caseDetail?.rmFindingsPostQA?.[taskName]) {
      const obj = caseDetail?.rmFindingsPostQA?.[taskName];
      Object.entries(obj).map(([key, value]: any) => {
        if (key === "insuredVisitDate")
          form.setFieldValue("insuredVisitDate", dayjs(value));
        else form.setFieldValue(key, value);
      });
    }
  }, [caseDetail?.rmFindingsPostQA, form]);

  return (
    <FormContainer<INPSVerification>
      form={form}
      handleSave={(payload) =>
        submit({ payload, id: caseDetail?._id, name: taskName })
      }
      submitting={loading}
      values={initialFormValues}
      formName={taskName}
    >
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<INPSVerification>
            label="Insured Visit"
            name="insuredVisit"
            rules={[{ required: true, message: "Please select" }]}
          >
            <Select options={doneNotDoneOptions} allowClear />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <label className="mb-2 block">System Fetch Insured Mobile No</label>
          <Input disabled value={systemFetch?.insuredMobileNo} />
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item
            label="User Feed Insured Mobile No"
            name="insuredMobileNo"
            rules={[
              { required: true, message: "Please Fill" },
              { len: 10, message: "Must be 10 digits" },
              { pattern: /\d/, message: "Only number are allowed" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item label="Insured Visit Date" name="insuredVisitDate">
            <DatePicker disabledDate={disableFuture} className="w-full" />
          </Form.Item>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default NPSConfirmation;
