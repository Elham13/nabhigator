import React from "react";
import MainContent from "../action-inbox/components/MainContent";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";

const ConsolidatedInbox = () => {
  return (
    <PageWrapper title="Consolidated Inbox">
      <MainContent origin="Consolidated" />
    </PageWrapper>
  );
};

export default ConsolidatedInbox;
