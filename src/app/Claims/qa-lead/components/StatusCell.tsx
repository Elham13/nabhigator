import React, { Fragment, useState } from "react";
import { IUser, ResponseType } from "@/lib/utils/types/fniDataTypes";
import { toast } from "react-toastify";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import {
  Badge,
  Button,
  Flex,
  Grid,
  Modal,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";

type PropTypes = { user: IUser; refetch: () => void };

interface ILeave {
  fromDate: Date | null;
  toDate: Date | null;
  remark: string;
}

const leaveInitials: ILeave = {
  fromDate: null,
  toDate: null,
  remark: "",
};

const StatusCell = ({ user, refetch }: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [leave, setLeave] = useState<ILeave>(leaveInitials);

  const handleSubmit = async (type: "Activate" | "Inactivate") => {
    setLoading(true);
    try {
      const payload = {
        action: "updateLeaveStatus",
        id: user?._id,
        payload: { ...leave, type },
      };
      await axios.post<ResponseType<IUser>>(EndPoints.POST_QA_USER, payload);

      toast.success("Leave Status updated");
      setOpen(false);
      refetch();
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div
        role="button"
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {user?.leave?.status === "Approved" ? (
          <Badge color="red" className="!block">
            Inactive
          </Badge>
        ) : (
          <Badge color="blue" className="!block">
            Active
          </Badge>
        )}
      </div>

      {open && (
        <Modal opened={open} onClose={() => setOpen(false)}>
          <Title order={4}>
            {user?.leave?.status === "Approved" ? "Activate" : "De-Activate"}
          </Title>

          {user?.leave?.status === "Approved" ? (
            <Button
              fullWidth
              my={30}
              onClick={() => handleSubmit("Activate")}
              loading={loading}
            >
              Activate
            </Button>
          ) : (
            <Grid>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <DateInput
                  clearable
                  minDate={new Date()}
                  value={leave.fromDate}
                  onChange={(val) =>
                    setLeave((prev) => ({ ...prev, fromDate: val }))
                  }
                  label="From Date"
                  placeholder="From Date"
                />
              </Grid.Col>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <DateInput
                  clearable
                  disabled={!leave?.fromDate}
                  minDate={new Date(leave.fromDate as Date)}
                  value={leave.toDate}
                  onChange={(val) =>
                    setLeave((prev) => ({ ...prev, toDate: val }))
                  }
                  label="To Date"
                  placeholder="To Date"
                />
              </Grid.Col>
              <Grid.Col span={{ sm: 12, md: 12 }}>
                <TextInput
                  value={leave.remark}
                  onChange={(e) =>
                    setLeave((prev) => ({
                      ...prev,
                      remark: e.target.value,
                    }))
                  }
                  label="Remark"
                  placeholder="Remark"
                />
              </Grid.Col>
              <Grid.Col span={12} my={10}>
                <Flex justify="flex-end" gap={2}>
                  <Button color="red" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    loading={loading}
                    onClick={() => handleSubmit("Inactivate")}
                  >
                    De-Activate
                  </Button>
                </Flex>
              </Grid.Col>
            </Grid>
          )}
        </Modal>
      )}
    </Fragment>
  );
};

export default StatusCell;
