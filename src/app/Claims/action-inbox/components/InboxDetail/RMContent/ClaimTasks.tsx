import React from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import { IClaimVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IClaimVerification;
};

const ClaimTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          Claim Verification
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

export default ClaimTasks;
