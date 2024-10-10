import React, { useState } from "react";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import { showError } from "@/lib/helpers";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";

const ActionButton = ({
  id,
  onDone,
  docs,
}: {
  id: string;
  onDone: () => void;
  docs: any;
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!id) throw new Error("id is required");
      const { data } = await axios.post(EndPoints.FEED_DOCS, {
        id,
        docs: !!docs
          ? docs instanceof Map
            ? Array.from(docs.entries())
            : Array.from(new Map(Object.entries(docs))?.entries())
          : null,
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
