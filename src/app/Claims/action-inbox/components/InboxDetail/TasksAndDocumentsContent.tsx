import React from "react";
import { ActionIcon, Box, Divider, Table, Text, Title } from "@mantine/core";
import { BiLink } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import {
  CaseDetail,
  IDashboardData,
  ResponseDoc,
} from "@/lib/utils/types/fniDataTypes";
import ExtraUploads from "./ExtraUploads";

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

  const { tasksAssigned: tasks } = caseDetail;
  const documents = caseDetail?.documents as ResponseDoc;

  return (
    <Box>
      <Title order={4} ta="center" c="green" my={8}>
        Tasks Assigned
      </Title>
      {tasks &&
        tasks?.length > 0 &&
        tasks?.map((task, ind) => (
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

      <Divider />
      <Title order={4} ta="center" c="green" my={8}>
        Documents Assigned
      </Title>
      {documents &&
        Object.keys(documents)?.map((docKey, ind) => {
          const doc = documents[docKey];
          return (
            <Box key={ind}>
              <Title order={5} c="cyan" my={8}>
                Documents of {docKey}
              </Title>
              {doc?.length > 0 && (
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
                    {doc.map((el, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>{el?.name}</Table.Td>
                        <Table.Td>
                          <Box className="flex items-center gap-x-4">
                            {el?.docUrl &&
                              el?.docUrl?.length > 0 &&
                              el?.docUrl?.map((url, ind) => (
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
                        <Table.Td>
                          {el?.docUrl?.length > 0 ? "Yes" : "No"}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </Box>
          );
        })}

      <ExtraUploads dashboardData={dashboardData} caseDetail={caseDetail} />
    </Box>
  );
};

export default TasksAndDocumentsContent;
