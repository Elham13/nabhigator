import React, { useState } from "react";
import { Box, Button, Flex, Modal, Text, TextInput } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import { toast } from "react-toastify";
import {
  IDashboardData,
  NumericStage,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";

const commonText = (
  <span>
    By skipping investigation the case will move out of investigator&apos;s
    bucket and he won&apos;t be able to perform any action,{" "}
  </span>
);

const skipAndCompleteText = (
  <Text>
    {commonText}
    <span className="font-bold">
      and you have to complete the investigator&apos;s tasks.
    </span>
  </Text>
);
const skipAndReAssignText = (
  <Text>
    {commonText}
    <span className="font-bold">
      and you have to Re-Assign the case to another investigator.
    </span>
  </Text>
);
const cancelText = (
  <Text>
    This action will return the case back to investigation bucket where it was
    before
  </Text>
);

type PropTypes = {
  dashboardData: IDashboardData | null;
  onDone: () => void;
};

type TModal = {
  open: boolean;
  action: "skipAndCompletePreQC" | "skipAndReassign" | "cancel" | "";
};

const modalInitials: TModal = { open: false, action: "" };

const SkipInvestigation = ({ dashboardData, onDone }: PropTypes) => {
  const [modal, setModal] = useState<TModal>(modalInitials);
  const [loading, setLoading] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>("");
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const handleSkip = async () => {
    setLoading(true);
    try {
      if (!remarks) throw new Error("Please add your remarks");
      const { data } = await axios.post<SingleResponseType<IDashboardData>>(
        EndPoints.UPDATE_DASHBOARD_DATA,
        {
          id: dashboardData?._id,
          action:
            modal?.action === "skipAndCompletePreQC"
              ? "skipInvestigationAndComplete"
              : modal?.action === "skipAndReassign"
              ? "skipInvestigationAndReAssign"
              : "cancelSkipInvestigation",
          userId: user?._id,
          remarks,
          userName: user?.name,
        }
      );
      toast.success(data?.message);
      setModal(modalInitials);
      onDone();
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={8}>
      {dashboardData?.stage &&
      dashboardData.stage ===
        NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING ? (
        <Button
          color="orange"
          onClick={() => setModal({ open: true, action: "cancel" })}
        >
          Pass back to same investigator
        </Button>
      ) : (
        <Flex gap={4}>
          <Button
            onClick={() =>
              setModal({ open: true, action: "skipAndCompletePreQC" })
            }
            color="green"
          >
            Skip And Complete Pre QC
          </Button>
          <Button
            onClick={() => setModal({ open: true, action: "skipAndReassign" })}
          >
            Skip And Re-Assign
          </Button>
        </Flex>
      )}

      {modal && (
        <Modal
          opened={modal.open}
          onClose={() => setModal(modalInitials)}
          title={
            <Text fw="bold">
              {modal?.action === "cancel"
                ? "Pass back to investigation"
                : "Skipping investigation"}
            </Text>
          }
          centered
          size="lg"
        >
          <Box mt={20}>
            <Box>
              {modal?.action === "skipAndCompletePreQC"
                ? skipAndCompleteText
                : modal?.action === "skipAndReassign"
                ? skipAndReAssignText
                : cancelText}
              <Text>By clicking confirm you agree to proceed</Text>
              <Text>Are you sure to proceed?</Text>

              <TextInput
                className="mt-4"
                label="Remarks"
                placeholder="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
                withAsterisk
              />
            </Box>
            <Flex columnGap={10} mt={50}>
              <Button loading={loading} color="green" onClick={handleSkip}>
                Confirm
              </Button>
              <Button color="red" onClick={() => setModal(modalInitials)}>
                Cancel
              </Button>
            </Flex>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default SkipInvestigation;
