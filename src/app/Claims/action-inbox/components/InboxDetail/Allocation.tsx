import React, { Dispatch, SetStateAction } from "react";
import { Button, Flex, Paper, Title } from "@mantine/core";
import {
  CaseDetail,
  CaseState,
  IDashboardData,
} from "@/lib/utils/types/fniDataTypes";
import AcceptSection from "@/components/ClaimsComponents/AcceptSection";
import RejectedSection from "@/components/ClaimsComponents/RejectedSection";

type PropTypes = {
  caseState: CaseState;
  dashboardData: IDashboardData | null;
  caseDetail: CaseDetail | null;
  setCaseState: Dispatch<SetStateAction<CaseState>>;
  onClose?: () => void;
};

const Allocation = ({
  caseState,
  dashboardData,
  caseDetail,
  setCaseState,
  onClose,
}: PropTypes) => {
  if (!dashboardData?._id) {
    return (
      <Paper>
        <Title order={2} mt={20} ta="center" c="red">
          Something went wrong
        </Title>
      </Paper>
    );
  }

  return (
    <Paper>
      <Flex gap={10} my={20}>
        <Button onClick={() => setCaseState(CaseState.ACCEPTED)}>
          Accept to investigate
        </Button>
        <Button color="red" onClick={() => setCaseState(CaseState.REJECTED)}>
          Return to Claim
        </Button>
      </Flex>

      {caseState === CaseState.ACCEPTED ? (
        <AcceptSection {...{ dashboardData, caseDetail, onClose }} />
      ) : (
        <RejectedSection
          id={dashboardData?._id as string}
          handleCancel={() => setCaseState(CaseState.ACCEPTED)}
        />
      )}
    </Paper>
  );
};

export default Allocation;
