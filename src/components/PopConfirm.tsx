import React, { ReactNode, useState } from "react";
import { Popover, Title, Text, Flex, Button, Box } from "@mantine/core";
import { AiOutlineExclamationCircle } from "react-icons/ai";

interface IProps {
  children: ReactNode;
  title: string;
  description?: string;
  okText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const PopConfirm = ({
  children,
  title,
  description,
  okText,
  cancelText,
  onConfirm,
  onCancel,
}: IProps) => {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      width={300}
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <Box onClick={() => setOpened(true)} w="100%">
          {children}
        </Box>
      </Popover.Target>
      <Popover.Dropdown>
        <Title order={6} className="flex items-center gap-2">
          <AiOutlineExclamationCircle className="text-orange-400" />
          {title}
        </Title>
        <Text size="xs" my={5}>
          {description}
        </Text>
        <Flex gap={4} mt={10} justify="end">
          <Button
            color="red"
            size="xs"
            onClick={() => {
              setOpened(false);
              if (onCancel) onCancel;
            }}
          >
            {cancelText || "No"}
          </Button>
          <Button
            color="green"
            size="xs"
            onClick={() => {
              setOpened(false);
              onConfirm();
            }}
          >
            {okText || "Yes"}
          </Button>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
};

export default PopConfirm;
