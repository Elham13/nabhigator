import React from "react";
import KeyValueContainer from "./KeyValueContainer";
import { Grid, GridCol } from "@mantine/core";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  data: IDashboardData | null;
};

const InsuredDetailsContent = ({ data }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Insured Name"
          value={data?.insuredDetails?.insuredName}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Gender"
          value={data?.insuredDetails?.gender}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer label="Age" value={data?.insuredDetails?.age} />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Address"
          value={data?.insuredDetails?.address}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer label="City" value={data?.insuredDetails?.city} />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer label="State" value={data?.insuredDetails?.state} />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Contact No"
          value={data?.insuredDetails?.contactNo}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Email ID"
          value={data?.insuredDetails?.emailId}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Member Type"
          value={data?.insuredDetails?.memberType}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Member ID"
          value={data?.insuredDetails?.memberId}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Pivotal Customer ID"
          value={data?.insuredDetails?.pivotalCustomerId}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Height"
          value={data?.insuredDetails?.height}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Weight"
          value={data?.insuredDetails?.weight}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Occupation"
          value={data?.insuredDetails?.occupation}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Member Fraud Status"
          value={data?.claimDetails?.fraudStatus || "-"}
        />
      </GridCol>
    </Grid>
  );
};

export default InsuredDetailsContent;
