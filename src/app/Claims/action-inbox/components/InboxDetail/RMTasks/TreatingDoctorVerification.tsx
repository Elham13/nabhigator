import React, { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import { Button, Col, Form, FormProps, Input, Row, Select } from "antd";
import FormContainer from "./CommonForm/FormContainer";
import { toast } from "react-toastify";
import { ITreatingDoctorVerification } from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import {
  doctorQualificationOptions,
  doctorRegNoOptions,
  meetingStatusOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";

const taskName = "Treating Doctor Verification";

const initialFormValues: ITreatingDoctorVerification = {
  doctors: [
    {
      meetingStatus: "",
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

const TreatingDoctorVerification = ({
  caseDetail,
  setCaseDetail,
}: PropTypes) => {
  const [form] = Form.useForm<ITreatingDoctorVerification>();

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

  const handleSave: FormProps<ITreatingDoctorVerification>["onFinish"] = async (
    values
  ) => {
    const payload: ITreatingDoctorVerification = {
      ...values,
    };

    submit({ payload, id: caseDetail?._id, name: taskName });
  };

  useEffect(() => {
    if (caseDetail?.rmFindingsPostQA?.[taskName]) {
      const obj = caseDetail?.rmFindingsPostQA?.[taskName];
      Object.entries(obj).map(([key, value]: any) => {
        form.setFieldValue(key, value);
      });
    }
  }, [caseDetail?.rmFindingsPostQA, form]);

  return (
    <FormContainer<ITreatingDoctorVerification>
      form={form}
      handleSave={handleSave}
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
                  <BiMinusCircle />
                </div>
                <Row gutter={10}>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Name of treating Doctor"
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Please Fill" }]}
                    >
                      <Input placeholder="Name of treating Doctor" />
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
                <Row gutter={10}>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Meeting Status"
                      name={[name, "meetingStatus"]}
                      rules={[{ required: true, message: "Please Select" }]}
                    >
                      <Select
                        placeholder="Meeting Status"
                        allowClear
                        showSearch
                        options={meetingStatusOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) =>
                      prev?.doctors[name]?.meetingStatus !==
                      curr?.doctors[name]?.meetingStatus
                    }
                  >
                    {({ getFieldValue }) => {
                      const value = getFieldValue([
                        "doctors",
                        name,
                        "meetingStatus",
                      ]);

                      return value === "Untraceable" ? (
                        <Col md={12} xs={24}>
                          <Form.Item
                            {...restField}
                            label="Remark"
                            name={[name, "remarkForUntraceable"]}
                            rules={[
                              { required: true, message: "Please Select" },
                            ]}
                          >
                            <Input placeholder="Remark" />
                          </Form.Item>
                        </Col>
                      ) : value === "Traceable" ? (
                        <Col md={12} xs={24}>
                          <Form.Item
                            {...restField}
                            label="Co-Operation"
                            name={[name, "cooperation"]}
                            rules={[
                              { required: true, message: "Please Select" },
                            ]}
                          >
                            <Select
                              placeholder="Co-Operation"
                              allowClear
                              showSearch
                              options={yesNoOptions}
                            />
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
                icon={<BiPlusCircle />}
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

export default TreatingDoctorVerification;
