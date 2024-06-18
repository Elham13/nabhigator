"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Card, Flex, Group, Select, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { MdPersonOutline } from "react-icons/md";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import {
  IUser,
  Role,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { showError } from "@/lib/helpers";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";

const UserDetail = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div>
      <Text ta="center" fz="sm" c="dimmed">
        {label}
      </Text>
      <Text ta="center" fz="lg" lh={1} fw={500}>
        {value || "-"}
      </Text>
    </div>
  );
};

const Profile = () => {
  const isFirstMount = useRef(true);
  const router = useRouter();
  const [user] = useLocalStorage<IUserFromSession | null>({
    key: StorageKeys.USER,
  });
  const [apiUser, setApiUser] = useState<IUser | null>(null);

  const handleEditUser = () => {
    router.push(`/Claims/user/${user?.userId}`);
  };

  const handleManageUser = () => {
    router.push(`/Claims/user/manage?userId=${user?.userId}`);
  };

  useEffect(() => {
    (async () => {
      if (user && user?._id && !apiUser && isFirstMount.current) {
        try {
          const { data } = await axios.get<SingleResponseType<IUser>>(
            `${EndPoints.USER}?id=${user?._id}`
          );
          setApiUser(data?.data);
        } catch (error: any) {
          showError(error);
        } finally {
          isFirstMount.current = false;
        }
      }
    })();
  }, [user, apiUser]);

  return (
    <PageWrapper title="">
      <Card
        withBorder
        padding="xl"
        radius="md"
        className="bg-[var(--mantine-color-body)]"
      >
        <Card.Section
          h={140}
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)",
          }}
        />
        <Avatar
          size={100}
          radius={100}
          mx="auto"
          mt={-30}
          className="border-2 border-[var(--mantine-color-body)]"
        >
          <MdPersonOutline size={80} />
        </Avatar>
        <Text ta="center" fz="lg" fw={500} mt="sm">
          {user?.name}
        </Text>
        <Text ta="center" fz="sm" c="dimmed">
          {user?.role?.join(", ")}
        </Text>
        <Group mt="md" justify="center" gap={30}>
          <UserDetail label="User ID" value={user?.userId} />
          <UserDetail label="Status" value={user?.status} />
          <UserDetail
            label="Created At"
            value={dayjs(user?.createdAt)?.format("DD-MMM-YYYY")}
          />
          <UserDetail
            label="Updated At"
            value={dayjs(user?.updatedAt)?.format("DD-MMM-YYYY")}
          />
          <UserDetail label="Active Role" value={user?.activeRole} />
          {user?.zone && user?.zone?.length > 0 ? (
            <UserDetail label="Zone" value={user?.zone?.join(", ")} />
          ) : null}
          {user?.activeRole !== Role.ADMIN ? (
            <>
              <UserDetail
                label="Claim Amount"
                value={user?.claimAmountThreshold}
              />
              {user?.config?.leadView && user?.config?.leadView?.length > 0 && (
                <Select
                  placeholder="Can see these cases"
                  data={user?.config?.leadView}
                  searchable
                  clearable
                />
              )}
              {user?.state && user?.state?.length > 0 && (
                <Select
                  placeholder="Assigned states"
                  data={user?.state}
                  searchable
                  clearable
                />
              )}
            </>
          ) : null}
        </Group>
        <Flex columnGap={10}>
          {user?.activeRole === Role.ADMIN ? (
            <Button
              fullWidth
              radius="md"
              mt="xl"
              size="md"
              variant="default"
              onClick={handleEditUser}
            >
              Edit
            </Button>
          ) : null}
          <Button
            fullWidth
            radius="md"
            mt="xl"
            size="md"
            variant="default"
            onClick={handleManageUser}
          >
            Manage
          </Button>
          {apiUser && apiUser?.role?.length > 1 && (
            <Button
              fullWidth
              radius="md"
              mt="xl"
              size="md"
              variant="default"
              onClick={() => router.push("/Claims/dashboard/selectRole")}
            >
              Change Role
            </Button>
          )}
        </Flex>
      </Card>
    </PageWrapper>
  );
};

export default Profile;
