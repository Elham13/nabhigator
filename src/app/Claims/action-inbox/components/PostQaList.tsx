import React, { useEffect, useMemo, useState } from "react";
import CommonTableHead from "@/components/ClaimsComponents/commonTable/CommonTableHead";
import CommonTablePlaceholder from "@/components/ClaimsComponents/commonTable/CommonTablePlaceholder";
import { showError } from "@/lib/helpers";
import { postQaTableHeaders } from "@/lib/utils/constants/tableHeadings";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { IUser, ResponseType, SortOrder } from "@/lib/utils/types/fniDataTypes";
import { Badge, Box, Button, Checkbox, Pagination, Table } from "@mantine/core";
import axios from "axios";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const tableHeadings = [
  "Name",
  "User ID",
  "Password",
  "Role",
  "Config",
  "Team Lead",
  "Status",
];

interface ILoadings {
  fetch: boolean;
  assign: boolean;
}

type PropTypes = {
  claimId: number;
};

const PostQaList = ({ claimId }: PropTypes) => {
  const router = useRouter();
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const [users, setUsers] = useState<IUser[]>([]);
  const [loadings, setLoadings] = useState<ILoadings>({
    fetch: false,
    assign: false,
  });
  const [sort, setSort] = useState<{ [x: string]: SortOrder } | null>(null);
  const [pagination, setPagination] = useState({
    limit: 5,
    page: 1,
    count: 0,
  });
  const [selected, setSelected] = useState<string[]>([]);

  const handleSort = (sortKey: string, order: SortOrder) => {
    setSort({ [sortKey]: order });
  };

  const handleSelect = (id: string) => {
    if (selected.includes(id))
      setSelected((prev) => prev.filter((elem) => elem !== id));
    else setSelected((prev) => [...prev, id]);
  };

  const handleAssign = async () => {
    setLoadings((prev) => ({ ...prev, assign: true }));
    try {
      let userName = "";
      let userId = "";
      if (selected?.length === 1) {
        const found = users?.find((el) => el?._id === selected[0]);
        if (found) {
          userName = found.name;
          userId = found?._id;
        }
      }

      const payload = {
        action: "assign",
        userId,
        userName,
        claimId,
        executer: user?._id,
        executerName: user?.name,
      };
      const { data } = await axios.post(EndPoints.POST_QA_USER, payload);
      toast.success(data?.message);
      router.replace("/Claims/action-inbox");
    } catch (error: any) {
      showError(error);
    } finally {
      setLoadings((prev) => ({ ...prev, assign: false }));
    }
  };

  const rows = useMemo(() => {
    return users?.map((el) => (
      <Table.Tr key={el?._id}>
        <Table.Td className="whitespace-nowrap">
          <Checkbox
            checked={selected.includes(el?._id)}
            onChange={() => handleSelect(el?._id)}
          />
        </Table.Td>
        <Table.Td>{el?.name}</Table.Td>
        <Table.Td>{el?.userId}</Table.Td>
        <Table.Td>{el?.phone}</Table.Td>
        <Table.Td>{el?.password}</Table.Td>
        <Table.Td>{el?.role?.join(", ")}</Table.Td>
        <Table.Td>
          {el?.status === "Active" ? (
            <Badge color="blue">{el?.status}</Badge>
          ) : (
            <Badge color="red">{el?.status}</Badge>
          )}
        </Table.Td>
        <Table.Td>
          {el?.state?.length > 0 ? el?.state?.join(", ") : "-"}
        </Table.Td>
        <Table.Td>{el?.zone?.length > 0 ? el?.zone?.join(", ") : "-"}</Table.Td>
      </Table.Tr>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, selected]);

  useEffect(() => {
    const getPostQA = async () => {
      setLoadings((prev) => ({ ...prev, fetch: true }));
      try {
        const payload = {
          action: "list",
          sort: sort || undefined,
          limit: pagination?.limit,
          skip: pagination.page - 1,
        };
        const { data } = await axios.post<ResponseType<IUser>>(
          EndPoints.POST_QA_USER,
          payload
        );
        setUsers(data?.data);
        setPagination((prev) => ({ ...prev, count: data?.count }));
      } catch (error: any) {
        showError(error);
      } finally {
        setLoadings((prev) => ({ ...prev, fetch: false }));
      }
    };

    getPostQA();
  }, [pagination.page, pagination.limit, sort]);

  return (
    <Box mt={10}>
      {selected?.length === 1 ? (
        <Button
          size="compact-xs"
          color="green"
          loading={loadings.assign}
          onClick={handleAssign}
        >
          Assign
        </Button>
      ) : null}
      <Table.ScrollContainer minWidth={800}>
        <Table highlightOnHover>
          <CommonTableHead
            tableHeadings={postQaTableHeaders}
            clear={false}
            onSort={handleSort}
            hasSelection={true}
            selectedCount={selected.length}
            dataCount={users?.length}
            onSelectAll={(checked) =>
              checked
                ? setSelected(users?.map((el) => el?._id))
                : setSelected([])
            }
          />

          <Table.Tbody>
            {loadings.fetch ? (
              <CommonTablePlaceholder
                type="loader"
                colSpan={tableHeadings?.length}
              />
            ) : users?.length > 0 ? (
              rows
            ) : (
              <CommonTablePlaceholder
                type="empty"
                colSpan={tableHeadings?.length}
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

export default PostQaList;
