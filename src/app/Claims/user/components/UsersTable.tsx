"use client";

import React, { useState, useEffect } from "react";
import {
  Anchor,
  Box,
  Paper,
  Table,
  Pagination,
  Button,
  Badge,
  Input,
  CloseButton,
  Flex,
} from "@mantine/core";
import axios from "axios";
import { BiSearch, BiUpload, BiUserPlus } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useDebouncedValue } from "@mantine/hooks";
import { AiOutlineClear } from "react-icons/ai";
import { IUser, SortOrder } from "@/lib/utils/types/fniDataTypes";
import { EndPoints } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import CommonTableHead from "@/components/ClaimsComponents/commonTable/CommonTableHead";
import { usersTableHeaders } from "@/lib/utils/constants/tableHeadings";
import CommonTablePlaceholder from "@/components/ClaimsComponents/commonTable/CommonTablePlaceholder";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
const UploadModal = dynamic(() => import("./UploadModal"), {
  ssr: false,
  loading: () => <Loading />,
});

const tableHeadings = [
  "Name",
  "User ID",
  "Password",
  "Role",
  "Config",
  "Team Lead",
  "Status",
  "Action",
];

const UsersTable = () => {
  const router = useRouter();
  const [data, setData] = useState<IUser[]>([]);
  const [sort, setSort] = useState<{ [x: string]: SortOrder } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    limit: 5,
    page: 1,
    count: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 500);

  const handleSort = (sortKey: string, order: SortOrder) => {
    setSort({ [sortKey]: order });
  };

  const handleAdd = () => {
    router.push("/Claims/user/create");
  };

  const handleClear = () => {
    setSearchTerm("");
    setSort(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(EndPoints.USER, {
          searchTerm: debouncedSearch,
          sort: sort || undefined,
          limit: pagination?.limit,
          skip: pagination.page - 1,
        });
        setData(data.data);
        setPagination((prev) => ({ ...prev, count: data?.count }));
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.page, debouncedSearch, sort, pagination?.limit]);

  const rows = data?.map((el) => (
    <Table.Tr key={el?._id}>
      <Table.Td>{el?.name}</Table.Td>
      <Table.Td>{el?.userId}</Table.Td>
      <Table.Td>{el?.phone}</Table.Td>
      <Table.Td>{el?.password}</Table.Td>
      <Table.Td>{el?.role?.join(", ")}</Table.Td>
      <Table.Td>
        {el?.status === "Active" ? (
          <Badge color="blue">{el?.status}</Badge>
        ) : (
          <Badge color="red">{el?.status}</Badge>
        )}
      </Table.Td>
      <Table.Td>
        <Anchor
          component="button"
          onClick={() => router.push(`/Claims/user/${el.userId}`)}
        >
          Edit
        </Anchor>
      </Table.Td>
    </Table.Tr>
  ));

  const showClearBtn = sort !== null || !!searchTerm;

  return (
    <Paper w="100%" p={20}>
      <Box className="flex justify-between items-center mb-2 space-x-2">
        <Flex gap={2} align="center">
          <Input
            radius="lg"
            leftSection={<BiSearch />}
            placeholder="Search Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            type="search"
            rightSectionPointerEvents="all"
            rightSection={
              <CloseButton
                aria-label="Clear search"
                onClick={() => setSearchTerm("")}
                style={{ display: searchTerm ? undefined : "none" }}
              />
            }
          />
          {showClearBtn && (
            <Button
              radius="lg"
              onClick={handleClear}
              variant="subtle"
              rightSection={<AiOutlineClear />}
              size="compact-md"
              color="red"
            >
              Clear
            </Button>
          )}
        </Flex>

        <Flex gap={2} align="center">
          {uploadOpen ? (
            <UploadModal open={uploadOpen} setOpen={setUploadOpen} />
          ) : null}
          <Button
            onClick={() => setUploadOpen(true)}
            rightSection={<BiUpload />}
            size="compact-md"
            color="green"
          >
            Upload Users Master
          </Button>
          <Button
            onClick={handleAdd}
            rightSection={<BiUserPlus />}
            size="compact-md"
          >
            Add
          </Button>
        </Flex>
      </Box>
      <Table.ScrollContainer minWidth={800}>
        <Table highlightOnHover>
          <CommonTableHead
            tableHeadings={usersTableHeaders}
            clear={!showClearBtn}
            onSort={handleSort}
            hasSelection={false}
          />

          <Table.Tbody>
            {loading ? (
              <CommonTablePlaceholder
                type="loader"
                colSpan={tableHeadings?.length}
              />
            ) : data?.length > 0 ? (
              rows
            ) : (
              <CommonTablePlaceholder
                type="empty"
                colSpan={tableHeadings?.length}
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
    </Paper>
  );
};

export default UsersTable;
