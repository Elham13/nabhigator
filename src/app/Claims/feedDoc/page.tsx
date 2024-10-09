"use client";

import React, { useState } from "react";
import { showError } from "@/lib/helpers";
import { Box, Button, Textarea, TextInput } from "@mantine/core";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { toast } from "react-toastify";

const FeedDoc = () => {
  const [values, setValues] = useState({ claimId: "", docs: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(EndPoints.FEED_DOCS, values);
      toast.success(data?.message);
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={20}>
      <TextInput
        label="Claim Id"
        placeholder="Claim Id"
        value={values?.claimId}
        onChange={(e) =>
          setValues((prev) => ({ ...prev, claimId: e.target?.value }))
        }
      />

      <Textarea
        label="Docs"
        placeholder="Docs"
        rows={20}
        resize="vertical"
        value={values?.docs}
        onChange={(e) =>
          setValues((prev) => ({ ...prev, docs: e.target?.value }))
        }
        mb={10}
      />

      <Button onClick={handleSubmit} loading={loading}>
        Submit
      </Button>
    </Box>
  );
};

export default FeedDoc;
