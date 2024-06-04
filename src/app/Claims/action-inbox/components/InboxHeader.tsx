import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  FileInput,
  Flex,
  Modal,
  NumberInput,
  Text,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import { toast } from "react-toastify";
import { BiSearch } from "react-icons/bi";
import { AiOutlineClear } from "react-icons/ai";
import { CiFilter } from "react-icons/ci";
import { HiDocumentAdd } from "react-icons/hi";
import TableAdjustment from "./TableAdjustment";
import FilterModal from "./FilterModal";
import DownloadExcelBtn from "./DownloadExcelBtn";
import {
  DashboardFilters,
  Role,
  SortOrder,
  TDashboardOrigin,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";

interface PropType {
  values: DashboardFilters;
  showClearBtn: boolean;
  searchTerm: string;
  sort: {
    [x: string]: SortOrder;
  } | null;
  origin: TDashboardOrigin;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  clearFilters: () => void;
  getFilters: (values: DashboardFilters) => void;
  refetch: () => void;
}

const InboxHeader = ({
  values,
  showClearBtn,
  searchTerm,
  sort,
  origin,
  setSearchTerm,
  clearFilters,
  getFilters,
  refetch,
}: PropType) => {
  const fileRef = useRef(null);
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [opened, { open, close }] = useDisclosure(false);
  const [docOpened, { open: openDoc, close: closeDoc }] = useDisclosure(false);
  const [filters, setFilters] = useState<DashboardFilters>(values);
  const [xlFile, setXlFile] = useState(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleClose = () => {
    setFilters({ filterApplied: false });
    close();
  };

  const handleCloseDoc = () => {
    if (xlFile) setXlFile(null);
    closeDoc();
  };

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const processedFilters = { ...filters };

    getFilters(processedFilters);

    handleClose();
  };

  const handleUpload = async () => {
    if (xlFile === null) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", xlFile);

    try {
      const { data } = await axios.post(
        EndPoints.UPLOAD_DASHBOARD_DATA,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message);
      toast.warning(
        `${data.inserted} records inserted and ${data.skipped} records skipped`
      );
      closeDoc();
      setXlFile(null);
      refetch();
    } catch (error) {
      showError(error);
    } finally {
      setUploading(false);
    }
  };

  const downloadSample = () => {
    const link = document.createElement("a");
    link.href = "/claim_details_sample_file.xlsx";
    link.download = "Calim_Details_Sample_File.xlsx";
    link.click();
  };

  useEffect(() => {
    setFilters(values);
  }, [values, opened]);

  return (
    <Box className="flex justify-between items-center mb-2 gap-2 flex-wrap md:flex-nowrap">
      <Flex gap={2} align="center">
        <FilterModal
          {...{
            filters,
            origin,
            handleClose,
            handleFilter,
            open: opened,
            setFilters,
            showClearBtn,
          }}
        />
        <NumberInput
          radius="lg"
          leftSection={<BiSearch />}
          placeholder="Search Claim Id"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e as string)}
          rightSectionPointerEvents="all"
        />
        {showClearBtn && (
          <Button
            radius="lg"
            onClick={clearFilters}
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
      <Box className="flex items-center gap-x-2">
        {user?.activeRole === Role.ADMIN && origin === "Consolidated" && (
          <>
            <Button
              size="compact-md"
              rightSection={<HiDocumentAdd />}
              onClick={openDoc}
            >
              Upload Document
            </Button>

            <Modal
              opened={docOpened}
              onClose={handleCloseDoc}
              title="Upload Document"
              centered
              size="lg"
            >
              <Box p={20}>
                <Text size="xs">
                  <strong>Instructions: </strong>Please download the sample file
                  and make sure number of columns and column names match with
                  the sample
                </Text>
                <Button
                  onClick={downloadSample}
                  size="compact-sm"
                  variant="outline"
                  mt={10}
                  mb={20}
                >
                  Download Sample
                </Button>
                <FileInput
                  {...{
                    ref: fileRef,
                    onFileSelected: (file: any) => setXlFile(file),
                    title: "",
                    onDelete: () => setXlFile(null),
                    accept:
                      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                    disabled: false,
                    preventDelete: false,
                  }}
                />
                <Button
                  loading={uploading}
                  disabled={!xlFile}
                  mt={20}
                  onClick={handleUpload}
                >
                  Upload Document
                </Button>
              </Box>
            </Modal>
          </>
        )}
        {user?.activeRole !== Role.VIEWER ||
        (origin === "Consolidated" &&
          user?.config?.canExportConsolidatedInbox === "Yes") ? (
          <DownloadExcelBtn
            filters={filters}
            sort={sort}
            searchTerm={searchTerm}
          />
        ) : null}
        <TableAdjustment />
      </Box>
    </Box>
  );
};

export default InboxHeader;
