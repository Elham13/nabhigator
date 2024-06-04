import React from "react";
import KeyValueContainer from "./KeyValueContainer";
import { Grid, GridCol } from "@mantine/core";
import dayjs from "dayjs";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  data: IDashboardData | null;
};

const HospitalDetailsContent = ({ data }: PropTypes) => {
  return (
    <Grid>
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

export default HospitalDetailsContent;
