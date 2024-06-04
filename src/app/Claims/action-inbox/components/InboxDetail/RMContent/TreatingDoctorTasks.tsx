import React, { Fragment } from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import { ITreatingDoctorVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: ITreatingDoctorVerification;
};

const TreatingDoctorTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          Treating Doctor Verification
        </Title>
      </GridCol>

      {values?.doctors && values?.doctors?.length > 0
        ? values?.doctors?.map((doctor, ind) => (
            <Fragment key={doctor?._id}>
              <GridCol span={{ sm: 12 }}>
                <Title order={5} c="orange">
                  Doctor {ind + 1}
                </Title>
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of treating Doctor"
                  value={doctor?.name || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Qualification"
                  value={doctor?.qualification || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Registration Number"
                  value={doctor?.registrationNo?.value || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Remark"
                  value={doctor?.registrationNo?.remark || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Meeting Status"
                  value={doctor?.meetingStatus || "-"}
                />
              </GridCol>
              {doctor?.remarkForUntraceable ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Untraceable Remark"
                    value={doctor?.remarkForUntraceable || "-"}
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

export default TreatingDoctorTasks;
