import React, { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import FormContainer from "./CommonForm/FormContainer";
import { Col, Form, Input, Row, Select } from "antd";
import { toast } from "react-toastify";
import { IEmploymentAndEstablishmentVerification } from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import {
  empRelationshipOptions,
  establishmentStatusOptions,
  establishmentTypeOptions,
  establishmentVerificationOptions,
  icpsCollectedOptions,
  refundInvoiceOptions,
} from "@/lib/utils/constants/options";

const taskName = "Employment & Establishment Verification";

const initialFormValues: IEmploymentAndEstablishmentVerification = {
  nameOfEstablishment: "",
  address: "",
  city: "",
  state: "",
  establishmentVerification: {
    value: "",
    status: {
      value: "",
      address: "",
      city: "",
      state: "",
      typeOfEstablishments: "",
    },
  },
  employeeAndEmployerRelationship: "",
  employeeIdCard: "",
  listOfEmpMatchWithMembersEnrolled: "",
  listOfWorkingEmployees: "",
  natureOfWork: "",
  salaryProof: "",
  totalNoOfEmployeesWorking: 0,
  investigationSummary: "",
  discrepanciesObserved: "",
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const EmploymentAndEstablishmentVerification = ({
  caseDetail,
  setCaseDetail,
}: PropTypes) => {
  const [form] = Form.useForm<IEmploymentAndEstablishmentVerification>();

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
      Object.entries(obj).map(([key, value]) => {
        form.setFieldValue(key, value);
      });
    }
  }, [caseDetail?.rmFindingsPostQA, form]);

  return (
    <FormContainer<IEmploymentAndEstablishmentVerification>
      form={form}
      handleSave={(payload) =>
        submit({ payload, id: caseDetail?._id, name: taskName })
      }
      submitting={loading}
      values={initialFormValues}
      formName={taskName}
    >
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="nameOfEstablishment"
            label="Name of Establishment"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Name of Establishment" />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="city"
            label="City"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="City" />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="state"
            label="State"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="State" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name={["establishmentVerification", "value"]}
            label="Establishment Verification"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Select
              placeholder="Establishment Verification"
              allowClear
              options={establishmentVerificationOptions}
            />
          </Form.Item>
        </Col>
        <Form.Item<IEmploymentAndEstablishmentVerification>
          noStyle
          shouldUpdate={(prev, curr) =>
            prev?.establishmentVerification?.value !==
            curr?.establishmentVerification?.value
          }
        >
          {({ getFieldValue }) => {
            const value = getFieldValue(["establishmentVerification", "value"]);
            return value === "Does Not Exist on the address as per contract" ? (
              <Col md={12} xs={24}>
                <Form.Item<IEmploymentAndEstablishmentVerification>
                  name={["establishmentVerification", "status", "value"]}
                  label="Status"
                  rules={[{ required: true, message: "Please Select" }]}
                >
                  <Select
                    placeholder="Status"
                    allowClear
                    options={establishmentStatusOptions}
                  />
                </Form.Item>
              </Col>
            ) : null;
          }}
        </Form.Item>
      </Row>
      <Form.Item<IEmploymentAndEstablishmentVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.establishmentVerification?.status?.value !==
          curr?.establishmentVerification?.status?.value
        }
      >
        {({ getFieldValue }) => {
          const value = getFieldValue([
            "establishmentVerification",
            "status",
            "value",
          ]);
          return value === "Exists on another address" ? (
            <Fragment>
              <Row gutter={10}>
                <Col md={12} xs={24}>
                  <Form.Item<IEmploymentAndEstablishmentVerification>
                    name={["establishmentVerification", "status", "address"]}
                    label="Address"
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <Input placeholder="Address" />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item<IEmploymentAndEstablishmentVerification>
                    name={["establishmentVerification", "status", "city"]}
                    label="City"
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <Input placeholder="City" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col xs={24}>
                  <Form.Item<IEmploymentAndEstablishmentVerification>
                    name={["establishmentVerification", "status", "state"]}
                    label="State"
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <Input placeholder="State" />
                  </Form.Item>
                </Col>
              </Row>
            </Fragment>
          ) : null;
        }}
      </Form.Item>

      <Form.Item<IEmploymentAndEstablishmentVerification>
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.establishmentVerification?.status?.value !==
            curr?.establishmentVerification?.status?.value ||
          prev?.establishmentVerification?.value !==
            curr?.establishmentVerification?.value
        }
      >
        {({ getFieldValue }) => {
          const estVal = getFieldValue(["establishmentVerification", "value"]);
          const statusVal = getFieldValue([
            "establishmentVerification",
            "status",
            "value",
          ]);
          return estVal === "Exist on the address as per contract" ||
            statusVal === "Exists on another address" ? (
            <Row gutter={10}>
              <Col xs={24}>
                <Form.Item<IEmploymentAndEstablishmentVerification>
                  name={[
                    "establishmentVerification",
                    "status",
                    "typeOfEstablishments",
                  ]}
                  label="Type of Establishment"
                  rules={[{ required: true, message: "Please Select" }]}
                >
                  <Select
                    placeholder="Type of Establishment"
                    allowClear
                    options={establishmentTypeOptions}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : null;
        }}
      </Form.Item>

      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="natureOfWork"
            label="Nature of work"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input placeholder="Nature of work" />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="totalNoOfEmployeesWorking"
            label="Total Number of Employees working"
            rules={[
              { required: true, message: "Please Fill" },
              { pattern: /\d/, message: "Only number are allowed" },
            ]}
          >
            <Input placeholder="Total Number of Employees working" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="listOfWorkingEmployees"
            label="List of working employees"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Select
              placeholder="List of working employees"
              allowClear
              showSearch
              options={refundInvoiceOptions.filter(
                (el) => el?.value !== "Not available with insured"
              )}
            />
          </Form.Item>
        </Col>

        <Form.Item<IEmploymentAndEstablishmentVerification>
          noStyle
          shouldUpdate={(prev, curr) =>
            prev?.listOfWorkingEmployees !== curr?.listOfWorkingEmployees
          }
        >
          {({ getFieldValue }) => {
            const value = getFieldValue("listOfWorkingEmployees");
            return value === "Collected" ? (
              <Col md={12} xs={24}>
                <Form.Item<IEmploymentAndEstablishmentVerification>
                  name="listOfEmpMatchWithMembersEnrolled"
                  label="Whether list of working employee matches with members enrolled"
                  rules={[{ required: true, message: "Please Fill" }]}
                >
                  <Input placeholder="Whether list of working employee matches with members enrolled" />
                </Form.Item>
              </Col>
            ) : null;
          }}
        </Form.Item>
      </Row>

      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="employeeAndEmployerRelationship"
            label="Employee-Employer relationship"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Employee-Employer relationship"
              allowClear
              showSearch
              options={empRelationshipOptions}
            />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="employeeIdCard"
            label="Employee ID Card"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Employee ID Card"
              allowClear
              showSearch
              options={icpsCollectedOptions.filter(
                (el) => el?.value !== "No Records"
              )}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="salaryProof"
            label="Salary Proof"
            rules={[{ required: true, message: "Please Select" }]}
          >
            <Select
              placeholder="Salary Proof"
              allowClear
              showSearch
              options={refundInvoiceOptions.filter(
                (el) => el?.value !== "Not available with insured"
              )}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="investigationSummary"
            label="Investigation Summary"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input.TextArea placeholder="Investigation Summary" />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item<IEmploymentAndEstablishmentVerification>
            name="discrepanciesObserved"
            label="Discrepancies Observed"
            rules={[{ required: true, message: "Please Fill" }]}
          >
            <Input.TextArea placeholder="Discrepancies Observed" />
          </Form.Item>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default EmploymentAndEstablishmentVerification;
