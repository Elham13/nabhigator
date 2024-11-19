import React, { useState } from "react";
import { Button } from "@mantine/core";
import { IoCloudDownloadOutline } from "react-icons/io5";
import dayjs from "dayjs";
import axios from "axios";
import {
  DashboardFilters,
  SortOrder,
  TDashboardOrigin,
} from "@/lib/utils/types/fniDataTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";

type PropTypes = {
  filters: DashboardFilters;
  sort: {
    [x: string]: SortOrder;
  } | null;
  searchTerm: string;
  origin: TDashboardOrigin;
};

const DownloadExcelBtn = ({ filters, sort, searchTerm, origin }: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    let stageValue: any = undefined;
    if (filters?.stage && filters?.stage?.length > 0)
      stageValue = { $in: filters?.stage?.map((st) => parseInt(st)) };

    const payload = {
      ...filters,
      user,
      sort: sort || undefined,
      claimId: searchTerm || undefined,
      origin,
      stage: stageValue,
      benefitType:
        filters?.benefitType && filters?.benefitType?.length > 0
          ? { $in: filters?.benefitType }
          : undefined,
      filterApplied: true,
      intimationDate: filters?.intimationDate
        ? dayjs(filters?.intimationDate)
            .tz("Asia/Kolkata")
            .format("DD-MMM-YYYY hh:mm:ss A")
        : undefined,
    };
    delete payload?.moreFilters;
    try {
      const { data } = await axios.post<any>(
        EndPoints.DOWNLOAD_EXCEL,
        payload,
        {
          responseType: "blob", // Important for binary data
        }
      );

      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `data_${dayjs().format("DD-MMM-YYYY hh-mm-ss a")}.zip`; // Optional
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="compact-md"
      color="cyan"
      rightSection={<IoCloudDownloadOutline />}
      onClick={fetchData}
      loading={loading}
      disabled={loading}
    >
      Export Excel
    </Button>
  );
};

export default DownloadExcelBtn;
