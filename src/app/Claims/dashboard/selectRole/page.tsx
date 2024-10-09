"use client";

import React, { useEffect, useState } from "react";
import { Button, Container, Loader, Paper, Select, Title } from "@mantine/core";
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
  const [loadings, setLoadings] = useState({
    fetching: false,
    submitting: false,
  });

  const handleChange = async () => {
    if (role) {
      setLoadings((prev) => ({ ...prev, submitting: true }));
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
      } finally {
        setLoadings((prev) => ({ ...prev, submitting: false }));
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (user && user?._id && !apiUser) {
        setLoadings((prev) => ({ ...prev, fetching: true }));

        try {
          const { data } = await axios.get<SingleResponseType<IUser>>(
            `${EndPoints.USER}?id=${user?._id}`
          );
          setApiUser(data?.data);
        } catch (error: any) {
          showError(error);
        } finally {
          setLoadings((prev) => ({ ...prev, fetching: false }));
        }
      }
    })();
  }, [user, apiUser]);

  return (
    <Paper h="100vh">
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
        <div className="flex items-end">
          <Select
            className="w-full"
            mt={20}
            label="Activate one role"
            placeholder="This role will be active during the entire session"
            data={apiUser?.role || []}
            value={role}
            onChange={(val) => setRole(val as Role)}
            clearable
            disabled={loadings?.fetching}
          />
          {loadings.fetching && <Loader size="md" type="dots" />}
        </div>
        <Button
          mt={10}
          disabled={!role}
          onClick={handleChange}
          loading={loadings?.submitting}
        >
          Change
        </Button>
      </Container>
    </Paper>
  );
};

export default SelectRole;
