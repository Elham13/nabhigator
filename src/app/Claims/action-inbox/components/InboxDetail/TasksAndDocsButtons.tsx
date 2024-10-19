import React, { Dispatch, SetStateAction } from "react";
import { Button, Grid } from "@mantine/core";
import { BiTask } from "react-icons/bi";
import { IoDocumentAttachOutline } from "react-icons/io5";
import {
  CaseDetail,
  IShowElement,
  ITasksAndDocuments,
  ResponseDoc,
  Task,
} from "@/lib/utils/types/fniDataTypes";
import PopConfirm from "@/components/PopConfirm";
import { getTasksAndDocs } from "@/lib/helpers";
import { toast } from "react-toastify";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { IRMFindings } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  id: string;
  caseData: CaseDetail | null;
  claimType?: "PreAuth" | "Reimbursement";
  setShowElement: Dispatch<SetStateAction<IShowElement>>;
};

const TasksAndDocsButtons = ({
  id,
  caseData,
  claimType,
  setShowElement,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const router = useRouter();

  const { tasksAndDocs, tasksAndDocsHospital, rmFindings, rmFindingsHospital } =
    getTasksAndDocs({
      claimType,
      claimCase: caseData,
    });

  const checkIfCanSubmit = () => {
    const validateTasks = (tasks?: Task[]) => {
      if (!tasks) throw new Error("Failed to find any data");
      if (!tasks.length) throw new Error("No tasks are there to submit");

      const incompleteTask = tasks.find((task) => !task?.completed);
      if (incompleteTask) {
        throw new Error(
          `Tasks of ${incompleteTask?.name || "-"} part are not completed`
        );
      }
    };

    const validateDocs = (docs: ResponseDoc) => {
      if (!docs || Object.keys(docs).length < 1) return true;

      for (const doc in docs) {
        if (doc === "NPS Confirmation") continue;
        const docArr = docs[doc];
        if (docArr.some((el) => !el.docUrl || el.docUrl.length === 0)) {
          throw new Error(`Documents of ${doc} are not uploaded`);
        }
      }
    };

    const validateFindings = (findings: IRMFindings | null) => {
      if (
        !findings?.recommendation?.value ||
        !findings?.investigationSummary ||
        !findings?.discrepanciesOrIrregularitiesObserved ||
        !findings?.otherRecommendation?.length
      ) {
        throw new Error("Common Form tasks are not completed");
      }
    };

    try {
      if (!caseData) throw new Error("No Data found to submit");

      const validateClaim = (
        tasksAndDocs: ITasksAndDocuments | null,
        findings: IRMFindings | null
      ) => {
        validateTasks(tasksAndDocs?.tasks);
        validateFindings(findings);
        validateDocs(tasksAndDocs?.docs as ResponseDoc);
      };

      if (claimType === "Reimbursement") {
        validateClaim(tasksAndDocs, rmFindings);

        if (caseData?.allocationType === "Dual") {
          validateClaim(tasksAndDocsHospital, rmFindingsHospital);
        }
      } else if (claimType === "PreAuth") {
        validateClaim(tasksAndDocs, null);

        if (caseData?.allocationType === "Dual") {
          validateClaim(tasksAndDocsHospital, null);
        }
      } else {
        throw new Error("Invalid claimType value");
      }

      return true;
    } catch (error: any) {
      toast.warn(error?.message);
      return false;
    }
  };

  const { refetch: submit, loading: submitLoading } = useAxios<any>({
    config: { url: EndPoints.INVESTIGATOR_SUBMIT, method: "POST" },
    dependencyArr: [],
    isMutation: true,
    onDone: (res) => {
      toast.success("Completed Successfully");
      router.replace("/Claims/consolidated-inbox");
    },
  });

  const handleSubmit = () => {
    const payload = {
      id,
      userId: user?._id,
      userName: user?.name,
      type: "notInvestigator",
    };

    const canSubmit = checkIfCanSubmit();

    if (canSubmit) submit(payload);
  };

  return (
    <Grid gutter={10} mt={18}>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Button
          fullWidth
          variant="outline"
          onClick={() =>
            setShowElement((prev) => ({
              ...prev,
              completeTasks: true,
            }))
          }
        >
          Complete Tasks&nbsp;
          <BiTask />
        </Button>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Button
          fullWidth
          variant="outline"
          onClick={() =>
            setShowElement((prev) => ({
              ...prev,
              completeDocuments: true,
            }))
          }
        >
          Complete Documents&nbsp;
          <IoDocumentAttachOutline />
        </Button>
      </Grid.Col>
      <Grid.Col span={12}>
        <PopConfirm
          title="Complete and submit"
          description="Are you sure you want to submit this case?"
          onConfirm={handleSubmit}
        >
          <Button fullWidth loading={submitLoading}>
            Complete And Submit&nbsp;
            <IoDocumentAttachOutline />
          </Button>
        </PopConfirm>
      </Grid.Col>
    </Grid>
  );
};

export default TasksAndDocsButtons;
