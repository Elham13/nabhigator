import React, { Fragment } from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import dayjs from "dayjs";
import { IEmployerVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IEmployerVerification;
};

const EmployerTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          Employer Verification
        </Title>
      </GridCol>

      {values?.employers && values?.employers?.length > 0
        ? values?.employers?.map((emp, ind) => (
            <Fragment key={emp?._id}>
              <GridCol span={{ sm: 12 }}>
                <Title order={5} c="orange">
                  Employer {ind + 1}
                </Title>
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of Employer"
                  value={emp?.nameOfEmployer || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Address"
                  value={emp?.address || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Date of Joining"
                  value={
                    emp?.dateOfJoining
                      ? dayjs(emp?.dateOfJoining).format("DD-MMM-YYYY")
                      : "-"
                  }
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Any Group Health Policy"
                  value={emp?.anyGroupHealthPolicy || "-"}
                />
              </GridCol>

              {emp?.anyGroupHealthPolicy === "Yes" ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Claim Details"
                    value={emp?.claimDetails || "-"}
                  />
                </GridCol>
              ) : null}
            </Fragment>
          ))
        : null}

      <GridCol span={{ sm: 12 }}>
        <KeyValueContainer
          label="Verification Summary"
          value={values?.verificationSummary || "-"}
        />
      </GridCol>
    </Grid>
  );
};

export default EmployerTasks;
