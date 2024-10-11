import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import UploadDoc from "../UploadDoc";
import axios from "axios";
import { BiHide, BiLink } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { MdOutlineDeleteSweep } from "react-icons/md";
import {
  CaseDetail,
  DocumentData,
  LocationType,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { showError } from "@/lib/helpers";
import { EndPoints } from "@/lib/utils/types/enums";

type PropTypes = {
  caseDetail: CaseDetail | null;
  onClose: () => void;
  setCaseDetail: React.Dispatch<React.SetStateAction<CaseDetail | null>>;
  claimId?: number;
  claimType?: "PreAuth" | "Reimbursement";
};

const CompleteDocuments = ({
  caseDetail,
  claimId,
  claimType,
  onClose,
  setCaseDetail,
}: PropTypes) => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getCurrentPosition = async () => {
    try {
      if (typeof window !== undefined) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (positionErr) => {
            showError(positionErr);
          },
          { enableHighAccuracy: true, timeout: 100000 }
        );
      }
    } catch (error: any) {
      showError(error);
    }
  };

  const handleChange = async (
    docId: string,
    docName: string,
    docUrl: string,
    action: "Add" | "Remove",
    docIndex?: number
  ) => {
    try {
      if (!location) throw new Error("Please enable access to location!");
      const { data } = await axios.post(EndPoints.UPDATE_CASE_DETAIL, {
        id: caseDetail?._id,
        docName,
        docId,
        docUrl,
        action,
        location,
        docIndex,
      });

      setCaseDetail(data?.updatedCase);
    } catch (error: any) {
      showError(error);
    }
  };

  const handleOpenDoc = async (docKey: string, name: string) => {
    try {
      setLoading(true);
      const { data } = await axios.post<
        SingleResponseType<{ signedUrl: string }>
      >(EndPoints.GET_SIGNED_URL, { docKey });

      const signedUrl = data?.data?.signedUrl;

      window.open(
        `/Claims/action-inbox/documents?url=${signedUrl}&name=${name}`,
        "_blank"
      );
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  let docs = {};

  if (caseDetail?.allocationType === "Single") {
    docs = caseDetail?.singleTasksAndDocs?.docs || {};
  } else if (caseDetail?.allocationType === "Dual") {
    // TODO: Handle for dual
    docs = caseDetail?.insuredTasksAndDocs?.docs || {};
  }

  return (
    <Box mt={16}>
      <Divider />
      <Title order={2} ta="center" c="green" my={20}>
        Complete Documents
      </Title>
      <ActionIcon className="float-right" onClick={onClose}>
        <IoMdClose />
      </ActionIcon>

      <Box mt={60}>
        {docs && Object.keys(docs)?.length > 0
          ? Object.keys(docs)?.map((docKey, ind) => {
              const docArr: DocumentData[] = docs
                ? // @ts-ignore
                  docs[docKey]
                : [];

              return (
                <Stack key={ind}>
                  <Title order={5} c="orange">
                    Documents of {docKey}
                  </Title>
                  {docArr?.length > 0
                    ? docArr?.map((el, index) =>
                        el?.docUrl && el?.docUrl?.length > 0 ? (
                          el?.docUrl?.map((url, ind) => {
                            const isHidden =
                              el?.replacedDocUrls?.includes(url) ||
                              el?.hiddenDocUrls?.includes(url);

                            if (isHidden) return <BiHide key={index} />;

                            return (
                              <Flex
                                key={ind}
                                gap={4}
                                align="center"
                                justify="space-between"
                                className="hover:bg-slate-100"
                              >
                                <ActionIcon
                                  variant="light"
                                  loading={loading}
                                  onClick={() => handleOpenDoc(url, el?.name)}
                                >
                                  <BiLink />
                                </ActionIcon>
                                <ActionIcon
                                  variant="light"
                                  onClick={() => {
                                    window.open(
                                      `https://www.google.com/maps?q=${el?.location?.latitude},${el?.location?.longitude}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  <HiLocationMarker />
                                </ActionIcon>
                                <Text>{el?.name}</Text>
                                <ActionIcon
                                  variant="light"
                                  color="red"
                                  onClick={() =>
                                    handleChange(
                                      el?._id || "",
                                      docKey,
                                      "",
                                      "Remove",
                                      ind
                                    )
                                  }
                                >
                                  <MdOutlineDeleteSweep />
                                </ActionIcon>
                              </Flex>
                            );
                          })
                        ) : (
                          <UploadDoc
                            key={index}
                            docName={el?.name}
                            claimId={claimId}
                            getUrl={(url) =>
                              handleChange(el?._id || "", docKey, url, "Add")
                            }
                          />
                        )
                      )
                    : null}
                </Stack>
              );
            })
          : null}
      </Box>
    </Box>
  );
};

export default CompleteDocuments;
