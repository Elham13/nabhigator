import React from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import { IMiscellaneousVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IMiscellaneousVerification;
};

const MiscellaneousTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          Miscellaneous Verification
        </Title>
      </GridCol>
      <GridCol span={{ sm: 12 }}>
        <KeyValueContainer
          label="Any Market Or Industry Feedback"
          value={values?.anyMarketOrIndustryFeedback || "-"}
        />
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

export default MiscellaneousTasks;
