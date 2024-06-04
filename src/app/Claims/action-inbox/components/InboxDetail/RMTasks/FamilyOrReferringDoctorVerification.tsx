import React, { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { IFamilyDoctorOrReferringDoctorVerification } from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import {
  doctorQualificationOptions,
  doctorRegNoOptions,
} from "@/lib/utils/constants/options";

const taskName = "Family Doctor Part/Referring Doctor Verification";

const initialFormValues: IFamilyDoctorOrReferringDoctorVerification = {
  doctors: [
    {
      name: "",
      qualification: "",
      registrationNo: { remark: "", value: "" },
    },
  ],
  verificationSummary: "",
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const FamilyOrReferringDoctorVerification = ({
  caseDetail,
  setCaseDetail,
}: PropTypes) => {
  const [form] = Form.useForm<IFamilyDoctorOrReferringDoctorVerification>();

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
    if (caseDetail?.rmFindings?.[taskName]) {
      const obj = caseDetail?.rmFindings?.[taskName];
      Object.entries(obj).map(([key, value]: any) => {
        form.setFieldValue(key, value);
      });
    }
  }, [caseDetail?.rmFindings, form]);

  return (
    <FormContainer<IFamilyDoctorOrReferringDoctorVerification>
      form={form}
      handleSave={(payload) =>
        submit({ payload, id: caseDetail?._id, name: taskName })
      }
      submitting={loading}
      values={initialFormValues}
      formName={taskName}
    >
      <Form.List name="doctors">
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
                      label="Name of family Doctor/Referring Doctor"
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Please Fill" }]}
                    >
                      <Input placeholder="Name of family Doctor/Referring Doctor" />
                    </Form.Item>
                  </Col>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Qualification"
                      name={[name, "qualification"]}
                      rules={[{ required: true, message: "Please Select" }]}
                    >
                      <Select
                        placeholder="Qualification"
                        allowClear
                        showSearch
                        options={doctorQualificationOptions}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Registration Number"
                      name={[name, "registrationNo", "value"]}
                      rules={[{ required: true, message: "Please Select" }]}
                    >
                      <Select
                        placeholder="Registration Number"
                        allowClear
                        showSearch
                        options={doctorRegNoOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) =>
                      prev?.doctors[name]?.registrationNo?.value !==
                      curr?.doctors[name]?.registrationNo?.value
                    }
                  >
                    {({ getFieldValue }) => {
                      const value = getFieldValue([
                        "doctors",
                        name,
                        "registrationNo",
                        "value",
                      ]);

                      return !!value ? (
                        <Col md={12} xs={24}>
                          <Form.Item
                            {...restField}
                            label="Remark"
                            name={[name, "registrationNo", "remark"]}
                            rules={[
                              { required: true, message: "Please Select" },
                            ]}
                          >
                            <Input placeholder="Remark" />
                          </Form.Item>
                        </Col>
                      ) : null;
                    }}
                  </Form.Item>
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
                Add More Doctor
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

export default FamilyOrReferringDoctorVerification;
