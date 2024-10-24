import { RejectionReason } from "@/lib/utils/types/fniDataTypes";
import { Box, Text } from "@mantine/core";
import React from "react";

const RejectionReasons = ({
  rejectionReasons,
}: {
  rejectionReasons?: RejectionReason[];
}) => {
  return (
    <Box>
      {rejectionReasons && rejectionReasons?.length > 0 ? (
        rejectionReasons?.map((reason, ind) => (
          <Box key={ind} mb={10}>
            <Text>Reason: {reason?.reason || "-"}</Text>
            <Text>Remark: {reason?.remark || "-"}</Text>
          </Box>
        ))
      ) : (
        <Text>Nothing to show</Text>
      )}
    </Box>
  );
};

export default RejectionReasons;
