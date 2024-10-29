import CommonTableHead from "@/components/ClaimsComponents/commonTable/CommonTableHead";
import CommonTablePlaceholder from "@/components/ClaimsComponents/commonTable/CommonTablePlaceholder";
import { showError } from "@/lib/helpers";
import { assignCaseTableHeaders } from "@/lib/utils/constants/tableHeadings";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import {
  IDashboardData,
  IUser,
  NumericStage,
  ResponseType,
} from "@/lib/utils/types/fniDataTypes";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Modal,
  NumberInput,
  Pagination,
  Table,
  Title,
} from "@mantine/core";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";

type PropTypes = { el: IUser; refetch: () => void };

const AssignButton = ({ el, refetch }: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedClaimId] = useDebouncedValue(searchTerm, 300);
  const [selected, setSelected] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    count: 0,
  });

  const [data, setData] = useState<IDashboardData[]>([]);

  const handleSelect = (id: string) => {
    if (selected.includes(id))
      setSelected((prev) => prev.filter((elem) => elem !== id));
    else {
      setSelected((prev) => [...prev, id]);
    }
  };

  const handleAssign = async () => {
    setLoading(true);
    try {
      const payload = {
        action: "assignCases",
        id: el?._id,
        caseIds: selected,
        userId: user?._id,
      };
      await axios.post<ResponseType<IUser>>(EndPoints.POST_QA_USER, payload);

      toast.success("Cases Assigned successfully");
      setOpen(false);
      refetch();
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          setDataLoading(true);
          const payload = {
            pagination,
            claimId: debouncedClaimId || undefined,
            stage: NumericStage.POST_QC,
            $or: [{ postQa: null }, { postQa: { $exists: false } }],
          };
          const { data } = await axios.post<ResponseType<IDashboardData>>(
            EndPoints.DASHBOARD_DATA,
            payload
          );
          setData(data.data);
          setPagination((prev) => ({ ...prev, count: data?.count }));
        } catch (error) {
          showError(error);
        } finally {
          setDataLoading(false);
        }
      };

      fetchData();
    }
  }, [open, pagination.limit, pagination.page, debouncedClaimId]);

  return (
    <Fragment>
      <Button size="compact-xs" onClick={() => setOpen(true)}>
        Assign
      </Button>

      {open && (
        <Modal opened={open} onClose={() => setOpen(false)} size="xl">
          <Title order={4}>Manually Assign cases to {el?.name}</Title>

          <Box mt={10}>
            <NumberInput
              label="Claim Id"
              placeholder="Claim Id"
              value={searchTerm}
              onChange={(val) => setSearchTerm(val as string)}
              className="w-fit mb-4"
            />
            <Table.ScrollContainer minWidth={800}>
              <Table highlightOnHover striped withTableBorder>
                <CommonTableHead
                  tableHeadings={assignCaseTableHeaders}
                  clear={false}
                  onSort={() => {}}
                  hasSelection={true}
                  selectedCount={selected.length}
                  dataCount={data?.length}
                  onSelectAll={(checked) =>
                    checked
                      ? setSelected(data?.map((el) => el?._id as string))
                      : setSelected([])
                  }
                />

                <Table.Tbody>
                  {dataLoading ? (
                    <CommonTablePlaceholder
                      type="loader"
                      colSpan={assignCaseTableHeaders?.length + 1}
                    />
                  ) : data?.length > 0 ? (
                    data?.map((el) => (
                      <Table.Tr key={el?._id as string}>
                        <Table.Td className="whitespace-nowrap">
                          <Checkbox
                            checked={selected.includes(el?._id as string)}
                            onChange={() => handleSelect(el?._id as string)}
                          />
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          {el?.claimId}
                        </Table.Td>
                        <Table.Td className="whitespace-nowrap">
                          {el?.claimType}
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <CommonTablePlaceholder
                      type="empty"
                      colSpan={assignCaseTableHeaders?.length + 1}
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

          <Grid>
            <Grid.Col span={12} my={10}>
              <Flex justify="flex-end" gap={4}>
                <Button color="red" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  loading={loading}
                  onClick={handleAssign}
                  disabled={selected?.length < 1}
                >
                  Assign
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
        </Modal>
      )}
    </Fragment>
  );
};

export default AssignButton;
