import React from "react";
import { Form, Input, Select } from "antd";
import {
  discrepancyStatusOptions,
  labBillVerificationResultOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";

type PropTypes = {
  restField: {
    isListField?: boolean;
    fieldKey?: number;
  };
  name: number;
  listName: "otherBills";
  remove: (index: number | number[]) => void;
};

const PrePostOtherBillsDynamicFormParts = ({
  restField,
  name,
  listName,
  remove,
}: PropTypes) => {
  return (
    <div className="flex items-center gap-x-2 flex-wrap">
      <Form.Item
        {...restField}
        label={`Name of Entity`}
        name={[name, "nameOfEntity"]}
        rules={[{ required: true, message: "Please Fill" }]}
        rootClassName="w-full md:w-[49%]"
      >
        <Input placeholder={`Name of Entity`} />
      </Form.Item>
      <Form.Item
        {...restField}
        label={`Type of Entity`}
        name={[name, "typeOfEntity"]}
        rules={[{ required: true, message: "Please Fill" }]}
        rootClassName="w-full md:w-[49%]"
      >
        <Input placeholder={`Type of Entity`} />
      </Form.Item>
      <Form.Item
        {...restField}
        label={`Address`}
        name={[name, "address"]}
        rules={[{ required: true, message: "Please Fill" }]}
        rootClassName="w-full md:w-[49%]"
      >
        <Input placeholder={`Address`} />
      </Form.Item>
      <Form.Item
        {...restField}
        label={`City`}
        name={[name, "city"]}
        rules={[{ required: true, message: "Please Fill" }]}
        rootClassName="w-full md:w-[49%]"
      >
        <Input placeholder={`City`} />
      </Form.Item>
      <Form.Item
        {...restField}
        label={`Bill & Reports Verified?`}
        name={[name, "billsAndReportsVerified"]}
        rules={[{ required: true, message: "Please Select" }]}
        rootClassName="w-full md:w-[49%]"
      >
        <Select
          placeholder={`Bill & Reports Verified?`}
          allowClear
          options={yesNoOptions}
        />
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev[listName][name]?.billsAndReportsVerified !==
          curr[listName][name]?.billsAndReportsVerified
        }
      >
        {({ getFieldValue }) =>
          getFieldValue(["otherBills", name, "billsAndReportsVerified"]) ===
          "No" ? (
            <Form.Item
              {...restField}
              label="Reason why bills not verified"
              name={[name, "codeScanResult"]}
              rules={[{ required: true, message: "Please Fill" }]}
              rootClassName="w-full md:w-[49%]"
            >
              <Input placeholder="Select Reason why bills not verified" />
            </Form.Item>
          ) : getFieldValue(["otherBills", name, "billsAndReportsVerified"]) ===
            "Yes" ? (
            <>
              <Form.Item
                {...restField}
                label="Discrepancy Status"
                name={[name, "discrepancyStatus"]}
                rules={[{ required: true, message: "Please Select" }]}
                rootClassName="w-full md:w-[49%]"
              >
                <Select
                  options={discrepancyStatusOptions}
                  allowClear
                  placeholder="Select Discrepancy Status"
                />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev[listName][name]?.discrepancyStatus !==
                  curr[listName][name]?.discrepancyStatus
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue([listName, name, "discrepancyStatus"]) ===
                  "Discrepant" ? (
                    <>
                      <Form.Item
                        {...restField}
                        label="Bill Verification Result"
                        name={[name, "billVerificationResult"]}
                        rules={[
                          {
                            required: true,
                            message: "Please Select",
                          },
                        ]}
                        rootClassName="w-full md:w-[49%]"
                      >
                        <Select
                          mode="tags"
                          options={labBillVerificationResultOptions}
                          allowClear
                          placeholder="Select Bill Verification Result"
                        />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prev, curr) =>
                          prev[listName][name]?.billVerificationResult !==
                          curr[listName][name]?.billVerificationResult
                        }
                      >
                        {({ getFieldValue }) =>
                          getFieldValue([
                            listName,
                            name,
                            "billVerificationResult",
                          ])?.includes("Others") ? (
                            <Form.Item
                              {...restField}
                              label="Remark"
                              name={[name, "billVerificationResultRemark"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please Fill",
                                },
                              ]}
                              rootClassName="w-full md:w-[49%]"
                            >
                              <Input placeholder="Remark" />
                            </Form.Item>
                          ) : null
                        }
                      </Form.Item>

                      <Form.Item
                        noStyle
                        shouldUpdate={(prev, curr) =>
                          prev[listName][name]?.billVerificationResult !==
                          curr[listName][name]?.billVerificationResult
                        }
                      >
                        {({ getFieldValue }) =>
                          !!getFieldValue([
                            listName,
                            name,
                            "billVerificationResult",
                          ]) ? (
                            <>
                              <Form.Item
                                {...restField}
                                label="Brief Summary of Discrepancy"
                                name={[name, "briefSummaryOfDiscrepancy"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Fill",
                                  },
                                ]}
                                rootClassName="w-full md:w-[49%]"
                              >
                                <Input.TextArea placeholder="Brief Summary of Discrepancy" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                label="Observation"
                                name={[name, "observation"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Fill",
                                  },
                                ]}
                                rootClassName="w-full md:w-[49%]"
                              >
                                <Input.TextArea placeholder="Observation" />
                              </Form.Item>
                            </>
                          ) : null
                        }
                      </Form.Item>
                    </>
                  ) : null
                }
              </Form.Item>
            </>
          ) : null
        }
      </Form.Item>
    </div>
  );
};

export default PrePostOtherBillsDynamicFormParts;
