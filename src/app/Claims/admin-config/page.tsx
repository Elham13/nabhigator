"use client";

import React, { useEffect, useState } from "react";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";
import { Box, Tabs } from "@mantine/core";
import ChangeStage from "./components/ChangeStage";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { StorageKeys } from "@/lib/utils/types/enums";
import { useLocalStorage } from "@mantine/hooks";
import { Role } from "@/lib/utils/types/fniDataTypes";
import { redirect } from "next/navigation";
import DeleteCase from "./components/DeleteCase";

const AdminConfig = () => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [activeTab, setActiveTab] = useState<string | null>("change-stage");

  useEffect(() => {
    if (!!user?.activeRole) {
      if (user?.activeRole !== Role.ADMIN) {
        redirect("/Claims/dashboard");
      }
    }
  }, [user?.activeRole]);

  return (
    <PageWrapper title="Admin Config">
      <Box>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="change-stage">Change Stage</Tabs.Tab>
            <Tabs.Tab value="delete-case">Delete Case</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="change-stage">
            <ChangeStage />
          </Tabs.Panel>
          <Tabs.Panel value="delete-case">
            <DeleteCase />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </PageWrapper>
  );
};

export default AdminConfig;
