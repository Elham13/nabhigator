import React, { Fragment } from "react";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import { personalHabitOptions } from "@/lib/utils/constants/options";

type OriginType = "insured" | "hospital";

interface PropTypes {
  origin: OriginType;
  form: FormInstance<any>;
}

const PatientHabitFormParts = ({ origin, form }: PropTypes) => {
  return (
    <Fragment>
      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item
            label="Personal/Social Habits"
            name="tempHabits"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              mode="multiple"
              placeholder="Personal/Social Habits"
              allowClear
              showSearch
              options={personalHabitOptions}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.tempHabits?.length !== curr?.tempHabits?.length
        }
      >
        {({ getFieldValue }) => {
          const value = getFieldValue("tempHabits") as string[];

          return value?.length > 0 && !value?.includes("NA")
            ? value?.map((el, ind) => {
                return (
                  <Row gutter={6} key={ind}>
                    <Col md={8} sm={24}>
                      <Form.Item
                        label={`Frequency of ${el}`}
                        name={["personalOrSocialHabits", ind, "frequency"]}
                        rules={[{ required: true, message: "Please Fill" }]}
                      >
                        <Input placeholder={`Frequency of ${el}`} />
                      </Form.Item>
                    </Col>
                    <Col md={8} sm={24}>
                      <Form.Item
                        label={`Quantity of ${el}`}
                        name={["personalOrSocialHabits", ind, "quantity"]}
                        rules={[{ required: true, message: "Please Fill" }]}
                      >
                        <Input placeholder={`Quantity of ${el}`} />
                      </Form.Item>
                    </Col>
                    <Col md={8} sm={24}>
                      <Form.Item
                        label={`Duration of ${el}`}
                        name={["personalOrSocialHabits", ind, "duration"]}
                        rules={[{ required: true, message: "Please Fill" }]}
                      >
                        <Input placeholder={`Duration of ${el}`} />
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

export default PatientHabitFormParts;
