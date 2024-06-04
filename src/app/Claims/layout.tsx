import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NABHIGATOR",
  description:
    "NABHIGATOR is a platform to investigate claims and confirm if they are legitimate",
};

type PropTypes = {
  children: React.ReactNode;
};

const NabhigatorLayout = ({ children }: PropTypes) => {
  return <section>{children}</section>;
};

export default NabhigatorLayout;
