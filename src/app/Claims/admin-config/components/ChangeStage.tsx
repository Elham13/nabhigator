import React, { useMemo, useState } from "react";
import { Box, Button, Flex, Grid, Select, TextInput } from "@mantine/core";
import { getStageLabel, showError } from "@/lib/helpers";
import axios from "axios";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import {
  IDashboardData,
  NumericStage,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { useLocalStorage } from "@mantine/hooks";
import { toast } from "react-toastify";

const ChangeStage = () => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [loadings, setLoadings] = useState({ get: false, change: false });
  const [claimId, setClaimId] = useState<string>("");
  const [stage, setStage] = useState<NumericStage | null>(null);
  const [dData, setDData] = useState<IDashboardData | null>(null);

  const stageOptions = useMemo(() => {
    if (!dData) return [];
    const stages = [
      {
        value: NumericStage.PENDING_FOR_PRE_QC.toString(),
        label: getStageLabel(NumericStage.PENDING_FOR_PRE_QC),
      },
      {
        value: NumericStage.PENDING_FOR_ALLOCATION.toString(),
        label: getStageLabel(NumericStage.PENDING_FOR_ALLOCATION),
      },
      {
        value: NumericStage.PENDING_FOR_RE_ALLOCATION.toString(),
        label: getStageLabel(NumericStage.PENDING_FOR_RE_ALLOCATION),
      },
      {
        value: NumericStage.IN_FIELD_FRESH.toString(),
        label: getStageLabel(NumericStage.IN_FIELD_FRESH),
      },
      {
        value: NumericStage.POST_QC.toString(),
        label: getStageLabel(NumericStage.POST_QC),
      },
      {
        value: NumericStage.IN_FIELD_REINVESTIGATION.toString(),
        label: getStageLabel(NumericStage.IN_FIELD_REINVESTIGATION),
      },
      {
        value: NumericStage.IN_FIELD_REWORK.toString(),
        label: getStageLabel(NumericStage.IN_FIELD_REWORK),
      },
      {
        value: NumericStage.CLOSED.toString(),
        label: getStageLabel(NumericStage.CLOSED),
      },
      {
        value: NumericStage.REJECTED.toString(),
        label: getStageLabel(NumericStage.REJECTED),
      },
      {
        value: NumericStage.INVESTIGATION_ACCEPTED.toString(),
        label: getStageLabel(NumericStage.INVESTIGATION_ACCEPTED),
      },
      {
        value: NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING.toString(),
        label: getStageLabel(NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING),
      },
      {
        value: NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING.toString(),
        label: getStageLabel(
          NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING
        ),
      },
    ];
    return stages;
  }, [dData]);

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

  const changeStage = async () => {
    if (!dData?._id || !stage) return;
    setLoadings((prev) => ({ ...prev, change: true }));
    try {
      const payload = {
        id: dData?._id,
        stage,
        userName: user?.name,
      };
      const { data } = await axios.post<SingleResponseType<IDashboardData>>(
        EndPoints.CHANGE_STAGE,
        payload
      );
      toast.success(data?.message);
      setDData(null);
      setClaimId("");
      setStage(null);
    } catch (error: any) {
      showError(error);
    } finally {
      setLoadings((prev) => ({ ...prev, change: false }));
    }
  };

  return (
    <Box mt={20}>
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
        <Grid mt={20}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              className="w-full"
              label="Old Stage"
              placeholder="Select old stage"
              data={stageOptions}
              value={!!dData?.stage ? dData?.stage.toString() : ""}
              disabled
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              className="w-full"
              label="New Stage"
              placeholder="Select new stage"
              data={stageOptions}
              value={!!stage ? stage.toString() : ""}
              onChange={(val) => setStage(!!val ? parseInt(val) : null)}
              required
              withAsterisk
            />
          </Grid.Col>

          <Button
            fullWidth
            loading={loadings.change}
            disabled={!stage}
            onClick={changeStage}
          >
            Change
          </Button>
        </Grid>
      )}
    </Box>
  );
};

export default ChangeStage;
