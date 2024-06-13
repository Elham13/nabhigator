import React, { Dispatch, SetStateAction, useState } from "react";
import { Box, Button } from "@mantine/core";
import axios from "axios";
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
  const [loadings, setLoadings] = useState({ view: false, download: false });

  const downloadBase64File = (
    base64: string,
    fileName: string,
    mimeType: string
  ) => {
    // Decode the base64 string
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the binary data
    const blob = new Blob([bytes], { type: mimeType });

    // Create an Object URL from the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;

    // Append the anchor to the body (required for Firefox)
    document.body.appendChild(a);

    // Programmatically click the anchor to trigger the download
    a.click();

    // Remove the anchor from the body
    document.body.removeChild(a);

    // Revoke the Object URL to free up memory
    URL.revokeObjectURL(url);
  };

  const handleClick = async () => {
    setLoadings((prev) => ({ ...prev, view: true }));

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
          if (imageExtensions.includes(lastLetters))
            mimeType = `image/${lastLetters}`;
        }
        const dataUrl = `data:${mimeType};base64,${data?.data?.DocContent}`;
        setBase64(dataUrl);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setLoadings((prev) => ({ ...prev, view: false }));
    }
  };

  const handleDownload = async () => {
    setLoadings((prev) => ({ ...prev, download: true }));
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
          if (imageExtensions.includes(lastLetters))
            mimeType = `image/${lastLetters}`;
        }
        downloadBase64File(data?.data?.DocContent, docName, mimeType);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setLoadings((prev) => ({ ...prev, download: false }));
    }
  };

  return (
    <Box>
      <Button
        variant="gradient"
        size="compact-xs"
        loading={loadings.view}
        onClick={handleClick}
      >
        View
      </Button>
      <Button
        variant="outline"
        size="compact-xs"
        loading={loadings.download}
        onClick={handleDownload}
      >
        Download
      </Button>
    </Box>
  );
};

export default ViewBtn;
