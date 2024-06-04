import React, { Fragment } from "react";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import { ailmentOptions, yesNoOptions } from "@/lib/utils/constants/options";

type OriginType = "insured" | "hospital";

interface PropTypes {
  origin: OriginType;
  form: FormInstance<any>;
}

const AilmentFormParts = ({ origin, form }: PropTypes) => {
  return (
    <Fragment>
      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item
            label="Ailments"
            name="tempAilments"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              mode="multiple"
              placeholder="Ailments"
              allowClear
              showSearch
              options={ailmentOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.tempAilments?.length !== curr?.tempAilments?.length
        }
      >
        {({ getFieldValue }) => {
          const value = getFieldValue("tempAilments") as string[];

          return value?.length > 0
            ? value?.map((el, ind) => {
                return (
                  <Row gutter={6} key={ind}>
                    <Col md={8} sm={24}>
                      <Form.Item
                        label={`Diagnosis of ${el}`}
                        name={[
                          "pedOrNonDisclosure",
                          "ailmentDetail",
                          ind,
                          "diagnosis",
                        ]}
                        rules={[{ required: true, message: "Please Fill" }]}
                      >
                        <Input placeholder={`Diagnosis of ${el}`} />
                      </Form.Item>
                    </Col>
                    <Col md={8} sm={24}>
                      <Form.Item
                        label={`Duration of ${el}`}
                        name={[
                          "pedOrNonDisclosure",
                          "ailmentDetail",
                          ind,
                          "duration",
                        ]}
                        rules={[{ required: true, message: "Please Fill" }]}
                      >
                        <Input
                          placeholder={`Duration of ${el}`}
                          addonAfter={
                            <Select
                              defaultValue="Months"
                              onChange={(val) => {
                                const duration = form.getFieldValue([
                                  "pedOrNonDisclosure",
                                  "ailmentDetail",
                                  ind,
                                  "duration",
                                ]);
                                const value =
                                  duration?.includes("Years") ||
                                  duration?.includes("Months")
                                    ? duration?.replace(/Months|Years/, val)
                                    : `${duration} Months`;
                                form.setFieldValue(
                                  [
                                    "pedOrNonDisclosure",
                                    "ailmentDetail",
                                    ind,
                                    "duration",
                                  ],
                                  value
                                );
                              }}
                            >
                              <Select.Option value="Months">
                                Months
                              </Select.Option>
                              <Select.Option value="Years">Years</Select.Option>
                            </Select>
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8} sm={24}>
                      <Form.Item
                        label={`On Medication of ${el}`}
                        name={[
                          "pedOrNonDisclosure",
                          "ailmentDetail",
                          ind,
                          "onMedication",
                        ]}
                        rules={[{ required: true, message: "Please Fill" }]}
                      >
                        <Select
                          placeholder={`On Medication of ${el}`}
                          options={yesNoOptions}
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              })
            : null;
        }}
      </Form.Item>
    </Fragment>
  );
};

export default AilmentFormParts;
