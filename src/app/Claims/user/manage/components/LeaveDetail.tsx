import React, { useState } from "react";
import { Button, Grid, Text, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { IUser, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { EndPoints } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";

interface ILeave {
  visible: boolean;
  fromDate: Date | null;
  toDate: Date | null;
  remark: string;
}

const leaveInitials: ILeave = {
  visible: false,
  fromDate: null,
  toDate: null,
  remark: "",
};

const LeaveDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId");
  const [loading, setLoading] = useState<boolean>(false);

  const [leave, setLeave] = useState<ILeave>(leaveInitials);

  const handleLeaveRequest = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post<SingleResponseType<IUser>>(
        EndPoints.USER,
        {
          userId,
          action: "leaveRequest",
          fromDate: leave.fromDate,
          toDate: leave.toDate,
          remark: leave.remark,
        }
      );
      setLeave(leaveInitials);
      router.back();
      toast.success(data.message);
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return !userId ? (
    <Text c="red" className="text-center">
      User id missing
    </Text>
  ) : (
    <>
      <Button
        onClick={() =>
          setLeave((prev) => ({ ...prev, visible: !prev.visible }))
        }
      >
        {leave.visible ? "Cancel Leave" : "Request Leave"}
      </Button>

      {leave.visible ? (
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
              onChange={(val) => setLeave((prev) => ({ ...prev, toDate: val }))}
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
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Button
              disabled={!leave.fromDate || !leave.toDate}
              onClick={handleLeaveRequest}
              loading={loading}
            >
              Submit
            </Button>
          </Grid.Col>
        </Grid>
      ) : null}
    </>
  );
};

export default LeaveDetail;
