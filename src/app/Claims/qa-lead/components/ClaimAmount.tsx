import React, { Fragment, useState } from "react";
import { IUser, ResponseType } from "@/lib/utils/types/fniDataTypes";
import { Button, Flex, Grid, Modal, Select, Title } from "@mantine/core";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { toast } from "react-toastify";
import { showError } from "@/lib/helpers";
import { claimAmountOptions } from "@/lib/utils/constants/options";

type PropTypes = { user: IUser; refetch: () => void };

const ClaimAmount = ({ user, refetch }: PropTypes) => {
  const [claimAmount, setClaimAmount] = useState(
    () => user?.config?.claimAmount || ""
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        action: "updateClaimAmount",
        claimAmount,
        id: user?._id,
      };
      await axios.post<ResponseType<IUser>>(EndPoints.POST_QA_USER, payload);

      toast.success("Claim Amount updated");
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
        {claimAmount || "-"}
      </div>
      {open && (
        <Modal opened={open} onClose={() => setOpen(false)}>
          <Title order={4}>Change Claim Amount</Title>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Claim Amount"
                placeholder="Claim Amount"
                value={claimAmount || ""}
                onChange={(val) => setClaimAmount(val || "")}
                data={claimAmountOptions?.map((el) => el?.label)}
                checkIconPosition="right"
                clearable
                searchable
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

export default ClaimAmount;