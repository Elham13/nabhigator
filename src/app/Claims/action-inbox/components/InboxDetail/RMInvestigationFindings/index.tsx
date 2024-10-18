import React, { Dispatch, SetStateAction, useMemo } from "react";
import { AccordionItem, CustomAccordion } from "@/components/CustomAccordion";
import {
  CaseDetail,
  IDashboardData,
  ITasksAndDocuments,
} from "@/lib/utils/types/fniDataTypes";
import { IRMFindings } from "@/lib/utils/types/rmDataTypes";
import Tasks from "./Tasks";
import { Box, Title } from "@mantine/core";
import CommonFormComponent from "../CommonFormComponent";

type PropTypes = {
  tasksAndDocs: ITasksAndDocuments | null;
  rmFindings: IRMFindings | null;
  caseDetail: CaseDetail | null;
  dashboardData: IDashboardData | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const RMInvestigationFindings = ({
  tasksAndDocs,
  rmFindings,
  caseDetail,
  dashboardData,
  setCaseDetail,
}: PropTypes) => {
  const items = useMemo(() => {
    if (
      tasksAndDocs &&
      tasksAndDocs?.tasks &&
      tasksAndDocs?.tasks?.length > 0
    ) {
      tasksAndDocs?.tasks?.map((task) => (
        <AccordionItem key={task?.name} title={task?.name}>
          <Tasks
            taskName={task?.name}
            data={dashboardData}
            caseId={caseDetail?._id as string}
            findings={rmFindings}
            setCaseDetail={setCaseDetail}
          />
        </AccordionItem>
      ));
      return [];
    } else return [];
  }, [tasksAndDocs]);

  return (
    <Box>
      <Title order={3}>Tasks Assigned</Title>
      <CustomAccordion>{items}</CustomAccordion>
      <CommonFormComponent
        findings={rmFindings}
        claimId={dashboardData?.claimId}
        caseId={caseDetail?._id as string}
        setCaseDetail={setCaseDetail}
      />
    </Box>
  );
};

export default RMInvestigationFindings;
