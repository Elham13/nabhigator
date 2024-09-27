"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  AppShell,
  Burger,
  Button,
  Modal,
  Paper,
  Text,
  Title,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocalStorage } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { IUser, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { camelCaseToProperCase, showError } from "@/lib/helpers";

type PropTypes = {
  title: string;
  showBackBtn?: boolean;
  children: ReactNode;
};

const PageWrapperContent = ({ title, showBackBtn, children }: PropTypes) => {
  const isFirstRender = useRef<boolean>(true);
  const router = useRouter();
  const [user, setUser] = useLocalStorage<IUserFromSession>({
    key: StorageKeys.USER,
  });
  const { colorScheme } = useMantineColorScheme();

  const [opened, setOpened] = useState<boolean>(false);
  const [logoPath, setLogoPath] = useState<string>("/images/nabhigator.png");
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const toggle = () => setOpened((prev) => !prev);

  const handleAcknowledge = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post<SingleResponseType<IUser>>(
        EndPoints.USER,
        {
          id: user?._id,
          action: "resetUpdates",
        }
      );
      toast.success(data?.message);
      setUser(data?.data);
      setInfoOpen(false);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);

  useEffect(() => {
    if (colorScheme === "dark") setLogoPath("/images/nabhigatorDark.jpeg");
    else setLogoPath("/images/nabhigator.png");
  }, [colorScheme]);

  return (
    <div className="relative">
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header className="flex items-center justify-between">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            className="ml-4"
          />

          <div className="hidden md:flex h-full items-center justify-between w-full">
            <Link href="/Claims/dashboard">
              <Image
                src={logoPath}
                alt="nabhigator logo"
                width={200}
                height={200}
                className="h-auto w-28"
                unoptimized
              />
            </Link>
            <Image
              src="/images/nivaBupaLogo.png"
              alt="nabhigator logo"
              width={200}
              height={200}
              className="h-auto w-24 mr-4"
              unoptimized
            />
          </div>
        </AppShell.Header>

        <AppShell.Navbar>
          <Navbar />
        </AppShell.Navbar>

        <AppShell.Main>
          {infoOpen && (
            <Modal
              opened={infoOpen}
              onClose={() => {}}
              title="Details Updated"
              closeButtonProps={{ display: "none" }}
            >
              <Modal.Body>
                <Text size="xs">
                  The following details about you are updated by the Admin
                </Text>
                <ul className="mt-4">
                  {!!user?.updates?.details
                    ? Object.keys(user?.updates?.details)?.map((elKey, ind) => {
                        const elem = user?.updates?.details[elKey];
                        return (
                          <li key={ind}>
                            {camelCaseToProperCase(elKey)} to{" "}
                            <span className="bg-red-200">{elem}</span>
                          </li>
                        );
                      })
                    : null}
                </ul>
                <Button
                  className="mt-8"
                  onClick={handleAcknowledge}
                  loading={loading}
                >
                  Acknowledged
                </Button>
              </Modal.Body>
            </Modal>
          )}
          <Paper w="100%" style={{ minHeight: "calc(100vh - 100px)" }} p={20}>
            <div className="flex items-center gap-x-2">
              {showBackBtn ? (
                <UnstyledButton onClick={() => router.back()}>
                  <IoMdArrowRoundBack size={22} />
                </UnstyledButton>
              ) : null}
              <Title order={2} mb={12}>
                {title}
              </Title>
            </div>
            {children}
          </Paper>
        </AppShell.Main>
      </AppShell>
    </div>
  );
};

export default PageWrapperContent;
