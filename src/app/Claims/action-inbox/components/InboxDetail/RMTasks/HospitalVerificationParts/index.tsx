import React, { Fragment } from "react";
import {
  Col,
  DatePicker,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  TimePicker,
} from "antd";
import PatientHabitFormParts from "../FormParts/PatientHabitFormParts";
import AilmentFormParts from "../FormParts/AilmentFormParts";
import { IHospitalVerification } from "@/lib/utils/types/rmDataTypes";
import { disableFuture } from "@/lib/helpers";
import {
  attendantDetailsOptions,
  billVerificationOptions,
  hospitalInfrastructureOptions,
  hospitalOperationsOptions,
  hospitalSpecialtyOptions,
  icpsCollectedOptions,
  indoorEntryOptions,
  medicinesOptions,
  paymentReceiptsOptions,
  recordKeepingOptions,
  yesNoNAOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";

type PropTypes = {
  form: FormInstance<IHospitalVerification>;
};

const HospitalVerificationParts = ({ form }: PropTypes) => {
  return (
    <Fragment>
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IHospitalVerification>
            name="dateOfVisitToHospital"
            label="Date of visit to hospital"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <DatePicker disabledDate={disableFuture} className="w-full" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IHospitalVerification>
            label="Time of visit to hospital"
            name="timeOfVisitToHospital"
            rules={[{ required: true, message: "Please select" }]}
          >
            <TimePicker use12Hours showSecond={false} className="w-full" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IHospitalVerification>
            label="Provider Co-operation"
            name="providerCooperation"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Provider Co-operation"
              options={yesNoOptions}
              allowClear
            />
          </Form.Item>
        </Col>
        <Form.Item<IHospitalVerification>
          noStyle
          shouldUpdate={(prev, curr) =>
            prev?.providerCooperation !== curr?.providerCooperation
          }
        >
          {({ getFieldValue }) => {
            const value = getFieldValue("providerCooperation");
            return value === "No" ? (
              <Col md={12} xs={24}>
                <Form.Item<IHospitalVerification>
                  label="Reason for provider not cooperating"
                  name="reasonOfProviderNotCooperating"
                  rules={[{ required: true, message: "Please Fill" }]}
                >
                  <Input placeholder="Reason for provider not cooperating" />
                </Form.Item>
              </Col>
            ) : null;
          }}
        </Form.Item>
      </Row>
      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IHospitalVerification>
            label="Hospital Infrastructure"
            name={["hospitalInfrastructure", "value"]}
            rules={[{ required: true, message: "Please select" }]}
          >
            <Select
              placeholder="Hospital Infrastructure"
              options={hospitalInfrastructureOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IHospitalVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.hospitalInfrastructure?.value !==
          curr?.hospitalInfrastructure?.value
        }
      >
        {({ getFieldValue }) => {
          const value = getFieldValue(["hospitalInfrastructure", "value"]);
          return ["Poor Setup", "Primary Care"].includes(value) ? (
            <Fragment>
              <Row gutter={10}>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="No of beds"
                    name={["hospitalInfrastructure", "noOfBeds"]}
                    rules={[
                      { required: true, message: "Please Fill" },
                      {
                        pattern: new RegExp(/^[0-9]+$/),
                        message: "Only numbers allowed",
                      },
                    ]}
                  >
                    <Input placeholder="No of beds" />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="OT"
                    name={["hospitalInfrastructure", "OT"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="OT"
                      allowClear
                      options={yesNoNAOptions}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="ICU"
                    name={["hospitalInfrastructure", "ICU"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="ICU"
                      allowClear
                      options={yesNoNAOptions}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="Specialty"
                    name={["hospitalInfrastructure", "specialty"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Specialty"
                      allowClear
                      options={hospitalSpecialtyOptions}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="Round the clock RMO"
                    name={["hospitalInfrastructure", "roundOfClockRMO"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Round the clock RMO"
                      allowClear
                      options={yesNoNAOptions}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="Pharmacy"
                    name={["hospitalInfrastructure", "pharmacy"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Pharmacy"
                      allowClear
                      options={medicinesOptions}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="Pathology"
                    name={["hospitalInfrastructure", "pathology"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Pathology"
                      allowClear
                      options={medicinesOptions}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="Hospital Operations"
                    name={["hospitalInfrastructure", "hospitalOperations"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Hospital Operations"
                      allowClear
                      options={hospitalOperationsOptions}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="Patient Lifts Available?"
                    name={[
                      "hospitalInfrastructure",
                      "patientLifts",
                      "available",
                    ]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Patient Lifts Available?"
                      allowClear
                      options={attendantDetailsOptions?.filter(
                        (el) => el?.value !== "NA"
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="Is Patient Lifts Operational"
                    name={[
                      "hospitalInfrastructure",
                      "patientLifts",
                      "operational",
                    ]}
                  >
                    <Select
                      placeholder="Is Patient Lifts Operational"
                      allowClear
                      options={yesNoOptions}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="Hospital Registration"
                    name={[
                      "hospitalInfrastructure",
                      "hospitalRegistration",
                      "registered",
                    ]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Hospital Registration"
                      allowClear
                      options={[
                        ...yesNoOptions,
                        { value: "Not shared", label: "Not shared" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item<IHospitalVerification>
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev?.hospitalInfrastructure?.hospitalRegistration
                    ?.registered !==
                  curr?.hospitalInfrastructure?.hospitalRegistration?.registered
                }
              >
                {({ getFieldValue }) => {
                  const value = getFieldValue([
                    "hospitalInfrastructure",
                    "hospitalRegistration",
                    "registered",
                  ]);
                  return value === "Yes" ? (
                    <Row gutter={10}>
                      <Col md={12} xs={24}>
                        <Form.Item<IHospitalVerification>
                          label="Registered From"
                          name={[
                            "hospitalInfrastructure",
                            "hospitalRegistration",
                            "registeredFrom",
                          ]}
                          rules={[{ required: true, message: "Please Select" }]}
                        >
                          <DatePicker
                            disabledDate={disableFuture}
                            className="w-full"
                          />
                        </Form.Item>
                      </Col>
                      <Col md={12} xs={24}>
                        <Form.Item<IHospitalVerification>
                          label="Registered To"
                          name={[
                            "hospitalInfrastructure",
                            "hospitalRegistration",
                            "registeredTo",
                          ]}
                          rules={[{ required: true, message: "Please Select" }]}
                        >
                          <DatePicker
                            disabledDate={disableFuture}
                            className="w-full"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : null;
                }}
              </Form.Item>

              <Row gutter={10}>
                <Col md={12} xs={24}>
                  <Form.Item<IHospitalVerification>
                    label="Record Keeping Available?"
                    name={["hospitalInfrastructure", "recordKeeping", "value"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Record Keeping Available?"
                      allowClear
                      options={yesNoOptions}
                    />
                  </Form.Item>
                </Col>
                <Form.Item<IHospitalVerification>
                  noStyle
                  shouldUpdate={(prev, curr) =>
                    prev?.hospitalInfrastructure?.recordKeeping?.value !==
                    curr?.hospitalInfrastructure?.recordKeeping?.value
                  }
                >
                  {({ getFieldValue }) => {
                    const value = getFieldValue([
                      "hospitalInfrastructure",
                      "recordKeeping",
                      "value",
                    ]);
                    return value === "Yes" ? (
                      <Col md={12} xs={24}>
                        <Form.Item<IHospitalVerification>
                          label="Record Keeping Type"
                          name={[
                            "hospitalInfrastructure",
                            "recordKeeping",
                            "type",
                          ]}
                          rules={[{ required: true, message: "Please Select" }]}
                        >
                          <Select
                            placeholder="Record Keeping Type"
                            allowClear
                            options={recordKeepingOptions}
                          />
                        </Form.Item>
                      </Col>
                    ) : null;
                  }}
                </Form.Item>
              </Row>
            </Fragment>
          ) : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col xs={24}>
          <Form.Item<IHospitalVerification>
            label="Remark/Observation"
            name="remarks"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input.TextArea placeholder="Remark/Observation" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IHospitalVerification>
            label="ICPs Collected?"
            name={["icpsCollected", "value"]}
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="ICPs Collected?"
              allowClear
              options={icpsCollectedOptions}
            />
          </Form.Item>
        </Col>

        <Form.Item<IHospitalVerification>
          noStyle
          shouldUpdate={(prev, curr) =>
            prev?.icpsCollected?.value !== curr?.icpsCollected?.value
          }
        >
          {({ getFieldValue }) => {
            const value = getFieldValue(["icpsCollected", "value"]);
            return ["No", "No Records", "Not Shared"].includes(value) ? (
              <Col md={12} xs={24}>
                <Form.Item<IHospitalVerification>
                  label="ICPs Collected Remarks"
                  name={["icpsCollected", "remark"]}
                  rules={[{ required: true, message: "Please Fill" }]}
                >
                  <Input placeholder="ICPs Collected Remarks" />
                </Form.Item>
              </Col>
            ) : null;
          }}
        </Form.Item>
      </Row>
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IHospitalVerification>
            label="Indoor Entry"
            name={["indoorEntry", "value"]}
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Indoor Entry"
              allowClear
              options={indoorEntryOptions}
            />
          </Form.Item>
        </Col>

        <Form.Item<IHospitalVerification>
          noStyle
          shouldUpdate={(prev, curr) =>
            prev?.indoorEntry?.value !== curr?.indoorEntry?.value
          }
        >
          {({ getFieldValue }) => {
            const value = getFieldValue(["indoorEntry", "value"]);
            return value === "Verified" ? (
              <Col md={12} xs={24}>
                <Form.Item<IHospitalVerification>
                  label="Period of Hospitalization Matching"
                  name={["indoorEntry", "periodOfHospitalizationMatching"]}
                  rules={[{ required: true, message: "Please Select" }]}
                >
                  <Select
                    placeholder="Period of Hospitalization Matching"
                    allowClear
                    options={yesNoOptions}
                  />
                </Form.Item>
              </Col>
            ) : null;
          }}
        </Form.Item>
      </Row>
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IHospitalVerification>
            label="Old records checked?"
            name={["oldRecordCheck", "value"]}
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Old records checked?"
              allowClear
              options={yesNoOptions}
            />
          </Form.Item>
        </Col>

        <Col md={12} xs={24}>
          <Form.Item<IHospitalVerification>
            label="Remarks"
            name={["oldRecordCheck", "remark"]}
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Remarks" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IHospitalVerification>
            label="Bill Verification"
            name="billVerification"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Bill Verification"
              allowClear
              options={billVerificationOptions}
            />
          </Form.Item>
        </Col>

        <Col md={12} xs={24}>
          <Form.Item<IHospitalVerification>
            label="Payment Receipts"
            name="paymentReceipts"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Payment Receipts"
              allowClear
              options={paymentReceiptsOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <PatientHabitFormParts origin="hospital" form={form} />

      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item<IHospitalVerification>
            label="PED/Non-Disclosure"
            name={["pedOrNonDisclosure", "value"]}
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              options={yesNoNAOptions}
              allowClear
              showSearch
              placeholder="PED/Non-Disclosure"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IHospitalVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.pedOrNonDisclosure?.value !== curr?.pedOrNonDisclosure?.value
        }
      >
        {({ getFieldValue }) => {
          const value = getFieldValue(["pedOrNonDisclosure", "value"]);
          return value === "Yes" ? (
            <AilmentFormParts origin="hospital" form={form} />
          ) : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IHospitalVerification>
            label="Verification Summary"
            name="verificationSummary"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input.TextArea placeholder="Verification Summary" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IHospitalVerification>
            label="Discrepancies/Irregularities Observed"
            name="discrepanciesOrIrregularitiesObserved"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input.TextArea placeholder="Discrepancies/Irregularities Observed" />
          </Form.Item>
        </Col>
      </Row>
    </Fragment>
  );
};

export default HospitalVerificationParts;
