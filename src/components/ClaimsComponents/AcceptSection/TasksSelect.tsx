import React, { useCallback, useEffect, useState } from "react";
import {
  AcceptedValues,
  DocumentData,
  DocumentMap,
  IDashboardData,
  NumericStage,
  ResponseDoc,
  Task,
} from "@/lib/utils/types/fniDataTypes";
import { MultiSelect, Title } from "@mantine/core";
import {
  mainObjectOptionsMap,
  mainPartOptions,
  mainPartRMOptions,
  rmMainObjectOptionsMap,
} from "@/lib/utils/constants/options";
import { configureRMTasksAndDocuments } from "@/lib/helpers";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { Spin } from "antd";

const InvestigatorsList = dynamic(() => import("../InvestigatorsList"), {
  loading: () => <Spin />,
  ssr: false,
});

interface PropTypes {
  title: string;
  tasksAssigned: Task[];
  documents: DocumentMap | ResponseDoc | null;
  dashboardData: IDashboardData | null;
  onTasksChange: (tasks: Task[]) => void;
  onDocsChange: (docs: Map<string, DocumentData[]>) => void;
  getSelectedInvestigator: (id: string) => void;
}

const TasksSelect = ({
  title,
  tasksAssigned,
  documents,
  dashboardData,
  onTasksChange,
  onDocsChange,
  getSelectedInvestigator,
}: PropTypes) => {
  const handleSelect = (
    name: keyof AcceptedValues,
    value: string | string[] | null
  ) => {
    if (name === "tasksAssigned" && Array.isArray(value)) {
      let docs = new Map(
        documents && Object.keys(documents)?.length > 0
          ? (documents as DocumentMap)
          : []
      );

      if (docs && docs?.size > 0) {
        if (docs?.size < value?.length) {
          const lastEl = value[value?.length - 1];
          const tempOptions = mainObjectOptionsMap.find(
            (el) => el.name === lastEl
          )?.options;
          const options = tempOptions?.map((el) => ({
            name: el.value,
            docUrl: [],
            location: null,
          }));
          docs?.set(lastEl, options || []);
        } else {
          for (let [key, val] of documents as DocumentMap) {
            if (!value?.includes(key)) docs?.delete(key);
          }
        }
      } else {
        const firstEl = value?.[0];
        const tempOptions = mainObjectOptionsMap.find(
          (el) => el.name === firstEl
        )?.options;
        const options =
          tempOptions?.map((el) => ({
            name: el.value,
            docUrl: [],
            location: null,
          })) || [];
        if (docs === null) {
          const map = new Map();
          map.set(firstEl, options);
          docs = map;
        } else {
          docs?.set(firstEl, options || []);
        }
      }

      onTasksChange([
        ...value.map((el) => ({
          name: el,
          completed: false,
          comment: "",
        })),
      ]);

      onDocsChange(docs);
      return;
    }
  };

  const handleSelectDocument = (docName: string, val: string[]) => {
    let newDoc: Map<string, DocumentData[]> = new Map(
      documents
        ? documents instanceof Map
          ? documents
          : Object.entries(documents)
        : []
    );
    if (newDoc) {
      newDoc.set(
        docName,
        val.map((v) => ({ name: v, docUrl: [], location: null }))
      );
    } else {
      newDoc = new Map();
      newDoc.set(
        docName,
        val.map((v) => ({ name: v, docUrl: [], location: null }))
      );
    }

    onDocsChange(newDoc);
  };

  const getDocumentsSelectOptions = useCallback(
    (name: string) => {
      if (dashboardData?.claimType === "PreAuth") {
        return mainObjectOptionsMap?.find((op) => op?.name === name)?.options;
      } else {
        return rmMainObjectOptionsMap?.find((op) => op?.name === name)?.options;
      }
    },
    [dashboardData?.claimType]
  );

  const handleInvSelect = (ids: string[]) => {
    if (ids?.length > 1) return toast.warn("Only one selection allowed!");
    getSelectedInvestigator(ids[0]);
  };

  useEffect(() => {
    // Setting the default tasks and documents
    if (!!dashboardData?.claimType && mainObjectOptionsMap?.length > 0) {
      if (dashboardData?.claimType === "PreAuth") {
        const newDocs = new Map<string, DocumentData[]>();
        const preAuthDocs = mainObjectOptionsMap
          ?.find((el) => el.name === "Pre-Auth Investigation")
          ?.options?.slice(0, 3)
          ?.map((el) => ({
            name: el?.value,
            docUrl: [],
            location: null,
          }));

        newDocs.set("Pre-Auth Investigation", preAuthDocs || []);

        onTasksChange([
          { name: "Pre-Auth Investigation", comment: "", completed: false },
        ]);
        onDocsChange(newDocs);
      } else if (dashboardData?.claimType === "Reimbursement") {
        const part = title?.includes("Insured")
          ? "Insured"
          : title?.includes("Hospital")
          ? "Hospital"
          : undefined;

        const { newTasks, newDocs } = configureRMTasksAndDocuments({
          claimSubType: dashboardData?.claimSubType,
          part,
        });

        onTasksChange(newTasks);
        onDocsChange(newDocs);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardData?.claimType, dashboardData?.claimSubType, title]);

  return (
    <>
      <Title
        order={2}
        c="blue"
        mt={20}
        mb={10}
        className="col-span-1 md:col-span-2"
      >
        {title}
      </Title>
      {console.log({ tasksAssigned })}
      <MultiSelect
        label="Select task"
        placeholder="Select tasks for the main part"
        value={
          tasksAssigned?.length > 0 ? tasksAssigned?.map((t) => t.name) : []
        }
        onChange={(val) => handleSelect("tasksAssigned", val)}
        data={
          dashboardData?.claimType === "PreAuth"
            ? mainPartOptions
            : mainPartRMOptions
        }
        checkIconPosition="right"
        searchable
        hidePickedOptions
        clearable
        required={tasksAssigned?.length < 1}
        withAsterisk
        disabled={dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION}
      />
      {tasksAssigned?.length > 0 &&
        tasksAssigned?.map((task, ind) => {
          const name = task.name;
          if (name === "NPS Confirmation") return null;
          let docVal: any = documents
            ? documents instanceof Map
              ? documents
              : new Map(Object.entries(documents))
            : null;

          docVal = docVal?.get(name)?.map((el: any) => el?.name) || [];

          return (
            <MultiSelect
              key={ind}
              label={`Documents of ${name}`}
              placeholder={`Documents of ${name}`}
              onChange={(val) => handleSelectDocument(name, val)}
              value={docVal}
              data={getDocumentsSelectOptions(name)}
              checkIconPosition="right"
              searchable
              hidePickedOptions
              clearable
              required={docVal.length < 1}
              withAsterisk
              className="col-span-1 md:col-span-2"
              nothingFoundMessage="Nothing Found"
              disabled={
                dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
              }
            />
          );
        })}

      <div className="col-span-2 mt-4">
        <InvestigatorsList
          destination="inbox"
          onSelection={handleInvSelect}
          initialFilters="inbox"
          singleSelect
        />
      </div>
    </>
  );
};

export default TasksSelect;
