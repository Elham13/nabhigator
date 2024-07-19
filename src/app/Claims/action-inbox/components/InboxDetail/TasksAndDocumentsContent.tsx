import React from "react";
import { ActionIcon, Box, Divider, Table, Text, Title } from "@mantine/core";
import { HiLocationMarker } from "react-icons/hi";
import { DocumentData, Role, Task } from "@/lib/utils/types/fniDataTypes";
import { Flex, Spin } from "antd";
import dynamic from "next/dynamic";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { StorageKeys } from "@/lib/utils/types/enums";
import { useLocalStorage } from "@mantine/hooks";
import { BsEye } from "react-icons/bs";
const TasksAndDocumentsButtons = dynamic(
  () => import("./TasksAndDocumentsButtons"),
  {
    ssr: false,
    loading: () => <Spin />,
  }
);

type PropTypes = {
  caseId: string;
  tasks: Task[];
  documents: Record<string, DocumentData[]>;
  refetchCaseDetail: () => void;
};

const TasksAndDocumentsContent = ({
  caseId,
  tasks,
  documents,
  refetchCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

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
                    {doc.map((el, index) => {
                      return [Role.ADMIN].includes(user?.activeRole) ? (
                        <Table.Tr key={index}>
                          <Table.Td>{el?.name}</Table.Td>
                          <Table.Td>
                            <Flex gap={4}>
                              {el?.docUrl &&
                                el?.docUrl?.length > 0 &&
                                el?.docUrl?.map((url, ind) => {
                                  return el?.replacedDocUrls?.includes(
                                    url
                                  ) ? null : (
                                    <TasksAndDocumentsButtons
                                      key={ind}
                                      docIndex={ind}
                                      caseId={caseId}
                                      url={url}
                                      name={el?.name}
                                      taskName={docKey}
                                      userName={user?.name}
                                      isHidden={el?.hiddenDocUrls?.includes(
                                        url
                                      )}
                                      refetchCaseDetail={refetchCaseDetail}
                                    />
                                  );
                                })}
                            </Flex>
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
                      ) : (
                        <Table.Tr key={index}>
                          <Table.Td>{el?.name}</Table.Td>
                          <Table.Td>
                            <Flex gap={4}>
                              {el?.docUrl &&
                                el?.docUrl?.length > 0 &&
                                el?.docUrl?.map((url, ind) => {
                                  return el?.replacedDocUrls?.includes(
                                    url
                                  ) ? null : el?.hiddenDocUrls?.includes(
                                      url
                                    ) ? (
                                    "-"
                                  ) : (
                                    <ActionIcon
                                      key={ind}
                                      disabled={!url}
                                      variant="light"
                                      title="View"
                                      onClick={() => {
                                        window.open(
                                          `/Claims/action-inbox/documents?url=${encodeURIComponent(
                                            url
                                          )}&name=${el?.name}`,
                                          "_blank"
                                        );
                                      }}
                                    >
                                      <BsEye />
                                    </ActionIcon>
                                  );
                                })}
                            </Flex>
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
                      );
                    })}
                  </Table.Tbody>
                </Table>
              )}
            </Box>
          );
        })}
    </Box>
  );
};

export default TasksAndDocumentsContent;
