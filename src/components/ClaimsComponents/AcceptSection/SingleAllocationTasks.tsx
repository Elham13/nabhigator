import React, { useState } from "react";
import {
  AcceptedValues,
  AssignToInvestigatorRes,
  IDashboardData,
  NumericStage,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { useLocalStorage } from "@mantine/hooks";
import { showError, validateTasksAndDocs } from "@/lib/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Button,
  Flex,
  Modal,
  MultiSelect,
  SimpleGrid,
  Textarea,
} from "@mantine/core";
import {
  alcoholAddictionOptionsArray,
  genuinenessOptionsArray,
  mainDropdownOptions,
  pedOptionsArray,
} from "@/lib/utils/constants/options";
import TasksSelect from "./TasksSelect";
import { useTasks } from "@/lib/providers/TasksAndDocsProvider";

const dependentOptionsMap = {
  PED: pedOptionsArray,
  Gen: genuinenessOptionsArray,
  Alc: alcoholAddictionOptionsArray,
};

interface PropTypes {
  dashboardData: IDashboardData | null;
  isChangeTask?: boolean;
  postQaComment?: string;
  onSuccess?: () => void;
}

const SingleAllocationTasks = ({
  dashboardData,
  isChangeTask,
  postQaComment,
  onSuccess,
}: PropTypes) => {
  const { values, setValues } = useTasks();
  const router = useRouter();
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  const handleSelect = (
    name: keyof AcceptedValues,
    value: string | string[] | null
  ) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validateValues = () => {
    try {
      if (values?.caseType && values?.caseType?.length > 0) {
        if (user?.config?.triggerSubType === "Mandatory") {
          values?.caseType?.map((item) => {
            const subTrigger = values?.caseTypeDependencies?.[item];
            if (!subTrigger || subTrigger?.length === 0)
              throw new Error(`Sub-Trigger ${item} is required`);
          });
        }
      } else {
        throw new Error("Triggers is required");
      }

      if (!values?.preQcObservation)
        throw new Error("Pre-Qc observation is required!");

      if (values?.tasksAndDocs?.length !== 1)
        throw new Error("Please select tasks and documents");

      const inv = values?.tasksAndDocs[0]?.investigator;

      if (dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION && !inv)
        throw new Error("Please select an investigator");

      validateTasksAndDocs({ tasksAndDocs: values?.tasksAndDocs, ind: 0 });

      if (
        dashboardData?.stage !== NumericStage.PENDING_FOR_ALLOCATION &&
        !inv
      ) {
        setConfirm(true);
        return false;
      }

      return true;
    } catch (err: any) {
      showError(err);
      return false;
    }
  };

  const sendRequest = async () => {
    try {
      setSubmitting(true);

      const tasksAndDocs = values?.tasksAndDocs?.map((el) => ({
        ...el,
        docs: el?.docs
          ? el?.docs instanceof Map
            ? Array.from(el?.docs?.entries())
            : Array.from(new Map(Object.entries(el?.docs)).entries())
          : null,
      }));

      const payload = {
        ...values,
        tasksAndDocs,
        caseStatus: "Accepted",
        user,
      };

      if (isChangeTask) {
        if (!dashboardData?.caseId) throw new Error("_id is missing");
        if (!postQaComment) throw new Error("Please add your comment");
        payload.postQaComment = postQaComment;
        payload._id = dashboardData?.caseId as string;
        const { data } = await axios.post<
          SingleResponseType<AssignToInvestigatorRes>
        >(EndPoints.CHANGE_TASK, payload);
        toast.success(data?.message);
        if (onSuccess) onSuccess();
      } else {
        const { data } = await axios.post<
          SingleResponseType<AssignToInvestigatorRes>
        >(EndPoints.ASSIGN_TO_INVESTIGATOR, payload);
        toast.success(data?.message);
        setConfirm(false);
        router.replace("/Claims/action-inbox");
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateValues()) {
      setSubmitting(true);
      try {
        await sendRequest();
      } catch (error) {
        showError(error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSetVal = (
    name: "docs" | "tasks" | "investigator",
    value: any
  ) => {
    const tasksAndDocs = values?.tasksAndDocs;
    const temp = tasksAndDocs[0] || {};
    temp[name] = value;
    tasksAndDocs[0] = temp;

    setValues((prev) => ({ ...prev, tasksAndDocs }));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <SimpleGrid cols={{ sm: 1, md: 2 }}>
        <MultiSelect
          label="Triggers"
          placeholder="Select triggers"
          value={values?.caseType || []}
          onChange={(val) => handleSelect("caseType", val)}
          data={mainDropdownOptions}
          checkIconPosition="right"
          searchable
          hidePickedOptions
          clearable
          required={values?.caseType?.length < 1}
          withAsterisk
          disabled={
            dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
          }
        />
        {values?.caseType?.length > 0 &&
          dashboardData?.claimType !== "PreAuth" &&
          values?.caseType?.map((item, ind) => {
            const options =
              dependentOptionsMap[
                item?.slice(0, 3) as keyof typeof dependentOptionsMap
              ];
            return options ? (
              <MultiSelect
                key={ind}
                label={item}
                placeholder={`Select ${item}`}
                value={values?.caseTypeDependencies?.[item] || []}
                onChange={(val) =>
                  setValues((prev) => ({
                    ...prev,
                    caseTypeDependencies: {
                      ...prev.caseTypeDependencies,
                      [item]: val,
                    },
                  }))
                }
                data={options}
                checkIconPosition="right"
                searchable
                hidePickedOptions
                clearable
                disabled={
                  dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
                }
                required={user?.config?.triggerSubType === "Mandatory"}
              />
            ) : null;
          })}
        <Textarea
          className="col-span-1 md:col-span-2"
          label="Pre-QC Observation"
          description="Mention pre-qc observation based on information and documents due deligence"
          placeholder="Pre-QC Observation"
          value={values?.preQcObservation || ""}
          required
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              preQcObservation: e?.currentTarget?.value || "",
            }))
          }
          disabled={
            dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
          }
        />
        {values?.caseType?.length > 0 && (
          <TasksSelect
            title="Task and Documents assignment"
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
            onDocsChange={(docs) => handleSetVal("docs", docs)}
            onTasksChange={(tasks) => handleSetVal("tasks", tasks)}
            getSelectedInvestigator={(id) => handleSetVal("investigator", id)}
          />
        )}
        {dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION && (
          <Textarea
            className="col-span-1 md:col-span-2"
            label="Allocator's comment"
            placeholder="Enter your comment"
            value={values?.allocatorComment || ""}
            required
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                allocatorComment: e?.currentTarget?.value || "",
              }))
            }
          />
        )}
        <Button loading={submitting} type="submit">
          Submit
        </Button>
      </SimpleGrid>

      {confirm && (
        <Modal
          opened={confirm}
          onClose={() => setConfirm(false)}
          title="Confirm"
        >
          You have not selected any investigators. If you proceed, the case will
          be auto assigned to an investigator, or it will fall into allocation
          bucket if no investigator found. Are you sure you want to proceed?
          <Flex gap={10} mt={10}>
            <Button
              onClick={() => {
                sendRequest();
              }}
              loading={submitting}
            >
              Proceed
            </Button>
            <Button onClick={() => setConfirm(false)} color="red">
              Cancel
            </Button>
          </Flex>
        </Modal>
      )}
    </form>
  );
};

export default SingleAllocationTasks;
