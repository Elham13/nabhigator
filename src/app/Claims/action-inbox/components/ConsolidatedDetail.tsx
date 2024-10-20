import React from "react";
import { Grid, GridCol, Title } from "@mantine/core";
import KeyValueContainer from "./InboxDetail/KeyValueContainer";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";
import { convertToIndianFormat } from "@/lib/helpers";
import dayjs from "dayjs";

type PropTypes = {
  data: IDashboardData | null;
};

const ConsolidatedDetail = ({ data }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} ta="center" c="blue" my={4}>
          Insured Details
        </Title>
      </GridCol>
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

      <GridCol span={{ sm: 12 }}>
        <Title order={3} ta="center" c="blue" my={4}>
          Claim Details
        </Title>
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Referred From"
          value={data?.contractDetails?.sourcing}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Referral Type"
          value={data?.claimDetails?.claimTrigger}
        />
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
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Exclusion Remarks"
          value={data?.claimDetails?.exclusionRemark || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} ta="center" c="blue" my={4}>
          Hospital & Hospitalization Details
        </Title>
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Provider Number"
          value={data?.hospitalDetails?.providerNo}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Provider Name"
          value={data?.hospitalDetails?.providerName}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Provider Type"
          value={data?.hospitalDetails?.providerType}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Provider Address"
          value={data?.hospitalDetails?.providerAddress}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Provider City"
          value={data?.hospitalDetails?.providerCity}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Provider State"
          value={data?.hospitalDetails?.providerState}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Pin Code"
          value={data?.hospitalDetails?.pinCode}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Treating Doctor Name"
          value={data?.hospitalizationDetails?.treatingDoctorName || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Treating Doctor Registration No"
          value={data?.hospitalizationDetails?.treatingDoctorRegNo || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Admission Date"
          value={
            data?.hospitalizationDetails?.dateOfAdmission
              ? dayjs(data?.hospitalizationDetails?.dateOfAdmission).format(
                  "DD-MMM-YYYY"
                )
              : "-"
          }
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Discharge Date"
          value={
            data?.hospitalizationDetails?.dateOfDischarge
              ? dayjs(data?.hospitalizationDetails?.dateOfDischarge).format(
                  "DD-MMM-YYYY"
                )
              : "-"
          }
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="LOS"
          value={data?.hospitalizationDetails?.LOS}
        />
      </GridCol>
    </Grid>
  );
};

export default ConsolidatedDetail;
