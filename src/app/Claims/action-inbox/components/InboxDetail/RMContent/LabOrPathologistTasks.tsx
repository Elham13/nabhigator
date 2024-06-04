import React, { Fragment } from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import { ILabOrPathologistVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: ILabOrPathologistVerification;
};

const LabOrPathologistTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          Lab Part/Pathologist Verification
        </Title>
      </GridCol>

      {values?.labs && values?.labs?.length > 0
        ? values?.labs?.map((lab, ind) => (
            <Fragment key={lab?._id}>
              <GridCol span={{ sm: 12 }}>
                <Title order={5} c="orange">
                  Lab Detail {ind + 1}
                </Title>
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of Lab"
                  value={lab?.name || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Address"
                  value={lab?.address || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer label="City" value={lab?.city || "-"} />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer label="State" value={lab?.state || "-"} />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Reports signed by"
                  value={lab?.reportsSigned || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Lab Reports"
                  value={lab?.labReports || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Lab Bills"
                  value={lab?.labBills || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12 }}>
                <Title order={5} c="green">
                  Pathologist Detail
                </Title>
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Name of Pathologist"
                  value={lab?.pathologistDetails?.name || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Qualification"
                  value={lab?.pathologistDetails?.qualification || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Registration Number"
                  value={lab?.pathologistDetails?.registrationNo || "-"}
                />
              </GridCol>
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Pathologist Meeting"
                  value={lab?.pathologistDetails?.meetingStatus || "-"}
                />
              </GridCol>
              {lab?.pathologistDetails?.meetingStatus === "Untraceable" ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Reason for Untraceable"
                    value={lab?.pathologistDetails?.reasonForUntraceable || "-"}
                  />
                </GridCol>
              ) : lab?.pathologistDetails?.meetingStatus === "Traceable" ? (
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Co-Operation"
                    value={lab?.pathologistDetails?.cooperation || "-"}
                  />
                </GridCol>
              ) : null}
            </Fragment>
          ))
        : null}

      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Verification Summary"
          value={values?.verificationSummary || "-"}
        />
      </GridCol>
    </Grid>
  );
};

export default LabOrPathologistTasks;
