import React, { Dispatch, SetStateAction, useState } from "react";
import { showError } from "@/lib/helpers";
import uploadUsersMaster from "@/lib/serverActions/uploadUsersMaster";
import { Box, Button, Modal, Text } from "@mantine/core";
import { toast } from "react-toastify";

type PropTypes = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UploadModal = ({ open, setOpen }: PropTypes) => {
  const [uploading, setUploading] = useState<boolean>(false);

  const downloadSample = () => {
    const link = document.createElement("a");
    link.href = "/navigator-admin-images/files/users_master.xlsx";
    link.download = "Users_Master_Sample_File.xlsx";
    link.click();
  };

  const handleUpload = async (data: FormData) => {
    setUploading(true);

    try {
      const { success } = await uploadUsersMaster(data);

      if (success) {
        toast.success("Success");
        setOpen(false);
      }
    } catch (error) {
      showError(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      opened={open}
      onClose={() => setOpen(false)}
      title="Upload Users Master"
      centered
      size="lg"
    >
      <Box p={20}>
        <Text size="xs">
          <strong>Instructions: </strong>Please download the sample file and
          make sure number of columns and column names match with the sample
        </Text>
        <Button
          onClick={downloadSample}
          size="compact-sm"
          variant="outline"
          mt={10}
          mb={20}
        >
          Download Sample
        </Button>
        <form action={handleUpload}>
          <input
            type="file"
            name="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <Button loading={uploading} mt={20} type="submit">
            Upload Document
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UploadModal;
