"use client";

import React, { useEffect, useState } from "react";
import { Grid, LoadingOverlay, Stack } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import {
  IDashboardCount,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";
import Card from "./components/Card";

const countsInitials: IDashboardCount = {
  preAuth: { green: 0, amber: 0, red: 0 },
  reimbursement: { green: 0, amber: 0, red: 0 },
  PAOrCI: { green: 0, amber: 0, red: 0 },
  total: { green: 0, amber: 0, red: 0 },
};

const Dashboard = () => {
  const [user] = useLocalStorage<IUserFromSession | null>({
    key: StorageKeys.USER,
  });

  const [counts, setCounts] = useState<IDashboardCount>(countsInitials);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Get dashboard counts
    (async () => {
      if (user?._id) {
        setLoading(true);
        try {
          const { data } = await axios.get<SingleResponseType<IDashboardCount>>(
            `${EndPoints.DASHBOARD_COUNTS}?userId=${user?._id}`
          );
          setCounts(data.data);
        } catch (error: any) {
          showError(error);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [user?._id]);

  return (
    <PageWrapper title="Claims Dashboard">
      <LoadingOverlay
        overlayProps={{ radius: "sm" }}
        loaderProps={{ color: "blue", type: "bars" }}
        visible={loading}
      />

      <Grid mt={40}>
        <Grid.Col span={3}>
          <Stack className="p-2">
            <h3 className="shadow-lg rounded-lg p-4 text-xl text-center border border-slate-200">
              PreAuth:{" "}
              <span className="font-semibold">
                {counts?.preAuth?.green +
                  counts?.preAuth?.amber +
                  counts?.preAuth?.red}
              </span>
            </h3>
            <Card
              number={counts?.preAuth?.green}
              color="Green"
              claimType="PreAuth"
              user={user}
            />
            <Card
              number={counts?.preAuth?.amber}
              color="Amber"
              claimType="PreAuth"
              user={user}
            />
            <Card
              number={counts?.preAuth?.red}
              color="Red"
              claimType="PreAuth"
              user={user}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack className="p-2">
            <h3 className="shadow-lg rounded-lg p-4 text-xl text-center border border-slate-200">
              RM:{" "}
              <span className="font-semibold">
                {counts?.reimbursement?.green +
                  counts?.reimbursement?.amber +
                  counts?.reimbursement?.red}
              </span>
            </h3>
            <Card
              number={counts?.reimbursement?.green}
              color="Green"
              claimType="Reimbursement"
              user={user}
            />
            <Card
              number={counts?.reimbursement?.amber}
              color="Amber"
              claimType="Reimbursement"
              user={user}
            />
            <Card
              number={counts?.reimbursement?.red}
              color="Red"
              claimType="Reimbursement"
              user={user}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack className="p-2">
            <h3 className="shadow-lg rounded-lg p-4 text-xl text-center border border-slate-200">
              PA/CI:{" "}
              <span className="font-semibold">
                {counts?.PAOrCI?.green +
                  counts?.PAOrCI?.amber +
                  counts?.PAOrCI?.red}
              </span>
            </h3>
            <Card
              number={counts?.PAOrCI?.green}
              color="Green"
              claimType="Reimbursement"
              user={user}
            />
            <Card
              number={counts?.PAOrCI?.amber}
              color="Amber"
              claimType="Reimbursement"
              user={user}
            />
            <Card
              number={counts?.PAOrCI?.red}
              color="Red"
              claimType="Reimbursement"
              user={user}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack className="p-2">
            <h3 className="shadow-lg rounded-lg p-4 text-xl text-center border border-slate-200">
              Total:{" "}
              <span className="font-semibold">
                {counts?.total?.green +
                  counts?.total?.amber +
                  counts?.total?.red}
              </span>
            </h3>
            <Card
              number={counts?.total?.green}
              color="Green"
              claimType="Total"
              user={user}
            />
            <Card
              number={counts?.total?.amber}
              color="Amber"
              claimType="Total"
              user={user}
            />
            <Card
              number={counts?.total?.red}
              color="Red"
              claimType="Total"
              user={user}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </PageWrapper>
  );
};

export default Dashboard;
