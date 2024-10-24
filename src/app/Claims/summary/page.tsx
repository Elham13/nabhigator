"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import axios from "axios";
import dayjs from "dayjs";
import { PiFolderOpenLight } from "react-icons/pi";
import {
  CaseDetail,
  ICaseEvent,
  IDashboardData,
  IMultipleEvents,
  NumericStage,
  RejectionReason,
  ResponseType,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { EndPoints } from "@/lib/utils/types/enums";
import { buildUrl, showError } from "@/lib/helpers";
import MultipleEventsTableRow from "./components/MultipleEventsTableRow";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";
import DocumentsMenu from "@/components/ClaimsComponents/documentsMenu";
import CommonTableHead from "@/components/ClaimsComponents/commonTable/CommonTableHead";
import {
  multipleEventTableHeading,
  singleEventTableHeading,
} from "@/lib/utils/constants/tableHeadings";
import RejectionReasons from "../action-inbox/components/InboxDetail/RejectionReasons";

interface IFilters {
  claimId: string;
  claimType: string;
  spotNumber: string;
  contractNumber: string;
  membershipNumber: string;
  pivotalCustomerId: string;
}

type SearchEnum = "single" | "multiple" | "clear";

const filtersInitial: IFilters = {
  claimType: "",
  claimId: "",
  spotNumber: "",
  contractNumber: "",
  membershipNumber: "",
  pivotalCustomerId: "",
};

const Summary = () => {
  const [filters, setFilters] = useState<IFilters>(filtersInitial);
  const [actionEvent, setActionEvent] = useState<ICaseEvent[]>([]);
  const [multipleEvents, setMultipleEvents] = useState<IMultipleEvents[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<IDashboardData | null>(
    null
  );
  const [rejectionReasons, setRejectionReasons] = useState<RejectionReason[]>(
    []
  );

  const handleChange = (name: keyof IFilters, val: string | null) => {
    setFilters((prev) => ({ ...prev, [name]: val || "" }));
  };

  const handleFilter = async (type: SearchEnum = "single") => {
    setLoading(true);
    let searchPayload = {};
    let searchType: SearchEnum = type;
    if (searchType !== "clear") {
      if (filters.claimId || filters.spotNumber) {
        searchPayload = {
          claimId: filters?.claimId ? parseInt(filters?.claimId) : undefined,
          spotNumber: filters?.spotNumber || undefined,
        };
      } else {
        searchType = "multiple";
        searchPayload = {
          contractNumber: filters?.contractNumber || undefined,
          membershipNumber: filters?.membershipNumber || undefined,
          pivotalCustomerId: filters?.pivotalCustomerId || undefined,
        };
      }
    }

    try {
      if (["single", "multiple"].includes(searchType)) {
        const { data } = await axios.post<ResponseType<ICaseEvent>>(
          EndPoints.CASE_EVENT,
          {
            searchType,
            searchPayload,
          }
        );
        if (searchType === "single") {
          setActionEvent(data?.data);
          setMultipleEvents([]);
        } else if (searchType === "multiple") {
          const tempData: IMultipleEvents[] = [];
          const arr = data?.data?.sort((a, b) =>
            dayjs(b.eventDate).diff(dayjs(a.eventDate))
          );
          arr.forEach((el) => {
            const foundIndex = tempData?.findIndex(
              (item) => item?.claimId === el.claimId
            );
            if (foundIndex < 0) {
              tempData.push({ ...el, children: [el] });
            } else {
              tempData[foundIndex]["children"]?.push(el);
            }
          });

          setMultipleEvents(
            tempData.map((el) => {
              el.children = el.children.sort((a, b) =>
                dayjs(a.eventDate).diff(dayjs(b.eventDate))
              );
              return el;
            })
          );
          setActionEvent([]);
        }
      } else {
        setActionEvent([]);
        setMultipleEvents([]);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFilters(filtersInitial);
    handleFilter("clear");
    setRejectionReasons([]);
  };

  const singleEventRow = useMemo(
    () =>
      actionEvent?.map((el) => (
        <Table.Tr key={el?._id}>
          <Table.Td className="whitespace-nowrap">{el?.eventName}</Table.Td>
          <Table.Td className="whitespace-nowrap">
            {el?.eventDate ? dayjs(el?.eventDate).format("D-MMM-YY") : "-"}
          </Table.Td>
          <Table.Td className="whitespace-nowrap">
            {el?.eventDate ? dayjs(el?.eventDate).format("hh:mm a") : "-"}
          </Table.Td>
          <Table.Td className="whitespace-nowrap">{el?.userName}</Table.Td>
          <Table.Td className="whitespace-nowrap">{el?.eventRemarks}</Table.Td>
        </Table.Tr>
      )),
    [actionEvent]
  );

  const multipleEventRow = useMemo(
    () => (
      <Table.Tbody>
        {multipleEvents?.map((el) => (
          <MultipleEventsTableRow key={el._id} item={el} />
        ))}
      </Table.Tbody>
    ),
    [multipleEvents]
  );

  useEffect(() => {
    if (actionEvent?.length > 0) {
      // Get Dashboard Data
      (async () => {
        try {
          setLoading(true);
          const { data } = await axios.get<SingleResponseType<IDashboardData>>(
            buildUrl(EndPoints.DASHBOARD_DATA, {
              claimId: actionEvent[0].claimId,
            })
          );
          setDashboardData(data?.data);

          if (data?.data?.stage === NumericStage.REJECTED) {
            const { data: caseDetail } = await axios.get<
              SingleResponseType<CaseDetail>
            >(
              buildUrl(EndPoints.CASE_DETAIL, {
                id: data?.data?.caseId,
              })
            );

            if (caseDetail?.data?.rejectionReasons?.length > 0) {
              setRejectionReasons(caseDetail?.data?.rejectionReasons);
            }
          }
        } catch (error: any) {
          showError(error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [actionEvent]);

  const filterExist = Object.keys(filters)?.every(
    (ke) => filters[ke as keyof IFilters] === ""
  );

  return (
    <PageWrapper title="Summary / Audit Trial">
      <Flex className="mt-8" wrap="wrap" rowGap={20} columnGap={20} align="end">
        <TextInput
          label="Pre-Auth/Claim Number"
          placeholder="Enter Pre-Auth/Claim Number"
          value={filters.claimId}
          onChange={(e) => handleChange("claimId", e.target.value)}
          type="number"
        />
        <TextInput
          label="Spot number"
          placeholder="Enter Spot number"
          value={filters.spotNumber}
          onChange={(e) => handleChange("spotNumber", e.target.value)}
        />
        <TextInput
          label="Contract number"
          placeholder="Enter Contract number"
          value={filters.contractNumber}
          onChange={(e) => handleChange("contractNumber", e.target.value)}
        />
        <TextInput
          label="Membership number"
          placeholder="Enter Membership number"
          value={filters.membershipNumber}
          onChange={(e) => handleChange("membershipNumber", e.target.value)}
        />
        <TextInput
          label="Pivotal Customer ID"
          placeholder="Enter Pivotal Customer ID"
          value={filters.pivotalCustomerId}
          onChange={(e) => handleChange("pivotalCustomerId", e.target.value)}
        />
        <Button disabled={filterExist} onClick={() => handleFilter()}>
          Filter
        </Button>
        <Button
          color="red"
          variant="transparent"
          disabled={filterExist}
          onClick={handleClear}
        >
          Clear
        </Button>
      </Flex>

      <Group py={20}>
        {loading ? (
          <Stack justify="center" align="center" w="100%" mt={80}>
            <Loader color="blue" />
          </Stack>
        ) : actionEvent?.length > 0 ? (
          <Box className="w-full">
            <DocumentsMenu dashboardData={dashboardData} />
            <Table.ScrollContainer minWidth={800} w="100%" mt={30}>
              <Table highlightOnHover>
                <CommonTableHead
                  tableHeadings={singleEventTableHeading}
                  clear={false}
                  onSort={() => {}}
                  hasSelection={false}
                />
                <Table.Tbody>{singleEventRow}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Box>
        ) : multipleEvents?.length > 0 ? (
          <Table.ScrollContainer minWidth={800} w="100%" mt={30}>
            <Table highlightOnHover>
              <CommonTableHead
                tableHeadings={multipleEventTableHeading}
                clear={false}
                onSort={() => {}}
                hasSelection={false}
              />
              {multipleEventRow}
            </Table>
          </Table.ScrollContainer>
        ) : (
          <Stack justify="center" align="center" w="100%" mt={80}>
            <PiFolderOpenLight size={30} color="#aaa" />
            <Text c="dimmed">No Data</Text>
          </Stack>
        )}

        {rejectionReasons?.length > 0 ? (
          <RejectionReasons rejectionReasons={rejectionReasons} />
        ) : null}
      </Group>
    </PageWrapper>
  );
};

export default Summary;
