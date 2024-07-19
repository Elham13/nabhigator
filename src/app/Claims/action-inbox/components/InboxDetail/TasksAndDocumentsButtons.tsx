import React, { useState } from "react";
import { ActionIcon, Button, FileButton, Flex, Popover } from "@mantine/core";
import { BiTrash } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { LuReplace } from "react-icons/lu";
import { showError } from "@/lib/helpers";
import { toast } from "react-toastify";
import { modifyDocument } from "@/lib/serverActions/modifyDocument";
import { MdRestore } from "react-icons/md";
import { GrAction } from "react-icons/gr";

type PropTypes = {
  caseId: string;
  url: string;
  name: string;
  taskName: string;
  userName: string;
  isHidden: boolean;
  docIndex: number;
  refetchCaseDetail: () => void;
};

const TasksAndDocumentsButtons = (props: PropTypes) => {
  const {
    caseId,
    url,
    name,
    taskName,
    userName,
    isHidden,
    docIndex,
    refetchCaseDetail,
  } = props;
  const [loadings, setLoadings] = useState({ replace: false, delete: false });

  const handleDelete = async () => {
    setLoadings((prev) => ({ ...prev, delete: true }));
    try {
      const { success, message } = await modifyDocument({
        action: isHidden ? "unhide" : "hide",
        taskName,
        name,
        caseId,
        userName,
        docIndex,
      });
      if (!success) throw new Error(message);
      refetchCaseDetail();
      toast.success(message);
    } catch (error: any) {
      showError(error);
    } finally {
      setLoadings((prev) => ({ ...prev, delete: false }));
    }
  };

  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button size="compact-xs" color={isHidden ? "red" : undefined}>
          <GrAction />
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Flex gap={4} justify="space-between">
          <ActionIcon
            disabled={!url}
            variant="light"
            title="View"
            onClick={() => {
              window.open(
                `/Claims/action-inbox/documents?url=${encodeURIComponent(
                  url
                )}&name=${name}`,
                "_blank"
              );
            }}
          >
            <BsEye />
          </ActionIcon>
          <Button
            size="compact-sm"
            color={isHidden ? "green" : "red"}
            title={isHidden ? "Restore" : "Delete"}
            onClick={handleDelete}
            loading={loadings?.delete}
          >
            {isHidden ? <MdRestore /> : <BiTrash />}
          </Button>
          <FileButton onChange={() => {}} accept="image/png,image/jpeg">
            {(props) => (
              <Button
                {...props}
                size="compact-sm"
                color="orange"
                title="Replace"
                loading={loadings?.replace}
              >
                <LuReplace />
              </Button>
            )}
          </FileButton>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
};

export default TasksAndDocumentsButtons;
