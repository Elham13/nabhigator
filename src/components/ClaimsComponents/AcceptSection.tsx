import React, { useEffect } from "react";
import { Box, Flex, Group, Radio, ActionIcon } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { GrClose } from "react-icons/gr";
import {
  CaseDetail,
  IDashboardData,
  NumericStage,
  Role,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { StorageKeys } from "@/lib/utils/types/enums";

import dynamic from "next/dynamic";
import { useTasks } from "@/lib/providers/TasksAndDocsProvider";
import { BiCog } from "react-icons/bi";

const SingleAllocationTasks = dynamic(
  () => import("./AcceptSection/SingleAllocationTasks"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const DualAllocationTasks = dynamic(
  () => import("./AcceptSection//DualAllocationTasks"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);

type PropType = {
  dashboardData: IDashboardData | null;
  caseDetail: CaseDetail | null;
  onClose?: () => void;
};

const AcceptSection = ({ dashboardData, caseDetail, onClose }: PropType) => {
  const { tasksState, dispatch } = useTasks();
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const setAllocationType = (val: string) => {
    const value = val as "Single" | "Dual";
    let newState = { ...tasksState, allocationType: value };
    if (value === "Single") {
      const { insuredAddress, insuredCity, insuredPinCode, insuredState } =
        newState;
      if (insuredAddress || insuredCity || insuredPinCode || insuredState) {
        newState = {
          ...newState,
          insuredAddress: "",
          insuredCity: "",
          insuredPinCode: 0,
          insuredState: "",
        };
      }
    }
    dispatch({ type: "change_state", value: newState });
  };

  useEffect(() => {
    dispatch({
      type: "change_state",
      value: {
        ...tasksState,
        caseType: ["PED/NDC", "Genuineness"],
        dashboardDataId: dashboardData?._id as string,
      },
    });
  }, [dashboardData?._id]);

  useEffect(() => {
    // Prefill values with the database values
    if (
      [
        Role.ALLOCATION,
        Role.ADMIN,
        Role.TL,
        Role.CLUSTER_MANAGER,
        Role.POST_QA,
      ].includes(user?.activeRole) &&
      caseDetail
    ) {
      dispatch({
        type: "change_state",
        value: {
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
    }
  }, [user?.activeRole, caseDetail]);

  return (
    <Box mt={20}>
      <Flex c="green" justify="end">
        <ActionIcon onClick={() => (!!onClose ? onClose() : null)}>
          <GrClose />
        </ActionIcon>
      </Flex>
      <Radio.Group
        name="favoriteFramework"
        withAsterisk
        mt={20}
        value={tasksState?.allocationType}
        onChange={setAllocationType}
      >
        <Group mt="xs">
          <Radio
            value="Single"
            label="Single Allocation"
            disabled={
              dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
            }
          />
          <Radio
            value="Dual"
            label="Dual Allocation"
            disabled={
              dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
            }
          />
        </Group>
      </Radio.Group>

      {tasksState?.allocationType === "Single" ? (
        <SingleAllocationTasks dashboardData={dashboardData} />
      ) : tasksState?.allocationType === "Dual" ? (
        <DualAllocationTasks dashboardData={dashboardData} />
      ) : null}
    </Box>
  );
};

export default AcceptSection;
