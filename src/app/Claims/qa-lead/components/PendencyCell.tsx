import { IUser } from "@/lib/utils/types/fniDataTypes";
import { Tooltip } from "@mantine/core";
import React from "react";

const PendencyCell = ({ user }: { user: IUser }) => {
  const preAuthAuto =
    !!user?.config?.pendency?.preAuth &&
    user?.config?.pendency?.preAuth?.length > 0
      ? user?.config?.pendency?.preAuth?.filter((el) => el?.type === "Auto")
          ?.length
      : 0;
  const preAuthManual =
    !!user?.config?.pendency?.preAuth &&
    user?.config?.pendency?.preAuth?.length > 0
      ? user?.config?.pendency?.preAuth?.filter((el) => el?.type === "Manual")
          ?.length
      : 0;
  const rmAuto =
    !!user?.config?.pendency?.rm && user?.config?.pendency?.rm?.length > 0
      ? user?.config?.pendency?.rm?.filter((el) => el?.type === "Auto")?.length
      : 0;
  const rmManual =
    !!user?.config?.pendency?.rm && user?.config?.pendency?.rm?.length > 0
      ? user?.config?.pendency?.rm?.filter((el) => el?.type === "Manual")
          ?.length
      : 0;
  return (
    <Tooltip
      label={`P_Auto: ${preAuthAuto} / P_Manual: ${preAuthManual} / R_Auto: ${rmAuto} / R_Manual: ${rmManual}`}
    >
      <span>
        {`P: ${user?.config?.preAuthPendency || 0} / R: ${
          user?.config?.rmPendency || 0
        }`}
      </span>
    </Tooltip>
  );
};

export default PendencyCell;
