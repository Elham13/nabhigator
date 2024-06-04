import React from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import { IOPDVerificationPart } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IOPDVerificationPart;
};

const OPDTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          OPD Verification Part
        </Title>
      </GridCol>
      <GridCol span={{ sm: 12 }}>
        <KeyValueContainer
          label="Final Observation"
          value={values?.finalObservation || "-"}
        />
      </GridCol>
    </Grid>
  );
};

export default OPDTasks;
