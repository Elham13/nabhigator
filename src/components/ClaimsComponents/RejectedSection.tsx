import React, { useState } from "react";
import {
  Box,
  Flex,
  MultiSelect,
  SimpleGrid,
  TextInput,
  Button,
  ActionIcon,
} from "@mantine/core";
import { BsSendSlash } from "react-icons/bs";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import { GrClose } from "react-icons/gr";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import {
  AssignToInvestigatorRes,
  RejectionReason,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { showError } from "@/lib/helpers";
import { rejectionReasonsOptions } from "@/lib/utils/constants/options";

type PropTypes = { id: string; handleCancel: () => void };

const RejectedSection = ({ id, handleCancel }: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const router = useRouter();
  const [rejectionReasons, setRejectionReasons] = useState<RejectionReason[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post<
        SingleResponseType<AssignToInvestigatorRes>
      >(EndPoints.PRE_QC_RETURN_THE_CASE, {
        dashboardDataId: id,
        rejectionReasons,
        user,
      });
      toast.success(data.message);
      router.replace("/Claims/action-inbox");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={20}>
      <Flex c="green" justify="end">
        <ActionIcon onClick={handleCancel}>
          <GrClose />
        </ActionIcon>
      </Flex>

      <form className="mt-4" onSubmit={handleSubmit}>
        <SimpleGrid cols={{ sm: 1, md: 2 }}>
          <Box className="col-span-1 md:col-span-2">
            <MultiSelect
              label="Rejection reason"
              placeholder="Select the reasons why you are rejecting the case"
              value={rejectionReasons.map((el) => el.reason) || []}
              onChange={(val) =>
                setRejectionReasons(
                  val.map((el) => ({ reason: el, remark: "" }))
                )
              }
              data={rejectionReasonsOptions}
              checkIconPosition="right"
              searchable
              hidePickedOptions
              clearable
              required={rejectionReasons?.length < 1}
              withAsterisk
            />
          </Box>
          {rejectionReasons?.length > 0 &&
            rejectionReasons.map((el, ind) => (
              <TextInput
                key={ind}
                required
                label={`Remark for ${el.reason}`}
                placeholder={`Enter remark for ${el.reason}`}
                value={el.remark}
                onChange={(e) =>
                  setRejectionReasons((prev) => {
                    const newData = [...prev];
                    newData[ind].remark = e.currentTarget.value;
                    return newData;
                  })
                }
              />
            ))}
        </SimpleGrid>
        <Button
          type="submit"
          color="red"
          rightSection={<BsSendSlash />}
          mt={20}
          loading={loading}
        >
          Reject
        </Button>
        <Button
          type="button"
          color="green"
          rightSection={<MdClose />}
          mt={20}
          ml={10}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </form>
    </Box>
  );
};

export default RejectedSection;
