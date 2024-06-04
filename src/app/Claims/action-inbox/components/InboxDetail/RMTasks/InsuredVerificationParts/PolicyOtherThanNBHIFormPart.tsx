import React, { Fragment } from "react";
import { Button, Col, Form, FormInstance, Input, Row } from "antd";
import UploadProof from "./UploadProof";
import { PlusOutlined } from "@ant-design/icons";
import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  claimId?: number;
  form: FormInstance<IInsuredVerification>;
};

const PolicyOtherThanNBHIFormPart = ({ claimId, form }: PropTypes) => {
  return (
    <Fragment>
      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Policy Number"
            name={["anyInsurancePolicyOtherThanNBHI", "policyNo"]}
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Policy Number" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Name of Insured Company"
            name={["anyInsurancePolicyOtherThanNBHI", "nameOfInsuranceCompany"]}
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Name of Insured Company" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col sm={24}>
          <Form.List name={["anyInsurancePolicyOtherThanNBHI", "documents"]}>
            {(fields, { add, remove }) => (
              <Fragment>
                {fields?.map((field, ind) => (
                  <UploadProof
                    key={ind}
                    name={field?.name}
                    claimId={claimId}
                    form={form}
                    fieldNames={[
                      "anyInsurancePolicyOtherThanNBHI",
                      "documents",
                    ]}
                    remove={remove}
                    label="Document"
                  />
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Upload File
                  </Button>
                </Form.Item>
              </Fragment>
            )}
          </Form.List>
        </Col>
      </Row>
    </Fragment>
  );
};

export default PolicyOtherThanNBHIFormPart;
