import React, { useEffect, useState } from "react";
import { Box, Table, Text } from "@mantine/core";
import { toast } from "react-toastify";
import {
  CaseState,
  MainTriage,
  TempTriage,
  TriageResult,
} from "@/lib/utils/types/fniDataTypes";

type PropType = {
  id: string;
  getCaseState: (caseState: CaseState) => void;
  triageSummary: MainTriage[];
};

const TriageSummary = ({ getCaseState, triageSummary }: PropType) => {
  const [data, setData] = useState<TempTriage[]>([]);
  const [info, setInfo] = useState<TriageResult>({
    total: 0,
    accepted: 0,
    rejected: 0,
    result: "",
  });

  useEffect(() => {
    if (triageSummary && triageSummary?.length > 0) {
      if (triageSummary?.some((obj) => obj.acceptOrReject?.condition)) {
        getCaseState(CaseState.ACCEPTED);
      } else {
        toast.warning("Case rejected automatically in the triaging logic");
        getCaseState(CaseState.REJECTED);
      }

      const accepted = triageSummary?.filter(
        (obj) => obj.acceptOrReject.condition
      )?.length;
      const rejected = triageSummary?.filter(
        (obj) => !obj.acceptOrReject.condition
      )?.length;

      setInfo({
        total: triageSummary?.length,
        accepted,
        rejected,
        result: accepted > 0 ? "Accepted" : "Rejected",
      });
      const res = triageSummary
        ?.filter((obj) => obj.acceptOrReject.condition)
        ?.map((obj) => ({
          variable: obj.variable,
          result: obj.result,
          inference: obj.acceptOrReject,
        }));
      setData(res);
    }
  }, [triageSummary, getCaseState]);

  return (
    <Box>
      {data?.length > 0 && (
        <>
          <Table withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Variable</Table.Th>
                <Table.Th>Result</Table.Th>
                <Table.Th>Inference</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.map((elem, ind) => (
                <Table.Tr key={ind}>
                  <Table.Td>{elem?.variable}</Table.Td>
                  <Table.Td>{elem?.result}</Table.Td>
                  <Table.Td>{elem?.inference?.text}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Box mt={20}>
            <Text fw="bold">Summary of result:</Text>
            <table className="border-collapse">
              <tbody>
                <tr className="bg-gray-500 text-white">
                  <td className="px-4 py-2">Total</td>
                  <td className="px-4 py-2">{info.total}</td>
                </tr>
                <tr className="bg-green-500 text-white">
                  <td className="px-4 py-2">Accepted</td>
                  <td className="px-4 py-2">{info.accepted}</td>
                </tr>
                <tr className="bg-red-500 text-white">
                  <td className="px-4 py-2">Rejected</td>
                  <td className="px-4 py-2">{info.rejected}</td>
                </tr>
              </tbody>
            </table>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TriageSummary;
