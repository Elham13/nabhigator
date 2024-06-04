import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Col, Form, Input, Row, Select } from "antd";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import { IVicinityVerification } from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import { doneNotDoneOptions } from "@/lib/utils/constants/options";

const taskName = "Vicinity Verification";

const initialFormValues: IVicinityVerification = {
  status: "",
  verificationSummary: "",
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const VicinityVerification = ({ caseDetail, setCaseDetail }: PropTypes) => {
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
    if (caseDetail?.rmFindings?.[taskName]) {
      const obj = caseDetail?.rmFindings?.[taskName];
      Object.entries(obj).map(([key, value]: any) => {
        form.setFieldValue(key, value);
      });
    }
  }, [caseDetail?.rmFindings, form]);

  return (
    <FormContainer<IVicinityVerification>
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
          <Form.Item<IVicinityVerification>
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              options={[...doneNotDoneOptions, { value: "NA", label: "NA" }]}
              placeholder="Status"
            />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item<IVicinityVerification>
            name="verificationSummary"
            label="Verification Summary"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Input.TextArea placeholder="Verification Summary" />
          </Form.Item>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default VicinityVerification;
