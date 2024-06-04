import React, { Fragment } from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import { IChemistVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IChemistVerification;
};

const ChemistTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          Chemist Verification
        </Title>
      </GridCol>

      {values?.chemists && values?.chemists?.length > 0
        ? values?.chemists?.map((chemist, ind) => (
            <Fragment key={chemist?._id}>
              <GridCol span={{ sm: 12 }}>
                <Title order={5} c="orange">
                  Chemist Detail {ind + 1}
                </Title>
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of Chemist"
                  value={chemist?.name || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Address"
                  value={chemist?.address || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer label="City" value={chemist?.city || "-"} />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="State"
                  value={chemist?.state || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Bills verified?"
                  value={chemist?.billsVerified || "-"}
                />
              </GridCol>
            </Fragment>
          ))
        : null}

      <GridCol span={{ sm: 12 }}>
        <KeyValueContainer
          label="Verification Summary"
          value={values.verificationSummary || "-"}
        />
      </GridCol>
    </Grid>
  );
};

export default ChemistTasks;
