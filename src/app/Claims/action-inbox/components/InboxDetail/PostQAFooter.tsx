import React, { Dispatch, SetStateAction } from "react";
import PostQaApproveContent from "./PostQaApproveContent";
import PostQaReworkContent from "./PostQaReworkContent";
import { Button, Flex } from "@mantine/core";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { IoRepeat } from "react-icons/io5";
import {
  CaseDetail,
  IDashboardData,
  IShowElement,
} from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  data: IDashboardData | null;
  caseDetail: CaseDetail | null;
  showElement: IShowElement;
  setShowElement: Dispatch<SetStateAction<IShowElement>>;
};

const PostQAFooter = ({
  data,
  caseDetail,
  showElement,
  setShowElement,
}: PropTypes) => {
  return showElement.postQaAccept ? (
    <PostQaApproveContent
      data={data}
      caseDetail={caseDetail}
      handleCancel={() =>
        setShowElement((prev) => ({
          ...prev,
          postQaAccept: false,
        }))
      }
    />
  ) : showElement.postQaReject ? (
    <PostQaReworkContent
      caseData={caseDetail}
      data={data}
      showElement={showElement}
      setShowElement={setShowElement}
    />
  ) : (
    <Flex gap={4} mt={4}>
      <Button
        bg="green"
        fullWidth
        onClick={() =>
          setShowElement((prev) => ({
            ...prev,
            postQaAccept: true,
          }))
        }
      >
        Approve &nbsp; <HiOutlineCheckBadge />
      </Button>
      <Button
        bg="red"
        fullWidth
        onClick={() =>
          setShowElement((prev) => ({
            ...prev,
            postQaReject: true,
          }))
        }
      >
        Rework &nbsp;
        <IoRepeat />
      </Button>
    </Flex>
  );
};

export default PostQAFooter;
