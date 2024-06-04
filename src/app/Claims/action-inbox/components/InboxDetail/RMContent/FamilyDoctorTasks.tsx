import React, { Fragment } from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import { IFamilyDoctorOrReferringDoctorVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IFamilyDoctorOrReferringDoctorVerification;
};

const FamilyDoctorTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          Family Doctor/Referring Doctor Verification
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
                  label="Name of family Doctor/Referring Doctor"
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

export default FamilyDoctorTasks;
