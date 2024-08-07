import React, { ReactNode } from "react";
import { BoxProps, Skeleton, Table } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IVisibleColumn } from "@/lib/utils/types/fniDataTypes";
import { StorageKeys } from "@/lib/utils/types/enums";

type PropTypes = {
  columnName: string;
  value?: string | number | ReactNode;
  loading: boolean;
  className?: BoxProps["className"];
  style?: BoxProps["style"];
};

const TableCell = ({
  columnName,
  value,
  loading,
  className,
  style,
}: PropTypes) => {
  const [cols] = useLocalStorage<IVisibleColumn[]>({
    key: StorageKeys.VISIBLE_COLUMNS,
  });

  return !!cols && cols?.find((c) => c.value === columnName)?.visible ? (
    <Table.Td className={`${className} whitespace-nowrap`} style={style}>
      <Skeleton visible={loading}>{value ?? "-"}</Skeleton>
    </Table.Td>
  ) : null;
};

export default TableCell;
