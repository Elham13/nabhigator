import React from "react";
import { Accordion, Text } from "@mantine/core";
import HistoryTable from "./HistoryTable";
import {
  HistoricalClaim,
  IDashboardData,
} from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  data: IDashboardData | null;
};

const HistoricalClaimTable = ({ data }: PropTypes) => {
  const historicalClaim: HistoricalClaim[] = data?.historicalClaim || [];

  return (
    <Accordion>
      {historicalClaim?.map((elem) => (
        <Accordion.Item key={elem?._id} value={elem._id}>
          <Accordion.Control>{elem?.memberName}</Accordion.Control>
          <Accordion.Panel>
            {elem?.history && elem?.history?.length > 0 ? (
              <HistoryTable history={elem?.history} dashboardData={data} />
            ) : (
              <Text>No history exist</Text>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default HistoricalClaimTable;
