import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Col, Form, Input, Row } from "antd";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import { IClaimVerification } from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";

const taskName = "Claim Verification";

const initialFormValues: IClaimVerification = {
  finalObservation: "",
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const ClaimVerification = ({ caseDetail, setCaseDetail }: PropTypes) => {
  const [form] = Form.useForm<IClaimVerification>();

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
    if (caseDetail?.rmFindingsPostQA?.[taskName]?.finalObservation) {
      form.setFieldValue(
        "finalObservation",
        caseDetail?.rmFindingsPostQA?.[taskName]?.finalObservation
      );
    }
  }, [caseDetail?.rmFindingsPostQA, form]);

  return (
    <FormContainer<IClaimVerification>
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
          <Form.Item<IClaimVerification>
            label="Final Observation"
            name="finalObservation"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input.TextArea placeholder="Final Observation" />
          </Form.Item>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default ClaimVerification;
