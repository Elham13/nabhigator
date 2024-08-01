import React from "react";
import {  Table } from "@mantine/core";
import dayjs from "dayjs";
import { Member } from "@/lib/utils/types/fniDataTypes";
import BenefitViewBtn from "./BenefitViewBtn";

type PropTypes = {
  members: Member[];
};

const MembersTable = ({ members }: PropTypes) => {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Member ID</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>DOB</Table.Th>
          <Table.Th>Relation</Table.Th>
          <Table.Th>Benefits Covered</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {members?.map((elem) => (
          <Table.Tr key={elem?._id}>
            <Table.Td>{elem?.membershipNumber}</Table.Td>
            <Table.Td>{elem?.membershipName}</Table.Td>
            <Table.Td>
              {elem?.DOB ? dayjs(elem?.DOB).format("DD-MMM-YYYY") : ""}
            </Table.Td>
            <Table.Td>{elem?.relation}</Table.Td>
            <Table.Td>
              <BenefitViewBtn benefitsCovered={elem?.benefitsCovered} />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

export default MembersTable;
