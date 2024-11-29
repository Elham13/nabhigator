import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  CloseIcon,
  Flex,
  Modal,
  Text,
  TextInput,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  CaseDetail,
  IDashboardData,
  IShowElement,
  NumericStage,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import TasksAndDocsProvider from "@/lib/providers/TasksAndDocsProvider";
import FileUploadFooter from "@/components/ClaimsComponents/FileUpload/FileUploadFooter";
import FileUpload from "@/components/ClaimsComponents/FileUpload";
import { tempDocInitials } from "@/lib/utils/constants";
import { useAxios } from "@/lib/hooks/useAxios";
const ChangeTask = dynamic(
  () => import("@/components/ClaimsComponents/ChangeTask")
);

type PropTypes = {
  showElement: IShowElement;
  caseData: CaseDetail | null;
  data: IDashboardData | null;
  setShowElement: Dispatch<SetStateAction<IShowElement>>;
};

const PostQaReworkContent = ({
  showElement,
  caseData,
  data,
  setShowElement,
}: PropTypes) => {
  const router = useRouter();
  const [values, setValues] = useState({
    comment: caseData?.postQaComment || "",
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [stageUpdating, setStageUpdating] = useState<boolean>(false);
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);

  const { refetch: submit } = useAxios<any>({
    config: { url: EndPoints.UPDATE_CASE_DETAIL, method: "POST" },
    dependencyArr: [],
    isMutation: true,
    onDone: (res) => {
      if (res?.updatedCase) setCaseDetail(res?.updatedCase);
    },
  });

  const handleRemove = (index: number) => {
    const payload = {
      id: caseDetail?._id,
      action: "AddPostQADocument",
      index,
    };
    submit(payload);
  };

  const handleGetUrl = (
    id: string,
    name: string,
    url: string,
    action: "Add" | "Remove"
  ) => {
    const payload = {
      id: caseDetail?._id,
      action: "AddPostQADocument",
      postQaDoc: url,
    };

    submit(payload);
  };

  const updateStage = async () => {
    setStageUpdating(true);
    try {
      if (!values?.comment) return toast.error("Please add your comment");
      const payload = {
        id: data?._id,
        action: "changeStage",
        stage: NumericStage.IN_FIELD_REWORK,
        userId: user._id,
        postQaComment: values?.comment,
        postQARecommendation: undefined,
        userName: user?.name,
      };
      submit(payload);
    } catch (error) {
      showError(error);
    } finally {
      setStageUpdating(false);
    }
  };

  useEffect(() => {
    if (caseData) {
      setCaseDetail(caseData);
    }
  }, [caseData]);

  return (
    <Box className="mt-4">
      <ActionIcon
        className="float-right mb-4"
        onClick={() =>
          setShowElement((prev) => ({
            ...prev,
            postQaReject: false,
            changeTask: false,
          }))
        }
      >
        <CloseIcon />
      </ActionIcon>
      <TextInput
        label="Have something in mind?"
        placeholder="You can leave a comment to the investigator"
        required
        value={values?.comment}
        onChange={(e) =>
          setValues((prev) => ({ ...prev, comment: e.target.value }))
        }
      />
      <Button
        my={10}
        color="violet"
        onClick={() =>
          setShowElement((prev) => ({
            ...prev,
            changeTask: !prev.changeTask,
          }))
        }
      >
        {showElement?.changeTask ? "Cancel" : "Change Tasks"}
      </Button>
      <Box>
        <Text className="font-semibold">Upload Document: </Text>
        {!!caseDetail &&
          !!caseDetail?.postQARecommendation?.documents &&
          caseDetail?.postQARecommendation?.documents?.length > 0 &&
          caseDetail?.postQARecommendation?.documents?.map((el, ind) => (
            <FileUploadFooter
              key={ind}
              url={el}
              onDelete={() => handleRemove(ind)}
            />
          ))}
        <FileUpload
          doc={tempDocInitials}
          docName="doc"
          getUrl={handleGetUrl}
          claimId={data?.claimId || 0}
        />
      </Box>
      {showElement.changeTask ? (
        <TasksAndDocsProvider>
          <ChangeTask
            dashboardData={data}
            caseDetail={caseDetail}
            postQaComment={values?.comment}
            onSuccess={() =>
              setShowElement((prev) => ({
                ...prev,
                changeTask: false,
              }))
            }
          />
        </TasksAndDocsProvider>
      ) : (
        <Button mt={12} onClick={() => setModalVisible(true)}>
          Send back to investigator
        </Button>
      )}
      {modalVisible && (
        <Modal
          opened={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Returning the case"
          centered
          size="lg"
        >
          <Box mt={20}>
            <Box>
              <Text>
                This action will return the case back to investigator&apos;s
                bucket
              </Text>
              <Text>By clicking confirm the case will return back.</Text>
              <Text>Are you sure to proceed?</Text>
            </Box>
            <Flex columnGap={10} mt={50}>
              <Button
                loading={stageUpdating}
                disabled={stageUpdating}
                color="green"
                onClick={updateStage}
              >
                Confirm
              </Button>
              <Button
                disabled={stageUpdating}
                color="red"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </Button>
            </Flex>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default PostQaReworkContent;
