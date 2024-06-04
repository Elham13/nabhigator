import React, { Dispatch, SetStateAction, useEffect } from "react";
import FormContainer from "./CommonForm/FormContainer";
import { Col, Form, Input, Row } from "antd";
import { toast } from "react-toastify";
import { IRandomVicinityVerification } from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";

const taskName = "Random Vicinity Hospital/Lab/Doctor/Chemist Verification";

const initialFormValues: IRandomVicinityVerification = {
  verificationSummary: "",
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const RandomVicinityVerification = ({
  caseDetail,
  setCaseDetail,
}: PropTypes) => {
  const [form] = Form.useForm<IRandomVicinityVerification>();

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
    if (caseDetail?.rmFindings?.[taskName]?.verificationSummary) {
      form.setFieldValue(
        "verificationSummary",
        caseDetail?.rmFindings?.[taskName]?.verificationSummary
      );
    }
  }, [caseDetail?.rmFindings, form]);

  return (
    <FormContainer<IRandomVicinityVerification>
      form={form}
      handleSave={(payload) =>
        submit({ payload, id: caseDetail?._id, name: taskName })
      }
      submitting={loading}
      values={initialFormValues}
      formName={taskName}
    >
      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IRandomVicinityVerification>
            label="Verification Summary"
            name="verificationSummary"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input.TextArea placeholder="Verification Summary" />
          </Form.Item>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RandomVicinityVerification;
