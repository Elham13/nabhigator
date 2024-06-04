import React, { Dispatch, SetStateAction } from "react";
import { Button, Flex } from "@mantine/core";
import { BiTask } from "react-icons/bi";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { IShowElement } from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  setShowElement: Dispatch<SetStateAction<IShowElement>>;
};

const TasksAndDocsButtons = ({ setShowElement }: PropTypes) => {
  return (
    <Flex gap={8} mt={18}>
      <Button
        className="flex-1"
        variant="outline"
        onClick={() =>
          setShowElement((prev) => ({
            ...prev,
            completeTasks: true,
          }))
        }
      >
        Complete Tasks&nbsp;
        <BiTask />
      </Button>
      <Button
        className="flex-1"
        variant="outline"
        onClick={() =>
          setShowElement((prev) => ({
            ...prev,
            completeDocuments: true,
          }))
        }
      >
        Complete Documents&nbsp;
        <IoDocumentAttachOutline />
      </Button>
    </Flex>
  );
};

export default TasksAndDocsButtons;
