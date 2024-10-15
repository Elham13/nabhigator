import React, { useState } from "react";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import { showError } from "@/lib/helpers";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";

const ActionButton = ({
  onDone,
  payload,
}: {
  onDone: () => void;
  payload: { id: string; date: Date | null }[];
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(EndPoints.FEED_DOCS, {
        payload,
      });
      toast.success(data?.message);
      onDone();
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSubmit} loading={loading}>
      Update
    </Button>
  );
};

export default ActionButton;
