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
import PolicyOtherThanNBHIFormPart from "./PolicyOtherThanNBHIFormPart";
import UploadProof from "./UploadProof";
import PatientHabitFormParts from "../FormParts/PatientHabitFormParts";
import AilmentFormParts from "../FormParts/AilmentFormParts";
import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";
import { disableFuture } from "@/lib/helpers";
import {
  anesthesiaOptions,
  attendantDetailsAtTheTimeOfAdmissionOptions,
  disclosedNotDisclosedOptions,
  firstConsultationOptions,
  firstConsultationReferralSlipOptions,
  genderOptions,
  medicinesOptions,
  occupationOptions,
  otherPolicyWithNBHIOptions,
  paymentMethodOptions,
  policyTypeOptions,
  previousInsurersOptions,
  refundInvoiceOptions,
  rmClassOfAccommodationOptions,
  rmRelationshipOptions,
  treatmentTypeOptions,
  typeOfAnesthesiaOptions,
  yesNoNAOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";

type PropTypes = {
  claimId?: number;
  form: FormInstance<IInsuredVerification>;
};

const InsuredDetailsForm = ({ claimId, form }: PropTypes) => {
  return (
    <Fragment>
      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Date of visit to insured"
            name="dateOfVisitToInsured"
            rules={[{ required: true, message: "Please select" }]}
          >
            <DatePicker disabledDate={disableFuture} className="w-full" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Time of visit to insured"
            name="timeOfVisitToInsured"
            rules={[{ required: true, message: "Please select" }]}
          >
            <TimePicker use12Hours showSecond={false} className="w-full" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Name of patient (System Fetch)"
            name="nameOfPatientSystem"
          >
            <Input disabled placeholder="Name of patient (System Fetch)" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Name of patient (User feed)"
            name="nameOfPatientUser"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Name of patient (User feed)" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Age of patient (System Fetch)"
            name="ageOfPatientSystem"
          >
            <Input disabled placeholder="Age of patient (System Fetch)" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Age of patient (User feed)"
            name="ageOfPatientUser"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Age of patient (User feed)" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Gender of patient (System Fetch)"
            name="genderOfPatientSystem"
          >
            <Select
              disabled
              placeholder="Gender of patient (System Fetch)"
              allowClear
              options={genderOptions}
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Gender of patient (User feed)"
            name="genderOfPatientUser"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Gender of patient (User feed)"
              allowClear
              options={genderOptions}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Mobile Number"
            name="mobileNumber"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Mobile Number" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Occupation of Insured"
            name="occupationOfInsured"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Occupation of Insured"
              allowClear
              options={occupationOptions}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Work place details"
            name="workPlaceDetail"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Work place details" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Any Other Policy with NBHI?"
            name="anyOtherPolicyWithNBHI"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Any Other Policy with NBHI?"
              allowClear
              options={otherPolicyWithNBHIOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.anyOtherPolicyWithNBHI !== curr?.anyOtherPolicyWithNBHI
        }
      >
        {({ getFieldValue }) => {
          return getFieldValue("anyOtherPolicyWithNBHI") === "Yes" ? (
            <Row gutter={10}>
              <Col sm={24}>
                <Form.Item<IInsuredVerification>
                  label="Policy Number"
                  name="policyNo"
                  rules={[{ required: true, message: "Please Fill" }]}
                >
                  <Input placeholder="Policy Number" />
                </Form.Item>
              </Col>
            </Row>
          ) : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Any Previous claim with NBHI"
            name="anyPreviousClaimWithNBHI"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Select
              allowClear
              placeholder="Any Previous claim with NBHI"
              options={yesNoOptions}
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Any Insurance policy other than NBHI?"
            name={["anyInsurancePolicyOtherThanNBHI", "value"]}
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Any Insurance policy other than NBHI?"
              allowClear
              options={yesNoOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.anyInsurancePolicyOtherThanNBHI?.value !==
          curr?.anyInsurancePolicyOtherThanNBHI?.value
        }
      >
        {({ getFieldValue }) => {
          return getFieldValue(["anyInsurancePolicyOtherThanNBHI", "value"]) ===
            "Yes" ? (
            <PolicyOtherThanNBHIFormPart claimId={claimId} form={form} />
          ) : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Coverage Under Any Gov Scheme"
            name="coverageUnderAnyGovSchema"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Select
              allowClear
              placeholder="Coverage Under Any Gov Scheme"
              options={yesNoOptions}
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            noStyle
            shouldUpdate={(prev, curr) =>
              prev?.coverageUnderAnyGovSchema !==
              curr?.coverageUnderAnyGovSchema
            }
          >
            {({ getFieldValue }) => {
              return !!getFieldValue("coverageUnderAnyGovSchema") ? (
                <Form.Item<IInsuredVerification>
                  label="Remarks"
                  name="coverageUnderAnyGovSchemaRemark"
                  rules={[{ required: true, message: "Please Fill" }]}
                >
                  <Input placeholder="Remarks" />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item<IInsuredVerification>
            label="Policy Type"
            name={["policyType", "value"]}
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              allowClear
              placeholder="Policy Type"
              options={policyTypeOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.policyType?.value !== curr?.policyType?.value
        }
      >
        {({ getFieldValue }) => {
          return getFieldValue(["policyType", "value"]) === "Port" ? (
            <Fragment>
              <Row gutter={10}>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Ported From"
                    name={["policyType", "portedFrom"]}
                    rules={[{ required: true, message: "Please select" }]}
                  >
                    <Select
                      placeholder="Ported From"
                      allowClear
                      options={previousInsurersOptions}
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Reason of portability"
                    name={["policyType", "reasonOfPortability"]}
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <Input placeholder="Reason of portability" />
                  </Form.Item>
                </Col>
              </Row>
            </Fragment>
          ) : null;
        }}
      </Form.Item>
      <Row gutter={10}>
        <Col sm={24}>
          <UploadProof
            claimId={claimId}
            form={form}
            fieldName="prevInsurancePolicyCopy"
            label="Previous Insurance Policy Copy"
          />
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Any claim with previous Insurance Company?"
            name="anyClaimWithPrevInsurance"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              allowClear
              placeholder="Any claim with previous Insurance Company?"
              options={yesNoOptions}
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Symptoms with duration insured presented with"
            name="symptomsWithDuration"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Input placeholder="Symptoms with duration insured presented with" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="First Consultation Details"
            name={["firstConsultationDetails", "value"]}
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="First Consultation Details"
              allowClear
              showSearch
              options={firstConsultationOptions}
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            noStyle
            shouldUpdate={(prev, curr) =>
              prev?.firstConsultationDetails?.value !==
              curr?.firstConsultationDetails?.value
            }
          >
            {({ getFieldValue }) => {
              return !!getFieldValue(["firstConsultationDetails", "value"]) ? (
                <Form.Item<IInsuredVerification>
                  label="Remark"
                  name={["firstConsultationDetails", "remark"]}
                  rules={[{ required: true, message: "Please Fill" }]}
                >
                  <Input placeholder="Remark" />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="First Consultation/Referral slip"
            name={["firstConsultationOrReferralSlip", "value"]}
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="First Consultation/Referral slip"
              allowClear
              showSearch
              options={firstConsultationReferralSlipOptions}
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            noStyle
            shouldUpdate={(prev, curr) =>
              prev?.firstConsultationOrReferralSlip?.value !==
              curr?.firstConsultationOrReferralSlip?.value
            }
          >
            {({ getFieldValue }) => {
              return !!getFieldValue([
                "firstConsultationOrReferralSlip",
                "value",
              ]) ? (
                <Form.Item<IInsuredVerification>
                  label="Remark"
                  name={["firstConsultationOrReferralSlip", "remark"]}
                  rules={[{ required: true, message: "Please Fill" }]}
                >
                  <Input placeholder="Remark" />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Name of hospital (System Fetch)"
            name="nameOfHospitalSystem"
          >
            <Input disabled placeholder="Name of hospital (System Fetch)" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Name of hospital (User feed)"
            name="nameOfHospitalUser"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Name of hospital (User feed)" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Date of Admission (System Fetch)"
            name="dateOfAdmissionSystem"
          >
            <DatePicker
              disabled
              disabledDate={disableFuture}
              className="w-full"
              placeholder="Date of Admission (System Fetch)"
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Date of Admission (User feed)"
            name="dateOfAdmissionUser"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <DatePicker
              disabledDate={disableFuture}
              className="w-full"
              placeholder="Date of Admission (User feed)"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Time of Admission"
            name={["timeOfAdmission", "value"]}
          >
            <Select
              placeholder="Time of Admission"
              allowClear
              options={disclosedNotDisclosedOptions}
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            noStyle
            shouldUpdate={(prev, curr) =>
              prev?.timeOfAdmission?.value !== curr?.timeOfAdmission?.value
            }
          >
            {({ getFieldValue }) => {
              return getFieldValue(["timeOfAdmission", "value"]) ===
                "Disclosed" ? (
                <Form.Item<IInsuredVerification>
                  label="At what time Admitted?"
                  name={["timeOfAdmission", "time"]}
                  rules={[{ required: true, message: "Please Select" }]}
                >
                  <TimePicker
                    className="w-full"
                    placeholder="At what time Admitted?"
                    showSecond={false}
                    use12Hours
                  />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Date of Discharge (System Fetch)"
            name="dateOfDischargeSystem"
          >
            <DatePicker
              disabled
              disabledDate={disableFuture}
              className="w-full"
              placeholder="Date of Discharge (System Fetch)"
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Date of Discharge (User feed)"
            name="dateOfDischargeUser"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <DatePicker
              disabledDate={disableFuture}
              className="w-full"
              placeholder="Date of Discharge (User feed)"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Time of Discharge"
            name={["timeOfDischarge", "value"]}
          >
            <Select
              placeholder="Time of Discharge"
              allowClear
              options={disclosedNotDisclosedOptions}
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            noStyle
            shouldUpdate={(prev, curr) =>
              prev?.timeOfDischarge?.value !== curr?.timeOfDischarge?.value
            }
          >
            {({ getFieldValue }) => {
              return getFieldValue(["timeOfDischarge", "value"]) ===
                "Disclosed" ? (
                <Form.Item<IInsuredVerification>
                  label="At what time Discharged?"
                  name={["timeOfDischarge", "time"]}
                  rules={[{ required: true, message: "Please Select" }]}
                >
                  <TimePicker
                    className="w-full"
                    placeholder="At what time Discharged?"
                    showSecond={false}
                    use12Hours
                  />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Name of Doctor attended"
            name="nameOfDoctorAttended"
          >
            <Input placeholder="Name of Doctor attended" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Number of visits of Doctor"
            name="numberOfVisitsOfDoctor"
          >
            <Input placeholder="Number of visits of Doctor" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item<IInsuredVerification>
            label="Treatment Type"
            name="treatmentType"
          >
            <Select
              placeholder="Treatment Type"
              allowClear
              showSearch
              options={treatmentTypeOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.treatmentType !== curr?.treatmentType
        }
      >
        {({ getFieldValue }) => {
          return getFieldValue("treatmentType") === "Surgical" ? (
            <Fragment>
              <Row gutter={10}>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Name of Procedure"
                    name={["surgicalTreatmentType", "nameOfProcedure"]}
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <Input placeholder="Name of Procedure" />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Date of Surgery"
                    name={["surgicalTreatmentType", "dateOfSurgery"]}
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <DatePicker
                      placeholder="Date of Surgery"
                      disabledDate={disableFuture}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Time of Surgery"
                    name={["surgicalTreatmentType", "timeOfSurgery"]}
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <TimePicker
                      placeholder="Time of Surgery"
                      use12Hours
                      showSecond={false}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Anesthesia Given?"
                    name={["surgicalTreatmentType", "anesthesiaGiven"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Anesthesia Given?"
                      options={anesthesiaOptions}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item<IInsuredVerification>
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev?.surgicalTreatmentType?.anesthesiaGiven !==
                  curr?.surgicalTreatmentType?.anesthesiaGiven
                }
              >
                {({ getFieldValue }) => {
                  return getFieldValue([
                    "surgicalTreatmentType",
                    "anesthesiaGiven",
                  ]) === "Yes" ? (
                    <Row gutter={10}>
                      <Col md={12} sm={24}>
                        <Form.Item<IInsuredVerification>
                          label="Type of Anesthesia"
                          name={["surgicalTreatmentType", "typeOfAnesthesia"]}
                          rules={[{ required: true, message: "Please Select" }]}
                        >
                          <Select
                            placeholder="Type of Anesthesia"
                            options={typeOfAnesthesiaOptions}
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : null;
                }}
              </Form.Item>

              <Row gutter={10}>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Name of surgeon"
                    name={["surgicalTreatmentType", "nameOfSurgeon"]}
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <Input placeholder="Name of surgeon" />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Name of Anesthetist"
                    name={["surgicalTreatmentType", "nameOfAnesthetist"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Input placeholder="Name of Anesthetist" />
                  </Form.Item>
                </Col>
              </Row>
            </Fragment>
          ) : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item<IInsuredVerification>
            label="Class of accommodation"
            name="classOfAccommodation"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              mode="multiple"
              allowClear
              showSearch
              options={rmClassOfAccommodationOptions}
              placeholder="Class of accommodation"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.classOfAccommodation?.length !==
          curr?.classOfAccommodation?.length
        }
      >
        {({ getFieldValue, setFieldValue }) => {
          const classOfAccommodation = getFieldValue(
            "classOfAccommodation"
          ) as string[];
          return !!classOfAccommodation && classOfAccommodation?.length > 0
            ? classOfAccommodation?.map((el, ind) => {
                setFieldValue(["classOfAccommodationDetails", ind, "name"], el);
                return (
                  <Fragment key={ind}>
                    {el === "Other" ? (
                      <Row gutter={10}>
                        <Col sm={24}>
                          <Form.Item<IInsuredVerification>
                            label="Specify other"
                            name={[
                              "classOfAccommodationDetails",
                              ind,
                              "othersSpecify",
                            ]}
                            rules={[{ required: true, message: "Please Fill" }]}
                          >
                            <Input placeholder="Specify other" />
                          </Form.Item>
                        </Col>
                      </Row>
                    ) : (
                      <Row gutter={10}>
                        <Col md={12} sm={24}>
                          <Form.Item<IInsuredVerification>
                            label={`From Date in ${el}`}
                            name={[
                              "classOfAccommodationDetails",
                              ind,
                              "fromDate",
                            ]}
                            rules={[
                              { required: true, message: "Please Select" },
                            ]}
                          >
                            <DatePicker
                              placeholder={`From Date in ${el}`}
                              disabledDate={disableFuture}
                              className="w-full"
                            />
                          </Form.Item>
                        </Col>
                        <Col md={12} sm={24}>
                          <Form.Item<IInsuredVerification>
                            label={`To Date in ${el}`}
                            name={[
                              "classOfAccommodationDetails",
                              ind,
                              "toDate",
                            ]}
                            rules={[
                              { required: true, message: "Please Select" },
                            ]}
                          >
                            <DatePicker
                              placeholder={`To Date in ${el}`}
                              disabledDate={disableFuture}
                              className="w-full"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}
                  </Fragment>
                );
              })
            : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item<IInsuredVerification>
            label="Attendant details at the time of Admission"
            name="attendantDetailsAtTheTimeOfAdmission"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Attendant details at the time of Admission"
              allowClear
              options={attendantDetailsAtTheTimeOfAdmissionOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.attendantDetailsAtTheTimeOfAdmission !==
          curr?.attendantDetailsAtTheTimeOfAdmission
        }
      >
        {({ getFieldValue }) => {
          const value = getFieldValue("attendantDetailsAtTheTimeOfAdmission");
          return value === "Shared" ? (
            <Fragment>
              <Row gutter={10}>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Name of attendant"
                    name={["attendantDetails", "name"]}
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <Input placeholder="Name of attendant" />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Gender"
                    name={["attendantDetails", "gender"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Gender"
                      options={genderOptions}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Relationship"
                    name={["attendantDetails", "relationship"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Relationship"
                      allowClear
                      options={rmRelationshipOptions}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Mobile Number"
                    name={["attendantDetails", "mobileNo"]}
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <Input placeholder="Mobile Number" />
                  </Form.Item>
                </Col>
              </Row>
            </Fragment>
          ) : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item<IInsuredVerification>
            label="Medicine"
            name="medicines"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Medicine"
              allowClear
              options={medicinesOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) => prev?.medicines !== curr?.medicines}
      >
        {({ getFieldValue }) => {
          const value = getFieldValue("medicines");
          return !!value ? (
            <Fragment>
              {value === "Outsourced" ? (
                <Fragment>
                  <Row gutter={10}>
                    <Col md={12} sm={24}>
                      <Form.Item<IInsuredVerification>
                        label="Cost of Medicine Bills"
                        name={["medicinesDetail", "costOfMedicineBill"]}
                        rules={[
                          { required: true, message: "Please Fill" },
                          {
                            pattern: new RegExp(/^[0-9]+$/),
                            warningOnly: true,
                            message: "Only numbers allowed",
                          },
                        ]}
                      >
                        <Input placeholder="Cost of Medicine Bills" />
                      </Form.Item>
                    </Col>
                    <Col md={12} sm={24}>
                      <Form.Item<IInsuredVerification>
                        label="Payment Mode"
                        name={["medicinesDetail", "paymentMode"]}
                        rules={[{ required: true, message: "Please Select" }]}
                      >
                        <Select
                          placeholder="Payment Mode"
                          options={paymentMethodOptions}
                          allowClear
                          showSearch
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col sm={24}>
                      <Form.Item<IInsuredVerification>
                        label="Remark"
                        name={["medicinesDetail", "remark"]}
                        rules={[{ required: true, message: "Please Fill" }]}
                      >
                        <Input placeholder="Remark" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Fragment>
              ) : null}
              <Row gutter={10}>
                <Col sm={24}>
                  <Form.Item<IInsuredVerification>
                    label="Medicine Returned?"
                    name={["medicinesDetail", "medicinesReturned"]}
                    rules={[{ required: true, message: "Please Select" }]}
                  >
                    <Select
                      placeholder="Medicine Returned?"
                      options={yesNoOptions}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item<IInsuredVerification>
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev?.medicinesDetail?.medicinesReturned !==
                  curr?.medicinesDetail?.medicinesReturned
                }
              >
                {({ getFieldValue }) => {
                  const value = getFieldValue([
                    "medicinesDetail",
                    "medicinesReturned",
                  ]);
                  return value === "Yes" ? (
                    <Row gutter={10}>
                      <Col md={12} sm={24}>
                        <Form.Item<IInsuredVerification>
                          label="Amount Refunded"
                          name={["medicinesDetail", "amountRefunded"]}
                          rules={[
                            { required: true, message: "Please Fill" },
                            {
                              pattern: new RegExp(/^[0-9]+$/),
                              warningOnly: true,
                              message: "Only numbers allowed",
                            },
                          ]}
                        >
                          <Input placeholder="Amount Refunded" />
                        </Form.Item>
                      </Col>
                      <Col md={12} sm={24}>
                        <Form.Item<IInsuredVerification>
                          label="Refund Invoice"
                          name={["medicinesDetail", "refundInvoice"]}
                          rules={[{ required: true, message: "Please Select" }]}
                        >
                          <Select
                            placeholder="Refund Invoice"
                            allowClear
                            showSearch
                            options={refundInvoiceOptions}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : null;
                }}
              </Form.Item>
            </Fragment>
          ) : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item<IInsuredVerification>
            label="Amount Paid to Hospital"
            name={["amountPaidToHospital", "value"]}
            rules={[
              { required: true, message: "Please Fill" },
              {
                pattern: new RegExp(/^[0-9]+$/),
                warningOnly: true,
                message: "Only numbers allowed",
              },
            ]}
          >
            <Input placeholder="Amount Paid to Hospital" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.amountPaidToHospital?.value !==
          curr?.amountPaidToHospital?.value
        }
      >
        {({ getFieldValue }) => {
          const value = getFieldValue(["amountPaidToHospital", "value"]);
          return !!value ? (
            <Row gutter={10}>
              <Col md={12} sm={24}>
                <Form.Item<IInsuredVerification>
                  label="Payment Mode"
                  name={["amountPaidToHospital", "paymentMode"]}
                  rules={[{ required: true, message: "Please Select" }]}
                >
                  <Select
                    placeholder="Payment Mode"
                    options={paymentMethodOptions}
                    allowClear
                    showSearch
                  />
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item<IInsuredVerification>
                  label="Remark"
                  name={["amountPaidToHospital", "remark"]}
                  rules={[{ required: true, message: "Please Fill" }]}
                >
                  <Input placeholder="Remark" />
                </Form.Item>
              </Col>
            </Row>
          ) : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Amount Paid for Diagnostic Tests"
            name={["amountPaidForDiagnosticTests", "value"]}
            rules={[
              { required: true, message: "Please Fill" },
              {
                pattern: new RegExp(/^[0-9]+$/),
                warningOnly: true,
                message: "Only numbers allowed",
              },
            ]}
          >
            <Input placeholder="Amount Paid for Diagnostic Tests" />
          </Form.Item>
        </Col>
        <Form.Item<IInsuredVerification>
          noStyle
          shouldUpdate={(prev, curr) =>
            prev?.amountPaidForDiagnosticTests?.value !==
            curr?.amountPaidForDiagnosticTests?.value
          }
        >
          {({ getFieldValue }) => {
            const value = getFieldValue([
              "amountPaidForDiagnosticTests",
              "value",
            ]);
            return !!value ? (
              <Col md={12} sm={24}>
                <Form.Item<IInsuredVerification>
                  label="Payment Mode"
                  name={["amountPaidForDiagnosticTests", "paymentMode"]}
                  rules={[{ required: true, message: "Please Select" }]}
                >
                  <Select
                    placeholder="Payment Mode"
                    options={paymentMethodOptions}
                    allowClear
                    showSearch
                  />
                </Form.Item>
              </Col>
            ) : null;
          }}
        </Form.Item>
      </Row>

      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item<IInsuredVerification>
            label="Any other amount paid?"
            name={["anyOtherAmountPaid", "value"]}
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Select
              placeholder="Any other amount paid?"
              options={yesNoNAOptions}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.anyOtherAmountPaid?.value !== curr?.anyOtherAmountPaid?.value
        }
      >
        {({ getFieldValue }) => {
          const value = getFieldValue(["anyOtherAmountPaid", "value"]);
          return value === "Yes" ? (
            <Row gutter={10}>
              <Col md={12} sm={24}>
                <Form.Item<IInsuredVerification>
                  label="Amount Paid"
                  name={["anyOtherAmountPaid", "amount"]}
                  rules={[
                    { required: true, message: "Please Fill" },
                    {
                      pattern: new RegExp(/^[0-9]+$/),
                      warningOnly: true,
                      message: "Only numbers allowed",
                    },
                  ]}
                >
                  <Input placeholder="Amount Paid" />
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item<IInsuredVerification>
                  label="Payment Mode"
                  name={["anyOtherAmountPaid", "paymentMode"]}
                  rules={[{ required: true, message: "Please Select" }]}
                >
                  <Select
                    placeholder="Payment Mode"
                    options={paymentMethodOptions}
                    allowClear
                    showSearch
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Total Amount Paid"
            name="totalAmountPaid"
          >
            <Input disabled placeholder="Total amount paid" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Remarks"
            name="remarks"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Remarks" />
          </Form.Item>
        </Col>
      </Row>

      <PatientHabitFormParts origin="insured" form={form} />

      <Row gutter={10}>
        <Col sm={24}>
          <Form.Item<IInsuredVerification>
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

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.pedOrNonDisclosure?.value !== curr?.pedOrNonDisclosure?.value
        }
      >
        {({ getFieldValue }) => {
          const value = getFieldValue(["pedOrNonDisclosure", "value"]);
          return value === "Yes" ? (
            <AilmentFormParts origin="insured" form={form} />
          ) : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Claim NEFT details verified"
            name="claimNEFTDetail"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              options={otherPolicyWithNBHIOptions}
              allowClear
              showSearch
              placeholder="Claimed NEFT details verified"
            />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Insured/Attendant Co-operation"
            name="insuredOrAttendantCooperation"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              options={yesNoOptions}
              allowClear
              showSearch
              placeholder="Insured/Attendant Co-operation"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<IInsuredVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.insuredOrAttendantCooperation !==
          curr?.insuredOrAttendantCooperation
        }
      >
        {({ getFieldValue }) => {
          const value = getFieldValue("insuredOrAttendantCooperation");
          return value === "No" ? (
            <Row gutter={10}>
              <Col sm={24}>
                <Form.Item<IInsuredVerification>
                  label="Reason for insured not co-operating"
                  name="reasonForInsuredNotCooperating"
                  rules={[{ required: true, message: "Please Fill" }]}
                >
                  <Input placeholder="Reason for insured not co-operating" />
                </Form.Item>
              </Col>
            </Row>
          ) : null;
        }}
      </Form.Item>
      <Row gutter={10}>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
            label="Verification Summary"
            name="verificationSummary"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input.TextArea placeholder="Verification Summary" />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item<IInsuredVerification>
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

export default InsuredDetailsForm;
