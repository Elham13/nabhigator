import React, { useEffect, useState } from "react";
import { Loader, SimpleGrid, Stack } from "@mantine/core";
import EditFormItem from "./EditFormItem";
import {
  MdMail,
  MdNotificationsActive,
  MdPassword,
  MdPermIdentity,
} from "react-icons/md";
import { BiPhone, BiSun, BiUser } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import axios from "axios";
import { BsCardChecklist } from "react-icons/bs";
import { showError } from "@/lib/helpers";
import { IUser, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { EndPoints } from "@/lib/utils/types/enums";
import dayjs from "dayjs";

type PropTypes = {
  userId: string;
  getUserId: (id: string) => void;
};

const UserEditForm = ({ userId, getUserId }: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post<SingleResponseType<IUser>>(
          EndPoints.USER,
          { userId, action: "getById" }
        );

        setUser(data?.data);
        getUserId(data?.data?._id);
      } catch (error: any) {
        showError(error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const items = (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      <EditFormItem
        title="User Id"
        description={user?.userId}
        icon={MdPermIdentity}
      />
      <EditFormItem title="Name" description={user?.name} icon={BiUser} />
      <EditFormItem
        title="Role"
        description={user?.role?.join(", ")}
        icon={BiSun}
      />
      <EditFormItem title="Email" description={user?.email} icon={MdMail} />
      <EditFormItem title="Phone" description={user?.phone} icon={BiPhone} />
      <EditFormItem
        title="Password"
        description={user?.password}
        icon={MdPassword}
      />
      {user?.zone && user?.zone?.length > 0 ? (
        <EditFormItem
          title="Zone"
          description={user?.zone?.join(", ")}
          icon={CiLocationOn}
        />
      ) : null}
      {user?.state && user?.state?.length > 0 ? (
        <EditFormItem
          title="State"
          description={user?.state?.join(", ")}
          icon={CiLocationOn}
        />
      ) : null}
      {user?.city ? (
        <EditFormItem
          title="City"
          description={user?.city}
          icon={CiLocationOn}
        />
      ) : null}
      {user?.district ? (
        <EditFormItem
          title="District"
          description={user?.district}
          icon={CiLocationOn}
        />
      ) : null}
      {user?.pinCode ? (
        <EditFormItem
          title="PinCode"
          description={user?.pinCode}
          icon={CiLocationOn}
        />
      ) : null}
      <EditFormItem
        title="Status"
        description={user?.status}
        icon={MdNotificationsActive}
      />
      {user?.team && typeof user?.team !== "string" ? (
        <EditFormItem
          title="Team Lead"
          description={user.team?.name}
          icon={BsCardChecklist}
        />
      ) : null}
      {user?.claimAmountThreshold ? (
        <EditFormItem
          title="Claim amount threshold"
          description={user?.claimAmountThreshold}
          icon={BsCardChecklist}
        />
      ) : null}
      {user?.config?.leadView && user?.config?.leadView?.length > 0 ? (
        <EditFormItem
          title="Lead View"
          description={user.config?.leadView?.join(", ")}
          icon={BsCardChecklist}
        />
      ) : null}
      {user?.config?.reportReceivedTime?.from ? (
        <EditFormItem
          title="Report received time From"
          description={dayjs(user?.config?.reportReceivedTime?.from).format(
            "hh:mm a"
          )}
          icon={BsCardChecklist}
        />
      ) : null}
      {user?.config?.reportReceivedTime?.to ? (
        <EditFormItem
          title="Report received time To"
          description={dayjs(user?.config?.reportReceivedTime?.to).format(
            "hh:mm a"
          )}
          icon={BsCardChecklist}
        />
      ) : null}
      {user?.config?.dailyThreshold ? (
        <EditFormItem
          title="Daily threshold"
          description={user?.config?.dailyThreshold}
          icon={BsCardChecklist}
        />
      ) : null}

      <EditFormItem
        title="User Type"
        description={user?.userType}
        icon={BsCardChecklist}
      />
      {user?.config?.canSeeConsolidatedInbox ? (
        <EditFormItem
          title="Can see consolidated inbox"
          description={user?.config?.canSeeConsolidatedInbox}
          icon={BsCardChecklist}
        />
      ) : null}
      {user?.config?.canExportConsolidatedInbox ? (
        <EditFormItem
          title="Can export consolidated inbox"
          description={user?.config?.canExportConsolidatedInbox}
          icon={BsCardChecklist}
        />
      ) : null}
    </SimpleGrid>
  );
  return loading ? <Loader type="dots" /> : <Stack>{items}</Stack>;
};

export default UserEditForm;
