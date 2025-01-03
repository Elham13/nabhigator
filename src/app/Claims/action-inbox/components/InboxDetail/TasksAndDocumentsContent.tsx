import React, { Dispatch, SetStateAction } from "react";
import {
  ActionIcon,
  Box,
  Divider,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { HiLocationMarker } from "react-icons/hi";
import {
  CaseDetail,
  DocumentData,
  IDashboardData,
  ResponseDoc,
  Role,
  Task,
} from "@/lib/utils/types/fniDataTypes";
import { getTasksAndDocs } from "@/lib/helpers";
import { AccordionItem, CustomAccordion } from "@/components/CustomAccordion";
import dynamic from "next/dynamic";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { StorageKeys } from "@/lib/utils/types/enums";
import { BsEye } from "react-icons/bs";
import { BiCog } from "react-icons/bi";
import ExtraUploadPreAuth from "./ExtraUploads/PreAuth";
import ExtraUploadsReimbursement from "./ExtraUploads/Reimbursement";

const TasksAndDocumentsButtons = dynamic(
  () => import("./TasksAndDocumentsButtons"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);

type DocumentTableProps = {
  documents: DocumentData[];
  docKey: string;
  caseId: string;
  typeOfDoc: "single" | "insured" | "hospital";
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const DocumentTable = ({
  documents,
  docKey,
  caseId,
  typeOfDoc,
  setCaseDetail,
}: DocumentTableProps) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  if (docKey === "NPS Confirmation") return null;

  return (
    <Box key={docKey}>
      <Title order={5} c="cyan" my={8}>
        Documents of {docKey}
      </Title>
      {documents.length > 0 && (
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Document name</Table.Th>
              <Table.Th>Documents Section</Table.Th>
              {!!user?.activeRole &&
                [Role.ADMIN, Role.POST_QA].includes(user.activeRole) && (
                  <Table.Th>Action</Table.Th>
                )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {documents.map((el, index: number) => (
              <Table.Tr key={index}>
                <Table.Td>{el?.name}</Table.Td>
                <Table.Td>
                  {el?.docUrl && el?.docUrl?.length > 0 ? (
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>View</Table.Th>
                          <Table.Th>Location</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {el?.docUrl?.map((url, ind) => {
                          return el?.replacedDocUrls?.includes(url) ||
                            el?.hiddenDocUrls?.includes(url) ? null : (
                            <Table.Tr key={ind}>
                              <Table.Td>
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
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  ) : null}
                </Table.Td>
                {!!user?.activeRole &&
                  [Role.ADMIN, Role.POST_QA].includes(user.activeRole) && (
                    <Table.Td className="flex flex-col gap-4">
                      {!!el?.docUrl &&
                        el?.docUrl?.length > 0 &&
                        el?.docUrl?.map((url: string, ind: number) => {
                          return el?.replacedDocUrls?.includes(url) ? null : (
                            <TasksAndDocumentsButtons
                              key={ind}
                              docIndex={ind}
                              caseId={caseId}
                              url={url}
                              name={el?.name}
                              taskName={docKey}
                              userName={user?.name}
                              isHidden={el?.hiddenDocUrls?.includes(url)}
                              setCaseDetail={setCaseDetail}
                              typeOfDoc={typeOfDoc}
                            />
                          );
                        })}
                    </Table.Td>
                  )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Box>
  );
};

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

type AssignedTasksAndDocsProps = {
  tasks?: Task[];
  docs?: ResponseDoc | null;
  typeOfDoc: "single" | "insured" | "hospital";
  caseId: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const AssignedTasksAndDocs = ({
  tasks,
  docs,
  typeOfDoc,
  caseId,
  setCaseDetail,
}: AssignedTasksAndDocsProps) => (
  <>
    <Title order={4} ta="center" c="green" my={8}>
      Tasks Assigned
    </Title>
    {tasks && tasks.length > 0 && <TaskList tasks={tasks} />}
    <Divider />
    <Title order={4} ta="center" c="green" my={8}>
      Documents Assigned
    </Title>
    {docs &&
      Object.keys(docs).map((docKey) => (
        <DocumentTable
          key={docKey}
          caseId={caseId}
          documents={docs[docKey]}
          docKey={docKey}
          typeOfDoc={typeOfDoc}
          setCaseDetail={setCaseDetail}
        />
      ))}
  </>
);

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
  dashboardData: IDashboardData | null;
};

const TasksAndDocumentsContent = ({
  caseDetail,
  dashboardData,
  setCaseDetail,
}: PropTypes) => {
  if (!caseDetail || !dashboardData)
    return (
      <Box>
        <Title order={4} ta="center" c="red" my={8}>
          Nothing found
        </Title>
      </Box>
    );

  const {
    tasksAndDocs,
    tasksAndDocsHospital,
    preAuthFindings,
    preAuthFindingsHospital,
    rmFindings,
    rmFindingsHospital,
  } = getTasksAndDocs({
    claimType: dashboardData?.claimType,
    claimCase: caseDetail,
  });

  const { tasks, docs } = tasksAndDocs || {};
  const { tasks: hospitalTasks, docs: hospitalDocs } =
    tasksAndDocsHospital || {};

  return (
    <Box>
      {caseDetail?.allocationType === "Single" ? (
        <Stack>
          <AssignedTasksAndDocs
            tasks={tasks}
            docs={docs as ResponseDoc}
            typeOfDoc="single"
            setCaseDetail={setCaseDetail}
            caseId={caseDetail?._id as string}
          />
          {dashboardData?.claimType === "PreAuth" ? (
            <ExtraUploadPreAuth findings={preAuthFindings} />
          ) : (
            <ExtraUploadsReimbursement rmFindings={rmFindings} />
          )}
        </Stack>
      ) : (
        <CustomAccordion>
          <AccordionItem title="Insured Part">
            <AssignedTasksAndDocs
              tasks={tasks}
              docs={docs as ResponseDoc}
              typeOfDoc="insured"
              caseId={caseDetail?._id as string}
              setCaseDetail={setCaseDetail}
            />
            {dashboardData?.claimType === "PreAuth" ? (
              <ExtraUploadPreAuth findings={preAuthFindings} />
            ) : (
              <ExtraUploadsReimbursement rmFindings={rmFindings} />
            )}
          </AccordionItem>
          <AccordionItem title="Hospital Part">
            <AssignedTasksAndDocs
              tasks={hospitalTasks}
              docs={hospitalDocs as ResponseDoc}
              typeOfDoc="hospital"
              caseId={caseDetail?._id as string}
              setCaseDetail={setCaseDetail}
            />
            {dashboardData?.claimType === "PreAuth" ? (
              <ExtraUploadPreAuth findings={preAuthFindingsHospital} />
            ) : (
              <ExtraUploadsReimbursement rmFindings={rmFindingsHospital} />
            )}
          </AccordionItem>
        </CustomAccordion>
      )}
    </Box>
  );
};

export default TasksAndDocumentsContent;
