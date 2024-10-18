import React, { Dispatch, Fragment, SetStateAction } from "react";
import {
  discrepancyStatusOptions,
  yesNAOptions,
} from "@/lib/utils/constants/options";
import { Divider, Grid, Select, Textarea, Title } from "@mantine/core";
import {
  IMainClaimDetails,
  IPrePostVerification,
} from "@/lib/utils/types/rmDataTypes";

type TField = "mainClaimIsVerified" | "insuredIsVerified";

type PropTypes = {
  fieldName: TField;
  objectName: "mainClaimDetail" | "insuredVerificationDetail";
  values: IPrePostVerification;
  setValues: Dispatch<SetStateAction<IPrePostVerification>>;
  onBlur: ({}: { key: keyof IPrePostVerification; value: any }) => void;
};

const MainClaimVerification = ({
  fieldName,
  objectName,
  values,
  setValues,
  onBlur,
}: PropTypes) => {
  const handleChange = (name: keyof IMainClaimDetails, value: any) => {
    const newObj: any = !!values[objectName] ? values[objectName] : {};
    newObj[name] = value;
    setValues((prev) => ({ ...prev, [objectName]: newObj }));
  };

  return (
    <Fragment>
      <Divider my="md" />
      <Grid.Col span={12}>
        <Title order={5}>
          {fieldName === "mainClaimIsVerified"
            ? "Main Claim Verification Summary"
            : "Insured Verification Summary"}
        </Title>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label={`${
            fieldName === "mainClaimIsVerified" ? "Main Claim" : "Insured"
          } Verified?`}
          placeholder={`${
            fieldName === "mainClaimIsVerified" ? "Main Claim" : "Insured"
          } Verified?`}
          withAsterisk
          required
          data={yesNAOptions}
          clearable
          searchable
          value={values[fieldName] || ""}
          onChange={(val) =>
            setValues((prev) => ({ ...prev, [fieldName]: val || "" }))
          }
          onBlur={() =>
            onBlur({
              key: fieldName,
              value: values[fieldName],
            })
          }
        />
      </Grid.Col>
      {values[fieldName] === "Yes" && (
        <Fragment>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Discrepancy Status"
              placeholder="Discrepancy Status"
              withAsterisk
              required
              data={discrepancyStatusOptions}
              clearable
              searchable
              value={values[objectName]?.discrepancyStatus || ""}
              onChange={(val) => handleChange("discrepancyStatus", val || "")}
              onBlur={() =>
                onBlur({
                  key: objectName,
                  value: values[objectName],
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Textarea
              label="Observations"
              placeholder="Observations"
              withAsterisk
              required
              resize="vertical"
              value={values[objectName]?.observation || ""}
              onChange={(e) =>
                handleChange("observation", e.target.value || "")
              }
              onBlur={() =>
                onBlur({
                  key: objectName,
                  value: values[objectName],
                })
              }
            />
          </Grid.Col>
        </Fragment>
      )}
    </Fragment>
  );
};

export default MainClaimVerification;
