import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  CloseIcon,
  FileButton,
  Flex,
  Modal,
  Progress,
  Text,
  TextInput,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { RiUploadCloudLine } from "react-icons/ri";
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
import { showError, uploadFile } from "@/lib/helpers";
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
  const [progress, setProgress] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [stageUpdating, setStageUpdating] = useState<boolean>(false);
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);

  const handleUploadDocument = async (file: File | null) => {
    if (!file) return;

    try {
      setProgress(10);
      //  TODO: Need to increase the progress from 0 to 100 somehow
      const docKey = await uploadFile(file, data?.claimId || 0);

      const { data: caseResponse } = await axios.post(
        EndPoints.UPDATE_CASE_DETAIL,
        {
          id: caseDetail?._id,
          action: "AddPostQADocument",
          postQaDoc: docKey,
        }
      );

      setCaseDetail(caseResponse?.updatedCase);
      setProgress(100);
    } catch (error: any) {
      showError(error);
    } finally {
      setProgress(0);
    }
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
      };

      const { data: res } = await axios.post<
        SingleResponseType<IDashboardData>
      >(EndPoints.UPDATE_DASHBOARD_DATA, payload);
      setShowElement((prev) => ({ ...prev, postQAComment: false }));
      toast.success(res.message);
      setModalVisible(false);
      router.replace("/Claims/action-inbox");
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
      <div>
        <FileButton onChange={handleUploadDocument}>
          {(props) => (
            <Button {...props} color="cyan">
              Upload Document&nbsp;
              <RiUploadCloudLine />
            </Button>
          )}
        </FileButton>
        {progress > 0 ? <Progress striped animated value={progress} /> : null}
        {caseDetail &&
          caseDetail?.postQARecommendation?.documents &&
          caseDetail?.postQARecommendation?.documents?.length > 0 &&
          caseDetail?.postQARecommendation?.documents?.map((doc, ind) => (
            <Text key={ind}>{doc}</Text>
          ))}
      </div>
      {showElement.changeTask ? (
        <ChangeTask
          id={data?._id as string}
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
