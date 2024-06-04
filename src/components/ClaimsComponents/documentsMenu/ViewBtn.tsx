import React, { Dispatch, SetStateAction, useState } from "react";
import { Box, Button } from "@mantine/core";
import axios from "axios";
import { toast } from "react-toastify";
import { IPostDocumentStatusRes } from "@/lib/utils/types/maximusResponseTypes";
import { SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { EndPoints } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";

type PropTypes = {
  Document_Index: string;
  docName: string;
  claimId?: number;
  setBase64: Dispatch<SetStateAction<string>>;
};

const ViewBtn = ({
  Document_Index,
  docName,
  claimId,
  setBase64,
}: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");

  const handleClick = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post<
        SingleResponseType<IPostDocumentStatusRes>
      >(EndPoints.WDMS_DOC_CONTENT, {
        Document_Index,
        claimId,
      });

      if (data?.data?.DocContent) {
        let mimeType = "application/pdf";
        if (docName) {
          const docNameArr = docName?.split(".");
          const lastLetters = docNameArr[docNameArr?.length - 1]?.toLowerCase();
          const imageExtensions = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "bmp",
            "tif",
            "tiff",
            "webp",
            "svg",
            "ico",
          ];
          if (imageExtensions.includes(lastLetters)) {
            mimeType = `image/${lastLetters}`;
          }
        }
        const dataUrl = `data:${mimeType};base64,${data?.data?.DocContent}`;
        setBase64(dataUrl);
        setCode(dataUrl);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!code) return toast.warn("Please click on View first");

    const btn = document.createElement("a");
    btn.href = code;
    btn.download = docName;
    btn.click();
  };

  return (
    <Box>
      <Button
        variant="gradient"
        size="compact-xs"
        loading={loading}
        onClick={handleClick}
      >
        View
      </Button>
      <Button
        variant="outline"
        size="compact-xs"
        loading={loading}
        onClick={handleDownload}
      >
        Download
      </Button>
    </Box>
  );
};

export default ViewBtn;
