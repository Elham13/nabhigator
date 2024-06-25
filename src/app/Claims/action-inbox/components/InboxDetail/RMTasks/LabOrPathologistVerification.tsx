import React, { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { ILabOrPathologistVerification } from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import {
  labReportsOptions,
  meetingStatusOptions,
  reportsSignedByOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";

const taskName = "Lab Part/Pathologist Verification";

const initialFormValues: ILabOrPathologistVerification = {
  labs: [
    {
      name: "",
      address: "",
      city: "",
      labBills: "",
      labReports: "",
      reportsSigned: "",
      state: "",
      pathologistDetails: {
        name: "",
        meetingStatus: "",
        qualification: "",
        registrationNo: "",
        cooperation: "",
        reasonForUntraceable: "",
      },
    },
  ],
  verificationSummary: "",
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const LabOrPathologistVerification = ({
  caseDetail,
  setCaseDetail,
}: PropTypes) => {
  const [form] = Form.useForm<ILabOrPathologistVerification>();

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
    <FormContainer<ILabOrPathologistVerification>
      form={form}
      handleSave={(payload) =>
        submit({ payload, id: caseDetail?._id, name: taskName })
      }
      submitting={loading}
      values={initialFormValues}
      formName={taskName}
    >
      <Form.List name="labs">
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
                      label="Name of Lab"
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Please Fill" }]}
                    >
                      <Input placeholder="Name of Lab" />
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
                      label="Reports signed by"
                      name={[name, "reportsSigned"]}
                      rules={[{ required: true, message: "Please Select" }]}
                    >
                      <Select
                        placeholder="Reports signed by"
                        allowClear
                        showSearch
                        options={reportsSignedByOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Lab Reports"
                      name={[name, "labReports"]}
                      rules={[{ required: true, message: "Please Select" }]}
                    >
                      <Select
                        placeholder="Lab Reports"
                        allowClear
                        showSearch
                        options={labReportsOptions}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col xs={24}>
                    <Form.Item
                      {...restField}
                      label="Lab Bills"
                      name={[name, "labBills"]}
                      rules={[{ required: true, message: "Please Select" }]}
                    >
                      <Select
                        placeholder="Lab Bills"
                        allowClear
                        showSearch
                        options={labReportsOptions}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider orientation="left" orientationMargin="0">
                  <Typography.Title level={4}>
                    Pathologist Details
                  </Typography.Title>
                </Divider>

                <Row gutter={10}>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Name of Pathologist"
                      name={[name, "pathologistDetails", "name"]}
                      rules={[{ required: true, message: "Please Fill" }]}
                    >
                      <Input placeholder="Name of Pathologist" />
                    </Form.Item>
                  </Col>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Qualification"
                      name={[name, "pathologistDetails", "qualification"]}
                      rules={[{ required: true, message: "Please Fill" }]}
                    >
                      <Input placeholder="Qualification" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Registration Number"
                      name={[name, "pathologistDetails", "registrationNo"]}
                      rules={[{ required: true, message: "Please Fill" }]}
                    >
                      <Input placeholder="Registration Number" />
                    </Form.Item>
                  </Col>
                  <Col md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      label="Pathologist Meeting"
                      name={[name, "pathologistDetails", "meetingStatus"]}
                      rules={[{ required: true, message: "Please Select" }]}
                    >
                      <Select
                        placeholder="Pathologist Meeting"
                        allowClear
                        options={meetingStatusOptions}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) =>
                    prev?.labs[name]?.pathologistDetails?.meetingStatus !==
                    curr?.labs[name]?.pathologistDetails?.meetingStatus
                  }
                >
                  {({ getFieldValue }) => {
                    const value = getFieldValue([
                      "labs",
                      name,
                      "pathologistDetails",
                      "meetingStatus",
                    ]);

                    return value === "Untraceable" ? (
                      <Col md={12} xs={24}>
                        <Form.Item
                          {...restField}
                          label="Reason for Untraceable"
                          name={[
                            name,
                            "pathologistDetails",
                            "reasonForUntraceable",
                          ]}
                          rules={[{ required: true, message: "Please Select" }]}
                        >
                          <Input placeholder="Reason for Untraceable" />
                        </Form.Item>
                      </Col>
                    ) : value === "Traceable" ? (
                      <Col md={12} xs={24}>
                        <Form.Item
                          {...restField}
                          label="Co-Operation"
                          name={[name, "pathologistDetails", "cooperation"]}
                          rules={[{ required: true, message: "Please Select" }]}
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
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add More Lab
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

export default LabOrPathologistVerification;
