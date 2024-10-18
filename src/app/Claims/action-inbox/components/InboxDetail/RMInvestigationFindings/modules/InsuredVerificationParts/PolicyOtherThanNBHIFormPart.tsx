import React, { Fragment } from "react";
import { Grid, Text, TextInput } from "@mantine/core";
import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";
import FileUploadFooter from "@/components/ClaimsComponents/FileUpload/FileUploadFooter";
import FileUpload from "@/components/ClaimsComponents/FileUpload";

const tempDoc = {
  _id: "",
  docUrl: [],
  name: "",
  location: null,
  hiddenDocUrls: [],
  replacedDocUrls: [],
};

interface IOnChangeParams {
  name: string | string[];
  value: any;
}

type PropTypes = {
  values: IInsuredVerification;
  claimId: number;
  onChange: ({}: IOnChangeParams) => void;
  handleBlur: ({}: { key: keyof IInsuredVerification; value: any }) => void;
};

const PolicyOtherThanNBHIFormPart = ({
  values,
  claimId,
  onChange,
  handleBlur,
}: PropTypes) => {
  const handleRemove = (index: number) => {
    const docArr =
      values?.anyInsurancePolicyOtherThanNBHI?.documents &&
      values?.anyInsurancePolicyOtherThanNBHI?.documents?.length > 0
        ? values?.anyInsurancePolicyOtherThanNBHI?.documents?.filter(
            (_, i) => i !== index
          )
        : [];
    onChange({
      name: ["anyInsurancePolicyOtherThanNBHI", "documents"],
      value: docArr,
    });
    handleBlur({
      key: "anyInsurancePolicyOtherThanNBHI",
      value: { ...values?.anyInsurancePolicyOtherThanNBHI, documents: docArr },
    });
  };

  const handleGetUrl = (
    id: string,
    name: string,
    url: string,
    action: "Add" | "Remove"
  ) => {
    const docArr = values?.anyInsurancePolicyOtherThanNBHI?.documents || [];
    docArr.push(url);
    onChange({
      name: ["anyInsurancePolicyOtherThanNBHI", "documents"],
      value: docArr,
    });
    handleBlur({
      key: "anyInsurancePolicyOtherThanNBHI",
      value: { ...values?.anyInsurancePolicyOtherThanNBHI, documents: docArr },
    });
  };

  return (
    <Fragment>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Policy Number"
          placeholder="Policy Number"
          required
          withAsterisk
          value={values?.anyInsurancePolicyOtherThanNBHI?.policyNo || ""}
          onChange={(e) =>
            onChange({
              name: ["anyInsurancePolicyOtherThanNBHI", "policyNo"],
              value: e.target.value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "anyInsurancePolicyOtherThanNBHI",
              value: values?.anyInsurancePolicyOtherThanNBHI,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label="Name of Insurance Company"
          placeholder="Name of Insurance Company"
          required
          withAsterisk
          value={
            values?.anyInsurancePolicyOtherThanNBHI?.nameOfInsuranceCompany ||
            ""
          }
          onChange={(e) =>
            onChange({
              name: [
                "anyInsurancePolicyOtherThanNBHI",
                "nameOfInsuranceCompany",
              ],
              value: e.target.value,
            })
          }
          onBlur={() =>
            handleBlur({
              key: "anyInsurancePolicyOtherThanNBHI",
              value: values?.anyInsurancePolicyOtherThanNBHI,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Text className="font-semibold">
          Insurance policy other than NBHI Documents:{" "}
        </Text>
        {!!values?.anyInsurancePolicyOtherThanNBHI?.documents &&
          values?.anyInsurancePolicyOtherThanNBHI?.documents?.length > 0 &&
          values?.anyInsurancePolicyOtherThanNBHI?.documents?.map((el, ind) => (
            <FileUploadFooter
              key={ind}
              url={el}
              onDelete={() => handleRemove(ind)}
            />
          ))}
        <FileUpload
          claimId={claimId}
          doc={tempDoc}
          docName="doc"
          getUrl={handleGetUrl}
        />
      </Grid.Col>
    </Fragment>
  );
};

export default PolicyOtherThanNBHIFormPart;
