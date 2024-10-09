import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IDashboardData,
  IUser,
  SingleResponseType,
  UserExpedition,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import CustomMarquee from "@/components/CustomMarquee";

type PropTypes = {
  data: IDashboardData;
  user: IUserFromSession;
};

const NotificationModal = ({ data, user }: PropTypes) => {
  const [expedition, setExpedition] = useState<UserExpedition | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.post<SingleResponseType<IUser>>(
          EndPoints.USER,
          { id: user?._id, action: "getById" }
        );

        if (
          data?.data?.updates?.expedition &&
          data?.data?.updates?.expedition?.length > 0
        ) {
          const found = data?.data?.updates?.expedition?.find(
            (el) => el?.noted === false
          );

          if (found) {
            setExpedition(found);
          }
        }
      } catch (error: any) {
        showError(error);
      }
    };

    if (data?.claimId && user?._id) getUser();
  }, [data?.claimId, user?._id]);

  return expedition ? (
    <div>
      <CustomMarquee
        text={`Expedition message from ${expedition?.role} ${
          expedition?.subject
        }: ${expedition?.message || "-"}`}
      />
    </div>
  ) : null;
};

export default NotificationModal;
