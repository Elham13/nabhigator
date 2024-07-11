import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Group,
  MultiSelect,
  Radio,
  SimpleGrid,
  TextInput,
  Textarea,
  Title,
  Button,
  Select,
  ActionIcon,
} from "@mantine/core";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocalStorage } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { GrClose } from "react-icons/gr";
import InvestigatorsList from "./InvestigatorsList";
import {
  alcoholAddictionOptionsArray,
  genuinenessOptionsArray,
  mainDropdownOptions,
  mainObjectOptionsMap,
  mainPartOptions,
  mainPartRMOptions,
  pedOptionsArray,
  rmMainObjectOptionsMap,
} from "@/lib/utils/constants/options";
import {
  AcceptedValues,
  AssignToInvestigatorRes,
  CaseDetail,
  DocumentData,
  DocumentMap,
  IDashboardData,
  INewCityMaster,
  INewPinCodeMaster,
  IUserSearchValues,
  NumericStage,
  ResponseType,
  Role,
  SingleResponseType,
  Task,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { buildUrl, showError } from "@/lib/helpers";
import { getStates } from "@/lib/helpers/getLocations";
import { changeTaskInitialValues } from "@/lib/utils/constants";

const dependentOptionsMap = {
  PED: pedOptionsArray,
  Gen: genuinenessOptionsArray,
  Alc: alcoholAddictionOptionsArray,
};

const searchValuesInitials: IUserSearchValues = {
  pinCode: "",
  city: "",
  state: "",
};

type TGeoOption = {
  city: string[];
  state: string[];
  pinCode: string[];
};

type PropType = {
  dashboardData: IDashboardData | null;
  caseDetail: CaseDetail | null;
  onClose?: () => void;
};

const AcceptSection = ({ dashboardData, caseDetail, onClose }: PropType) => {
  const router = useRouter();
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] = useState<AcceptedValues>({
    ...changeTaskInitialValues,
    dashboardDataId: dashboardData?._id as string,
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [geoOptions, setGeoOptions] = useState<TGeoOption>({
    city: [],
    state: [],
    pinCode: [],
  });
  const [searchValues, setSearchValues] =
    useState<IUserSearchValues>(searchValuesInitials);

  const setAllocationType = (val: string) => {
    const value = val as "Single" | "Dual";
    if (value === "Single") {
      const { insuredAddress, insuredCity, insuredPinCode, insuredState } =
        values;
      if (insuredAddress || insuredCity || insuredPinCode || insuredState) {
        setValues((prev) => ({
          ...prev,
          insuredAddress: "",
          insuredCity: "",
          insuredPinCode: 0,
          insuredState: "",
        }));
      }
    }
    setValues((prev) => ({
      ...prev,
      allocationType: value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (
    name: keyof AcceptedValues,
    value: string | string[] | null
  ) => {
    if (name === "tasksAssigned" && Array.isArray(value)) {
      let documents = new Map(
        values?.documents && Object.keys(values?.documents)?.length > 0
          ? (values?.documents as DocumentMap)
          : []
      );
      if (documents && documents?.size > 0) {
        if (documents?.size < value?.length) {
          const lastEl = value[value?.length - 1];
          const tempOptions = mainObjectOptionsMap.find(
            (el) => el.name === lastEl
          )?.options;
          const options = tempOptions?.map((el) => ({
            name: el.value,
            docUrl: [],
            location: null,
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
            name: el.value,
            docUrl: [],
            location: null,
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

  const handleSelectDocument = (docName: string, val: string[]) => {
    let newDoc = new Map(
      values?.documents
        ? values?.documents instanceof Map
          ? values?.documents
          : Object.entries(values?.documents)
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

    setValues((prev) => ({
      ...prev,
      documents: newDoc,
    }));
  };

  const validateValues = () => {
    try {
      if (values?.caseType && values?.caseType?.length > 0) {
        if (user?.config?.triggerSubType === "Mandatory") {
          values?.caseType?.map((item) => {
            const subTrigger = values?.caseTypeDependencies?.[item];
            if (!subTrigger || subTrigger?.length === 0)
              throw new Error(`Sub-Trigger ${item} is required`);
          });
        }
      } else {
        throw new Error("Triggers is required");
      }

      if (values?.allocationType === "Single" && selected.length > 1)
        throw new Error(
          "You have selected more than 1 investigators in Single allocation"
        );

      if (values?.allocationType === "Dual" && selected.length !== 2)
        throw new Error(
          "Please select 2 investigators for Dual allocation, one for hospital part and one for insured part"
        );

      if (dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION) {
        if (values?.allocationType === "Single" && selected?.length < 1) {
          throw new Error("Please select an investigator");
        }
        if (values?.allocationType === "Dual" && selected?.length < 2) {
          throw new Error("You must select exactly 2 investigators to assign");
        }
      }

      return true;
    } catch (err: any) {
      showError(err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateValues()) {
      setSubmitting(true);
      try {
        const payload = {
          ...values,
          documents: values?.documents
            ? values?.documents instanceof Map
              ? Array.from(values?.documents?.entries())
              : Array.from(new Map(Object.entries(values?.documents)).entries())
            : null,
          investigator: isManual && selected?.length > 0 ? selected : undefined,
          caseStatus: "Accepted",
          isManual,
          user,
        };

        const { data } = await axios.post<
          SingleResponseType<AssignToInvestigatorRes>
        >(EndPoints.ASSIGN_TO_INVESTIGATOR, payload);
        toast.success(data.message);
        router.replace("/Claims/action-inbox");
      } catch (error) {
        showError(error);
      } finally {
        setSubmitting(false);
      }
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

  const onSelection = useCallback((ids: string[]) => setSelected(ids), []);

  useEffect(() => {
    if (!!dashboardData && mainObjectOptionsMap?.length > 0) {
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

        setValues((prev) => ({
          ...prev,
          caseType: ["PED/NDC", "Genuineness"],
          tasksAssigned: [
            { name: "Pre-Auth Investigation", comment: "", completed: false },
          ],
          documents: newDocs,
        }));
      } else {
        const newDocs = new Map<string, DocumentData[]>();
        const newTasks: Task[] = [];
        if (dashboardData?.claimSubType === "In-patient Hospitalization") {
          for (const el of rmMainObjectOptionsMap) {
            if (
              [
                "NPS Confirmation",
                "Insured Verification",
                "Vicinity Verification",
                "Hospital Verification",
                "Lab Part/Pathologist Verification",
                "Chemist Verification",
              ].includes(el?.name)
            ) {
              const tempDocs = el?.options?.map((op) => ({
                name: op?.value,
                docUrl: [],
                location: null,
              }));
              newTasks?.push({ name: el?.name, completed: false, comment: "" });
              newDocs?.set(el?.name, tempDocs);
            }
          }
        } else if (dashboardData?.claimSubType === "Pre-Post") {
          const tempOption = rmMainObjectOptionsMap?.find(
            (op) => op?.name === "Pre-Post Verification"
          );
          if (tempOption) {
            newTasks?.push({
              name: tempOption?.name,
              completed: false,
              comment: "",
            });
            newDocs.set(
              tempOption?.name,
              tempOption?.options?.map((op) => ({
                name: op?.value,
                docUrl: [],
                location: null,
              }))
            );
          }
        } else if (dashboardData?.claimSubType === "Hospital Daily Cash") {
          const tempOption = rmMainObjectOptionsMap?.find(
            (op) => op?.name === "Hospital Daily Cash Part"
          );
          if (tempOption) {
            newTasks?.push({
              name: tempOption?.name,
              completed: false,
              comment: "",
            });
            newDocs.set(
              tempOption?.name,
              tempOption?.options?.map((op) => ({
                name: op?.value,
                docUrl: [],
                location: null,
              }))
            );
          }
        } else if (dashboardData?.claimSubType === "OPD") {
          const tempOption = rmMainObjectOptionsMap?.find(
            (op) => op?.name === "OPD Verification Part"
          );
          if (tempOption) {
            newTasks?.push({
              name: tempOption?.name,
              completed: false,
              comment: "",
            });
            newDocs.set(
              tempOption?.name,
              tempOption?.options?.map((op) => ({
                name: op?.value,
                docUrl: [],
                location: null,
              }))
            );
          }
        } else if (dashboardData?.claimSubType === "AHC") {
          const tempOption = rmMainObjectOptionsMap?.find(
            (op) => op?.name === "AHC Verification Part"
          );
          if (tempOption) {
            newTasks?.push({
              name: tempOption?.name,
              completed: false,
              comment: "",
            });
            newDocs.set(
              tempOption?.name,
              tempOption?.options?.map((op) => ({
                name: op?.value,
                docUrl: [],
                location: null,
              }))
            );
          }
        } else if (!dashboardData?.claimSubType) {
          const tempOption = rmMainObjectOptionsMap?.find(
            (op) => op?.name === "Claim Verification"
          );
          if (tempOption) {
            newTasks?.push({
              name: tempOption?.name,
              completed: false,
              comment: "",
            });
            newDocs.set(
              tempOption?.name,
              tempOption?.options?.map((op) => ({
                name: op?.value,
                docUrl: [],
                location: null,
              }))
            );
          }
        }

        for (const el of rmMainObjectOptionsMap) {
          if (["Miscellaneous Verification"].includes(el?.name)) {
            const tempDocs = el?.options
              ?.filter((op) =>
                [
                  "Miscellaneous Verification Documents",
                  "Customer Feedback Form",
                  "GPS Photo",
                  "Call Recording",
                  "AVR",
                ].includes(op?.value)
              )
              ?.map((op) => ({
                name: op?.value,
                docUrl: [],
                location: null,
              }));
            newTasks.push({ name: el?.name, completed: false, comment: "" });
            newDocs.set(el?.name, tempDocs);
          }
        }

        setValues((prev) => ({
          ...prev,
          caseType: ["PED/NDC", "Genuineness"],
          tasksAssigned: newTasks,
          documents: newDocs,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardData?.claimType, mainObjectOptionsMap, rmMainObjectOptionsMap]);

  useEffect(() => {
    if (
      [
        Role.ALLOCATION,
        Role.ADMIN,
        Role.TL,
        Role.CLUSTER_MANAGER,
        Role.POST_QA,
      ].includes(user?.activeRole) &&
      caseDetail
    ) {
      setValues({
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
    }

    if (
      dashboardData?.stage &&
      [
        NumericStage.PENDING_FOR_ALLOCATION,
        NumericStage.PENDING_FOR_RE_ALLOCATION,
        NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING,
      ].includes(dashboardData?.stage) &&
      !isManual
    )
      setIsManual(true);
  }, [user?.activeRole, caseDetail, dashboardData?.stage, isManual]);

  useEffect(() => {
    if (values?.allocationType === "Dual") {
      const getCities = async () => {
        try {
          const { data } = await axios.get<ResponseType<INewCityMaster>>(
            buildUrl(EndPoints.NEW_CITY_MASTER, {
              limit: 10,
              searchValue:
                searchValues?.city || dashboardData?.insuredDetails?.city,
            })
          );
          setGeoOptions((prev) => ({
            ...prev,
            city: [...new Set(data?.data?.map((el) => el.Title))],
          }));
        } catch (error) {
          showError(error);
        }
      };

      getCities();
    }
  }, [
    values?.allocationType,
    searchValues.city,
    dashboardData?.insuredDetails?.city,
  ]);

  useEffect(() => {
    if (values?.allocationType === "Dual") {
      const getPinCodes = async () => {
        try {
          const { data } = await axios.get<ResponseType<INewPinCodeMaster>>(
            buildUrl(EndPoints.NEW_PIN_CODE_MASTER, {
              limit: 10,
              pinCode: searchValues?.pinCode,
            })
          );
          setGeoOptions((prev) => ({
            ...prev,
            pinCode: [...new Set(data?.data?.map((el) => el.PIN_CODE))],
          }));
        } catch (error) {
          showError(error);
        }
      };
      getPinCodes();
    }
  }, [values?.allocationType, searchValues.pinCode]);

  useEffect(() => {
    if (values?.allocationType === "Dual") {
      getStates({
        stateName: searchValues?.state || dashboardData?.insuredDetails?.state,
        limit: 10,
        getOptions: (options) => {
          setGeoOptions((prev) => ({
            ...prev,
            state: [...new Set(options?.map((el) => el.State))],
          }));
        },
        getLoading: (status) => {},
      });
    }
  }, [
    values?.allocationType,
    searchValues.state,
    dashboardData?.insuredDetails?.state,
  ]);

  useEffect(() => {
    if (values?.allocationType === "Dual") {
      // Prefill insured address
      setValues((prev) => ({
        ...prev,
        insuredAddress: dashboardData?.insuredDetails?.address || "",
        insuredCity: dashboardData?.insuredDetails?.city || "",
        insuredState: dashboardData?.insuredDetails?.state || "",
      }));
    }
  }, [
    values?.allocationType,
    dashboardData?.insuredDetails?.address,
    dashboardData?.insuredDetails?.city,
    dashboardData?.insuredDetails?.state,
  ]);

  return (
    <Box mt={20}>
      <Flex c="green" justify="end">
        <ActionIcon onClick={() => (!!onClose ? onClose() : null)}>
          <GrClose />
        </ActionIcon>
      </Flex>
      <Radio.Group
        name="favoriteFramework"
        withAsterisk
        mt={20}
        value={values?.allocationType}
        onChange={setAllocationType}
      >
        <Group mt="xs">
          <Radio
            value="Single"
            label="Single Allocation"
            disabled={
              dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
            }
          />
          <Radio
            value="Dual"
            label="Dual Allocation"
            disabled={
              dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
            }
          />
        </Group>
      </Radio.Group>

      <form onSubmit={handleSubmit} className="mt-8">
        <SimpleGrid cols={{ sm: 1, md: 2 }}>
          {values?.allocationType === "Dual" && (
            <>
              <TextInput
                label="Insured Address"
                placeholder="Insured Address"
                required
                value={values?.insuredAddress}
                name="insuredAddress"
                onChange={handleChange}
                disabled={
                  dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
                }
              />
              <Select
                label="Insured City"
                placeholder="Insured City"
                required
                value={values?.insuredCity}
                name="insuredCity"
                onChange={(val) =>
                  setValues((prev) => ({ ...prev, insuredCity: val || "" }))
                }
                disabled={
                  dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
                }
                data={geoOptions?.city}
                searchable
                clearable
                searchValue={searchValues.city}
                onSearchChange={(val) =>
                  setSearchValues((prev) => ({ ...prev, city: val || "" }))
                }
              />
              <Select
                label="Insured State"
                placeholder="Insured State"
                required
                value={values?.insuredState}
                name="insuredState"
                onChange={(val) =>
                  setValues((prev) => ({ ...prev, insuredState: val || "" }))
                }
                disabled={
                  dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
                }
                data={geoOptions?.state}
                searchable
                clearable
                searchValue={searchValues.state}
                onSearchChange={(val) =>
                  setSearchValues((prev) => ({ ...prev, state: val || "" }))
                }
              />
              <Select
                label="Insured PinCode"
                placeholder="Insured PinCode"
                required
                value={values?.insuredPinCode?.toString() || ""}
                onChange={(val) =>
                  setValues((prev) => ({
                    ...prev,
                    insuredPinCode: val ? parseInt(val) : 0,
                  }))
                }
                disabled={
                  dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
                }
                data={geoOptions?.pinCode}
                searchable
                clearable
                searchValue={searchValues.pinCode}
                onSearchChange={(val) =>
                  setSearchValues((prev) => ({ ...prev, pinCode: val || "" }))
                }
              />
            </>
          )}
          <MultiSelect
            label="Triggers"
            placeholder="Select triggers"
            value={values?.caseType || []}
            onChange={(val) => handleSelect("caseType", val)}
            data={mainDropdownOptions}
            checkIconPosition="right"
            searchable
            hidePickedOptions
            clearable
            required={values?.caseType?.length < 1}
            withAsterisk
            disabled={
              dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
            }
          />
          {values?.caseType?.length > 0 &&
            dashboardData?.claimType !== "PreAuth" &&
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
                  value={values?.caseTypeDependencies?.[item] || []}
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
                  disabled={
                    dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
                  }
                  required={user?.config?.triggerSubType === "Mandatory"}
                />
              ) : null;
            })}
          <Textarea
            className="col-span-1 md:col-span-2"
            label="Pre-QC Observation"
            description="Mention pre-qc observation based on information and documents due deligence"
            placeholder="Pre-QC Observation"
            value={values?.preQcObservation || ""}
            required
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                preQcObservation: e?.currentTarget?.value || "",
              }))
            }
            disabled={
              dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
            }
          />
          {values?.caseType?.length > 0 && (
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
                  values?.tasksAssigned?.length > 0
                    ? values?.tasksAssigned?.map((t) => t.name)
                    : []
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
                required={values?.tasksAssigned?.length < 1}
                withAsterisk
                disabled={
                  dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
                }
              />
              {values?.tasksAssigned?.length > 0 &&
                values?.tasksAssigned?.map((task, ind) => {
                  const name = task.name;
                  let docVal: any = values?.documents
                    ? values?.documents instanceof Map
                      ? values?.documents
                      : new Map(Object.entries(values?.documents))
                    : null;
                  docVal = docVal.get(name)?.map((el: any) => el?.name) || [];
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
                        dashboardData?.stage ===
                        NumericStage.PENDING_FOR_ALLOCATION
                      }
                    />
                  );
                })}
            </>
          )}
          {dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION && (
            <Textarea
              className="col-span-1 md:col-span-2"
              label="Allocator's comment"
              placeholder="Enter your comment"
              value={values?.allocatorComment || ""}
              required
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  allocatorComment: e?.currentTarget?.value || "",
                }))
              }
            />
          )}
          <Box className="col-span-1 md:col-span-2">
            {isManual && (
              <InvestigatorsList
                destination="inbox"
                onSelection={onSelection}
                initialFilters="inbox"
              />
            )}
            <Flex mt={20} gap={10}>
              {!isManual ? (
                <>
                  <Button
                    type="submit"
                    onClick={() => {
                      if (isManual) setIsManual(false);
                    }}
                    loading={submitting}
                  >
                    Auto Assign
                  </Button>
                  <Button
                    component="div"
                    color="cyan"
                    onClick={() => setIsManual(true)}
                  >
                    Manual Assign
                  </Button>
                </>
              ) : (
                <Button type="submit" color="cyan" loading={submitting}>
                  {dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
                    ? "Assign to investigator"
                    : dashboardData?.stage &&
                      [
                        NumericStage.PENDING_FOR_ALLOCATION,
                        NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING,
                      ].includes(dashboardData?.stage)
                    ? "Manual Assign"
                    : "Manual Assign / Send to allocation bucket"}
                </Button>
              )}
            </Flex>
          </Box>
        </SimpleGrid>
      </form>
    </Box>
  );
};

export default AcceptSection;
