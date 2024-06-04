import React, { Dispatch, SetStateAction } from "react";
import { Button, Flex } from "@mantine/core";
import dynamic from "next/dynamic";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  CaseDetail,
  IDashboardData,
  IShowElement,
} from "@/lib/utils/types/fniDataTypes";

const AcceptSection = dynamic(
  () => import("@/components/ClaimsComponents/AcceptSection")
);
const RejectedSection = dynamic(
  () => import("@/components/ClaimsComponents/RejectedSection")
);

type PropTypes = {
  data: IDashboardData | null;
  caseDetail: CaseDetail | null;
  showElement: IShowElement;
  setShowElement: Dispatch<SetStateAction<IShowElement>>;
};

const PreQcFooter = ({
  data,
  caseDetail,
  showElement,
  setShowElement,
}: PropTypes) => {
  const handleAccept = () => {
    setShowElement((prev) => ({
      ...prev,
      preQCAccept: true,
    }));
  };

  return showElement?.preQCAccept ? (
    <AcceptSection
      {...{
        dashboardData: data,
        caseDetail,
        onClose: () =>
          setShowElement((prev) => ({ ...prev, preQCAccept: false })),
      }}
    />
  ) : showElement?.preQCReject ? (
    <RejectedSection
      id={data?._id as string}
      handleCancel={() =>
        setShowElement((prev) => ({
          ...prev,
          preQCReject: false,
        }))
      }
    />
  ) : (
    <Flex gap={4} mt={4}>
      <Button bg="green" fullWidth onClick={handleAccept}>
        Accept &nbsp; <HiOutlineCheckBadge />
      </Button>
      <Button
        bg="red"
        fullWidth
        onClick={() =>
          setShowElement((prev) => ({
            ...prev,
            preQCReject: true,
          }))
        }
      >
        Reject &nbsp;
        <IoCloseCircleOutline />
      </Button>
    </Flex>
  );
};

export default PreQcFooter;
