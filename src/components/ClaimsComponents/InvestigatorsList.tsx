"use client";

import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  Input,
  Modal,
  Pagination,
  Select,
  SimpleGrid,
  Table,
  TextInput,
  Badge,
  Anchor,
  Checkbox,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BiSearch, BiUserPlus } from "react-icons/bi";
import { AiOutlineClear } from "react-icons/ai";
import { CiFilter } from "react-icons/ci";
import dayjs from "dayjs";
import CommonTableHead from "./commonTable/CommonTableHead";
import CommonTablePlaceholder from "./commonTable/CommonTablePlaceholder";
import {
  Investigator,
  ResponseType,
  SortOrder,
} from "@/lib/utils/types/fniDataTypes";
import { EndPoints } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import { investigatorsTableHead } from "@/lib/utils/constants/tableHeadings";
import { toast } from "react-toastify";

interface Filters {
  userStatus?: string;
  phone?: string;
  Type?: string;
  Mode?: string;
  assignmentPreferred?: string;
  State?: string;
}

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];
const typeOptions = [
  { value: "Internal", label: "Internal" },
  { value: "External", label: "External" },
];
const modeOptions = [
  { value: "Mixed", label: "Mixed" },
  { value: "Specialized", label: "Specialized" },
];

const assignmentPreferredOptions = [
  { value: "PreAuth", label: "PreAuth" },
  { value: "Spot", label: "Spot" },
  { value: "RM & Others", label: "RM & Others" },
  { value: "", label: "All" },
];

type PropTypes = {
  initialFilters?: "inbox";
  onSelection?: (ids: string[]) => void;
  singleSelect?: boolean;
  destination: "inbox" | "assignment";
};

const InvestigatorsList = ({
  initialFilters,
  destination,
  onSelection,
  singleSelect,
}: PropTypes) => {
  const router = useRouter();
  const [data, setData] = useState<Investigator[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    limit: 15,
    page: 1,
    count: 0,
  });
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState<{ [x: string]: SortOrder } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 500);
  const [opened, { open, close }] = useDisclosure(false);
  const [selected, setSelected] = useState<string[]>([]);

  const handleSort = (sortKey: string, order: SortOrder) => {
    const obj = { [sortKey]: order };
    setSort(obj);
  };

  const handleAdd = () => {
    router.push("/Claims/investigators/create");
  };

  const handleChange = (name: keyof Filters, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const fetchData = useCallback(
    async (filters?: Filters) => {
      setLoading(true);
      try {
        const { data } = await axios.post<ResponseType<Investigator>>(
          EndPoints.INVESTIGATORS,
          {
            filters: {
              investigatorName: debouncedSearch || undefined,
              source: initialFilters,
              ...(filters ? filters : {}),
            },
            sort: sort || undefined,
            pagination,
          }
        );
        setData(data.data);
        setPagination((prev) => ({ ...prev, count: data?.count }));
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, debouncedSearch, initialFilters, pagination.page, sort]
  );

  const handleClose = () => {
    setFilters({});
    close();
    fetchData({});
  };

  const handleFilter = () => {
    fetchData(filters);
    close();
  };

  const handleClear = () => {
    setSearchTerm("");
    setSort(null);
    if (Object.values(filters)?.some((val) => !!val)) {
      setFilters({});
      fetchData({});
    }
  };

  const handleEdit = (id: string) => {
    if (destination === "assignment") return;
    router.push(`/Claims/investigators/${id}`);
  };

  const handleSelect = (id: string) => {
    if (selected.includes(id))
      setSelected((prev) => prev.filter((elem) => elem !== id));
    else {
      if (singleSelect && selected?.length > 0)
        return toast.warn("Only one investigator is allowed");
      setSelected((prev) => [...prev, id]);
    }
  };

  const rows = useMemo(() => {
    return data?.map((el) => (
      <Table.Tr key={el?._id}>
        <Table.Td className="whitespace-nowrap">
          <Checkbox
            checked={selected.includes(el?._id)}
            onChange={() => handleSelect(el?._id)}
          />
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          {el?.investigatorName}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">{`P:${
          el?.pendency?.preAuth?.length || 0
        } / R:${el?.pendency?.rm?.length || 0}`}</Table.Td>
        <Table.Td className="whitespace-nowrap">{el?.phone}</Table.Td>
        <Table.Td className="whitespace-nowrap">
          {el?.email?.length > 0 ? el?.email?.join(", ") : "-"}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">{el?.dailyThreshold}</Table.Td>
        <Table.Td className="whitespace-nowrap">
          {el?.monthlyThreshold}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">{el?.Type}</Table.Td>
        <Table.Td className="whitespace-nowrap">{el?.Mode}</Table.Td>
        <Table.Td className="whitespace-nowrap">
          {el?.assignmentPreferred?.join(", ")}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          {el?.states?.join(", ")}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          {el?.userStatus === "active" ? (
            <Badge color="blue">{el?.userStatus}</Badge>
          ) : (
            <Badge color="red">{el?.userStatus}</Badge>
          )}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">{el?.performance}</Table.Td>
        <Table.Td className="whitespace-nowrap">{el?.dailyAssign}</Table.Td>
        <Table.Td className="whitespace-nowrap">{el?.monthlyAssigned}</Table.Td>
        <Table.Td className="whitespace-nowrap">
          {el?.updatedDate ? dayjs(el?.updatedDate).format("DD-MM-YYYY") : ""}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          <Anchor
            component="button"
            onClick={() => handleEdit(el?._id)}
            disabled={destination === "assignment"}
          >
            Edit
          </Anchor>
        </Table.Td>
      </Table.Tr>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selected]);

  useEffect(() => {
    fetchData();
  }, [pagination.page, debouncedSearch, sort, initialFilters]);

  useEffect(() => {
    if (!!onSelection) {
      onSelection(selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const showClearBtn =
    sort !== null ||
    !!searchTerm ||
    Object.values(filters)?.some((val) => !!val);

  return (
    <Box>
      {destination === "inbox" && (
        <Box className="flex justify-between items-center mb-2 gap-2 flex-wrap md:flex-nowrap">
          <Flex gap={2} align="center">
            <Modal
              opened={opened}
              onClose={handleClose}
              title="Filters"
              centered
              size="lg"
            >
              <Box className="p-2">
                <SimpleGrid cols={{ sm: 1, md: 2 }} mb={20}>
                  <Select
                    label="Status"
                    placeholder="User status"
                    value={filters?.userStatus}
                    onChange={(val) => handleChange("userStatus", val)}
                    data={statusOptions}
                    checkIconPosition="right"
                    clearable
                  />
                  <TextInput
                    label="Phone"
                    placeholder="User phone"
                    value={filters?.phone}
                    onChange={(e) =>
                      handleChange("phone", e.currentTarget.value)
                    }
                  />
                  <Select
                    label="Investigator Type"
                    placeholder="Investigator type"
                    value={filters?.Type}
                    onChange={(e) => handleChange("Type", e)}
                    data={typeOptions}
                    checkIconPosition="right"
                    clearable
                  />
                  <Select
                    label="Investigator Mode"
                    placeholder="Investigator mode"
                    value={filters?.Mode}
                    onChange={(e) => handleChange("Mode", e)}
                    data={modeOptions}
                    checkIconPosition="right"
                    clearable
                  />
                  <Select
                    label="Assignment preferred"
                    placeholder="Assignment preferred"
                    value={filters?.assignmentPreferred}
                    onChange={(e) => handleChange("assignmentPreferred", e)}
                    data={assignmentPreferredOptions}
                    checkIconPosition="right"
                    clearable
                  />
                  <TextInput
                    label="State"
                    placeholder="User state"
                    value={filters?.State}
                    onChange={(e) =>
                      handleChange("State", e.currentTarget.value)
                    }
                  />
                </SimpleGrid>
                <Button disabled={!showClearBtn} onClick={handleFilter}>
                  Filter
                </Button>
              </Box>
            </Modal>
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
            <Button
              radius="lg"
              onClick={open}
              variant="subtle"
              rightSection={<CiFilter />}
              size="compact-md"
            >
              Filters
            </Button>
          </Flex>
          <Button
            size="compact-md"
            onClick={handleAdd}
            rightSection={<BiUserPlus />}
          >
            Add
          </Button>
        </Box>
      )}
      <Table.ScrollContainer minWidth={800}>
        <Table highlightOnHover striped withTableBorder>
          <CommonTableHead
            tableHeadings={investigatorsTableHead}
            clear={!showClearBtn}
            onSort={handleSort}
            hasSelection={true}
            selectedCount={selected.length}
            dataCount={data?.length}
            onSelectAll={(checked) =>
              checked
                ? setSelected(data?.map((el) => el?._id))
                : setSelected([])
            }
          />

          <Table.Tbody>
            {loading ? (
              <CommonTablePlaceholder
                type="loader"
                colSpan={investigatorsTableHead?.length}
              />
            ) : data?.length > 0 ? (
              rows
            ) : (
              <CommonTablePlaceholder
                type="empty"
                colSpan={investigatorsTableHead?.length}
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

export default memo(InvestigatorsList);
