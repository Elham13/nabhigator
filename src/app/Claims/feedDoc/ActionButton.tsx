import React, { useState } from "react";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import { showError } from "@/lib/helpers";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";

const ActionButton = ({
  onDone,
  docs,
}: {
  onDone: () => void;
  docs: { id: string; doc: any }[];
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = docs?.map((el) => ({
        ...el,
        doc: !!el?.doc
          ? el?.doc instanceof Map
            ? Array.from(el?.doc.entries())
            : Array.from(new Map(Object.entries(el?.doc))?.entries())
          : null,
      }));
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
