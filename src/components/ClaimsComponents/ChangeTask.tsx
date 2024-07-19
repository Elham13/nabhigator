import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Radio,
  SimpleGrid,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import { toast } from "react-toastify";
import InvestigatorsList from "./InvestigatorsList";
import {
  alcoholAddictionOptionsArray,
  genuinenessOptionsArray,
  mainDropdownOptions,
  mainObjectOptionsMap,
  mainPartOptions,
  pedOptionsArray,
} from "@/lib/utils/constants/options";
import {
  AcceptedValues,
  AssignToInvestigatorRes,
  CaseDetail,
  DocumentMap,
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { showError } from "@/lib/helpers";
import { changeTaskInitialValues } from "@/lib/utils/constants";

const dependentOptionsMap = {
  PED: pedOptionsArray,
  Gen: genuinenessOptionsArray,
  Alc: alcoholAddictionOptionsArray,
};

type PropType = {
  id: string;
  dashboardData: IDashboardData | null;
  caseDetail: CaseDetail | null;
  postQaComment: string;
  onSuccess: () => void;
};

const ChangeTask = ({
  id,
  dashboardData,
  caseDetail,
  postQaComment,
  onSuccess,
}: PropType) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [values, setValues] = useState<AcceptedValues>({
    ...changeTaskInitialValues,
    dashboardDataId: id,
  });
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectDocument = (docName: string, val: string[]) => {
    let newDoc = new Map(values.documents as DocumentMap);
    const docObj = {
      name: "",
      docUrl: [],
      location: null,
      hiddenDocUrls: [],
      replacedDocUrls: [],
    };
    if (newDoc) {
      newDoc.set(
        docName,
        val.map((v) => ({ ...docObj, name: v }))
      );
    } else {
      newDoc = new Map();
      newDoc.set(
        docName,
        val.map((v) => ({ ...docObj, name: v }))
      );
    }

    setValues((prev) => ({
      ...prev,
      documents: newDoc,
    }));
  };

  const handleSelect = (
    name: keyof AcceptedValues,
    value: string | string[] | null
  ) => {
    if (name === "tasksAssigned" && Array.isArray(value)) {
      const docObj = {
        name: "",
        docUrl: [],
        location: null,
        hiddenDocUrls: [],
        replacedDocUrls: [],
      };
      let documents = values.documents as DocumentMap;
      if (documents && documents?.size > 0) {
        if (documents?.size < value?.length) {
          const lastEl = value[value?.length - 1];
          const tempOptions = mainObjectOptionsMap.find(
            (el) => el.name === lastEl
          )?.options;
          const options = tempOptions?.map((el) => ({
            ...docObj,
            name: el.value,
          }));
          documents?.set(lastEl, options || []);
        } else {
          for (let [key, val] of documents) {
            if (!value?.includes(key)) documents?.delete(key);
          }
        }
      } else {
        const firstEl = value?.[0];
        const tempOptions = mainObjectOptionsMap.find(
          (el) => el.name === firstEl
        )?.options;
        const options =
          tempOptions?.map((el) => ({
            ...docObj,
            name: el.value,
          })) || [];
        if (documents === null) {
          const map = new Map();
          map.set(firstEl, options);
          documents = map;
        } else {
          documents?.set(firstEl, options || []);
        }
      }

      return setValues((prev) => ({
        ...prev,
        tasksAssigned: [
          ...value.map((el) => ({
            name: el,
            completed: false,
            comment: "",
          })),
        ],
        documents,
      }));
    }
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!values._id) throw new Error("_id is missing");
      if (!postQaComment) throw new Error("Please add your comment");

      const { data } = await axios.post<
        SingleResponseType<AssignToInvestigatorRes>
      >(EndPoints.CHANGE_TASK, {
        ...values,
        user,
        investigators: selected,
        postQaComment,
      });
      toast.success(data.message);
      onSuccess();
    } catch (error: any) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (caseDetail)
      setValues({
        _id: caseDetail?._id as string,
        allocationType: caseDetail?.allocationType,
        caseType: caseDetail?.caseType,
        caseTypeDependencies: caseDetail?.caseTypeDependencies,
        caseStatus: caseDetail?.caseStatus,
        dashboardDataId: caseDetail?.dashboardDataId,
        documents: caseDetail?.documents,
        investigator: caseDetail?.investigator,
        preQcObservation: caseDetail?.preQcObservation,
        tasksAssigned: caseDetail?.tasksAssigned,
        insuredAddress: caseDetail?.insuredAddress,
        insuredCity: caseDetail?.insuredCity,
        insuredState: caseDetail?.insuredState,
        insuredPinCode: caseDetail?.insuredPinCode,
        allocatorComment: caseDetail?.allocatorComment,
      });
  }, [dashboardData?.caseId, caseDetail]);

  return (
    <Paper>
      <Radio.Group
        name="favoriteFramework"
        withAsterisk
        mt={20}
        value={values.allocationType}
      >
        <Group mt="xs">
          <Radio value="Single" label="Single Allocation" disabled />
          <Radio value="Dual" label="Dual Allocation" disabled />
        </Group>
      </Radio.Group>

      <form onSubmit={handleSubmit} className="mt-8">
        <SimpleGrid cols={{ sm: 1, md: 2 }}>
          {values.allocationType === "Dual" && (
            <>
              <TextInput
                label="Insured Address"
                placeholder="Insured Address"
                required
                value={values?.insuredAddress}
                name="insuredAddress"
                onChange={handleChange}
              />
              <TextInput
                label="Insured City"
                placeholder="Insured City"
                required
                value={values?.insuredCity}
                name="insuredCity"
                onChange={handleChange}
              />
              <TextInput
                label="Insured State"
                placeholder="Insured State"
                required
                value={values?.insuredState}
                name="insuredState"
                onChange={handleChange}
              />
              <NumberInput
                label="Insured PinCode"
                placeholder="Insured PinCode"
                required
                value={values?.insuredPinCode}
                name="insuredPinCode"
                allowNegative={false}
                onChange={(val) =>
                  setValues((prev) => ({
                    ...prev,
                    insuredPinCode: val as number,
                  }))
                }
              />
            </>
          )}

          <MultiSelect
            label="Triggers"
            placeholder="Select triggers"
            value={values.caseType || []}
            onChange={(val) => handleSelect("caseType", val)}
            data={mainDropdownOptions}
            checkIconPosition="right"
            searchable
            hidePickedOptions
            clearable
            required={values?.caseType?.length < 1}
            withAsterisk
          />

          {values?.caseType?.length > 0 &&
            values?.caseType?.map((item, ind) => {
              const options =
                dependentOptionsMap[
                  item?.slice(0, 3) as keyof typeof dependentOptionsMap
                ];
              return options ? (
                <MultiSelect
                  key={ind}
                  label={item}
                  placeholder={`Select ${item}`}
                  value={values.caseTypeDependencies?.[item] || []}
                  onChange={(val) =>
                    setValues((prev) => ({
                      ...prev,
                      caseTypeDependencies: {
                        ...prev.caseTypeDependencies,
                        [item]: val,
                      },
                    }))
                  }
                  data={options}
                  checkIconPosition="right"
                  searchable
                  hidePickedOptions
                  clearable
                  // @ts-ignore: Unreachable code error
                  withAsterisk
                />
              ) : null;
            })}

          <Textarea
            className="col-span-1 md:col-span-2"
            label="Pre-QC Observation"
            description="Mention pre-qc observation based on information and documents due deligence"
            placeholder="Pre-QC Observation"
            value={values?.preQcObservation}
            required
            disabled
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                preQcObservation: e.currentTarget.value,
              }))
            }
          />

          {values.caseType?.length > 0 && (
            <>
              <Title
                order={2}
                c="blue"
                mt={20}
                mb={10}
                className="col-span-1 md:col-span-2"
              >
                Task and Documents assignment
              </Title>
              <MultiSelect
                label="Select task"
                placeholder="Select tasks for the main part"
                value={
                  values.tasksAssigned?.length > 0
                    ? values.tasksAssigned?.map((t) => t.name)
                    : []
                }
                onChange={(val) => handleSelect("tasksAssigned", val)}
                data={mainPartOptions}
                checkIconPosition="right"
                searchable
                hidePickedOptions
                clearable
                required={values?.tasksAssigned?.length < 1}
                withAsterisk
              />
              {values?.tasksAssigned?.length > 0 &&
                values?.tasksAssigned?.map((task, ind) => {
                  const name = task.name;
                  return (
                    <MultiSelect
                      key={ind}
                      label={`Documents of ${name}`}
                      placeholder={`Documents of ${name}`}
                      onChange={(val) => handleSelectDocument(name, val)}
                      // @ts-ignore
                      value={values.documents?.[name]?.map((d) => d.name) || []}
                      data={
                        mainObjectOptionsMap?.find((op) => op?.name === name)
                          ?.options
                      }
                      checkIconPosition="right"
                      searchable
                      hidePickedOptions
                      clearable
                      // @ts-ignore
                      required={values.documents?.[name]?.length < 1}
                      withAsterisk
                      className="col-span-1 md:col-span-2"
                    />
                  );
                })}
            </>
          )}
          <Box className="col-span-1 md:col-span-2">
            <InvestigatorsList
              destination="inbox"
              onSelection={(ids) => setSelected(ids)}
            />
          </Box>

          <Button type="submit" loading={submitting}>
            Change Task
          </Button>
        </SimpleGrid>
      </form>
    </Paper>
  );
};

export default ChangeTask;
