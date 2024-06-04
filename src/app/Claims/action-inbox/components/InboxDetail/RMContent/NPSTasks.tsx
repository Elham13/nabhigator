import React from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Title } from "@mantine/core";
import dayjs from "dayjs";
import { INPSVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: INPSVerification;
};

const NPSTasks = ({ values }: PropTypes) => {
  return (
    <>
      <Title order={3} c="cyan" my={10}>
        OPD Verification Part
      </Title>
      <KeyValueContainer
        label="Insured Visit"
        value={values?.insuredVisit || "-"}
      />
      <KeyValueContainer
        label="Insured Mobile No"
        value={values?.insuredMobileNo || "-"}
      />
      <KeyValueContainer
        label="Insured Visit Date"
        value={
          values?.insuredVisitDate
            ? dayjs(values?.insuredVisitDate).format("DD-MMM-YYYY")
            : "-"
        }
      />
    </>
  );
};

export default NPSTasks;
