import React, { Fragment } from "react";
import { Col, Form, FormInstance, Row, Select } from "antd";
import ReasonForInsuredNotVisited from "./ReasonForInsuredNotVisited";
import InsuredDetailsForm from "./InsuredDetailsForm";
import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";
import {
  doneNotDoneOptions,
  reasonOfInsuredNotVisitOptions,
} from "@/lib/utils/constants/options";

type PropTypes = {
  claimId?: number;
  form: FormInstance<IInsuredVerification>;
};

const InsuredVerificationParts = ({ claimId, form }: PropTypes) => {
  return (
    <Fragment>
      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item<IInsuredVerification>
            label="Insured Visit"
            name="insuredVisit"
            rules={[{ required: true, message: "Please select" }]}
          >
            <Select
              options={doneNotDoneOptions}
              allowClear
              placeholder="Insured Visit"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) => prev?.insuredVisit !== curr?.insuredVisit}
      >
        {({ getFieldValue }) =>
          getFieldValue("insuredVisit") === "Not Done" ? (
            <Fragment>
              <Row gutter={10}>
                <Col sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Why Insured not visited?"
                    name={["reasonOfInsuredNotVisit", "value"]}
                    rules={[{ required: true, message: "Please select" }]}
                  >
                    <Select
                      options={reasonOfInsuredNotVisitOptions}
                      allowClear
                      placeholder="Why Insured not visited?"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <ReasonForInsuredNotVisited claimId={claimId} form={form} />
            </Fragment>
          ) : getFieldValue("insuredVisit") === "Done" ? (
            <InsuredDetailsForm claimId={claimId} form={form} />
          ) : null
        }
      </Form.Item>
    </Fragment>
  );
};

export default InsuredVerificationParts;
