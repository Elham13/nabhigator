import React from "react";
import { Col, Divider, Form, Input, Row, Select, Typography } from "antd";
import { IPrePostVerification } from "@/lib/utils/types/rmDataTypes";
import {
  discrepancyStatusOptions,
  yesNAOptions,
} from "@/lib/utils/constants/options";

type PropTypes = {
  fieldName: "mainClaimIsVerified" | "insuredIsVerified";
  objectName: "mainClaimDetail" | "insuredVerificationDetail";
};

const MainClaimVerification = ({ objectName, fieldName }: PropTypes) => {
  return (
    <>
      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>
          {fieldName === "mainClaimIsVerified"
            ? "Main Claim Verification Summary"
            : "Insured Verification Summary"}
        </Typography.Title>
      </Divider>
      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IPrePostVerification>
            label={`${
              fieldName === "mainClaimIsVerified" ? "Main Claim" : "Insured"
            } Verified?`}
            name={fieldName}
            rules={[{ required: true, message: "Please select" }]}
          >
            <Select
              options={yesNAOptions}
              allowClear
              placeholder={`${
                fieldName === "mainClaimIsVerified" ? "Main Claim" : "Insured"
              } Verified?`}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) => prev[fieldName] !== curr[fieldName]}
      >
        {({ getFieldValue }) =>
          getFieldValue(fieldName) === "Yes" ? (
            <Row gutter={10}>
              <Col md={12} xs={24}>
                <Form.Item
                  label="Discrepancy Status"
                  name={[objectName, "discrepancyStatus"]}
                  rules={[{ required: true, message: "Please Select" }]}
                >
                  <Select
                    options={discrepancyStatusOptions}
                    allowClear
                    placeholder="Select Discrepancy Status"
                  />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  label="Observation"
                  name={[objectName, "observation"]}
                  rules={[{ required: true, message: "Please Fill" }]}
                >
                  <Input.TextArea placeholder="Observation" />
                </Form.Item>
              </Col>
            </Row>
          ) : null
        }
      </Form.Item>
    </>
  );
};

export default MainClaimVerification;
