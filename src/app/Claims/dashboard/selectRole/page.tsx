"use client";

import React, { useEffect, useState } from "react";
import { Button, Container, Paper, Select, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import {
  IUser,
  Role,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { showError } from "@/lib/helpers";
import Header from "../../login/components/Header";

const SelectRole = () => {
  const router = useRouter();
  const [user, setUser] = useLocalStorage<IUserFromSession | null>({
    key: StorageKeys.USER,
  });

  const [apiUser, setApiUser] = useState<IUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  const handleChange = async () => {
    if (role) {
      try {
        const { data } = await axios.post<SingleResponseType<IUser>>(
          EndPoints.USER,
          {
            userId: user?.userId,
            action: "changeActiveRole",
            role,
          }
        );
        setUser(data?.data);
        router.replace("/Claims/dashboard");
      } catch (error: any) {
        showError(error);
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (user && user?._id && !apiUser) {
        try {
          const { data } = await axios.get<SingleResponseType<IUser>>(
            `${EndPoints.USER}?id=${user?._id}`
          );
          setApiUser(data?.data);
        } catch (error: any) {
          showError(error);
        }
      }
    })();
  }, [user, apiUser]);

  return (
    <Paper h="100%">
      <Head>
        <title>Claim Dashboard</title>
        <meta
          name="description"
          content="A dashboard in which you can see and manage all FNI claim cases"
        />
      </Head>
      <Header />
      <Container size={420} my={40}>
        <Title ta="center">Select a role</Title>
        <Select
          mt={20}
          label="Activate one role"
          placeholder="This role will be active during the entire session"
          data={apiUser?.role || []}
          value={role}
          onChange={(val) => setRole(val as Role)}
          clearable
        />
        <Button mt={10} disabled={!role} onClick={handleChange}>
          Change
        </Button>
      </Container>
    </Paper>
  );
};

export default SelectRole;
