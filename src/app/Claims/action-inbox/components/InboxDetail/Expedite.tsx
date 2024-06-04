import React, { useState } from "react";
import { Box, Button, Flex, Modal, TextInput } from "@mantine/core";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocalStorage } from "@mantine/hooks";
import {
  IDashboardData,
  IUser,
  NumericStage,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";

type PropTypes = {
  dashboardData: IDashboardData | null;
};

const Expedite = ({ dashboardData }: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [remark, setRemark] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!dashboardData?.claimId) throw new Error("claimId is required");

      let investigatorId: string[] = [];

      if (
        [
          NumericStage.INVESTIGATION_ACCEPTED,
          NumericStage.IN_FIELD_FRESH,
          NumericStage.IN_FIELD_REINVESTIGATION,
        ]?.includes(dashboardData?.stage)
      ) {
        investigatorId = dashboardData?.claimInvestigators?.map(
          (el) => el?._id
        );
      }

      const payload = {
        currentStage: dashboardData?.stage,
        claimId: dashboardData?.claimId,
        message: remark,
        investigatorId,
        subject: user?.name,
        role: user?.activeRole,
      };

      const { data } = await axios.post<SingleResponseType<IUser>>(
        EndPoints.EXPEDITE_CASE,
        payload
      );
      toast.success(data?.message);
      setOpen(false);
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button onClick={() => setOpen(true)}>Expedite</Button>
      {open ? (
        <Modal
          opened={open}
          onClose={() => setOpen(false)}
          title="Add your remark"
          centered
          size="lg"
        >
          <Box mt={20}>
            <Box>
              <TextInput
                label="Remark"
                placeholder="Your remark for the user"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Box>
            <Flex columnGap={10} mt={50}>
              <Button
                color="green"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
              >
                Confirm
              </Button>
              <Button color="red" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </Flex>
          </Box>
        </Modal>
      ) : null}
    </div>
  );
};

export default Expedite;
