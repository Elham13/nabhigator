import React from "react";
import { Box, Divider, Text, Title } from "@mantine/core";
import {
  CaseDetail,
  CaseState,
  IDashboardData,
} from "@/lib/utils/types/fniDataTypes";
import TriageSummary from "@/components/ClaimsComponents/TriageSummary";
import FraudIndicatorTable from "@/components/ClaimsComponents/FraudIndicators";

type PropTypes = {
  caseDetail: CaseDetail | null;
  data: IDashboardData | null;
  setCaseState: React.Dispatch<React.SetStateAction<CaseState>>;
};

const TriageOrPreQcSummary = ({
  caseDetail,
  data,
  setCaseState,
}: PropTypes) => {
  return (
    <div>
      <Title order={5} ta="center" c="green" my={4}>
        Triggers
      </Title>
      <Box>
        {caseDetail?.caseType &&
          caseDetail?.caseType?.length > 0 &&
          caseDetail?.caseType?.map((el, ind) => <Text key={ind}>{el}</Text>)}
      </Box>
      <Divider />
      <Title order={5} ta="center" c="green" my={4}>
        Triaging Summary
      </Title>
      <TriageSummary
        getCaseState={(status) => setCaseState(status)}
        id={data?._id as string}
        triageSummary={data?.triageSummary || []}
      />
      <Divider />
      <Title order={5} ta="center" c="green" my={4}>
        Model Fraud Indicator
      </Title>
      <FraudIndicatorTable
        data={data?.fraudIndicators?.indicatorsList}
        comments={data?.fraudIndicators?.remarks}
      />
      {data?.claimType === "Reimbursement" && (
        <>
          <Divider />
          <Title order={5} ta="center" c="green" my={4}>
            Exclusion Remarks
          </Title>
          <Text>{data?.claimDetails?.exclusionRemark || "-"}</Text>
          <Divider className="my-4" />
          <Text>
            Member Fraud Status: {data?.claimDetails?.fraudStatus || "-"}
          </Text>
          <Text>Fraud Type: {data?.claimDetails?.fraudType || "-"}</Text>
          <Text>Fraud Reason: {data?.claimDetails?.fraudReason || "-"}</Text>
        </>
      )}
    </div>
  );
};

export default TriageOrPreQcSummary;
