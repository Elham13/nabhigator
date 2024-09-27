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
import { Spin } from "antd";

import dynamic from "next/dynamic";
import { useTasks } from "@/lib/providers/TasksAndDocsProvider";

const SingleAllocationTasks = dynamic(
  () => import("./AcceptSection/SingleAllocationTasks"),
  {
    ssr: false,
    loading: () => <Spin />,
  }
);
const DualAllocationTasks = dynamic(
  () => import("./AcceptSection//DualAllocationTasks"),
  {
    ssr: false,
    loading: () => <Spin />,
  }
);

type PropType = {
  dashboardData: IDashboardData | null;
  caseDetail: CaseDetail | null;
  onClose?: () => void;
};

const AcceptSection = ({ dashboardData, caseDetail, onClose }: PropType) => {
  const { values, setValues } = useTasks();
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const setAllocationType = (val: string) => {
    const value = val as "Single" | "Dual";
    if (value === "Single") {
      const { insuredAddress, insuredCity, insuredPinCode, insuredState } =
        values;
      if (insuredAddress || insuredCity || insuredPinCode || insuredState) {
        setValues((prev) => ({
          ...prev,
          insuredAddress: "",
          insuredCity: "",
          insuredPinCode: 0,
          insuredState: "",
        }));
      }
    }
    setValues((prev) => ({
      ...prev,
      allocationType: value,
    }));
  };

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      caseType: ["PED/NDC", "Genuineness"],
      dashboardDataId: dashboardData?._id as string,
    }));
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
      setValues({
        tasksAndDocs: caseDetail?.tasksAndDocs || [],
        allocationType: caseDetail?.allocationType,
        caseType: caseDetail?.caseType,
        caseTypeDependencies: caseDetail?.caseTypeDependencies,
        caseStatus: caseDetail?.caseStatus,
        dashboardDataId: caseDetail?.dashboardDataId,
        documents: caseDetail?.documents,
        investigator: caseDetail?.investigator,
        preQcObservation: caseDetail?.preQcObservation,
        tasksAssigned: caseDetail?.tasksAssigned,
        insuredAddress: caseDetail?.insuredAddress,
        insuredCity: caseDetail?.insuredCity,
        insuredState: caseDetail?.insuredState,
        insuredPinCode: caseDetail?.insuredPinCode,
        allocatorComment: caseDetail?.allocatorComment,
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
        value={values?.allocationType}
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

      {values?.allocationType === "Single" ? (
        <SingleAllocationTasks dashboardData={dashboardData} />
      ) : values?.allocationType === "Dual" ? (
        <DualAllocationTasks dashboardData={dashboardData} />
      ) : null}
    </Box>
  );
};

export default AcceptSection;
