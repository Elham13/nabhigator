import React from "react";
import InvestigatorsList from "@/components/ClaimsComponents/InvestigatorsList";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";

const Investigators = () => {
  return (
    <PageWrapper title="Investigators">
      <InvestigatorsList destination="inbox" />
    </PageWrapper>
  );
};

export default Investigators;
