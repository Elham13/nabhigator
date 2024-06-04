import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CopyButton,
  NumberInput,
  Pagination,
  Table,
} from "@mantine/core";
import { FaCheck } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import {
  IFeedingLogsTableData,
  SortOrder,
} from "@/lib/utils/types/fniDataTypes";
import CommonTableHead from "@/components/ClaimsComponents/commonTable/CommonTableHead";
import { feedingLogsTableHeaders } from "@/lib/utils/constants/tableHeadings";
import CommonTablePlaceholder from "@/components/ClaimsComponents/commonTable/CommonTablePlaceholder";

type PropTypes = {
  data: IFeedingLogsTableData[];
};

const FeedingLogTable = ({ data }: PropTypes) => {
  const [tableData, setTableData] = useState<IFeedingLogsTableData[]>([]);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    count: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSort = (sortKey: string, order: SortOrder) => {
    const sortedData = data?.sort((a, b) => {
      if (order === 1) {
        return a[sortKey as keyof IFeedingLogsTableData] >
          b[sortKey as keyof IFeedingLogsTableData]
          ? 1
          : a[sortKey as keyof IFeedingLogsTableData] <
            b[sortKey as keyof IFeedingLogsTableData]
          ? -1
          : 0;
      } else {
        return a[sortKey as keyof IFeedingLogsTableData] <
          b[sortKey as keyof IFeedingLogsTableData]
          ? 1
          : a[sortKey as keyof IFeedingLogsTableData] >
            b[sortKey as keyof IFeedingLogsTableData]
          ? -1
          : 0;
      }
    });
    setTableData(sortedData?.slice(0, 10));
  };

  useEffect(() => {
    if (data?.length > 0) {
      setPagination((prev) => ({ ...prev, count: data?.length }));
      setTableData(data?.slice(0, 10));
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = data?.filter((el) =>
        el?.claimId?.includes(searchTerm)
      );
      setTableData(filteredData?.slice(0, 10));
    }
  }, [searchTerm, data]);

  useEffect(() => {
    if (data?.length > 0) {
      const getPageItems = (pageNumber: number, itemsPerPage: number) => {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
      };
      setTableData(getPageItems(pagination.page, 10));
    }
  }, [pagination.page, data]);

  return (
    <>
      <Box className="flex gap-2">
        <NumberInput
          radius="lg"
          leftSection={<BiSearch />}
          placeholder="Search Claim Id"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e as string)}
          rightSectionPointerEvents="all"
        />
        <Button
          onClick={() => {
            setSearchTerm("");
            setTableData(data?.slice(0, 10));
          }}
        >
          Clear
        </Button>
      </Box>
      <Table.ScrollContainer minWidth={800}>
        <Table highlightOnHover>
          <CommonTableHead
            tableHeadings={feedingLogsTableHeaders}
            clear={false}
            onSort={handleSort}
            hasSelection={false}
          />
          <Table.Tbody>
            {tableData?.length > 0 ? (
              tableData?.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td className="flex">
                    <button className="flex-1">{item?.claimId}</button>
                    <CopyButton value={item?.claimId}>
                      {({ copied, copy }) => (
                        <button className="px-2 py-1" onClick={copy}>
                          {copied ? <FaCheck /> : <IoCopyOutline />}
                        </button>
                      )}
                    </CopyButton>
                  </Table.Td>
                  <Table.Td>{item?.failureReason}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <CommonTablePlaceholder
                type="empty"
                colSpan={feedingLogsTableHeaders?.length}
              />
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <div className="relative">
        <p className="absolute bottom-0 left-1/2 -translate-x-1/2">
          Total: {data?.length}
        </p>
        <Pagination
          size="md"
          className="w-fit ml-auto mt-8"
          value={pagination.page}
          onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          total={Math.ceil(pagination.count / pagination.limit)}
        />
      </div>
    </>
  );
};

export default FeedingLogTable;
