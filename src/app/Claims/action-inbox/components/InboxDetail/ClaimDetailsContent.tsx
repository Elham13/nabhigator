import React from "react";
import KeyValueContainer from "./KeyValueContainer";
import dayjs from "dayjs";
import { Grid, GridCol } from "@mantine/core";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";
import { convertToIndianFormat } from "@/lib/helpers";

type PropTypes = {
  data: IDashboardData | null;
};

const ClaimDetailsContent = ({ data }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Referred From"
          value={data?.contractDetails?.sourcing} //TODO: Need to confirm this value
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer label="Referral Type" value={data?.referralType} />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Claim Number"
          value={data?.claimDetails?.claimNo}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Submitted By"
          value={data?.claimDetails?.submittedBy}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Received Date"
          value={
            data?.claimDetails?.receivedAt
              ? dayjs(data?.claimDetails?.receivedAt).format("DD-MMM-YYYY")
              : "-"
          }
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Pay To"
          value={data?.claimDetails?.payTo || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Claim Type"
          value={data?.claimDetails?.claimType || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Pre-Post Indicator"
          value={data?.claimDetails?.prePostIndicator || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Main Claim No"
          value={data?.claimDetails?.mainClaim || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Hospitalization Type"
          value={data?.claimDetails?.hospitalizationType || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Diagnosis"
          value={data?.claimDetails?.diagnosis || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="ICD Code"
          value={data?.claimDetails?.icdCode || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Line of Treatment"
          value={data?.claimDetails?.lineOfTreatment || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Billed amount"
          value={
            data?.claimDetails?.billedAmount
              ? convertToIndianFormat(
                  parseInt(data?.claimDetails?.billedAmount)
                )
              : "-"
          }
        />
      </GridCol>
    </Grid>
  );
};

export default ClaimDetailsContent;
