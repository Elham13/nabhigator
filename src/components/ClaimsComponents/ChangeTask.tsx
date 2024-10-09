import React, { useEffect } from "react";
import { Group, Paper, Radio } from "@mantine/core";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import SingleAllocationTasks from "./AcceptSection/SingleAllocationTasks";
import DualAllocationTasks from "./AcceptSection/DualAllocationTasks";
import { useTasks } from "@/lib/providers/TasksAndDocsProvider";

type PropType = {
  dashboardData: IDashboardData | null;
  caseDetail: CaseDetail | null;
  postQaComment: string;
  onSuccess: () => void;
};

const ChangeTask = ({
  dashboardData,
  caseDetail,
  postQaComment,
  onSuccess,
}: PropType) => {
  const { tasksState, dispatch } = useTasks();

  useEffect(() => {
    dispatch({
      type: "change_state",
      value: { ...tasksState, dashboardDataId: dashboardData?._id as string },
    });
  }, [dashboardData?._id]);

  useEffect(() => {
    if (caseDetail)
      dispatch({
        type: "change_state",
        value: {
          _id: caseDetail?._id as string,
          singleTasksAndDocs: caseDetail?.singleTasksAndDocs,
          insuredTasksAndDocs: caseDetail?.insuredTasksAndDocs,
          hospitalTasksAndDocs: caseDetail?.hospitalTasksAndDocs,
          allocationType: caseDetail?.allocationType,
          caseType: caseDetail?.caseType,
          caseTypeDependencies: caseDetail?.caseTypeDependencies,
          caseStatus: caseDetail?.caseStatus,
          dashboardDataId: caseDetail?.dashboardDataId,
          preQcObservation: caseDetail?.preQcObservation,
          insuredAddress: caseDetail?.insuredAddress,
          insuredCity: caseDetail?.insuredCity,
          insuredState: caseDetail?.insuredState,
          insuredPinCode: caseDetail?.insuredPinCode,
          allocatorComment: caseDetail?.allocatorComment,
        },
      });
  }, [dashboardData?.caseId, caseDetail]);

  return (
    <Paper>
      <Radio.Group
        name="favoriteFramework"
        withAsterisk
        mt={20}
        value={tasksState.allocationType}
      >
        <Group mt="xs">
          <Radio value="Single" label="Single Allocation" disabled />
          <Radio value="Dual" label="Dual Allocation" disabled />
        </Group>
      </Radio.Group>

      {tasksState?.allocationType === "Single" ? (
        <SingleAllocationTasks
          dashboardData={dashboardData}
          isChangeTask
          onSuccess={onSuccess}
          postQaComment={postQaComment}
        />
      ) : tasksState?.allocationType === "Dual" ? (
        <DualAllocationTasks
          dashboardData={dashboardData}
          isChangeTask
          onSuccess={onSuccess}
          postQaComment={postQaComment}
        />
      ) : null}
    </Paper>
  );
};

export default ChangeTask;
