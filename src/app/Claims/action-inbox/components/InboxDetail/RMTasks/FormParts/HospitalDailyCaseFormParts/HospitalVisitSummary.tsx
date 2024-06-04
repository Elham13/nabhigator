import React, { useEffect } from "react";
import {
  Col,
  DatePicker,
  Divider,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  TimePicker,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { IHospitalDailyCashPart } from "@/lib/utils/types/rmDataTypes";
import {
  classOfAccommodationOptions,
  yesNAOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";
import { disableFuture } from "@/lib/helpers";

type PropTypes = {
  form: FormInstance<IHospitalDailyCashPart>;
};
const HospitalVisitSummary = ({ form }: PropTypes) => {
  const DOASystem = Form.useWatch(
    ["hospitalCooperationDetail", "dateOfAdmissionSystem"],
    form
  );
  const DOAUser = Form.useWatch(
    ["hospitalCooperationDetail", "dateOfAdmissionUser"],
    form
  );
  const TODSystem = Form.useWatch(
    ["hospitalCooperationDetail", "timeOfDischargeSystem"],
    form
  );
  const TODUser = Form.useWatch(
    ["hospitalCooperationDetail", "timeOfDischargeUser"],
    form
  );

  useEffect(() => {
    if (DOASystem && TODSystem) {
      const dateDuration = dayjs().diff(DOASystem);
      const timeDuration = dayjs().diff(TODSystem);

      const days = Math.floor(dateDuration / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      form.setFieldValue(
        ["hospitalCooperationDetail", "durationOfHospitalizationSystem"],
        `${days} days and ${hours} hours`
      );
    }
  }, [DOASystem, TODSystem, form]);

  useEffect(() => {
    if (DOAUser && TODUser) {
      const dateDuration = dayjs().diff(DOAUser);
      const timeDuration = dayjs().diff(TODUser);

      const days = Math.floor(dateDuration / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      form.setFieldValue(
        ["hospitalCooperationDetail", "durationOfHospitalizationUser"],
        `${days} days and ${hours} hours`
      );
    }
  }, [DOAUser, TODUser, form]);

  return (
    <>
      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>Hospital Visit Summary</Typography.Title>
      </Divider>

      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IHospitalDailyCashPart>
            label="Hospital Visited?"
            name="hospitalVisit"
            rules={[{ required: true, message: "Please select" }]}
          >
            <Select
              options={yesNAOptions}
              allowClear
              placeholder="Hospital Visited?"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.hospitalVisit !== curr?.hospitalVisit
        }
      >
        {({ getFieldValue }) =>
          getFieldValue("hospitalVisit") === "Yes" ? (
            <>
              <Row gutter={10}>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalDailyCashPart>
                    label="Hospital Cooperating?"
                    name="hospitalCooperation"
                    rules={[{ required: true, message: "Please select" }]}
                  >
                    <Select
                      options={yesNoOptions}
                      allowClear
                      placeholder="Hospital Cooperating?"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev?.hospitalCooperation !== curr?.hospitalCooperation
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("hospitalCooperation") === "No" ? (
                    <Row gutter={10}>
                      <Col xs={24}>
                        <Form.Item<IHospitalDailyCashPart>
                          label="Remarks on hospital not cooperating"
                          name="hospitalNotCooperatingReason"
                          rules={[{ required: true, message: "Please Fill" }]}
                        >
                          <Input placeholder="Remarks on hospital not cooperating?" />
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : getFieldValue("hospitalCooperation") === "Yes" ? (
                    <>
                      <Row gutter={10}>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Date of visit to hospital"
                            name={[
                              "hospitalCooperationDetail",
                              "dateOfVisitToHospital",
                            ]}
                            rules={[{ required: true, message: "Please Fill" }]}
                          >
                            <DatePicker
                              disabledDate={disableFuture}
                              className="w-full"
                            />
                          </Form.Item>
                        </Col>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Time of visit to hospital"
                            name={[
                              "hospitalCooperationDetail",
                              "timeOfVisitToHospital",
                            ]}
                            rules={[{ required: true, message: "Please Fill" }]}
                          >
                            <TimePicker
                              use12Hours
                              showSecond={false}
                              className="w-full"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={10}>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Date of Admission (System Fetch)"
                            name={[
                              "hospitalCooperationDetail",
                              "dateOfAdmissionSystem",
                            ]}
                          >
                            <DatePicker
                              disabledDate={disableFuture}
                              className="w-full"
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Date of Admission (User Feed)"
                            name={[
                              "hospitalCooperationDetail",
                              "dateOfAdmissionUser",
                            ]}
                            rules={[{ required: true, message: "Please Fill" }]}
                          >
                            <DatePicker
                              disabledDate={disableFuture}
                              className="w-full"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={10}>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Time of Discharge (System Fetch)"
                            name={[
                              "hospitalCooperationDetail",
                              "timeOfDischargeSystem",
                            ]}
                          >
                            <TimePicker
                              className="w-full"
                              disabled
                              use12Hours
                              showSecond={false}
                            />
                          </Form.Item>
                        </Col>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Time of Discharge (User Feed)"
                            name={[
                              "hospitalCooperationDetail",
                              "timeOfDischargeUser",
                            ]}
                            rules={[{ required: true, message: "Please Fill" }]}
                          >
                            <TimePicker
                              disabledDate={disableFuture}
                              className="w-full"
                              use12Hours
                              showSecond={false}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={10}>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Number of days and hours of Hospitalization (System Fetch)"
                            name={[
                              "hospitalCooperationDetail",
                              "durationOfHospitalizationSystem",
                            ]}
                          >
                            <Input
                              disabled
                              placeholder="Number of days and hours of Hospitalization (System Fetch)"
                            />
                          </Form.Item>
                        </Col>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Number of days and Hours of Hospitalization (User Feed)"
                            name={[
                              "hospitalCooperationDetail",
                              "durationOfHospitalizationUser",
                            ]}
                            rules={[{ required: true, message: "Please Fill" }]}
                          >
                            <Input placeholder="Number of days and Hours of Hospitalization (User Feed)" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={10}>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Diagnosis"
                            name={["hospitalCooperationDetail", "diagnosis"]}
                          >
                            <Input placeholder="Diagnosis" />
                          </Form.Item>
                        </Col>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Class of accommodation"
                            name={[
                              "hospitalCooperationDetail",
                              "classOfAccommodation",
                            ]}
                            rules={[
                              { required: true, message: "Please Select" },
                            ]}
                          >
                            <Select
                              placeholder="Class of accommodation"
                              options={classOfAccommodationOptions}
                              allowClear
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={10}>
                        <Col xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Discrepancies Observed"
                            name={[
                              "hospitalCooperationDetail",
                              "discrepanciesObserved",
                            ]}
                          >
                            <Input.TextArea placeholder="Discrepancies Observed" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  ) : null
                }
              </Form.Item>
            </>
          ) : null
        }
      </Form.Item>
    </>
  );
};

export default HospitalVisitSummary;
