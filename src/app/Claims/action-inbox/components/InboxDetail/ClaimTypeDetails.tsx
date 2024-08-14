import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Grid, Select } from "@mantine/core";
import KeyValueContainer from "./KeyValueContainer";
import axios from "axios";
import {
  IDashboardData,
  Role,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import { claimSubTypeOptions } from "@/lib/utils/constants/options";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { useLocalStorage } from "@mantine/hooks";
import { toast } from "react-toastify";

type PropTypes = {
  data: IDashboardData | null;
  setData: Dispatch<SetStateAction<IDashboardData | null>>;
};

const ClaimTypeDetails = ({ data, setData }: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [value, setValue] = useState<string>("");
  const [loadings, setLoadings] = useState({
    save: false,
    approved: false,
    disapproved: false,
  });

  const handleChange = (val: string | null) => setValue(val || "");

  const handleSave = async () => {
    setLoadings((prev) => ({ ...prev, save: true }));
    try {
      const payload = {
        id: data?._id,
        claimSubType: value || "",
        userName: user?.name,
      };
      const { data: res } = await axios.post<
        SingleResponseType<IDashboardData>
      >(EndPoints.CHANGE_CLAIM_SUB_TYPE, payload);
      setData(res?.data);
    } catch (error: any) {
      showError(error);
    } finally {
      setLoadings((prev) => ({ ...prev, save: false }));
    }
  };

  const handleAction = async (status: "approved" | "disapproved") => {
    setLoadings((prev) => ({ ...prev, [status]: true }));

    const payload = {
      id: data?._id,
      userName: user?.name,
      action: "tlApprove",
      status,
    };

    try {
      const { data } = await axios.post<SingleResponseType<IDashboardData>>(
        EndPoints.CHANGE_CLAIM_SUB_TYPE,
        payload
      );
      setData(data?.data);
      toast.success(data?.message);
    } catch (error: any) {
      showError(error);
    } finally {
      setLoadings((prev) => ({ ...prev, [status]: false }));
    }
  };

  useEffect(() => {
    if (data?.claimSubType) setValue(data?.claimSubType);
  }, [data?.claimSubType]);

  return (
    <Grid>
      <Grid.Col span={{ sm: 12, md: 6 }}>
        <KeyValueContainer label="Claim Type" value={data?.claimType} />
      </Grid.Col>

      <Grid.Col span={{ sm: 12, md: 6 }}>
        <div className="flex gap-2 items-end">
          <Select
            className="w-full"
            label="Claim Subtype"
            placeholder="Change claim sub type if it's incorrect"
            data={claimSubTypeOptions}
            value={value}
            disabled={loadings?.save}
            onChange={handleChange}
            clearable
            searchable
          />
          <Button loading={loadings?.save} onClick={handleSave}>
            Save
          </Button>
        </div>
      </Grid.Col>

      {data?.tlInbox?.claimSubTypeChange?.value &&
      user?.activeRole === Role.TL ? (
        <>
          <Grid.Col span={{ sm: 12 }} mt={20}>
            <p className="text-center text-orange-500 text-xl">
              A change request in claim sub-type is received, please take an
              action
            </p>
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Current Claim Sub-Type"
              value={data?.claimSubType || "-"}
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Changed Claim Sub-Type"
              value={data?.tlInbox?.claimSubTypeChange?.value || "-"}
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12 }}>
            <KeyValueContainer
              label="Change Remarks"
              value={data?.tlInbox?.claimSubTypeChange?.remarks || "-"}
            />
          </Grid.Col>
          <Grid.Col span={{ sm: 12 }}>
            <Button
              onClick={() => handleAction("approved")}
              loading={loadings?.approved}
            >
              Approve
            </Button>
            <Button
              color="red"
              ml={5}
              onClick={() => handleAction("disapproved")}
              loading={loadings?.disapproved}
            >
              Reject
            </Button>
          </Grid.Col>
        </>
      ) : null}
    </Grid>
  );
};

export default ClaimTypeDetails;
