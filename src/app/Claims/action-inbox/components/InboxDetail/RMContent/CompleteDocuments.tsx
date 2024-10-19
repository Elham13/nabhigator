import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Loader,
  Stack,
  Title,
} from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import {
  CaseDetail,
  DocumentData,
  LocationType,
  ResponseDoc,
} from "@/lib/utils/types/fniDataTypes";
import { getTasksAndDocs, showError } from "@/lib/helpers";
import { EndPoints } from "@/lib/utils/types/enums";
import { useAxios } from "@/lib/hooks/useAxios";
import FileUpload from "@/components/ClaimsComponents/FileUpload";
import { AccordionItem, CustomAccordion } from "@/components/CustomAccordion";

type PropTypes = {
  caseDetail: CaseDetail | null;
  onClose: () => void;
  setCaseDetail: React.Dispatch<React.SetStateAction<CaseDetail | null>>;
  claimId?: number;
  claimType?: "PreAuth" | "Reimbursement";
};

type DocumentUploadProps = {
  caseId: string;
  docs: ResponseDoc | null;
  claimId: number;
  part?: "insured" | "hospital";
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

type DocumentButtonProps = {
  caseId: string;
  doc: DocumentData;
  claimId: number;
  docKey: string;
  deviceLocation: LocationType | null;
  part?: "insured" | "hospital";
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const DocumentButton = ({
  doc,
  caseId,
  claimId,
  docKey,
  deviceLocation,
  part,
  setCaseDetail,
}: DocumentButtonProps) => {
  const { refetch: addDoc, loading } = useAxios<any>({
    config: {
      url: EndPoints.SAVE_DOCUMENTS,
      method: "POST",
    },
    dependencyArr: [deviceLocation, caseId],
    isMutation: true,
    trigger: !!caseId,
    onDone: (data) => {
      if (data?.updatedCase) setCaseDetail(data?.updatedCase);
    },
  });

  return (
    <Box key={doc._id} mb={8}>
      {loading ? (
        <Loader type="dots" />
      ) : (
        <FileUpload
          doc={doc}
          docName={docKey}
          claimId={claimId}
          getUrl={(docId, docName, docUrl, action, docIndex) =>
            addDoc({
              id: caseId,
              docName,
              docId,
              docUrl,
              action,
              location: deviceLocation,
              docIndex,
              part,
            })
          }
        />
      )}
    </Box>
  );
};

const DocumentUpload = ({
  caseId,
  docs,
  claimId,
  part,
  setCaseDetail,
}: DocumentUploadProps) => {
  const [deviceLocation, setDeviceLocation] = useState<LocationType | null>(
    null
  );

  const getCurrentPosition = async () => {
    try {
      if (typeof window !== undefined) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setDeviceLocation({
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

  useEffect(() => {
    getCurrentPosition();
  }, []);

  return (
    <Box mt={16}>
      <Divider />
      <Title order={2} ta="center" c="green" my={20}>
        Complete Documents
      </Title>
      <Box mt={60}>
        {!!docs && Object.keys(docs)?.length > 0
          ? Object.keys(docs)?.map((docKey, ind) => {
              const docArr: DocumentData[] = docs[docKey];

              if (docKey === "NPS Confirmation") return null;

              return (
                <Stack key={ind}>
                  <Title order={5} c="orange">
                    Documents of {docKey}
                  </Title>
                  {docArr?.length > 0
                    ? docArr?.map((doc) => (
                        <DocumentButton
                          key={doc?._id}
                          {...{
                            caseId,
                            claimId,
                            deviceLocation,
                            doc,
                            docKey,
                            part,
                            setCaseDetail,
                          }}
                        />
                      ))
                    : null}
                </Stack>
              );
            })
          : null}
      </Box>
    </Box>
  );
};

const CompleteDocuments = ({
  caseDetail,
  claimId,
  claimType,
  onClose,
  setCaseDetail,
}: PropTypes) => {
  const { tasksAndDocs, tasksAndDocsHospital } = getTasksAndDocs({
    claimType,
    claimCase: caseDetail,
  });

  if (caseDetail?.allocationType === "Single")
    return (
      <Box className="relative bg-white">
        <Box className="absolute top-0 right-0">
          <ActionIcon onClick={onClose}>
            <IoMdClose />
          </ActionIcon>
        </Box>

        <DocumentUpload
          {...{
            caseId: (caseDetail?._id as string) || "",
            claimId: claimId || 0,
            setCaseDetail,
            docs: tasksAndDocs?.docs as ResponseDoc,
          }}
        />

        <Button onClick={onClose} mt={10}>
          Submit
        </Button>
      </Box>
    );
  else
    return (
      <Box className="relative bg-white">
        <Box className="absolute top-0 right-0">
          <ActionIcon onClick={onClose}>
            <IoMdClose />
          </ActionIcon>
        </Box>

        <CustomAccordion>
          <AccordionItem title="Insured Part Documents">
            <DocumentUpload
              {...{
                caseId: (caseDetail?._id as string) || "",
                claimId: claimId || 0,
                setCaseDetail,
                docs: tasksAndDocs?.docs as ResponseDoc,
                part: "insured",
              }}
            />
          </AccordionItem>
          <AccordionItem title="Hospital Part Documents">
            <DocumentUpload
              {...{
                caseId: (caseDetail?._id as string) || "",
                claimId: claimId || 0,
                setCaseDetail,
                docs: tasksAndDocsHospital?.docs as ResponseDoc,
                part: "hospital",
              }}
            />
          </AccordionItem>
        </CustomAccordion>

        <Button onClick={onClose} mt={10}>
          Submit
        </Button>
      </Box>
    );
};

export default CompleteDocuments;
