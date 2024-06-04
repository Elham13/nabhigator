import React from "react";
import { Col, Divider, Form, Input, Row, Select, Typography } from "antd";
import { IPrePostVerification } from "@/lib/utils/types/rmDataTypes";
import {
  consultationIsRelatedToDiagnosisOptions,
  consultationOrFollowupOptions,
  yesNAOptions,
} from "@/lib/utils/constants/options";

const ConsultationPapersDynamicFormPart = () => {
  return (
    <>
      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>
          Consultation Paper and Doctor Verification Summary
        </Typography.Title>
      </Divider>

      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IPrePostVerification>
            label="Consultation Papers and Doctor Verified?"
            name="consultationPaperAndDoctorVerified"
            rules={[{ required: true, message: "Please select" }]}
          >
            <Select
              options={yesNAOptions}
              allowClear
              placeholder="Consultation Papers and Doctor Verified?"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues?.consultationPaperAndDoctorVerified !==
          currentValues?.consultationPaperAndDoctorVerified
        }
      >
        {({ getFieldValue }) =>
          getFieldValue("consultationPaperAndDoctorVerified") === "Yes" ? (
            <>
              <Row gutter={10}>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Doctor Name"
                    name={["consultationPaperAndDoctorDetail", "doctorName"]}
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <Input placeholder="Doctor Name" />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Consultation/Followup confirmation"
                    name={[
                      "consultationPaperAndDoctorDetail",
                      "consultationOrFollowUpConfirmation",
                    ]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Consultation/Followup confirmation"
                      allowClear
                      options={consultationOrFollowupOptions}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col xs={24}>
                  <Form.Item
                    label="Whether Consultations/ Follow-up is related to Diagnosis/Procedure for which hospitalization was necessitated"
                    name={[
                      "consultationPaperAndDoctorDetail",
                      "consultationIsRelatedToDiagnosis",
                    ]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Whether Consultations/ Follow-up is related to Diagnosis/Procedure for which hospitalization was necessitated"
                      allowClear
                      options={consultationIsRelatedToDiagnosisOptions}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Observation"
                    name={["consultationPaperAndDoctorDetail", "observation"]}
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <Input.TextArea placeholder="Observation" />
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : null
        }
      </Form.Item>
    </>
  );
};

export default ConsultationPapersDynamicFormPart;
