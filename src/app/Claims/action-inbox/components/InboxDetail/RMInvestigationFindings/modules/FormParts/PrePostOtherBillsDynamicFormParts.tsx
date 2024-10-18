import React, { Fragment } from "react";
import {
  discrepancyStatusOptions,
  labBillVerificationResultOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";
import {
  ActionIcon,
  Grid,
  MultiSelect,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IoClose } from "react-icons/io5";
import { IOtherBill } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  index: number;
  el: IOtherBill;
  onChange: (name: keyof IOtherBill, index: number, value: any) => void;
  onBlur: () => void;
  remove: (ind: number) => void;
};

const PrePostOtherBillsDynamicFormParts = ({
  index,
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
          label="Name of Entity"
          placeholder="Name of Entity"
          withAsterisk
          required
          value={el?.nameOfEntity || ""}
          onChange={(e) => onChange("nameOfEntity", index, e.target.value)}
          onBlur={onBlur}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Type of Entity"
          placeholder="Type of Entity"
          withAsterisk
          required
          value={el?.typeOfEntity || ""}
          onChange={(e) => onChange("typeOfEntity", index, e.target.value)}
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
          label="Bills and Reports Verified"
          placeholder="Bills and Reports Verified"
          withAsterisk
          required
          clearable
          searchable
          data={yesNoOptions}
          value={el?.billsAndReportsVerified || ""}
          onChange={(val) => onChange("billsAndReportsVerified", index, val)}
          onBlur={onBlur}
        />
      </Grid.Col>
      {el?.billsAndReportsVerified === "No" ? (
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Reason why bills not verified"
            placeholder="Reason why bills not verified"
            withAsterisk
            required
            value={el?.reasonOfBillsNotVerified || ""}
            onChange={(e) =>
              onChange("reasonOfBillsNotVerified", index, e.target.value)
            }
            onBlur={onBlur}
          />
        </Grid.Col>
      ) : el?.billsAndReportsVerified === "Yes" ? (
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
          {el?.discrepancyStatus === "Discrepant" && (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <MultiSelect
                  label="Bill Verification Result"
                  placeholder="Bill Verification Result"
                  withAsterisk
                  required
                  clearable
                  searchable
                  data={labBillVerificationResultOptions}
                  value={el?.billVerificationResult || []}
                  onChange={(val) =>
                    onChange("billVerificationResult", index, val)
                  }
                  onBlur={onBlur}
                />
              </Grid.Col>
              {el?.billVerificationResult?.includes("Others") ? (
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

export default PrePostOtherBillsDynamicFormParts;
