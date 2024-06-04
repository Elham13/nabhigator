import React, { ReactNode } from "react";
import PageWrapperContent from "./generalContents/PageWrapperContent";

type PropTypes = {
  children: ReactNode;
  title: string;
  showBackBtn?: boolean;
};

const PageWrapper = ({ title, showBackBtn, children }: PropTypes) => {
  return (
    <PageWrapperContent title={title} showBackBtn={showBackBtn}>
      {children}
    </PageWrapperContent>
  );
};

export default PageWrapper;
