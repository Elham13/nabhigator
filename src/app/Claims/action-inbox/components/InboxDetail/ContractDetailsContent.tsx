import React from "react";
import KeyValueContainer from "./KeyValueContainer";
import dayjs from "dayjs";
import { Grid, GridCol } from "@mantine/core";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  data: IDashboardData | null;
};

const ContractDetailsContent = ({ data }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Contract Number"
          value={data?.contractDetails?.contractNo}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Product"
          value={data?.contractDetails?.product}
        />
      </GridCol>
      {data?.contractDetails?.policyStartDate && (
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Contract Renewal Date"
            value={dayjs(data?.contractDetails?.policyStartDate).format(
              "DD-MMM-YYYY"
            )}
          />
        </GridCol>
      )}
      {data?.contractDetails?.policyEndDate && (
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Policy End Date"
            value={dayjs(data?.contractDetails?.policyEndDate).format(
              "DD-MMM-YYYY"
            )}
          />
        </GridCol>
      )}
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer label="Port" value={data?.contractDetails?.port} />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Previous insured company"
          value={data?.contractDetails?.prevInsuranceCompany}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Mbr Reg.Date"
          value={
            data?.contractDetails?.mbrRegDate
              ? dayjs(data?.contractDetails?.mbrRegDate).format("DD-MMM-YYYY")
              : "-"
          }
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="NBHI Policy Start Date"
          value={
            data?.contractDetails?.NBHIPolicyStartDate
              ? dayjs(data?.contractDetails?.NBHIPolicyStartDate).format(
                  "DD-MMM-YYYY"
                )
              : "-"
          }
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="No of members covered"
          value={data?.contractDetails?.membersCovered}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Sourcing"
          value={data?.contractDetails?.sourcing}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Agent Name"
          value={data?.contractDetails?.agentName}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Agent code"
          value={data?.contractDetails?.agentCode}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Branch Location"
          value={data?.contractDetails?.branchLocation}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Banca Details"
          value={data?.contractDetails?.bancaDetails}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Current Status"
          value={data?.contractDetails?.currentStatus}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Customer Type"
          value={data?.contractDetails?.customerType}
        />
      </GridCol>
    </Grid>
  );
};

export default ContractDetailsContent;
