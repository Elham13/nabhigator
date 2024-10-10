"use client";

import React, { useState } from "react";
import { showError } from "@/lib/helpers";
import { Box, Button, Textarea, TextInput } from "@mantine/core";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { toast } from "react-toastify";
import { NumericStage } from "@/lib/utils/types/fniDataTypes";

const FeedDoc = () => {
  const [values, setValues] = useState({ claimId: "", docs: "" });
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const handleSubmit = async (props?: { caseId: any; docs: any }) => {
    setLoading(true);
    try {
      const payload: any = !!props ? props : values;
      const { data } = await axios.post(EndPoints.FEED_DOCS, payload);
      toast.success(data?.message);
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkFeed = async () => {
    setBulkLoading(true);
    try {
      const { data } = await axios.post(EndPoints.DASHBOARD_DATA, {
        filterApplied: false,
        pagination: {
          limit: 500,
          page: 1,
          count: 0,
        },
        user: {
          updates: {
            userIsInformed: false,
            details: {
              canSeeFailedCases: "Yes",
            },
            expedition: [],
          },
          zone: [],
          _id: "65ef3849d1b53be30c08c949",
          name: "Manish Baweja",
          email: "Manish.Baweja@nivabupa.com",
          phone: "9818124686",
          userId: "P117449",
          role: ["Admin"],
          status: "Active",
          userType: "Internal",
          config: {
            reportReceivedTime: {
              from: null,
              to: null,
            },
            canSeeConsolidatedInbox: "Yes",
            canSeeFailedCases: "Yes",
            updatedAt: "2024-06-19T05:42:18.798Z",
            leadView: [],
            isPreQcAutomated: false,
            canExportConsolidatedInbox: "No",
            dailyThreshold: 0,
            dailyAssign: 0,
            thresholdUpdatedAt: null,
            triggerSubType: "Non Mandatory",
            _id: "6707564a8b9057991831a534",
          },
          team: "6571a632c6b62984ab3aa10a",
          location: "Noida- NOC",
          state: ["Uttar Pradesh"],
          createdAt: "2024-03-11T08:21:04.330Z",
          updatedAt: "2024-06-19T05:42:18.798Z",
          __v: 1,
          activeRole: "Admin",
          leave: {
            status: "",
            fromDate: null,
            toDate: null,
            _id: "6707564a8b9057991831a535",
          },
        },
        stage: NumericStage.INVESTIGATION_ACCEPTED,
        origin: "Inbox",
      });

      const con = (data: any) => {
        return data
          ?.filter((el: any) => {
            const docs = el?.caseId?.singleTasksAndDocs?.docs;
            const docLength =
              docs instanceof Map ? docs?.size : Object.keys(docs)?.length;

            if (!!el?.caseId?.documents && (!docs || docLength === 0))
              return true;
            return false;
          })
          ?.map((el: any) => ({
            id: el?.caseId?._id,
            singleTasksAndDocs: el?.caseId?.singleTasksAndDocs,
            documents: el?.caseId?.documents || null,
            claimId: el?.claimId,
            insuredTasksAndDocs: el?.caseId?.insuredTasksAndDocs || null,
            hospitalTasksAndDocs: el?.caseId?.hospitalTasksAndDocs || null,
          }));
      };

      const result = con(data);

      for (const obj of result) {
        await handleSubmit({
          caseId: obj?.id,
          docs: JSON.stringify(
            obj?.documents instanceof Map
              ? Array.from(obj?.documents.entries())
              : Array.from(new Map(Object.entries(obj?.documents))?.entries())
          ),
        });
      }

      toast.success(data?.message);
    } catch (error: any) {
      showError(error);
    } finally {
      setBulkLoading(false);
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

      <Button onClick={() => handleSubmit()} loading={loading}>
        Submit
      </Button>

      <Button onClick={handleBulkFeed} loading={bulkLoading}>
        Bulk Feed
      </Button>
    </Box>
  );
};

export default FeedDoc;
