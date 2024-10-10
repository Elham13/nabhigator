"use client";

import React, { useEffect, useState } from "react";
import { showError } from "@/lib/helpers";
import { Box, Flex, Pagination, Table, Title } from "@mantine/core";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { CaseDetail, ResponseType } from "@/lib/utils/types/fniDataTypes";
import CommonTablePlaceholder from "@/components/ClaimsComponents/commonTable/CommonTablePlaceholder";
import ActionButton from "./ActionButton";

const FeedDoc = () => {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 5,
    page: 1,
    count: 0,
  });
  const [claimCases, setClaimCases] = useState<CaseDetail[]>([]);

  const getData = async () => {
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
      <Table.ScrollContainer minWidth={800}>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Id</Table.Th>
              <Table.Th>Docs</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <CommonTablePlaceholder type="loader" colSpan={2} />
            ) : claimCases?.length > 0 ? (
              claimCases?.map((el) => (
                <Table.Tr key={el?._id as string}>
                  <Table.Td>{el?._id as string}</Table.Td>
                  <Table.Td>
                    {JSON.stringify(el?.singleTasksAndDocs?.docs)}
                  </Table.Td>
                  <Table.Td>
                    <ActionButton
                      id={el?._id as string}
                      onDone={getData}
                      // @ts-expect-error
                      docs={el?.documents}
                    />
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <CommonTablePlaceholder type="empty" colSpan={2} />
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
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
