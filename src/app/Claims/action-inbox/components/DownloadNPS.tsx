import React, { useState } from "react";
import { ActionIcon, Box } from "@mantine/core";
import { MdSentimentSatisfiedAlt } from "react-icons/md";
import { showError } from "@/lib/helpers";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";

const DownloadNPS = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post<any>(
        EndPoints.DOWNLOAD_NPS,
        {},
        {
          responseType: "blob", // Important for binary data
        }
      );

      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "nps_values.zip"; // Optional
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box>
      <ActionIcon
        color="purple"
        title="Download NPS Confirmation"
        onClick={handleDownload}
        loading={loading}
      >
        <MdSentimentSatisfiedAlt />
      </ActionIcon>
    </Box>
  );
};

export default DownloadNPS;
