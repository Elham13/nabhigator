import React, { useEffect, useState } from "react";
import { CopyButton, Tooltip } from "@mantine/core";
import { FaCheck } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { IDashboardData, UserExpedition } from "@/lib/utils/types/fniDataTypes";
import Pulse from "@/components/ClaimsComponents/Pulse";

type PropTypes = {
  data: IDashboardData;
  onClick: () => void;
};

const ClaimIdCell = ({ data, onClick }: PropTypes) => {
  const [expeditor, setExpeditor] = useState<UserExpedition | null>(null);

  useEffect(() => {
    if (data?.expedition && data?.expedition?.length > 0) {
      const found = data?.expedition?.find(
        (el) => el?.claimId === data?.claimId && el?.noted === false
      );
      if (found) setExpeditor(found);
    }
  }, [data?.expedition, data?.claimId]);

  return (
    <div className="flex">
      <button className="flex-1" onClick={onClick}>
        {data?.claimId}
      </button>
      {!!expeditor ? (
        <Tooltip
          inline
          multiline
          w={200}
          label={`Name: ${expeditor?.subject}${
            expeditor?.createdAt
              ? `, Date: ${dayjs(expeditor?.createdAt).format(
                  "DD-MMM-YYYY hh:mm:ss A"
                )}`
              : ""
          }`}
        >
          <div className="px-2">
            <Pulse />
          </div>
        </Tooltip>
      ) : null}
      <CopyButton value={data?.claimId?.toString()}>
        {({ copied, copy }) => (
          <button className="px-2 py-1" onClick={copy}>
            {copied ? <FaCheck /> : <IoCopyOutline />}
          </button>
        )}
      </CopyButton>
    </div>
  );
};

export default ClaimIdCell;
