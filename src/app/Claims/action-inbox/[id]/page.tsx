import React from "react";
import { Title } from "@mantine/core";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
const DetailsContent = dynamic(() => import("../components/DetailsContent"), {
  ssr: false,
  loading: () => <Loading />,
});

type PropTypes = {
  params: { id?: string };
  searchParams: Record<string, any>;
};

const InboxDetail = ({ params }: PropTypes) => {
  if (!params?.id) {
    return (
      <PageWrapper title="Inbox Detail" showBackBtn>
        <Title order={2} mt={20} ta="center" c="red">
          Failed to get dashboard id
        </Title>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Inbox Detail" showBackBtn>
      <DetailsContent dashboardDataId={params?.id as string} origin="inbox" />
    </PageWrapper>
  );
};

export default InboxDetail;
