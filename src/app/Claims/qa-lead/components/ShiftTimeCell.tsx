import React, { Fragment, useState } from "react";
import { IUser, ResponseType } from "@/lib/utils/types/fniDataTypes";
import dayjs from "dayjs";
import { Button, Flex, Grid, Modal, Title } from "@mantine/core";
import TimePicker from "@/components/TimePicker";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { toast } from "react-toastify";
import { showError } from "@/lib/helpers";

type PropTypes = { user: IUser; refetch: () => void };

const ShiftTimeCell = ({ user, refetch }: PropTypes) => {
  const getTime = () => {
    let start = "-";
    let end = "-";

    if (!!user?.config?.reportReceivedTime?.from) {
      start = dayjs(user?.config?.reportReceivedTime?.from).format("hh:mm a");
    }
    if (!!user?.config?.reportReceivedTime?.to) {
      end = dayjs(user?.config?.reportReceivedTime?.to).format("hh:mm a");
    }
    return { start, end };
  };

  const [time, setTime] = useState(() => {
    const obj = { from: new Date(), to: new Date() };
    if (getTime().start !== "-")
      obj.from = dayjs(getTime().start, "hh:mm a").toDate();
    if (getTime().end !== "-")
      obj.to = dayjs(getTime().end, "hh:mm a").toDate();
    return obj;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        action: "updateShiftTime",
        time,
        id: user?._id,
      };
      await axios.post<ResponseType<IUser>>(EndPoints.POST_QA_USER, payload);

      toast.success("Shift time updated");
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
        {!!user?.config?.reportReceivedTime
          ? `${getTime().start} - ${getTime().end}`
          : null}
      </div>
      {open && (
        <Modal opened={open} onClose={() => setOpen(false)}>
          <Title order={4}>Change shift time</Title>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TimePicker
                label="From"
                value={time?.from ? dayjs(time?.from).format("HH:mm:ss") : ""}
                onChange={(time) => {
                  setTime((prev) => ({
                    ...prev,
                    from: dayjs(time, "HH:mm:ss").toDate(),
                  }));
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TimePicker
                label="To"
                value={time?.to ? dayjs(time?.to).format("HH:mm:ss") : ""}
                onChange={(time) => {
                  setTime((prev) => ({
                    ...prev,
                    to: dayjs(time, "HH:mm:ss").toDate(),
                  }));
                }}
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

export default ShiftTimeCell;
