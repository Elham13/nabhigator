import React, { Fragment, useState } from "react";
import { IUser, ResponseType } from "@/lib/utils/types/fniDataTypes";
import { toast } from "react-toastify";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import { Button, Flex, Grid, Modal, MultiSelect, Title } from "@mantine/core";
import { leadViewOptionsArray } from "@/lib/utils/constants/options";

type PropTypes = { user: IUser; refetch: () => void };

const ClaimTypeCell = ({ user, refetch }: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [claimType, setClaimType] = useState<string[]>(() => {
    return !!user?.config?.leadView && user?.config?.leadView?.length > 0
      ? user?.config?.leadView
      : [];
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        action: "updateClaimType",
        claimType,
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
        {!!user?.config?.leadView && user?.config?.leadView?.length > 0
          ? user?.config?.leadView?.join(", ")
          : "-"}
      </div>

      {open && (
        <Modal opened={open} onClose={() => setOpen(false)}>
          <Title order={4}>Change Claim Type</Title>

          <Grid>
            <Grid.Col span={12}>
              <MultiSelect
                label="Claim type"
                placeholder="Select claim type"
                data={leadViewOptionsArray}
                value={claimType}
                onChange={(val) => setClaimType(val)}
                required
                withAsterisk
                hidePickedOptions
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

export default ClaimTypeCell;
