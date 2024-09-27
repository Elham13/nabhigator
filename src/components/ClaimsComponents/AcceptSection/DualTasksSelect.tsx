import React, { useState } from "react";
import { Tabs } from "@mantine/core";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";
import TasksSelect from "./TasksSelect";
import { useTasks } from "@/lib/providers/TasksAndDocsProvider";

interface PropTypes {
  dashboardData: IDashboardData | null;
}

const DualTasksSelect = ({ dashboardData }: PropTypes) => {
  const { values, setValues } = useTasks();
  const [activeTab, setActiveTab] = useState<string | null>("Insured");

  const handleSetVal = (
    name: "docs" | "tasks" | "investigator",
    value: any,
    ind: 0 | 1
  ) => {
    let tasksAndDocs = values.tasksAndDocs ? [...values?.tasksAndDocs] : [];
    const temp = tasksAndDocs[ind] || {};
    temp[name] = value;
    tasksAndDocs[ind] = temp;
    setValues((prev) => ({ ...prev, tasksAndDocs }));
  };

  return (
    <div className="col-span-2">
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List className="mb-4">
          <Tabs.Tab value="Insured">Insured Part</Tabs.Tab>
          <Tabs.Tab value="Hospital">Hospital Part</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Insured">
          <TasksSelect
            title={`Select Tasks and Documents for ${activeTab} Part`}
            dashboardData={dashboardData}
            documents={
              !!values?.tasksAndDocs[0]?.docs
                ? values?.tasksAndDocs[0]?.docs
                : null
            }
            tasksAssigned={
              !!values?.tasksAndDocs[0]?.tasks &&
              values?.tasksAndDocs[0]?.tasks?.length > 0
                ? values?.tasksAndDocs[0]?.tasks
                : []
            }
            onDocsChange={(docs) => handleSetVal("docs", docs, 0)}
            onTasksChange={(tasks) => handleSetVal("tasks", tasks, 0)}
            getSelectedInvestigator={(id) =>
              handleSetVal("investigator", id, 0)
            }
          />
        </Tabs.Panel>

        <Tabs.Panel value="Hospital">
          <TasksSelect
            title={`Select Tasks and Documents for ${activeTab} Part`}
            dashboardData={dashboardData}
            documents={
              !!values?.tasksAndDocs[1]?.docs
                ? values?.tasksAndDocs[1]?.docs
                : null
            }
            tasksAssigned={
              !!values?.tasksAndDocs[1]?.tasks &&
              values?.tasksAndDocs[1]?.tasks?.length > 0
                ? values?.tasksAndDocs[1]?.tasks
                : []
            }
            onDocsChange={(docs) => handleSetVal("docs", docs, 1)}
            onTasksChange={(tasks) => handleSetVal("tasks", tasks, 1)}
            getSelectedInvestigator={(id) =>
              handleSetVal("investigator", id, 1)
            }
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default DualTasksSelect;
