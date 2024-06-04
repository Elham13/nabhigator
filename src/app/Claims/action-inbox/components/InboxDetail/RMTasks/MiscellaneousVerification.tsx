import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Col, Form, Input, Row } from "antd";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import { IMiscellaneousVerification } from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";

const taskName = "Miscellaneous Verification";

const initialFormValues: IMiscellaneousVerification = {
  anyMarketOrIndustryFeedback: "",
  verificationSummary: "",
};
type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const MiscellaneousVerification = ({
  caseDetail,
  setCaseDetail,
}: PropTypes) => {
  const [form] = Form.useForm<IMiscellaneousVerification>();

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
      Object.entries(obj).map(([key, value]) => {
        form.setFieldValue(key, value);
      });
    }
  }, [caseDetail?.rmFindings, form]);

  return (
    <FormContainer<IMiscellaneousVerification>
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
          <Form.Item<IMiscellaneousVerification>
            label="Any Market Or Industry Feedback"
            name="anyMarketOrIndustryFeedback"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input.TextArea placeholder="Any Market Or Industry Feedback" />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item<IMiscellaneousVerification>
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

export default MiscellaneousVerification;
