import React from "react";
import { MinusCircleOutlined } from "@ant-design/icons";
import { Form, Input, Select } from "antd";
import {
  billVerificationResultOptions,
  discrepancyStatusOptions,
  labBillVerificationResultOptions,
  scanResultOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";

type PropTypes = {
  restField: {
    isListField?: boolean;
    fieldKey?: number;
  };
  name: number;
  listName: "pharmacies" | "labs";
  remove: (index: number | number[]) => void;
};
const PrePostDynamicFormParts = ({
  restField,
  name,
  listName,
  remove,
}: PropTypes) => {
  return (
    <div className="flex items-center gap-x-2 flex-wrap">
      <Form.Item
        {...restField}
        label={`Name of ${listName === "labs" ? "Lab" : "Pharmacy"}`}
        name={[name, "name"]}
        rules={[{ required: true, message: "Please Fill" }]}
        rootClassName="w-full md:w-[49%]"
      >
        <Input
          placeholder={`Name of ${listName === "labs" ? "Lab" : "Pharmacy"}`}
        />
      </Form.Item>
      <Form.Item
        {...restField}
        label="Address"
        name={[name, "address"]}
        rules={[{ required: true, message: "Please Fill" }]}
        rootClassName="w-full md:w-[49%]"
      >
        <Input placeholder="Address" />
      </Form.Item>
      <Form.Item
        {...restField}
        label="City"
        name={[name, "city"]}
        rules={[{ required: true, message: "Please Fill" }]}
        rootClassName="w-full md:w-[49%]"
      >
        <Input placeholder="City" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        {...restField}
        label="QR Code Available On Bill?"
        name={[name, "qrCodeAvailableOnBill"]}
        rules={[{ required: true, message: "Please Select" }]}
        rootClassName="w-full md:w-[49%]"
      >
        <Select
          options={yesNoOptions}
          allowClear
          placeholder="Is QC Code available on bill?"
        />
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev[listName][name]?.qrCodeAvailableOnBill !==
          curr[listName][name]?.qrCodeAvailableOnBill
        }
      >
        {({ getFieldValue }) =>
          getFieldValue([listName, name, "qrCodeAvailableOnBill"]) === "Yes" ? (
            <Form.Item
              {...restField}
              label="Scan Result"
              name={[name, "codeScanResult"]}
              rules={[{ required: true, message: "Please Select" }]}
              rootClassName="w-full md:w-[49%]"
            >
              <Select
                options={scanResultOptions}
                allowClear
                placeholder="Select scan Result"
              />
            </Form.Item>
          ) : null
        }
      </Form.Item>
      <Form.Item
        {...restField}
        label={`${
          listName === "labs" ? "Bills and Reports" : "Bills"
        } Verified`}
        name={[name, "billsVerified"]}
        rules={[{ required: true, message: "Please Select" }]}
        rootClassName="w-full md:w-[49%]"
      >
        <Select
          options={yesNoOptions}
          allowClear
          placeholder={`${
            listName === "labs" ? "Bills and Reports" : "Bills"
          } Verified`}
        />
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev[listName][name]?.billsVerified !==
          curr[listName][name]?.billsVerified
        }
      >
        {({ getFieldValue }) =>
          getFieldValue([listName, name, "billsVerified"]) === "No" ? (
            <Form.Item
              {...restField}
              label="Reason for bill not verified"
              name={[name, "reasonOfBillsNotVerified"]}
              rules={[{ required: true, message: "Please Fill" }]}
              rootClassName="w-full md:w-[49%]"
            >
              <Input placeholder="Reason for bill not verified" />
            </Form.Item>
          ) : null
        }
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev[listName][name]?.billsVerified !==
          curr[listName][name]?.billsVerified
        }
      >
        {({ getFieldValue }) =>
          getFieldValue([listName, name, "billsVerified"]) === "Yes" ? (
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
                    curr[listName][name]?.discrepancyStatus ||
                  prev[listName][name]?.codeScanResult !==
                    curr[listName][name]?.codeScanResult
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue([listName, name, "discrepancyStatus"]) ===
                    "Discrepant" &&
                  getFieldValue([listName, name, "codeScanResult"]) ===
                    "Scan- discrepant bill" ? (
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
                          mode={listName === "labs" ? "tags" : undefined}
                          options={
                            listName === "labs"
                              ? labBillVerificationResultOptions
                              : billVerificationResultOptions
                          }
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
                          ]) === "Others" ||
                          (listName === "labs" &&
                            getFieldValue([
                              listName,
                              name,
                              "billVerificationResult",
                            ])?.includes("Others")) ? (
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

      {listName === "labs" ? (
        <Form.Item
          {...restField}
          label="Final Observation"
          name={[name, "finalObservation"]}
          rules={[
            {
              required: true,
              message: "Please Fill",
            },
          ]}
          rootClassName="w-full md:w-[49%]"
        >
          <Input.TextArea placeholder="Final Observation" />
        </Form.Item>
      ) : null}

      <MinusCircleOutlined onClick={() => remove(name)} className="mt-2" />
    </div>
  );
};

export default PrePostDynamicFormParts;
