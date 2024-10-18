import {
  billVerificationResultOptions,
  discrepancyStatusOptions,
  labBillVerificationResultOptions,
  scanResultOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";
import { ILab, IPharmacy } from "@/lib/utils/types/rmDataTypes";
import {
  ActionIcon,
  Grid,
  MultiSelect,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import React, { Fragment } from "react";
import { IoClose } from "react-icons/io5";

type PropTypes = {
  index: number;
  listName: "pharmacies" | "labs";
  el: IPharmacy | ILab;
  onChange: (name: keyof IPharmacy, index: number, value: any) => void;
  onBlur: () => void;
  remove: (ind: number) => void;
};
const PrePostDynamicFormParts = ({
  index,
  listName,
  el,
  onChange,
  onBlur,
  remove,
}: PropTypes) => {
  return (
    <Grid className="w-full relative pt-8 border-b pb-2">
      <div className="absolute right-4 top-4">
        <ActionIcon onClick={() => remove(index)}>
          <IoClose />
        </ActionIcon>
      </div>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label={`Name of ${listName === "labs" ? "Lab" : "Pharmacy"}`}
          placeholder={`Name of ${listName === "labs" ? "Lab" : "Pharmacy"}`}
          withAsterisk
          required
          value={el?.name || ""}
          onChange={(e) => onChange("name", index, e.target.value)}
          onBlur={onBlur}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Address"
          placeholder="Address"
          withAsterisk
          required
          value={el?.address || ""}
          onChange={(e) => onChange("address", index, e.target.value)}
          onBlur={onBlur}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="City"
          placeholder="City"
          withAsterisk
          required
          value={el?.city || ""}
          onChange={(e) => onChange("city", index, e.target.value)}
          onBlur={onBlur}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="QR Code Available On Bill?"
          placeholder="QR Code Available On Bill?"
          withAsterisk
          required
          clearable
          searchable
          data={yesNoOptions}
          value={el?.qrCodeAvailableOnBill || ""}
          onChange={(val) => onChange("qrCodeAvailableOnBill", index, val)}
          onBlur={onBlur}
        />
      </Grid.Col>
      {el?.qrCodeAvailableOnBill === "Yes" && (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Scan Result"
            placeholder="Scan Result"
            withAsterisk
            required
            clearable
            searchable
            data={scanResultOptions}
            value={el?.codeScanResult || ""}
            onChange={(val) => onChange("codeScanResult", index, val)}
            onBlur={onBlur}
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label={`${
            listName === "labs" ? "Bills and Reports" : "Bills"
          } Verified`}
          placeholder={`${
            listName === "labs" ? "Bills and Reports" : "Bills"
          } Verified`}
          withAsterisk
          required
          clearable
          searchable
          data={yesNoOptions}
          value={el?.billsVerified || ""}
          onChange={(val) => onChange("billsVerified", index, val)}
          onBlur={onBlur}
        />
      </Grid.Col>
      {el?.billsVerified === "No" ? (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Reason for bills not verified"
            placeholder="Reason for bills not verified"
            withAsterisk
            required
            value={el?.reasonOfBillsNotVerified || ""}
            onChange={(e) =>
              onChange("reasonOfBillsNotVerified", index, e.target.value)
            }
            onBlur={onBlur}
          />
        </Grid.Col>
      ) : el?.billsVerified === "Yes" ? (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Discrepancy Status"
              placeholder="Discrepancy Status"
              withAsterisk
              required
              clearable
              searchable
              data={discrepancyStatusOptions}
              value={el?.discrepancyStatus || ""}
              onChange={(val) => onChange("discrepancyStatus", index, val)}
              onBlur={onBlur}
            />
          </Grid.Col>
          {el?.discrepancyStatus === "Discrepant" &&
            el?.codeScanResult === "Scan- discrepant bill" && (
              <Fragment>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  {listName === "labs" ? (
                    <MultiSelect
                      label="Bill Verification Result"
                      placeholder="Bill Verification Result"
                      withAsterisk
                      required
                      clearable
                      searchable
                      data={labBillVerificationResultOptions}
                      value={(el?.billVerificationResult as string[]) || []}
                      onChange={(val) =>
                        onChange("billVerificationResult", index, val)
                      }
                      onBlur={onBlur}
                    />
                  ) : (
                    <Select
                      label="Bill Verification Result"
                      placeholder="Bill Verification Result"
                      withAsterisk
                      required
                      clearable
                      searchable
                      data={billVerificationResultOptions}
                      value={(el?.billVerificationResult as string) || ""}
                      onChange={(val) =>
                        onChange("billVerificationResult", index, val)
                      }
                      onBlur={onBlur}
                    />
                  )}
                </Grid.Col>
                {(typeof el?.billVerificationResult === "string" &&
                  el?.billVerificationResult === "Others") ||
                (Array.isArray(el?.billVerificationResult) &&
                  el?.billVerificationResult?.includes("Others")) ? (
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Remark"
                      placeholder="Remark"
                      withAsterisk
                      required
                      value={el?.billVerificationResultRemark || ""}
                      onChange={(e) =>
                        onChange(
                          "billVerificationResultRemark",
                          index,
                          e.target.value
                        )
                      }
                      onBlur={onBlur}
                    />
                  </Grid.Col>
                ) : null}
                {!!el?.billVerificationResult && (
                  <Fragment>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Textarea
                        label="Brief Summary of Discrepancy"
                        placeholder="Brief Summary of Discrepancy"
                        resize="vertical"
                        required
                        withAsterisk
                        value={el?.briefSummaryOfDiscrepancy}
                        onChange={(e) =>
                          onChange(
                            "briefSummaryOfDiscrepancy",
                            index,
                            e.target.value
                          )
                        }
                        onBlur={onBlur}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Textarea
                        label="Observation"
                        placeholder="Observation"
                        resize="vertical"
                        required
                        withAsterisk
                        value={el?.observation}
                        onChange={(e) =>
                          onChange("observation", index, e.target.value)
                        }
                        onBlur={onBlur}
                      />
                    </Grid.Col>
                  </Fragment>
                )}
              </Fragment>
            )}
        </Fragment>
      ) : null}
    </Grid>
  );
};

export default PrePostDynamicFormParts;
