import React, { Fragment, useState } from "react";
import { IUser, ResponseType } from "@/lib/utils/types/fniDataTypes";
import { toast } from "react-toastify";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import {
  Button,
  Flex,
  Grid,
  Modal,
  MultiSelect,
  NumberInput,
  Title,
} from "@mantine/core";
import { leadViewOptionsArray } from "@/lib/utils/constants/options";

type PropTypes = {
  user: IUser;
  type: "dailyThreshold" | "dailyAssign";
  refetch: () => void;
};

const ThresholdsCell = ({ user, type, refetch }: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(() => {
    return !!user?.config?.[type] ? user?.config?.[type] : 0;
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        action: "updateThreshold",
        type,
        threshold,
        id: user?._id,
      };
      await axios.post<ResponseType<IUser>>(EndPoints.POST_QA_USER, payload);

      toast.success("Updated");
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
        {!!user?.config?.[type] ? user?.config?.[type] : 0}
      </div>

      {open && (
        <Modal opened={open} onClose={() => setOpen(false)}>
          <Title order={4}>
            Change {type === "dailyAssign" ? "Daily Assign" : "Daily Threshold"}
          </Title>

          <Grid>
            <Grid.Col span={12}>
              <NumberInput
                label={`${
                  type === "dailyAssign" ? "Daily Assign" : "Daily Threshold"
                }`}
                placeholder={`${
                  type === "dailyAssign" ? "Daily Assign" : "Daily Threshold"
                }`}
                value={threshold}
                onChange={(val) => setThreshold(val as number)}
                withAsterisk
                required
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

export default ThresholdsCell;
