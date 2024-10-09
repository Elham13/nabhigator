import React, { useState } from "react";
import { Tabs } from "@mantine/core";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";
import TasksSelect from "./TasksSelect";
import { useTasks } from "@/lib/providers/TasksAndDocsProvider";

interface PropTypes {
  dashboardData: IDashboardData | null;
}

const DualTasksSelect = ({ dashboardData }: PropTypes) => {
  const [activeTab, setActiveTab] = useState<string | null>("Insured");

  return (
    <div className="col-span-2">
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        keepMounted={false}
        variant="pills"
      >
        <Tabs.List className="mb-4">
          <Tabs.Tab value="Insured">Insured Part</Tabs.Tab>
          <Tabs.Tab value="Hospital">Hospital Part</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Insured">
          <TasksSelect
            title={`Select Tasks and Documents for ${activeTab} Part`}
            dashboardData={dashboardData}
            part="Insured"
          />
        </Tabs.Panel>

        <Tabs.Panel value="Hospital">
          <TasksSelect
            title={`Select Tasks and Documents for ${activeTab} Part`}
            dashboardData={dashboardData}
            part="Hospital"
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default DualTasksSelect;
