import React from "react";
import UsersTable from "./components/UsersTable";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";

const User = () => {
  return (
    <PageWrapper title="Users">
      <UsersTable />
    </PageWrapper>
  );
};

export default User;
