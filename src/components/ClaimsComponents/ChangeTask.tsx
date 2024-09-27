import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Radio,
  SimpleGrid,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import { toast } from "react-toastify";
import InvestigatorsList from "./InvestigatorsList";
import {
  alcoholAddictionOptionsArray,
  genuinenessOptionsArray,
  mainDropdownOptions,
  mainObjectOptionsMap,
  mainPartOptions,
  pedOptionsArray,
} from "@/lib/utils/constants/options";
import {
  AcceptedValues,
  AssignToInvestigatorRes,
  CaseDetail,
  DocumentMap,
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import { changeTaskInitialValues } from "@/lib/utils/constants";
import SingleAllocationTasks from "./AcceptSection/SingleAllocationTasks";
import DualAllocationTasks from "./AcceptSection/DualAllocationTasks";
import { useTasks } from "@/lib/providers/TasksAndDocsProvider";

const dependentOptionsMap = {
  PED: pedOptionsArray,
  Gen: genuinenessOptionsArray,
  Alc: alcoholAddictionOptionsArray,
};

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
  const { values, setValues } = useTasks();

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      dashboardDataId: dashboardData?._id as string,
    }));
  }, [dashboardData?._id]);

  useEffect(() => {
    if (caseDetail)
      setValues({
        _id: caseDetail?._id as string,
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
  }, [dashboardData?.caseId, caseDetail]);

  return (
    <Paper>
      <Radio.Group
        name="favoriteFramework"
        withAsterisk
        mt={20}
        value={values.allocationType}
      >
        <Group mt="xs">
          <Radio value="Single" label="Single Allocation" disabled />
          <Radio value="Dual" label="Dual Allocation" disabled />
        </Group>
      </Radio.Group>

      {values?.allocationType === "Single" ? (
        <SingleAllocationTasks
          dashboardData={dashboardData}
          isChangeTask
          onSuccess={onSuccess}
          postQaComment={postQaComment}
        />
      ) : values?.allocationType === "Dual" ? (
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
