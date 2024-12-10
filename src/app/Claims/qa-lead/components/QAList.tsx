"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  CloseButton,
  Flex,
  Input,
  Pagination,
  Table,
} from "@mantine/core";
import { IUser, ResponseType, SortOrder } from "@/lib/utils/types/fniDataTypes";
import { showError } from "@/lib/helpers";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import CommonTableHead from "@/components/ClaimsComponents/commonTable/CommonTableHead";
import { postQaTableHeaders } from "@/lib/utils/constants/tableHeadings";
import CommonTablePlaceholder from "@/components/ClaimsComponents/commonTable/CommonTablePlaceholder";
import ShiftTimeCell from "./ShiftTimeCell";
import ClaimTypeCell from "./ClaimTypeCell";
import StatusCell from "./StatusCell";
import AssignButton from "./AssignButton";
import { useDebouncedValue } from "@mantine/hooks";
import { BiSearch } from "react-icons/bi";
import ClaimAmount from "./ClaimAmount";
import PendencyCell from "./PendencyCell";

interface ILoadings {
  fetch: boolean;
  assign: boolean;
  dailyAssign: boolean;
}

const QAList = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 500);
  const [sort, setSort] = useState<{ [x: string]: SortOrder } | null>(null);
  const [loadings, setLoadings] = useState<ILoadings>({
    fetch: false,
    assign: false,
    dailyAssign: false,
  });
  const [pagination, setPagination] = useState({
    limit: 15,
    page: 1,
    count: 0,
  });

  const handleSort = (sortKey: string, order: SortOrder) => {
    setSort({ [sortKey]: order });
  };

  const getPostQA = useCallback(async () => {
    setLoadings((prev) => ({ ...prev, fetch: true }));
    try {
      const payload = {
        action: "list",
        name: debouncedSearch,
        sort: sort || undefined,
        limit: pagination?.limit,
        skip: pagination.page - 1,
      };
      const { data } = await axios.post<ResponseType<IUser>>(
        EndPoints.POST_QA_USER,
        payload
      );
      setUsers(data?.data);
      setPagination((prev) => ({ ...prev, count: data?.count }));
    } catch (error: any) {
      showError(error);
    } finally {
      setLoadings((prev) => ({ ...prev, fetch: false }));
    }
  }, [pagination?.limit, pagination?.page, sort, debouncedSearch]);

  useEffect(() => {
    getPostQA();
  }, [pagination.page, pagination.limit, sort, getPostQA, debouncedSearch]);

  const rows = useMemo(() => {
    return users?.map((el) => (
      <Table.Tr key={el?._id}>
        <Table.Td className="whitespace-nowrap">{el?.name}</Table.Td>
        <Table.Td className="whitespace-nowrap">
          <Flex gap={4}>
            <AssignButton el={el} refetch={() => getPostQA()} action="assign" />
            <AssignButton
              el={el}
              refetch={() => getPostQA()}
              action="reassign"
            />
          </Flex>
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          <StatusCell user={el} refetch={() => getPostQA()} />
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          <ShiftTimeCell user={el} refetch={() => getPostQA()} />
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          <ClaimAmount user={el} refetch={() => getPostQA()} />
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          <PendencyCell user={el} />
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          <ClaimTypeCell user={el} refetch={() => getPostQA()} />
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          {!!el?.zone ? el?.zone?.join(", ") : "-"}
        </Table.Td>
      </Table.Tr>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return (
    <Box>
      <Input
        radius="lg"
        leftSection={<BiSearch />}
        placeholder="Search Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        type="search"
        rightSectionPointerEvents="all"
        className="w-fit"
        rightSection={
          <CloseButton
            aria-label="Clear search"
            onClick={() => setSearchTerm("")}
            style={{ display: searchTerm ? undefined : "none" }}
          />
        }
      />
      <Table.ScrollContainer minWidth={800}>
        <Table highlightOnHover>
          <CommonTableHead
            tableHeadings={postQaTableHeaders}
            clear={false}
            onSort={handleSort}
            hasSelection={false}
          />

          <Table.Tbody>
            {loadings.fetch ? (
              <CommonTablePlaceholder
                type="loader"
                colSpan={postQaTableHeaders?.length}
              />
            ) : users?.length > 0 ? (
              rows
            ) : (
              <CommonTablePlaceholder
                type="empty"
                colSpan={postQaTableHeaders?.length}
              />
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Pagination
        className="w-fit ml-auto mt-8"
        value={pagination.page}
        onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        total={Math.ceil(pagination.count / pagination.limit)}
      />
    </Box>
  );
};

export default QAList;
