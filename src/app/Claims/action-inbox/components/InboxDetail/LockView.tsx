import React, { useState } from "react";
import { Anchor, Box, Button, Flex, Modal, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import { BiLock } from "react-icons/bi";
import { BsUnlock } from "react-icons/bs";
import { toast } from "react-toastify";
import {
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";

type PropTypes = {
  data: IDashboardData;
  onSuccess: () => void;
};

const LockView = ({ data, onSuccess }: PropTypes) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const handleLock = async () => {
    setLoading(true);
    try {
      const { data: res } = await axios.post<
        SingleResponseType<IDashboardData>
      >(EndPoints.UPDATE_DASHBOARD_DATA, {
        id: data?._id,
        action: "lock",
        userId: user?._id,
      });
      toast.success(res.message);
      setModalVisible(false);
      onSuccess();
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {data?.locked?.status ? (
        <Anchor
          c="green"
          component="button"
          onClick={() => setModalVisible(true)}
        >
          <BsUnlock />
        </Anchor>
      ) : (
        <Anchor
          c="red"
          component="button"
          onClick={() => setModalVisible(true)}
        >
          <BiLock />
        </Anchor>
      )}

      {modalVisible && (
        <Modal
          opened={modalVisible}
          onClose={() => setModalVisible(false)}
          title={
            <Text fw="bold">{`${
              data?.locked?.status ? "Unlock" : "Lock"
            } the case`}</Text>
          }
          centered
          size="lg"
        >
          <Box mt={20}>
            <Box>
              <Text>
                {data?.locked?.status
                  ? "By unlocking this case you will allow the POST QA user to complete/close the case"
                  : "If you lock this case the POST QA user will not be able to complete/close te case"}
              </Text>
              <Text>Are you sure to proceed?</Text>
            </Box>
            <Flex columnGap={10} mt={50}>
              <Button loading={loading} color="green" onClick={handleLock}>
                Confirm
              </Button>
              <Button color="red" onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Flex>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default LockView;
