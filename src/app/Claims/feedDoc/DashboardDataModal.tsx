import React, { useState } from "react";
import { showError } from "@/lib/helpers";
import { Box, Button, Modal, Textarea } from "@mantine/core";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { toast } from "react-toastify";

type PropTypes = {
  open: boolean;
  onClose: () => void;
};

const DashboardDataModal = ({ open, onClose }: PropTypes) => {
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(EndPoints.FEED_DOCS, {
        payload: JSON.parse(value),
        action: "addDData",
      });
      toast.success(data?.message);
      onClose();
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={open} onClose={onClose}>
      <Box>
        <Textarea
          label="Dashboard Data"
          placeholder="Dashboard Data"
          resize="vertical"
          rows={10}
          value={value}
          onChange={(e) => setValue(e?.target?.value)}
        />
        <Button onClick={handleSubmit} loading={loading}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default DashboardDataModal;
