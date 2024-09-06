import React, { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { IChemistVerification } from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import { billsVerifiedOptions } from "@/lib/utils/constants/options";

const taskName = "Chemist Verification";

const initialFormValues: IChemistVerification = {
  chemists: [{ name: "", address: "", billsVerified: "", city: "", state: "" }],
  verificationSummary: "",
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const ChemistVerification = ({ caseDetail, setCaseDetail }: PropTypes) => {
  const [form] = Form.useForm<IChemistVerification>();

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
    <FormContainer<IChemistVerification>
      form={form}
      handleSave={(payload) =>
        submit({ payload, id: caseDetail?._id, name: taskName })
      }
      submitting={loading}
      values={initialFormValues}
      formName={taskName}
    >
      <Form.List name="chemists">
        {(fields, { add, remove }) => (
          <Fragment>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="relative">
                <div
                  className="absolute top-0 right-2 text-red-500 cursor-pointer text-xl z-50"
                  onClick={() => remove(name)}
                >
                  <MinusCircleOutlined />
                </div>
                <Row gutter={10}>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Name of Chemist"
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Please Fill" }]}
                    >
                      <Input placeholder="Name of Chemist" />
                    </Form.Item>
                  </Col>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Address"
                      name={[name, "address"]}
                      rules={[{ required: true, message: "Please Fill" }]}
                    >
                      <Input placeholder="Address" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="City"
                      name={[name, "city"]}
                      rules={[{ required: true, message: "Please Fill" }]}
                    >
                      <Input placeholder="City" />
                    </Form.Item>
                  </Col>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="State"
                      name={[name, "state"]}
                      rules={[{ required: true, message: "Please Fill" }]}
                    >
                      <Input placeholder="State" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Bills verified?"
                      name={[name, "billsVerified"]}
                      rules={[{ required: true, message: "Please Select" }]}
                    >
                      <Select
                        placeholder="Bills verified?"
                        allowClear
                        showSearch
                        options={billsVerifiedOptions}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add More Chemist
              </Button>
            </Form.Item>
          </Fragment>
        )}
      </Form.List>

      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item
            label="Verification Summary"
            name="verificationSummary"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Input.TextArea placeholder="Verification Summary" />
          </Form.Item>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default ChemistVerification;
