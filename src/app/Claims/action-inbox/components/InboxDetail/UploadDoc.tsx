import React, { useState } from "react";
import { Box, Button, FileButton, Progress } from "@mantine/core";
import { RiUploadCloudLine } from "react-icons/ri";
import { showError, uploadFile } from "@/lib/helpers";

type PropTypes = {
  docName: string;
  getUrl: (url: string) => void;
  claimId?: number;
};

const UploadDoc = ({ docName, getUrl, claimId }: PropTypes) => {
  const [progress, setProgress] = useState<number>(0);

  const handleUpload = async (file: File | null) => {
    if (!file) return;

    try {
      setProgress(10);
      //  TODO: Need to increase the progress from 0 to 100 somehow
      const docKey = await uploadFile(file, claimId || 0);

      getUrl(docKey);
      setProgress(100);
    } catch (error: any) {
      showError(error);
    } finally {
      setProgress(0);
    }
  };

  return (
    <Box>
      <FileButton onChange={handleUpload}>
        {(props) => (
          <Button {...props} color="cyan">
            Upload {docName}&nbsp;
            <RiUploadCloudLine />
          </Button>
        )}
      </FileButton>
      {progress > 0 ? <Progress striped animated value={progress} /> : null}
    </Box>
  );
};

export default UploadDoc;
