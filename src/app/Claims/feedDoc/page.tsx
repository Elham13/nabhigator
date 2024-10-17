"use client";

import React, { useEffect, useState } from "react";
import { showError } from "@/lib/helpers";
import {
  Box,
  Button,
  Flex,
  Pagination,
  Table,
  Text,
  Title,
} from "@mantine/core";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { CaseDetail, ResponseType } from "@/lib/utils/types/fniDataTypes";
import CommonTablePlaceholder from "@/components/ClaimsComponents/commonTable/CommonTablePlaceholder";
import ActionButton from "./ActionButton";
import dayjs from "dayjs";
import DashboardDataModal from "./DashboardDataModal";
import ClaimCaseModal from "./ClaimCaseModal";

const FeedDoc = () => {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 500,
    page: 1,
    count: 0,
  });
  const [claimCases, setClaimCases] = useState<CaseDetail[]>([]);
  const [open, setOpen] = useState({ dData: false, claimCase: false });

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post<ResponseType<CaseDetail>>(
        EndPoints.FEED_DOCS,
        {
          action: "getData",
          pagination,
        }
      );
      setClaimCases(data?.data);
      setPagination((prev) => ({ ...prev, count: data?.count }));
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [pagination?.page]);

  return (
    <Box p={20} bg="white">
      <Flex gap={10}>
        <Button onClick={() => setOpen((prev) => ({ ...prev, dData: true }))}>
          Add to Dashboard Data
        </Button>
        <Button
          onClick={() => setOpen((prev) => ({ ...prev, claimCase: true }))}
        >
          Add to Claim Cases
        </Button>
        {open?.dData && (
          <DashboardDataModal
            open={open?.dData}
            onClose={() => setOpen((prev) => ({ ...prev, dData: false }))}
          />
        )}
        {open?.claimCase && (
          <ClaimCaseModal
            open={open?.claimCase}
            onClose={() => setOpen((prev) => ({ ...prev, claimCase: false }))}
          />
        )}
      </Flex>
      <Table.ScrollContainer minWidth={800}>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Id</Table.Th>
              <Table.Th>Docs</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <CommonTablePlaceholder type="loader" colSpan={2} />
            ) : claimCases?.length > 0 ? (
              claimCases?.map((el) => {
                const date = !!el?.singleTasksAndDocs?.invReportReceivedDate
                  ? el?.singleTasksAndDocs?.invReportReceivedDate
                  : // @ts-expect-error
                  !!el?.reportReceivedDate
                  ? // @ts-expect-error
                    el?.reportReceivedDate
                  : // @ts-expect-error
                  !!el?.invReportReceivedDate
                  ? // @ts-expect-error
                    el?.invReportReceivedDate
                  : "";
                return (
                  <Table.Tr key={el?._id as string}>
                    <Table.Td>{el?._id as string}</Table.Td>
                    <Table.Td>
                      {!!date ? dayjs(date).format("DD-MMM-YYYY") : "-"}
                    </Table.Td>
                  </Table.Tr>
                );
              })
            ) : (
              <CommonTablePlaceholder type="empty" colSpan={2} />
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {claimCases?.length > 0 && (
        <Flex gap={10} mb={20}>
          <Text>Update {claimCases?.length} Records</Text>
          <ActionButton
            onDone={getData}
            payload={claimCases?.map((el) => ({
              id: el?.dashboardDataId as string,
              date: !!el?.singleTasksAndDocs?.invReportReceivedDate
                ? el?.singleTasksAndDocs?.invReportReceivedDate
                : // @ts-expect-error
                !!el?.reportReceivedDate
                ? // @ts-expect-error
                  el?.reportReceivedDate
                : // @ts-expect-error
                !!el?.invReportReceivedDate
                ? // @ts-expect-error
                  el?.invReportReceivedDate
                : "",
            }))}
          />
        </Flex>
      )}
      <Flex gap={10}>
        <Title order={4}>Total: {pagination?.count}</Title>
        <Pagination
          value={pagination.page}
          onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          total={Math.ceil(pagination.count / pagination.limit)}
        />
      </Flex>
    </Box>
  );
};

export default FeedDoc;
