import PageWrapper from "@/components/ClaimsComponents/PageWrapper";
import React from "react";
import MainContent from "./components/MainContent";

const ActionInbox = () => {
  return (
    <PageWrapper title="Action Inbox">
      <MainContent origin="Inbox" />
    </PageWrapper>
  );
};

export default ActionInbox;
