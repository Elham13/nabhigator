import React, { Fragment, useState } from "react";
import { IUser, ResponseType } from "@/lib/utils/types/fniDataTypes";
import { toast } from "react-toastify";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import { Badge, Button, Flex, Grid, Modal, Select, Title } from "@mantine/core";

type PropTypes = { user: IUser; refetch: () => void };

const StatusCell = ({ user, refetch }: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<string>(() => {
    return !!user?.status ? user?.status : "";
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        action: "updateStatus",
        status,
        id: user?._id,
      };
      await axios.post<ResponseType<IUser>>(EndPoints.POST_QA_USER, payload);

      toast.success("Claim Type updated");
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
        {user?.status === "Active" ? (
          <Badge color="blue" className="!block">
            {user?.status}
          </Badge>
        ) : (
          <Badge color="red" className="!block">
            {user?.status}
          </Badge>
        )}
      </div>

      {open && (
        <Modal opened={open} onClose={() => setOpen(false)}>
          <Title order={4}>Change Claim Type</Title>

          <Grid>
            <Grid.Col span={12}>
              <Select
                label="Status"
                placeholder="Select Status"
                data={["Active", "Inactive"]}
                value={status}
                onChange={(val) => setStatus(val || "")}
                required
                withAsterisk
              />
            </Grid.Col>
            <Grid.Col span={12} my={10}>
              <Flex justify="flex-end" gap={2}>
                <Button color="red" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button loading={loading} onClick={handleSubmit}>
                  Change
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
        </Modal>
      )}
    </Fragment>
  );
};

export default StatusCell;
