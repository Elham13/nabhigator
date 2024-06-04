import React, { Dispatch, SetStateAction } from "react";
import { Button, Flex } from "@mantine/core";
import { BiCheck } from "react-icons/bi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IDashboardData, IShowElement } from "@/lib/utils/types/fniDataTypes";
import RejectedSection from "@/components/ClaimsComponents/RejectedSection";

type PropTypes = {
  showElement: IShowElement;
  data: IDashboardData | null;
  setShowElement: Dispatch<SetStateAction<IShowElement>>;
};

const AllocationFooter = ({ showElement, data, setShowElement }: PropTypes) => {
  return showElement.allocationAccept ? null : showElement.allocationReject ? (
    <RejectedSection
      id={data?._id as string}
      handleCancel={() =>
        setShowElement((prev) => ({
          ...prev,
          allocationReject: false,
        }))
      }
    />
  ) : (
    <Flex gap={4} mt={4}>
      <Button
        bg="green"
        fullWidth
        onClick={() =>
          setShowElement((prev) => ({
            ...prev,
            allocationAccept: true,
          }))
        }
      >
        Accept &nbsp; <BiCheck />
      </Button>
      <Button
        bg="red"
        fullWidth
        onClick={() =>
          setShowElement((prev) => ({
            ...prev,
            allocationReject: true,
          }))
        }
      >
        Return &nbsp;
        <IoIosCloseCircleOutline />
      </Button>
    </Flex>
  );
};

export default AllocationFooter;
