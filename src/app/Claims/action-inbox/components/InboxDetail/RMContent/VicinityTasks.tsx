import React from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Title } from "@mantine/core";
import { IVicinityVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IVicinityVerification;
};

const VicinityTasks = ({ values }: PropTypes) => {
  return (
    <>
      <Title order={3} c="cyan" my={10}>
        Vicinity Verification
      </Title>
      <KeyValueContainer label="Status" value={values?.status || "-"} />
      <KeyValueContainer
        label="Verification Summary"
        value={values?.verificationSummary || "-"}
      />
    </>
  );
};

export default VicinityTasks;
