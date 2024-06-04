import React from "react";
import { Box, Text, rem } from "@mantine/core";
import { BiSun } from "react-icons/bi";

interface PropTypes
  extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  icon: typeof BiSun;
  title: React.ReactNode;
  description: React.ReactNode;
}

const EditFormItem = ({
  icon: Icon,
  title,
  description,
  ...others
}: PropTypes) => {
  return (
    <div className="flex items-center" {...others}>
      <Box mr="md">
        <Icon style={{ width: rem(24), height: rem(24) }} />
      </Box>
      <div>
        <Text size="xs">{title}</Text>
        <Text>{description}</Text>
      </div>
    </div>
  );
};

export default EditFormItem;
