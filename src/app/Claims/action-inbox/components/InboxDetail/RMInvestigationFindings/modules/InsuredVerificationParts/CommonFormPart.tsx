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

type CommonFormPartPropTypes = {
  title: "Non Contactable" | "Non Co-operation";
  claimId: number;
  values: IInsuredVerification;
  onChange: (name: string, value: string | string[]) => void;
  handleBlur: (name: string, value: string | string[]) => void;
};

const CommonFormPart = ({
  title,
  values,
  claimId,
  onChange,
  handleBlur,
}: CommonFormPartPropTypes) => {
  const handleRemove = (index: number) => {
    const docArr =
      values?.reasonOfInsuredNotVisit?.proof &&
      values?.reasonOfInsuredNotVisit?.proof?.length > 0
        ? values?.reasonOfInsuredNotVisit?.proof?.filter((_, i) => i !== index)
        : [];
    onChange("proof", docArr);
    handleBlur("proof", docArr);
  };

  const handleGetUrl = (
    id: string,
    name: string,
    url: string,
    action: "Add" | "Remove"
  ) => {
    const docArr = values?.reasonOfInsuredNotVisit?.proof || [];
    docArr.push(url);
    onChange("proof", docArr);
    handleBlur("proof", docArr);
  };

  return (
    <Fragment>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput
          label={`Remarks of ${title}`}
          placeholder={`Remarks of ${title}`}
          required
          withAsterisk
          value={values?.reasonOfInsuredNotVisit?.reason || ""}
          onChange={(e) => onChange("reason", e.target.value)}
          onBlur={(e) => handleBlur("reason", e.target.value)}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Text className="font-semibold">Proof: </Text>
        {!!values?.reasonOfInsuredNotVisit?.proof &&
          values?.reasonOfInsuredNotVisit?.proof?.length > 0 &&
          values?.reasonOfInsuredNotVisit?.proof?.map((el, ind) => (
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

export default CommonFormPart;
