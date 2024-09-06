import React, { Dispatch, SetStateAction, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
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
import PrePostDynamicFormParts from "./FormParts/PrePostDynamicFormParts";
import PrePostOtherBillsDynamicFormParts from "./FormParts/PrePostOtherBillsDynamicFormParts";
import ConsultationPapersDynamicFormPart from "./FormParts/ConsultationPapersDynamicFormPart";
import MainClaimVerification from "./FormParts/MainClaimVerification";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import { IPrePostVerification } from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import { yesNAOptions } from "@/lib/utils/constants/options";

const taskName = "Pre-Post Verification";

const initialFormValues: IPrePostVerification = {
  pharmacyBillVerified: "",
  consultationPaperAndDoctorVerified: "",
  labVerified: "",
  pharmacies: [],
  labs: [],
  mainClaimIsVerified: "",
  otherBillVerified: "",
  consultationPaperAndDoctorDetail: {
    consultationIsRelatedToDiagnosis: "",
    consultationOrFollowUpConfirmation: "",
    doctorName: "",
    observation: "",
  },
  mainClaimDetail: {
    discrepancyStatus: "",
    observation: "",
  },
  insuredIsVerified: "",
  insuredVerificationDetail: {
    discrepancyStatus: "",
    observation: "",
  },
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const PrePostVerification = ({ caseDetail, setCaseDetail }: PropTypes) => {
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
    if (caseDetail?.rmFindingsPostQA?.[taskName]) {
      const obj = caseDetail?.rmFindingsPostQA?.[taskName];
      Object.entries(obj).map(([key, value]: any) => {
        form.setFieldValue(key, value);
      });
    }
  }, [caseDetail?.rmFindingsPostQA, form]);

  return (
    <FormContainer<IPrePostVerification>
      form={form}
      handleSave={(payload) =>
        submit({ payload, id: caseDetail?._id, name: taskName })
      }
      submitting={loading}
      values={initialFormValues}
      formName={taskName}
    >
      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>
          Pharmacy Bill Verification Summary
        </Typography.Title>
      </Divider>
      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IPrePostVerification>
            label="Pharmacy Bill Verified?"
            name="pharmacyBillVerified"
            rules={[{ required: true, message: "Please select" }]}
          >
            <Select
              options={yesNAOptions}
              allowClear
              placeholder="Pharmacy Bill Verified?"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues?.pharmacyBillVerified !==
          currentValues?.pharmacyBillVerified
        }
      >
        {({ getFieldValue }) =>
          getFieldValue("pharmacyBillVerified") === "Yes" ? (
            <Form.List name="pharmacies">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <PrePostDynamicFormParts
                      key={key}
                      name={name}
                      restField={restField}
                      listName="pharmacies"
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
                      Add Pharmacy
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          ) : null
        }
      </Form.Item>

      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>Lab Verification Summary</Typography.Title>
      </Divider>
      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IPrePostVerification>
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

      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>
          Other bill Verification Summary
        </Typography.Title>
      </Divider>
      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IPrePostVerification>
            label="Other bills Verified?"
            name="otherBillVerified"
            rules={[{ required: true, message: "Please select" }]}
          >
            <Select
              options={yesNAOptions}
              allowClear
              placeholder="Other bills Verified?"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues?.otherBillVerified !== currentValues?.otherBillVerified
        }
      >
        {({ getFieldValue }) =>
          getFieldValue("otherBillVerified") === "Yes" ? (
            <Form.List name="otherBills">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <PrePostOtherBillsDynamicFormParts
                      key={key}
                      name={name}
                      restField={restField}
                      listName="otherBills"
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

      <ConsultationPapersDynamicFormPart />

      <MainClaimVerification
        fieldName="mainClaimIsVerified"
        objectName="mainClaimDetail"
      />

      <MainClaimVerification
        fieldName="insuredIsVerified"
        objectName="insuredVerificationDetail"
      />

      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IPrePostVerification>
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

export default PrePostVerification;
