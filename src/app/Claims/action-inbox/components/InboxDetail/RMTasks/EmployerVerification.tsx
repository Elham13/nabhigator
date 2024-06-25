import React, { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  IEmployer,
  IEmployerVerification,
} from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import { disableFuture } from "@/lib/helpers";
import { yesNoNAOptions } from "@/lib/utils/constants/options";

const taskName = "Employer Verification";

const initialFormValues: IEmployerVerification = {
  employers: [
    {
      nameOfEmployer: "",
      address: "",
      anyGroupHealthPolicy: "",
      dateOfJoining: null,
      claimDetails: "",
    },
  ],
  verificationSummary: "",
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const EmployerVerification = ({ caseDetail, setCaseDetail }: PropTypes) => {
  const [form] = Form.useForm<IEmployerVerification>();

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
        if (key === "employers") {
          form.setFieldValue(
            key,
            value?.map((el: IEmployer) => ({
              ...el,
              dateOfJoining: el?.dateOfJoining
                ? dayjs(el?.dateOfJoining)
                : el?.dateOfJoining,
            }))
          );
        } else form.setFieldValue(key, value);
      });
    }
  }, [caseDetail?.rmFindingsPostQA, form]);

  return (
    <FormContainer<IEmployerVerification>
      form={form}
      handleSave={(payload) =>
        submit({ payload, id: caseDetail?._id, name: taskName })
      }
      submitting={loading}
      values={initialFormValues}
      formName={taskName}
    >
      <Form.List name="employers">
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
                      label="Name of Employer"
                      name={[name, "nameOfEmployer"]}
                      rules={[{ required: true, message: "Please Fill" }]}
                    >
                      <Input placeholder="Name of Employer" />
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
                      label="Date of Joining"
                      name={[name, "dateOfJoining"]}
                      rules={[{ required: true, message: "Please Select" }]}
                    >
                      <DatePicker
                        disabledDate={disableFuture}
                        className="w-full"
                      />
                    </Form.Item>
                  </Col>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Any Group Health Policy"
                      name={[name, "anyGroupHealthPolicy"]}
                      rules={[{ required: true, message: "Please Select" }]}
                    >
                      <Select
                        placeholder="Any Group Health Policy"
                        options={yesNoNAOptions}
                        allowClear
                        showSearch
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) =>
                    prev?.employers?.[name]?.anyGroupHealthPolicy !==
                    curr?.employers?.[name]?.anyGroupHealthPolicy
                  }
                >
                  {({ getFieldValue }) => {
                    const value = getFieldValue([
                      "employers",
                      name,
                      "anyGroupHealthPolicy",
                    ]);
                    return value === "Yes" ? (
                      <Row gutter={10}>
                        <Col md={12} xs={24}>
                          <Form.Item
                            {...restField}
                            label="Claim Details"
                            name={[name, "claimDetails"]}
                            rules={[
                              { required: true, message: "Please Select" },
                            ]}
                          >
                            <Input placeholder="Claim Details" />
                          </Form.Item>
                        </Col>
                      </Row>
                    ) : null;
                  }}
                </Form.Item>
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add More Employer
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

export default EmployerVerification;
