import React, { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import RowsContent from "./RowsContent";
import { useLocalStorage } from "@mantine/hooks";
import {
  IDashboardData,
  TDashboardOrigin,
  SortOrder,
  ITableHeader,
  IVisibleColumn,
} from "@/lib/utils/types/fniDataTypes";
import { mainDashboardTableHeaders } from "@/lib/utils/constants/tableHeadings";
import { StorageKeys } from "@/lib/utils/types/enums";
import CommonTableHead from "@/components/ClaimsComponents/commonTable/CommonTableHead";
import CommonTablePlaceholder from "@/components/ClaimsComponents/commonTable/CommonTablePlaceholder";

type PropTypes = {
  showClearBtn: boolean;
  loading: boolean;
  data: IDashboardData[];
  origin: TDashboardOrigin;
  handleSort: (sortKey: string, order: SortOrder) => void;
  fetchData: () => void;
  handleView: (id: string) => void;
};

const TableContent = ({
  showClearBtn,
  loading,
  data,
  handleSort,
  fetchData,
  handleView,
}: PropTypes) => {
  const [headers, setHeaders] = useState<ITableHeader[]>(
    mainDashboardTableHeaders
  );
  const [cols] = useLocalStorage<IVisibleColumn[]>({
    key: StorageKeys.VISIBLE_COLUMNS,
  });

  useEffect(() => {
    setHeaders(
      mainDashboardTableHeaders?.filter((el) => {
        const found = cols?.find((col) => col?.value === el?.value);
        if (found && !found.visible) return false;
        return true;
      })
    );
  }, [cols]);

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table highlightOnHover>
        <CommonTableHead
          tableHeadings={headers}
          clear={!showClearBtn}
          onSort={handleSort}
          hasSelection={false}
        />

        <Table.Tbody>
          {data?.length > 0 ? (
            <RowsContent
              data={data}
              loading={loading}
              fetchData={fetchData}
              handleView={handleView}
            />
          ) : (
            <CommonTablePlaceholder type="empty" colSpan={headers?.length} />
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default TableContent;
