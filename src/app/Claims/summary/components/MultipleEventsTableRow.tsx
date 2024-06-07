import React, { useState } from "react";
import { ActionIcon, Badge, Flex, Table } from "@mantine/core";
import dayjs from "dayjs";
import { PiMinus, PiPlus } from "react-icons/pi";
import { IMultipleEvents } from "@/lib/utils/types/fniDataTypes";
import { getStageLabel, getStatusColor } from "@/lib/helpers";
import {
  multipleEventTableHeading,
  singleEventTableHeading,
} from "@/lib/utils/constants/tableHeadings";
import CommonTableHead from "@/components/ClaimsComponents/commonTable/CommonTableHead";
import CommonTablePlaceholder from "@/components/ClaimsComponents/commonTable/CommonTablePlaceholder";

type PropTypes = {
  item: IMultipleEvents;
};

const MultipleEventsTableRow = ({ item }: PropTypes) => {
  const [childrenVisible, setChildrenVisible] = useState<boolean>(false);

  return (
    <>
      <Table.Tr>
        <Table.Td className="whitespace-nowrap">
          <Flex columnGap={10}>
            <ActionIcon
              variant="subtle"
              onClick={() => setChildrenVisible((prev) => !prev)}
            >
              {childrenVisible ? <PiMinus /> : <PiPlus />}
            </ActionIcon>
            {item?.claimId}
          </Flex>
        </Table.Td>
        <Table.Td className="whitespace-nowrap">{item?.claimType}</Table.Td>
        <Table.Td className="whitespace-nowrap">
          {item?.intimationDate
            ? dayjs(item?.intimationDate).format("DD-MMM-YY")
            : "-"}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          <Badge color={getStatusColor(item?.status)}>
            {getStageLabel(item?.status)}
          </Badge>
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          {item?.recommendation}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          {item?.closureDate ? dayjs(item?.closureDate).format("hh:mm a") : "-"}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          {item?.investigator && typeof item?.investigator !== "string"
            ? item?.investigator?.investigatorName
            : "-"}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">
          {item?.clusterManager && typeof item?.clusterManager !== "string"
            ? item?.clusterManager?.name
            : "-"}
        </Table.Td>
        <Table.Td className="whitespace-nowrap">{item?.zonalManager}</Table.Td>
        <Table.Td className="whitespace-nowrap">{item?.qaBy}</Table.Td>
      </Table.Tr>
      {childrenVisible ? (
        <Table.Tr>
          <Table.Td colSpan={multipleEventTableHeading?.length}>
            <Table highlightOnHover>
              <CommonTableHead
                tableHeadings={singleEventTableHeading}
                clear={false}
                onSort={() => {}}
                hasSelection={false}
              />
              <Table.Tbody>
                {item?.children?.length > 0 ? (
                  item?.children?.map((el) => (
                    <Table.Tr key={el?._id}>
                      <Table.Td className="whitespace-nowrap">
                        {el?.eventName}
                      </Table.Td>
                      <Table.Td className="whitespace-nowrap">
                        {el?.eventDate
                          ? dayjs(el?.eventDate).format("DD-MMM-YY")
                          : "-"}
                      </Table.Td>
                      <Table.Td className="whitespace-nowrap">
                        {el?.eventDate
                          ? dayjs(el?.eventDate).format("hh:mm a")
                          : "-"}
                      </Table.Td>
                      <Table.Td className="whitespace-nowrap">
                        {el?.userName}
                      </Table.Td>
                      <Table.Td className="whitespace-nowrap">
                        {el?.eventRemarks}
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <CommonTablePlaceholder
                    type="empty"
                    colSpan={singleEventTableHeading?.length}
                  />
                )}
              </Table.Tbody>
            </Table>
          </Table.Td>
        </Table.Tr>
      ) : null}
    </>
  );
};

export default MultipleEventsTableRow;
