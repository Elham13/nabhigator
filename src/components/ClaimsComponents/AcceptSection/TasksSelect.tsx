import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DocumentData,
  DocumentMap,
  IDashboardData,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import { MultiSelect, Title } from "@mantine/core";
import {
  mainObjectOptionsMap,
  mainPartOptions,
  mainPartRMOptions,
  rmMainObjectOptionsMap,
} from "@/lib/utils/constants/options";
import { configureRMTasksAndDocuments, showError } from "@/lib/helpers";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { useTasks } from "@/lib/providers/TasksAndDocsProvider";
import { BiCog } from "react-icons/bi";

const InvestigatorsList = dynamic(() => import("../InvestigatorsList"), {
  loading: () => <BiCog className="animate-spin" />,
  ssr: false,
});

interface PropTypes {
  title: string;
  dashboardData: IDashboardData | null;
  part: "Insured" | "Hospital" | "None";
}

const TasksSelect = ({ title, part, dashboardData }: PropTypes) => {
  const { tasksState, dispatch } = useTasks();

  const tasksAssigned = useMemo(() => {
    return part === "Hospital"
      ? tasksState?.hospitalTasksAndDocs?.tasks || []
      : part === "Insured"
      ? tasksState?.insuredTasksAndDocs?.tasks || []
      : part === "None"
      ? tasksState?.singleTasksAndDocs?.tasks || []
      : [];
  }, [
    part,
    tasksState?.hospitalTasksAndDocs?.tasks,
    tasksState?.insuredTasksAndDocs?.tasks,
    tasksState?.singleTasksAndDocs?.tasks,
  ]);

  const documents = useMemo(() => {
    return part === "Hospital"
      ? tasksState?.hospitalTasksAndDocs?.docs || {}
      : part === "Insured"
      ? tasksState?.insuredTasksAndDocs?.docs || {}
      : part === "None"
      ? tasksState?.singleTasksAndDocs?.docs
      : [];
  }, [
    part,
    tasksState?.hospitalTasksAndDocs?.docs,
    tasksState?.insuredTasksAndDocs?.docs,
    tasksState?.singleTasksAndDocs?.docs,
  ]);

  const handleSelect = (value: string[]) => {
    try {
      let docs = documents
        ? Array.isArray(documents)
          ? documents.length > 0 && (documents[0] as any) instanceof Array
            ? new Map(documents) // If the input is an array of entries, create a Map
            : Object.fromEntries(documents) // If it's just a simple array of key-value pairs, convert to object
          : null
        : null;

      if (!!docs && docs?.size > 0) {
        if (docs?.size < value?.length) {
          const lastEl = value[value?.length - 1];
          const tempOptions = mainObjectOptionsMap.find(
            (el) => el.name === lastEl
          )?.options;
          const options = tempOptions?.map((el) => ({
            name: el.value,
            docUrl: [],
            hiddenDocUrls: [],
            replacedDocUrls: [],
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
            hiddenDocUrls: [],
            replacedDocUrls: [],
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

      const payload = {
        tasks: [
          ...value.map((el) => ({
            name: el,
            completed: false,
            comment: "",
          })),
        ],
        docs,
      };
      let key = "";

      if (part === "Hospital") {
        key = "hospitalTasksAndDocs";
      } else if (part === "Insured") {
        key = "insuredTasksAndDocs";
      } else if (part === "None") {
        key = "singleTasksAndDocs";
      }
      if (!!key)
        dispatch({
          type: "change_state",
          value: { [key]: payload },
        });
    } catch (error: any) {
      showError(error);
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
        val.map((v) => ({
          name: v,
          docUrl: [],
          hiddenDocUrls: [],
          replacedDocUrls: [],
          location: null,
        }))
      );
    } else {
      newDoc = new Map();
      newDoc.set(
        docName,
        val.map((v) => ({
          name: v,
          docUrl: [],
          hiddenDocUrls: [],
          replacedDocUrls: [],
          location: null,
        }))
      );
    }

    if (part === "Hospital") {
      dispatch({
        type: "change_state",
        value: {
          hospitalTasksAndDocs: {
            ...tasksState?.hospitalTasksAndDocs,
            docs: newDoc,
          },
        },
      });
    } else if (part === "Insured") {
      dispatch({
        type: "change_state",
        value: {
          insuredTasksAndDocs: {
            ...tasksState?.insuredTasksAndDocs,
            docs: newDoc,
          },
        },
      });
    } else if (part === "None") {
      dispatch({
        type: "change_state",
        value: {
          singleTasksAndDocs: {
            ...tasksState?.singleTasksAndDocs,
            docs: newDoc,
          },
        },
      });
    }
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
    if (part === "Hospital") {
      dispatch({
        type: "change_state",
        value: {
          hospitalTasksAndDocs: {
            ...tasksState?.hospitalTasksAndDocs,
            investigator: ids[0],
          },
        },
      });
    } else if (part === "Insured") {
      dispatch({
        type: "change_state",
        value: {
          insuredTasksAndDocs: {
            ...tasksState?.insuredTasksAndDocs,
            investigator: ids[0],
          },
        },
      });
    } else if (part === "None") {
      dispatch({
        type: "change_state",
        value: {
          singleTasksAndDocs: {
            ...tasksState?.singleTasksAndDocs,
            investigator: ids[0],
          },
        },
      });
    }
  };

  useEffect(() => {
    // Setting the default tasks and documents
    let isNoDefaultTasks = false;

    const taskMappings = {
      None: tasksState?.singleTasksAndDocs?.tasks,
      Hospital: tasksState?.hospitalTasksAndDocs?.tasks,
      Insured: tasksState?.insuredTasksAndDocs?.tasks,
    };

    if (
      !taskMappings[part] ||
      (taskMappings[part] && taskMappings[part].length < 1)
    ) {
      isNoDefaultTasks = true;
    }

    if (
      !!dashboardData?.claimType &&
      mainObjectOptionsMap?.length > 0 &&
      isNoDefaultTasks
    ) {
      if (dashboardData?.claimType === "PreAuth") {
        const newDocs = new Map<string, DocumentData[]>();
        const preAuthDocs = mainObjectOptionsMap
          ?.find((el) => el.name === "Pre-Auth Investigation")
          ?.options?.slice(0, 3)
          ?.map((el) => ({
            name: el?.value,
            docUrl: [],
            hiddenDocUrls: [],
            replacedDocUrls: [],
            location: null,
          }));

        newDocs.set("Pre-Auth Investigation", preAuthDocs || []);

        const tasks = [
          { name: "Pre-Auth Investigation", comment: "", completed: false },
        ];

        let payload = {};
        if (part === "Hospital") {
          payload = {
            hospitalTasksAndDocs: {
              ...tasksState?.hospitalTasksAndDocs,
              tasks,
              docs: newDocs,
            },
          };
        } else if (part === "Insured") {
          payload = {
            insuredTasksAndDocs: {
              ...tasksState?.insuredTasksAndDocs,
              tasks,
              docs: newDocs,
            },
          };
        } else if (part === "None") {
          payload = {
            singleTasksAndDocs: {
              ...tasksState?.singleTasksAndDocs,
              tasks,
              docs: newDocs,
            },
          };
        }
        dispatch({
          type: "change_state",
          value: payload,
        });
      } else if (dashboardData?.claimType === "Reimbursement") {
        const { newTasks, newDocs } = configureRMTasksAndDocuments({
          claimSubType: dashboardData?.claimSubType,
          part,
        });

        let payload = {};
        if (part === "Insured") {
          const temp = tasksState?.insuredTasksAndDocs || {};
          payload = {
            insuredTasksAndDocs: {
              ...temp,
              tasks: newTasks,
              docs: newDocs,
            },
          };
        }
        if (part === "Hospital") {
          const temp = tasksState?.hospitalTasksAndDocs || {};
          payload = {
            hospitalTasksAndDocs: {
              ...temp,
              tasks: newTasks,
              docs: newDocs,
            },
          };
        } else if (part === "None") {
          const temp = tasksState?.singleTasksAndDocs;
          payload = {
            singleTasksAndDocs: {
              ...temp,
              tasks: newTasks,
              docs: newDocs,
            },
          };
        }
        dispatch({
          type: "change_state",
          value: payload,
        });
      }
    }
  }, [
    dashboardData?.claimType,
    dashboardData?.claimSubType,
    part,
    tasksState?.allocationType,
  ]);

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
      <MultiSelect
        label="Select task"
        placeholder="Select tasks for the main part"
        value={
          tasksAssigned?.length > 0 ? tasksAssigned?.map((t) => t.name) : []
        }
        onChange={(val) => handleSelect(val)}
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
