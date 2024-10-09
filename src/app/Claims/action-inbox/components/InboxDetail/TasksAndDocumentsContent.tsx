import React from "react";
import { ActionIcon, Box, Divider, Table, Text, Title } from "@mantine/core";
import { BiLink } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import {
  CaseDetail,
  IDashboardData,
  Task,
} from "@/lib/utils/types/fniDataTypes";
import ExtraUploads from "./ExtraUploads";
import { getTasksAndDocs } from "@/lib/helpers";

// TODO: Type here
const DocumentTable = ({ documents, docKey }: any) => (
  <Box key={docKey}>
    <Title order={5} c="cyan" my={8}>
      Documents of {docKey}
    </Title>
    {documents.length > 0 && (
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Document name</Table.Th>
            <Table.Th>Document url</Table.Th>
            <Table.Th>Document location</Table.Th>
            <Table.Th>Is uploaded</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {documents.map((el: any, index: number) => (
            <Table.Tr key={index}>
              <Table.Td>{el?.name}</Table.Td>
              <Table.Td>
                <Box className="flex items-center gap-x-4">
                  {el?.docUrl?.map((url: string, ind: number) => (
                    <ActionIcon
                      key={ind}
                      disabled={!url}
                      variant="light"
                      onClick={() => {
                        window.open(
                          `/Claims/action-inbox/documents?url=${encodeURIComponent(
                            url
                          )}&name=${el.name}`,
                          "_blank"
                        );
                      }}
                    >
                      <BiLink />
                    </ActionIcon>
                  ))}
                </Box>
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  disabled={!el?.location}
                  variant="light"
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps?q=${el?.location?.latitude},${el?.location?.longitude}`,
                      "_blank"
                    );
                  }}
                >
                  <HiLocationMarker />
                </ActionIcon>
              </Table.Td>
              <Table.Td>{el?.docUrl?.length > 0 ? "Yes" : "No"}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    )}
  </Box>
);

const TaskList = ({ tasks }: { tasks: Task[] }) => (
  <>
    {tasks.map((task, ind) => (
      <div
        key={task?._id}
        className="flex justify-between items-center cursor-pointer hover:bg-slate-200"
      >
        <Text py={4}>
          {ind + 1}- {task.name}
        </Text>
        {"✔"}
      </div>
    ))}
  </>
);

const AssignedTasksAndDocs = ({
  caseDetail,
  tasks,
  docs,
  hospitalTasks,
  hospitalDocs,
}: any) => (
  <>
    <Title order={4} ta="center" c="green" my={8}>
      {caseDetail?.allocationType === "Single"
        ? "Tasks Assigned"
        : "Tasks Assigned (Insured Part)"}
    </Title>
    {tasks && tasks.length > 0 && <TaskList tasks={tasks} />}
    <Divider />
    <Title order={4} ta="center" c="green" my={8}>
      {caseDetail?.allocationType === "Single"
        ? "Documents Assigned"
        : "Documents Assigned (Insured Part)"}
    </Title>
    {docs &&
      Object.keys(docs).map((docKey) => (
        <DocumentTable key={docKey} documents={docs[docKey]} docKey={docKey} />
      ))}
    {caseDetail?.allocationType !== "Single" && (
      <>
        <Title order={4} ta="center" c="green" my={8}>
          Tasks Assigned (Hospital Part)
        </Title>
        {hospitalTasks && hospitalTasks.length > 0 && (
          <TaskList tasks={hospitalTasks} />
        )}
        <Divider />
        <Title order={4} ta="center" c="green" my={8}>
          Documents Assigned (Hospital Part)
        </Title>
        {hospitalDocs &&
          Object.keys(hospitalDocs).map((docKey) => (
            <DocumentTable
              key={docKey}
              documents={hospitalDocs[docKey]}
              docKey={docKey}
            />
          ))}
      </>
    )}
  </>
);

type PropTypes = {
  caseDetail: CaseDetail | null;
  dashboardData: IDashboardData | null;
};

const TasksAndDocumentsContent = ({ caseDetail, dashboardData }: PropTypes) => {
  if (!caseDetail || !dashboardData)
    return (
      <Box>
        <Title order={4} ta="center" c="red" my={8}>
          Nothing found
        </Title>
      </Box>
    );

  const { tasksAndDocs, tasksAndDocsHospital } = getTasksAndDocs({
    claimType: dashboardData?.claimType,
    claimCase: caseDetail,
  });

  const { tasks, docs } = tasksAndDocs || {};
  const { tasks: hospitalTasks, docs: hospitalDocs } =
    tasksAndDocsHospital || {};

  return (
    <Box>
      <AssignedTasksAndDocs
        caseDetail={caseDetail}
        tasks={tasks}
        docs={docs}
        hospitalTasks={hospitalTasks}
        hospitalDocs={hospitalDocs}
      />

      <ExtraUploads dashboardData={dashboardData} caseDetail={caseDetail} />
    </Box>
  );
};

export default TasksAndDocumentsContent;
