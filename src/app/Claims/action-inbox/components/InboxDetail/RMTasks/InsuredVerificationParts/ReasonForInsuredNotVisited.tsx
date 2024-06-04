import React, { Fragment } from "react";
import { Button, Col, Form, FormInstance, Row, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import UploadProof from "./UploadProof";
import CommonFormPart from "./CommonFormPart";
import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";
import { untraceableBasisOptions } from "@/lib/utils/constants/options";

type PropTypes = {
  claimId?: number;
  form: FormInstance<IInsuredVerification>;
};

const ReasonForInsuredNotVisited = ({ claimId, form }: PropTypes) => {
  return (
    <Form.Item<IInsuredVerification>
      noStyle
      shouldUpdate={(prev, curr) =>
        prev?.reasonOfInsuredNotVisit?.value !==
        curr?.reasonOfInsuredNotVisit?.value
      }
    >
      {({ getFieldValue }) =>
        getFieldValue(["reasonOfInsuredNotVisit", "value"]) ===
        "Non Contactable" ? (
          <CommonFormPart
            title="Non Contactable"
            claimId={claimId}
            form={form}
          />
        ) : getFieldValue(["reasonOfInsuredNotVisit", "value"]) ===
          "Non Co-operation" ? (
          <CommonFormPart
            title="Non Co-operation"
            claimId={claimId}
            form={form}
          />
        ) : getFieldValue(["reasonOfInsuredNotVisit", "value"]) ===
          "Untraceable" ? (
          <Fragment>
            <Row gutter={10}>
              <Col sm={24}>
                <Form.Item<IInsuredVerification>
                  label="Specify Untraceable"
                  name={["reasonOfInsuredNotVisit", "untraceableBasis"]}
                  rules={[{ required: true, message: "Please Select" }]}
                >
                  <Select
                    placeholder="Specify Untraceable"
                    options={untraceableBasisOptions}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col sm={24}>
                <Form.List name={["reasonOfInsuredNotVisit", "proof"]}>
                  {(fields, { add, remove }) => (
                    <Fragment>
                      {fields?.map((field, ind) => (
                        <UploadProof
                          key={ind}
                          name={field?.name}
                          claimId={claimId}
                          form={form}
                          remove={remove}
                          fieldNames={["reasonOfInsuredNotVisit", "proof"]}
                          label="Proof"
                        />
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Proof of Untraceable
                        </Button>
                      </Form.Item>
                    </Fragment>
                  )}
                </Form.List>
              </Col>
            </Row>
          </Fragment>
        ) : null
      }
    </Form.Item>
  );
};

export default ReasonForInsuredNotVisited;
