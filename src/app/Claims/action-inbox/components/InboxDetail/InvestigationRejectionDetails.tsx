import { Box, Title } from "@mantine/core";
import React from "react";
import KeyValueContainer from "./KeyValueContainer";
import { IInvestigationRejected } from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  rejectionInfo: IInvestigationRejected | null;
};

const InvestigationRejectionDetails = ({ rejectionInfo }: PropTypes) => {
  return (
    <Box>
      <Title order={5} c="green" my={4}>
        Investigation Rejection Details
      </Title>
      <KeyValueContainer
        label="Rejection Reason"
        value={rejectionInfo?.investigationRejectedReason || "-"}
      />
      {rejectionInfo?.insuredAddress ? (
        <KeyValueContainer
          label="Insured Address"
          value={rejectionInfo?.insuredAddress || "-"}
        />
      ) : null}
      {rejectionInfo?.insuredCity ? (
        <KeyValueContainer
          label="Insured City"
          value={rejectionInfo?.insuredCity || "-"}
        />
      ) : null}
      {rejectionInfo?.insuredState ? (
        <KeyValueContainer
          label="Insured State"
          value={rejectionInfo?.insuredState || "-"}
        />
      ) : null}
      {rejectionInfo?.insuredMobileNumber ? (
        <KeyValueContainer
          label="Insured Mobile number"
          value={rejectionInfo?.insuredMobileNumber || "-"}
        />
      ) : null}

      <KeyValueContainer label="Remark" value={rejectionInfo?.remark || "-"} />
    </Box>
  );
};

export default InvestigationRejectionDetails;
