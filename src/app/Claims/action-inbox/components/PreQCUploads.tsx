import React, { Dispatch } from "react";
import { CaseDetail } from "@/lib/utils/types/fniDataTypes";
import { Box, Text } from "@mantine/core";
import FileUploadFooter from "@/components/ClaimsComponents/FileUpload/FileUploadFooter";
import FileUpload from "@/components/ClaimsComponents/FileUpload";
import { tempDocInitials } from "@/lib/utils/constants";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";

type PropTypes = {
  caseDetail: CaseDetail | null;
  claimId?: number;
  setCaseDetail: Dispatch<CaseDetail | null>;
};

const PreQCUploads = ({ caseDetail, claimId, setCaseDetail }: PropTypes) => {
  const { refetch: submit, loading } = useAxios<any>({
    config: {
      url: EndPoints.UPDATE_CASE_DETAIL,
      method: "POST",
    },
    dependencyArr: [],
    isMutation: true,
    onDone: (res) => {
      if (res?.updatedCase) setCaseDetail(res?.updatedCase);
    },
  });

  const handleGetUrl = (
    id: string,
    name: string,
    url: string,
    action: "Add" | "Remove"
  ) => {
    try {
      console.log({ caseDetail });
      if (!caseDetail?._id) throw new Error("id is required");

      const urls =
        caseDetail?.preQcUploads && caseDetail?.preQcUploads?.length > 0
          ? [...caseDetail?.preQcUploads, url]
          : [url];

      const payload = {
        id: caseDetail?._id,
        action: "AddPreQcUploads",
        preQcUploads: urls,
      };
      submit(payload);
    } catch (error: any) {
      showError(error);
    }
  };

  const handleRemove = (index: number) => {
    let urls =
      caseDetail?.preQcUploads && caseDetail?.preQcUploads?.length > 0
        ? [...caseDetail?.preQcUploads]
        : [];

    urls = urls?.filter((_, ind) => ind !== index);

    const payload = {
      id: caseDetail?._id,
      action: "AddPreQcUploads",
      preQcUploads: urls,
    };
    submit(payload);
  };

  return (
    <Box>
      <Text className="font-semibold">Pre-Qc Uploads: </Text>
      {!!caseDetail?.preQcUploads &&
        caseDetail?.preQcUploads?.length > 0 &&
        caseDetail?.preQcUploads?.map((el, ind) => (
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
        claimId={claimId || 0}
      />
    </Box>
  );
};

export default PreQCUploads;
