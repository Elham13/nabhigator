"use client";

import React, { useEffect, useState } from "react";
import { Group, Stack, Switch } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import {
  IAutoPreQC,
  Role,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { showError } from "@/lib/helpers";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";
import Loading from "@/components/Loading";
const LeaveDetail = dynamic(() => import("./components/LeaveDetail"), {
  ssr: false,
  loading: () => <Loading />,
});

const MangeUser = () => {
  const [user] = useLocalStorage<IUserFromSession | null>({
    key: StorageKeys.USER,
  });
  const [fniManger, setFniManager] = useState<IAutoPreQC | null>(null);

  const handleAutomatePreQC = async () => {
    try {
      const { data } = await axios.post<SingleResponseType<IAutoPreQC>>(
        EndPoints.AUTO_PRE_QC,
        {
          action: "toggle",
        }
      );
      setFniManager(data.data);
      toast.success(data.message);
    } catch (error: any) {
      showError(error);
    }
  };

  useEffect(() => {
    // Getting Auto pre qc
    if (user?.activeRole === Role.ADMIN) {
      (async () => {
        try {
          const { data } = await axios.post<SingleResponseType<IAutoPreQC>>(
            EndPoints.AUTO_PRE_QC,
            {
              action: "check",
            }
          );
          setFniManager(data.data);
        } catch (error: any) {
          showError(error);
        }
      })();
    }
  }, [user]);

  return (
    <PageWrapper title="Manage User">
      <Group mt={30}>
        <Stack className="w-full" gap={30}>
          {user?.activeRole === Role.ADMIN ? (
            <Switch
              checked={fniManger?.autoPreQC}
              label="Automate the manual Pre-QC"
              onChange={handleAutomatePreQC}
              labelPosition="left"
            />
          ) : null}

          <LeaveDetail />
        </Stack>
      </Group>
    </PageWrapper>
  );
};

export default MangeUser;
