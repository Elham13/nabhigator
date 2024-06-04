"use client";

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Pagination } from "@mantine/core";
import InboxHeader from "./InboxHeader";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import TableContent from "./TableContent";
import { toast } from "react-toastify";
import {
  TDashboardOrigin,
  SortOrder,
  DashboardFilters,
  IDashboardData,
  NumericStage,
  ResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";

dayjs.extend(utc);
dayjs.extend(timezone);

type PropTypes = {
  origin: TDashboardOrigin;
};

const MainContent = ({ origin }: PropTypes) => {
  const router = useRouter();
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [sort, setSort] = useState<{ [x: string]: SortOrder } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<DashboardFilters>({
    filterApplied: false,
  });
  const [data, setData] = useState<IDashboardData[]>([]);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    count: 0,
  });

  const clearFilters = () => {
    if (sort !== null) setSort(null);
    if (filters?.filterApplied) setFilters({ filterApplied: false });
    if (searchTerm) setSearchTerm("");
  };

  const handleSort = (sortKey: string, order: SortOrder) => {
    setSort({ [sortKey]: order });
  };

  const handleView = (id: string) => {
    if (NumericStage.POST_QC) {
      const targetData = data?.find((el) => el?._id === id);
      if (
        targetData &&
        targetData?.locked?.status &&
        targetData?.stage === NumericStage.POST_QC
      )
        return toast.warn(
          `This case is locked by ${targetData?.locked?.name}, ${
            targetData?.locked?.role
          }${
            targetData?.locked?.updatedAt
              ? ` at ${dayjs(targetData?.locked?.updatedAt).format(
                  "DD-MMM-YYYY hh:mm:ss A"
                )}`
              : ""
          }`
        );
    }

    let address = `/Claims/action-inbox/${id}`;

    if (origin === "Consolidated") address = `/Claims/consolidated-inbox/${id}`;
    router.push(address);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    let stageValue: any = undefined;
    if (filters?.stage && filters?.stage?.length > 0)
      stageValue = { $in: filters?.stage?.map((st) => parseInt(st)) };
    else stageValue = undefined;

    const payload = {
      ...filters,
      pagination,
      user,
      sort: sort || undefined,
      claimId: searchTerm || undefined,
      stage: stageValue,
      origin,
      benefitType:
        filters?.benefitType && filters?.benefitType?.length > 0
          ? { $in: filters?.benefitType }
          : undefined,
      intimationDate: filters?.intimationDate
        ? dayjs(filters?.intimationDate)
            .tz("Asia/Kolkata")
            .format("DD-MMM-YYYY hh:mm:ss A")
        : undefined,
    };

    delete payload?.moreFilters;

    try {
      const { data } = await axios.post<ResponseType<IDashboardData>>(
        EndPoints.DASHBOARD_DATA,
        payload
      );
      setData(data.data);
      setPagination((prev) => ({ ...prev, count: data?.count }));
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.limit, pagination.page, sort, searchTerm, user?._id]);

  useEffect(() => {
    if (user?._id) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.limit, pagination.page, sort, searchTerm, user?._id]);

  const showClearBtn = sort !== null || !!searchTerm || filters?.filterApplied;

  return (
    <Fragment>
      <InboxHeader
        {...{
          values: filters,
          searchTerm,
          setSearchTerm,
          showClearBtn,
          data,
          clearFilters,
          sort,
          getFilters: (val) => {
            setPagination((prev) => ({ ...prev, page: 1 }));
            setFilters(val);
          },
          refetch: fetchData,
          origin,
        }}
      />
      <TableContent
        {...{
          data,
          fetchData,
          handleSort,
          handleView,
          loading,
          showClearBtn,
          origin,
        }}
      />

      <Pagination
        className="w-fit ml-auto mt-8"
        value={pagination.page}
        onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        total={Math.ceil(pagination.count / pagination.limit)}
      />
    </Fragment>
  );
};

export default MainContent;
