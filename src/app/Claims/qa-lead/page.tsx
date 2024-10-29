"use client";
import React, { useState } from "react";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";
import { Box } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import QAList from "./components/QAList";

const QALead = () => {
  const [date, setDate] = useState<[Date | null, Date | null]>(() => [
    dayjs().subtract(1, "month").toDate(),
    dayjs().toDate(),
  ]);

  return (
    <PageWrapper title="QA Lead">
      <Box className="w-fit mb-4">
        <DatePickerInput
          type="range"
          label="Calendar"
          placeholder="Calendar"
          value={date}
          onChange={setDate}
        />
      </Box>
      <QAList />
    </PageWrapper>
  );
};

export default QALead;
