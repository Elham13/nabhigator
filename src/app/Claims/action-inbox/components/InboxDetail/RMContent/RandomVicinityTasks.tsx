import React from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import { IRandomVicinityVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IRandomVicinityVerification;
};

const RandomVicinityTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          Random Vicinity Hospital/Lab/Doctor/Chemist Verification
        </Title>
      </GridCol>
      <GridCol span={{ sm: 12 }}>
        <KeyValueContainer
          label="Verification Summary"
          value={values?.verificationSummary || "-"}
        />
      </GridCol>
    </Grid>
  );
};

export default RandomVicinityTasks;
