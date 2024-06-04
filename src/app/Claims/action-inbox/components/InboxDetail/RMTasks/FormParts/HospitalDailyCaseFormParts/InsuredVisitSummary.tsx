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
const InsuredVisitSummary = ({ form }: PropTypes) => {
  const DOASystem = Form.useWatch(
    ["insuredCooperationDetail", "dateOfAdmissionSystem"],
    form
  );
  const DOAUser = Form.useWatch(
    ["insuredCooperationDetail", "dateOfAdmissionUser"],
    form
  );
  const TODSystem = Form.useWatch(
    ["insuredCooperationDetail", "timeOfDischargeSystem"],
    form
  );
  const TODUser = Form.useWatch(
    ["insuredCooperationDetail", "timeOfDischargeUser"],
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
        ["insuredCooperationDetail", "durationOfHospitalizationSystem"],
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
        ["insuredCooperationDetail", "durationOfHospitalizationUser"],
        `${days} days and ${hours} hours`
      );
    }
  }, [DOAUser, TODUser, form]);

  return (
    <>
      <Divider orientation="left" orientationMargin="0">
        <Typography.Title level={4}>Insured Visit Summary</Typography.Title>
      </Divider>

      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IHospitalDailyCashPart>
            label="Insured Visited?"
            name="insuredVisit"
            rules={[{ required: true, message: "Please select" }]}
          >
            <Select
              options={yesNAOptions}
              allowClear
              placeholder="Insured Visited?"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) => prev?.insuredVisit !== curr?.insuredVisit}
      >
        {({ getFieldValue }) =>
          getFieldValue("insuredVisit") === "Yes" ? (
            <>
              <Row gutter={10}>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalDailyCashPart>
                    label="Insured Cooperating?"
                    name="insuredCooperation"
                    rules={[{ required: true, message: "Please select" }]}
                  >
                    <Select
                      options={yesNoOptions}
                      allowClear
                      placeholder="Insured Cooperating?"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev?.insuredCooperation !== curr?.insuredCooperation
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("insuredCooperation") === "No" ? (
                    <Row gutter={10}>
                      <Col xs={24}>
                        <Form.Item<IHospitalDailyCashPart>
                          label="Remarks on insured not cooperating"
                          name="insuredNotCooperatingReason"
                          rules={[{ required: true, message: "Please Fill" }]}
                        >
                          <Input placeholder="Remarks on insured not cooperating?" />
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : getFieldValue("insuredCooperation") === "Yes" ? (
                    <>
                      <Row gutter={10}>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Date of visit to insured"
                            name={[
                              "insuredCooperationDetail",
                              "dateOfVisitToInsured",
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
                            label="Time of visit to insured"
                            name={[
                              "insuredCooperationDetail",
                              "timeOfVisitToInsured",
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
                            label="Name of insured (System Fetch)"
                            name={[
                              "insuredCooperationDetail",
                              "nameOfInsuredSystem",
                            ]}
                          >
                            <Input
                              disabled
                              placeholder="Name of insured (System Fetch)"
                            />
                          </Form.Item>
                        </Col>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Name of insured (User Feed)"
                            name={[
                              "insuredCooperationDetail",
                              "nameOfInsuredUser",
                            ]}
                            rules={[{ required: true, message: "Please Fill" }]}
                          >
                            <Input placeholder="Name of insured (User Feed)" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={10}>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Date of Admission (System Fetch)"
                            name={[
                              "insuredCooperationDetail",
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
                              "insuredCooperationDetail",
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
                              "insuredCooperationDetail",
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
                              "insuredCooperationDetail",
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
                              "insuredCooperationDetail",
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
                              "insuredCooperationDetail",
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
                            name={["insuredCooperationDetail", "diagnosis"]}
                          >
                            <Input placeholder="Diagnosis" />
                          </Form.Item>
                        </Col>
                        <Col md={12} xs={24}>
                          <Form.Item<IHospitalDailyCashPart>
                            label="Class of accommodation"
                            name={[
                              "insuredCooperationDetail",
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
                              "insuredCooperationDetail",
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

export default InsuredVisitSummary;
