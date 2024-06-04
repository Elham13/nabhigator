import React, { Dispatch, SetStateAction, useEffect } from "react";
import FormContainer from "./CommonForm/FormContainer";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import { toast } from "react-toastify";
import PrePostDynamicFormParts from "./FormParts/PrePostDynamicFormParts";
import { PlusOutlined } from "@ant-design/icons";
import { IAHCVerificationPart } from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import { yesNAOptions } from "@/lib/utils/constants/options";

const taskName = "AHC Verification Part";

const initialFormValues: IAHCVerificationPart = {
  labVerified: "",
  labs: [],
  finalObservation: "",
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const AHCVerification = ({ caseDetail, setCaseDetail }: PropTypes) => {
  const [form] = Form.useForm<IAHCVerificationPart>();

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
    <FormContainer<IAHCVerificationPart>
      form={form}
      handleSave={(payload) =>
        submit({ payload, id: caseDetail?._id, name: taskName })
      }
      submitting={loading}
      values={initialFormValues}
      formName={taskName}
    >
      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>Lab Verification Summary</Typography.Title>
      </Divider>

      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IAHCVerificationPart>
            label="Lab Verified?"
            name="labVerified"
            rules={[{ required: true, message: "Please select" }]}
          >
            <Select
              options={yesNAOptions}
              allowClear
              placeholder="Lab Verified?"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues?.labVerified !== currentValues?.labVerified
        }
      >
        {({ getFieldValue }) =>
          getFieldValue("labVerified") === "Yes" ? (
            <Form.List name="labs">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <PrePostDynamicFormParts
                      key={key}
                      name={name}
                      restField={restField}
                      listName="labs"
                      remove={remove}
                    />
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add field
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          ) : null
        }
      </Form.Item>

      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IAHCVerificationPart>
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

export default AHCVerification;
