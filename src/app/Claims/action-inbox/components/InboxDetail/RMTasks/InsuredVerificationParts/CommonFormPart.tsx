import React, { Fragment } from "react";
import { Button, Col, Form, FormInstance, Input, Row } from "antd";
import UploadProof from "./UploadProof";
import { PlusOutlined } from "@ant-design/icons";
import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";

type CommonFormPartPropTypes = {
  title: "Non Contactable" | "Non Co-operation";
  claimId?: number;
  form: FormInstance<IInsuredVerification>;
};

const CommonFormPart = ({ title, claimId, form }: CommonFormPartPropTypes) => {
  return (
    <Fragment>
      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item<IInsuredVerification>
            label={`Remarks of ${title}`}
            name={["reasonOfInsuredNotVisit", "reason"]}
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder={`Remarks of ${title}`} />
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
                    Add Proof of {title}
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

export default CommonFormPart;
