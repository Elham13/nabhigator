import { showError } from "@/lib/helpers";
import { EndPoints } from "@/lib/utils/types/enums";
import {
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { Box, Button, Flex, Grid, GridCol, TextInput } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import KeyValueContainer from "../../action-inbox/components/InboxDetail/KeyValueContainer";
import PopConfirm from "@/components/PopConfirm";
import { toast } from "react-toastify";

const DeleteCase = () => {
  const [loadings, setLoadings] = useState({ get: false, delete: false });
  const [claimId, setClaimId] = useState<string>("");
  const [dData, setDData] = useState<IDashboardData | null>(null);

  const fetchData = async () => {
    setLoadings((prev) => ({ ...prev, get: true }));
    try {
      const { data } = await axios.get<SingleResponseType<IDashboardData>>(
        `${EndPoints.DASHBOARD_DATA}?claimId=${claimId}`
      );
      setDData(data?.data);
    } catch (error: any) {
      showError(error);
    } finally {
      setLoadings((prev) => ({ ...prev, get: false }));
    }
  };

  const handleDelete = async () => {
    setLoadings((prev) => ({ ...prev, delete: true }));
    try {
      await axios.post(EndPoints.DELETE_CASE, { claimId });
      toast.success("Deleted successfully");
      setDData(null);
      setClaimId("");
    } catch (error: any) {
      showError(error);
    } finally {
      setLoadings((prev) => ({ ...prev, delete: false }));
    }
  };

  return (
    <Box p={20}>
      <Flex gap={10} align="end">
        <TextInput
          className="w-full"
          label="Claim Id"
          placeholder="Enter PreAuth/Claim ID"
          value={claimId}
          onChange={(e) => setClaimId(e.target.value)}
          required
          withAsterisk
        />
        <Button loading={loadings.get} disabled={!claimId} onClick={fetchData}>
          Find
        </Button>
      </Flex>
      {!!dData && (
        <Grid mt={30}>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer label="Claim ID" value={dData?.claimId} />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer label="Claim Type" value={dData?.claimType} />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <PopConfirm
              onConfirm={handleDelete}
              title="Remove the Case"
              description="If you proceed to delete this case it will be completely removed from Nabhigator and if it's assigned to any investigator or post qa it will be removed from their buckets and the Audit trials about this case will also be removed.
            Are you absolutely sure to proceed?"
            >
              <Button loading={loadings?.delete} color="red">
                Delete
              </Button>
            </PopConfirm>
          </GridCol>
        </Grid>
      )}
    </Box>
  );
};

export default DeleteCase;
