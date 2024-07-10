import React, { useEffect, useState } from "react";
import { ComboboxItem, Table } from "@mantine/core";
import dayjs from "dayjs";
import {
  History,
  IDashboardData,
  SortOrder,
} from "@/lib/utils/types/fniDataTypes";
import CommonTableHead from "@/components/ClaimsComponents/commonTable/CommonTableHead";
import { historyTableHeadings } from "@/lib/utils/constants/tableHeadings";
import { getSelectOption } from "@/lib/helpers";

type PropTypes = {
  history: History[];
  dashboardData: IDashboardData | null;
};

const HistoryTable = ({ history, dashboardData }: PropTypes) => {
  const [data, setData] = useState<History[]>([]);

  const handleSort = (sortKey: string, order: SortOrder) => {
    let newData: History[] = [];

    if (order === 1) {
      newData = data?.sort((a, b) =>
        a[sortKey as keyof History] < b[sortKey as keyof History]
          ? -1
          : a[sortKey as keyof History] > b[sortKey as keyof History]
          ? 1
          : 0
      );
    } else {
      newData = data?.sort((a, b) =>
        b[sortKey as keyof History] < a[sortKey as keyof History]
          ? -1
          : b[sortKey as keyof History] > a[sortKey as keyof History]
          ? 1
          : 0
      );
    }

    setData([...newData]);
  };

  useEffect(() => {
    if (history && history?.length > 0) {
      const newData = history?.sort((a, b) =>
        a["DOA"] < b["DOA"] ? 1 : a["DOA"] > b["DOA"] ? -1 : 0
      );
      setData(newData);
    }
  }, [history]);

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table>
        <CommonTableHead
          tableHeadings={historyTableHeadings}
          clear={false}
          onSort={handleSort}
          hasSelection={false}
        />
        <Table.Tbody>
          {data?.map((elem) => {
            const claimNo = parseInt(
              elem?.claim_number?.replace("R_", "")?.replace("P_", "")
            );

            const isPresentClaim =
              elem?.DOA &&
              dayjs(elem?.DOA).isSame(
                dashboardData?.hospitalizationDetails?.dateOfAdmission,
                "day"
              ) &&
              dashboardData?.claimId &&
              claimNo === dashboardData?.claimId;
            const options = getSelectOption("FRCU");

            const code = options?.find((op: ComboboxItem) => {
              const codeArr = op.value?.split("_");
              return (
                codeArr?.length > 1 && elem?.fcu && codeArr[0] === elem?.fcu
              );
            }) as ComboboxItem | undefined;

            let fcu = "-";

            if (code) fcu = code?.label;

            return (
              <Table.Tr
                key={elem?._id}
                bg={isPresentClaim ? "blue" : undefined}
                c={isPresentClaim ? "white" : undefined}
              >
                <Table.Td className="whitespace-nowrap">
                  {elem?.claim_number}
                </Table.Td>
                <Table.Td className="whitespace-nowrap">
                  {elem?.dsClaimId || "-"}
                </Table.Td>
                <Table.Td className="whitespace-nowrap">
                  {elem?.claims_Status}
                </Table.Td>
                <Table.Td className="whitespace-nowrap">{fcu}</Table.Td>
                <Table.Td className="whitespace-nowrap">
                  {elem?.hospital}
                </Table.Td>
                <Table.Td className="whitespace-nowrap">
                  {elem?.diagnosis}
                </Table.Td>
                <Table.Td className="whitespace-nowrap">
                  {elem?.DOA ? dayjs(elem?.DOA).format("DD-MMM-YYYY") : ""}
                </Table.Td>
                <Table.Td className="whitespace-nowrap">
                  {elem?.DOD ? dayjs(elem?.DOD).format("DD-MMM-YYYY") : ""}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default HistoryTable;
