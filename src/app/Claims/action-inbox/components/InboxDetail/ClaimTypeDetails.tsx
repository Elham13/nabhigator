import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Grid, Loader, Select } from "@mantine/core";
import KeyValueContainer from "./KeyValueContainer";
import axios from "axios";
import {
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import { claimSubTypeOptions } from "@/lib/utils/constants/options";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { useLocalStorage } from "@mantine/hooks";

type PropTypes = {
  data: IDashboardData | null;
  setData: Dispatch<SetStateAction<IDashboardData | null>>;
};

const ClaimTypeDetails = ({ data, setData }: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (val: string | null) => setValue(val || "");

  const handleSave = async () => {
    setLoading(true);
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
      setLoading(false);
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
            disabled={loading}
            onChange={handleChange}
            clearable
            searchable
          />
          <Button loading={loading} onClick={handleSave}>
            Save
          </Button>
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default ClaimTypeDetails;
