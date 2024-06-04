import { Box, Loader, Table, Text } from "@mantine/core";
import React from "react";
import { BsEmojiFrown } from "react-icons/bs";

type PropType = {
  colSpan: number;
  type: "loader" | "empty";
};

const CommonTablePlaceholder = ({ colSpan, type }: PropType) => {
  return (
    <Table.Tr>
      <Table.Td colSpan={colSpan}>
        <Box className="flex flex-col gap-4 py-4 ml-32 justify-center">
          {type === "loader" ? (
            <Loader color="blue" type="dots" />
          ) : type === "empty" ? (
            <>
              <BsEmojiFrown size={40} />
              <Text>No Data</Text>
            </>
          ) : null}
        </Box>
      </Table.Td>
    </Table.Tr>
  );
};

export default CommonTablePlaceholder;
