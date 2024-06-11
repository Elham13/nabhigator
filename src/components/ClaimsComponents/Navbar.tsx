import React, { useMemo, useState } from "react";
import { Button, Box, useMantineColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import { BiChevronRight, BiLogOut, BiUser } from "react-icons/bi";
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdOutlineSmsFailed,
  MdTravelExplore,
} from "react-icons/md";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { AiOutlineAudit } from "react-icons/ai";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import CustomLink from "../CustomLink";
import axios from "axios";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { Role } from "@/lib/utils/types/fniDataTypes";
import { showError } from "@/lib/helpers";

const Navbar = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useLocalStorage<IUserFromSession | null>({
    key: StorageKeys.USER,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const links = useMemo(
    () => [
      {
        name: "Dashboard",
        icon: <MdDashboard />,
        href: "/Claims/dashboard",
      },
      {
        name: "Action Inbox",
        icon: <MdOutlinePendingActions />,
        href: "/Claims/action-inbox",
      },
      ...(user?.config?.canSeeConsolidatedInbox === "Yes"
        ? [
            {
              name: "Consolidated Inbox",
              icon: <IoCheckmarkDoneCircleOutline />,
              href: "/Claims/consolidated-inbox",
            },
          ]
        : []),
      {
        name: "Summary/Audit Trial",
        icon: <AiOutlineAudit />,
        href: "/Claims/summary",
      },
      ...(user?.activeRole &&
      [
        Role.ADMIN,
        Role.ALLOCATION,
        Role.PRE_QC,
        Role.TL,
        Role.CLUSTER_MANAGER,
      ].includes(user?.activeRole)
        ? [
            {
              name: "Investigators",
              icon: <MdTravelExplore />,
              href: "/Claims/investigators",
            },
          ]
        : []),
      ...(user?.activeRole === Role.ADMIN
        ? [
            { name: "Users", icon: <BiUser />, href: "/Claims/user" },
            {
              name: "Failed Cases",
              icon: <MdOutlineSmsFailed />,
              href: "/Claims/feeding-logs",
            },
          ]
        : []),
    ],
    [user]
  );

  const toggleTheme = () => {
    if (colorScheme === "dark") {
      setColorScheme("light");
    } else {
      setColorScheme("dark");
    }
  };

  const handleLogout = async () => {
    setLoading(false);
    try {
      await axios.get(EndPoints.USER_LOGOUT);
      setUser(null);
      router.replace("/Claims/login");
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(true);
    }
  };

  const themeButton =
    colorScheme === "light" ? (
      <button className="mr-2 p-2" onClick={toggleTheme}>
        <MdDarkMode size={28} />
      </button>
    ) : (
      <button className="mr-2 p-2" onClick={toggleTheme}>
        <MdLightMode size={28} />
      </button>
    );

  return (
    <div className="flex flex-col justify-between h-[calc(100vh-3.8rem)] overflow-x-hidden overflow-y-auto">
      <div className="py-4 pr-4">
        <CustomLink
          href="/Claims/user/Profile"
          className={`pl-4 text-xl mb-8 flex items-center justify-between`}
        >
          Welcome {user?.name}&nbsp;
          <BiChevronRight size={24} />
        </CustomLink>
        {links?.map((link, index) => (
          <CustomLink
            key={index}
            className={`flex items-center gap-2 p-2 pl-4 rounded-tr-lg rounded-br-lg mb-1 ${
              pathname === link.href
                ? "bg-sky-500 text-white"
                : "hover:bg-sky-100 hover:text-black"
            }`}
            href={link.href}
          >
            {link.icon}
            {link.name}
          </CustomLink>
        ))}
      </div>
      <Box className="flex border-t border-slate-600 p-4 justify-between">
        {themeButton}
        <Button
          variant="transparent"
          className="hover:bg-sky-700 hover:text-white"
          onClick={handleLogout}
          loading={loading}
        >
          <BiLogOut size={20} />
          &nbsp; Logout
        </Button>
      </Box>
    </div>
  );
};

export default Navbar;
