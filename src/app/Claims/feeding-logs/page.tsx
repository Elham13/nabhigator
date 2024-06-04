"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  Box,
  Button,
  NumberInput,
  Paper,
  Select,
  Text,
  Title,
} from "@mantine/core";
import axios from "axios";
import { toast } from "react-toastify";
import { BsEmojiFrown } from "react-icons/bs";
import FeedingLogTable from "./components/FeedingLogTable";
import {
  IDDataFeedingLog,
  IFeedingLogsTableData,
  ResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { EndPoints } from "@/lib/utils/types/enums";
import { numberToOrdinal, showError } from "@/lib/helpers";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";
import LoaderPlaceholder from "@/components/ClaimsComponents/LoaderPlaceholder";

const formDataInitials = { claimId: "", claimType: "" };

const FeedingLogs = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [data, setData] = useState<IFeedingLogsTableData[][]>([]);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState(formDataInitials);

  const handleFeed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.claimId || !formData.claimType)
      return toast.error("Claim Id and Claim type is required");

    setSubmitting(true);

    try {
      const { data } = await axios.post<ResponseType<any>>(
        EndPoints.FEED_DASHBOARD,
        {
          claimId: formData.claimId,
          claimType: formData.claimType,
        }
      );
      toast.success(data?.message);
      setFormData(formDataInitials);
      setFormVisible(false);
    } catch (error: any) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const getLogs = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<ResponseType<IDDataFeedingLog>>(
          EndPoints.FAILED_CASES
        );
        const tmpArr = data?.data?.map((el) => {
          return el?.skippedClaimIds?.map((id, ind) => ({
            claimId: id,
            failureReason: el?.skippedReasons[ind],
          }));
        });
        setData(tmpArr);
      } catch (error: any) {
        showError(error);
      } finally {
        setLoading(false);
      }
    };
    getLogs();
  }, []);

  return (
    <PageWrapper title="Failed Cases">
      <Paper w="100%" p={20}>
        <Box className="flex items-center justify-end mb-4">
          <Button onClick={() => setFormVisible((prev) => !prev)}>
            {formVisible ? "Cancel" : "Feed Manually"}
          </Button>
        </Box>
        {formVisible ? (
          <form
            className="mb-4 flex items-center gap-x-2"
            onSubmit={handleFeed}
          >
            <NumberInput
              title="Claim Id"
              placeholder="Claim Id"
              value={formData.claimId}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, claimId: val as string }))
              }
            />
            <Select
              title="Claim Type"
              placeholder="Select claim type"
              value={formData.claimType}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, claimType: val as string }))
              }
              data={["P", "R"]}
              clearable
            />
            <Button type="submit" loading={submitting}>
              Submit
            </Button>
          </form>
        ) : null}

        <Accordion variant="contained">
          {loading ? (
            <LoaderPlaceholder />
          ) : data?.length > 0 ? (
            data?.map((el, ind) => (
              <Accordion.Item key={ind} value={ind?.toString()}>
                <Accordion.Control>
                  <Title order={4} c="blue">
                    {numberToOrdinal(ind + 1)} feed
                  </Title>
                </Accordion.Control>
                <Accordion.Panel>
                  <FeedingLogTable data={el} />
                </Accordion.Panel>
              </Accordion.Item>
            ))
          ) : (
            <Box className="flex flex-col items-center justify-center gap-2">
              <BsEmojiFrown size={40} />
              <Text>No Data</Text>
            </Box>
          )}
        </Accordion>
      </Paper>
    </PageWrapper>
  );
};

export default FeedingLogs;
