import PageWrapper from "@/components/ClaimsComponents/PageWrapper";
import { Title } from "@mantine/core";
import React from "react";
import DetailsContent from "../../action-inbox/components/DetailsContent";

type PropTypes = {
  params: { id?: string };
  searchParams: Record<string, any>;
};

const ConsolidatedInboxDetail = ({ params }: PropTypes) => {
  if (!params?.id) {
    return (
      <PageWrapper title="Consolidate Inbox Detail" showBackBtn>
        <Title order={2} mt={20} ta="center" c="red">
          Failed to get dashboard id
        </Title>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Consolidate Inbox Detail" showBackBtn>
      <DetailsContent
        dashboardDataId={params?.id as string}
        origin="consolidated"
      />
    </PageWrapper>
  );
};

export default ConsolidatedInboxDetail;
