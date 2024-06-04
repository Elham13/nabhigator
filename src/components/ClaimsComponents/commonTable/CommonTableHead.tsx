import React, { useState, useEffect } from "react";

import {
  Center,
  Group,
  Table,
  Text,
  UnstyledButton,
  rem,
  Checkbox,
} from "@mantine/core";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { LuChevronsUpDown } from "react-icons/lu";
import { CommonThProps, SortOrder } from "@/lib/utils/types/fniDataTypes";

type TableHead = { value: string; label: string; sortable: boolean };

interface PropType {
  tableHeadings: TableHead[];
  clear: boolean;
  hasSelection: boolean;
  selectedCount?: number;
  dataCount?: number;
  onSelectAll?: (checked: boolean) => void;
  onSort: (sortKey: string, order: SortOrder) => void;
}

const Th = ({ children, sortable, sorted, sortKey, onSort }: CommonThProps) => {
  const Icon =
    sorted === 1
      ? BiChevronUp
      : sorted === -1
      ? BiChevronDown
      : LuChevronsUpDown;

  const handleSort = () => {
    onSort(sortKey);
  };

  return (
    <Table.Th className="whitespace-nowrap">
      {sortable ? (
        <UnstyledButton onClick={handleSort}>
          <Group justify="space-between" wrap="nowrap">
            <Text fw={500} size="sm">
              {children}
            </Text>
            <Center>
              <Icon style={{ width: rem(12), height: rem(12) }} />
            </Center>
          </Group>
        </UnstyledButton>
      ) : (
        children
      )}
    </Table.Th>
  );
};

const sortInitials = {
  sortKey: "",
  order: null,
};

const CommonTableHead = ({
  tableHeadings,
  clear,
  hasSelection,
  selectedCount,
  dataCount,
  onSelectAll,
  onSort,
}: PropType) => {
  const [sort, setSort] = useState<{ sortKey: string; order: SortOrder }>(
    sortInitials
  );

  const handleSort = (sortKey: string) => {
    if (sort.order === null) setSort({ sortKey, order: 1 });
    if (sort.order === 1) setSort({ sortKey, order: -1 });
    if (sort.order === -1) setSort({ sortKey, order: 1 });
  };

  useEffect(() => {
    if (sort.sortKey && sort.order !== null) {
      onSort(sort.sortKey, sort.order);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort.sortKey, sort.order]);

  useEffect(() => {
    if (clear) setSort(sortInitials);
  }, [clear]);

  return (
    <Table.Thead>
      <Table.Tr>
        {hasSelection && (
          <Table.Th className="whitespace-nowrap">
            <Checkbox
              checked={
                !!selectedCount && !!dataCount && selectedCount === dataCount
              }
              indeterminate={
                !!selectedCount &&
                !!dataCount &&
                selectedCount > 0 &&
                selectedCount < dataCount
              }
              onChange={(e) => !!onSelectAll && onSelectAll(e.target.checked)}
            />
          </Table.Th>
        )}
        {tableHeadings?.map((th, ind) => (
          <Th
            key={ind}
            sortable={th.sortable}
            sorted={th.value === sort.sortKey ? sort.order : null}
            sortKey={th.value}
            onSort={handleSort}
          >
            {th.label}
          </Th>
        ))}
      </Table.Tr>
    </Table.Thead>
  );
};

export default CommonTableHead;
