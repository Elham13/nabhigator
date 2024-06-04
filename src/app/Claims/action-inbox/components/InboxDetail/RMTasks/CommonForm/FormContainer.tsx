import React, { ReactNode } from "react";
import { Button, Col, Form, FormInstance, FormProps, Row, Space } from "antd";

interface PropTypes<T> {
  values: Record<string, any>;
  form: FormInstance<T>;
  submitting: boolean;
  children: ReactNode;
  formName: string;
  handleSave: FormProps<T>["onFinish"];
  onValuesChange?: (changedValues: any, values: T) => void;
}

const FormContainer = <T,>({
  values,
  form,
  submitting,
  children,
  formName,
  handleSave,
  onValuesChange,
}: PropTypes<T>) => {
  return (
    <Form
      name={`basic_form_or_${formName}`}
      layout="vertical"
      initialValues={values}
      onFinish={handleSave}
      autoComplete="off"
      form={form}
      scrollToFirstError
      onValuesChange={onValuesChange}
    >
      {children}
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item>
            <Space>
              <Button
                htmlType="submit"
                type="primary"
                className="bg-blue-500"
                loading={submitting}
              >
                Save
              </Button>
              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormContainer;
