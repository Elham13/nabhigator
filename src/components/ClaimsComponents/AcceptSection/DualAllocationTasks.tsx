import React, { useEffect, useState } from "react";
import {
  AcceptedValues,
  AssignToInvestigatorRes,
  IDashboardData,
  INewCityMaster,
  INewPinCodeMaster,
  IUserSearchValues,
  NumericStage,
  ResponseType,
  SingleResponseType,
  TGeoOption,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { useLocalStorage } from "@mantine/hooks";
import { buildUrl, showError, validateTasksAndDocs } from "@/lib/helpers";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  Modal,
  MultiSelect,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  alcoholAddictionOptionsArray,
  genuinenessOptionsArray,
  mainDropdownOptions,
  pedOptionsArray,
} from "@/lib/utils/constants/options";
import { getStates } from "@/lib/helpers/getLocations";
import DualTasksSelect from "./DualTasksSelect";
import { useTasks } from "@/lib/providers/TasksAndDocsProvider";
import { toast } from "react-toastify";
import FileUpload from "../FileUpload";
import { tempDocInitials } from "@/lib/utils/constants";
import FileUploadFooter from "../FileUpload/FileUploadFooter";

const searchValuesInitials: IUserSearchValues = {
  pinCode: "",
  city: "",
  state: "",
};

const dependentOptionsMap = {
  PED: pedOptionsArray,
  Gen: genuinenessOptionsArray,
  Alc: alcoholAddictionOptionsArray,
};

interface PropTypes {
  dashboardData: IDashboardData | null;
  isChangeTask?: boolean;
  postQaComment?: string;
  onSuccess?: () => void;
}

const DualAllocationTasks = ({
  dashboardData,
  isChangeTask,
  postQaComment,
  onSuccess,
}: PropTypes) => {
  const router = useRouter();
  const { tasksState, dispatch } = useTasks();
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchValues, setSearchValues] =
    useState<IUserSearchValues>(searchValuesInitials);
  const [geoOptions, setGeoOptions] = useState<TGeoOption>({
    city: [],
    state: [],
    pinCode: [],
  });
  const [confirm, setConfirm] = useState({ value: "", visible: false });

  const closeConfirm = () => setConfirm({ value: "", visible: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    dispatch({ type: "change_state", value: { ...tasksState, [name]: value } });
  };

  const handleSelect = (
    name: keyof AcceptedValues,
    value: string | string[] | null
  ) => {
    dispatch({ type: "change_state", value: { ...tasksState, [name]: value } });
  };

  const validateValues = () => {
    try {
      if (tasksState?.caseType && tasksState?.caseType?.length > 0) {
        if (user?.config?.triggerSubType === "Mandatory") {
          tasksState?.caseType?.map((item) => {
            const subTrigger = tasksState?.caseTypeDependencies?.[item];
            if (!subTrigger || subTrigger?.length === 0)
              throw new Error(`Sub-Trigger ${item} is required`);
          });
        }
      } else {
        throw new Error("Triggers is required");
      }

      if (!tasksState?.preQcObservation)
        throw new Error("Pre-Qc observation is required!");

      if (
        !tasksState?.insuredTasksAndDocs?.tasks ||
        tasksState?.insuredTasksAndDocs?.tasks?.length < 1
      )
        throw new Error("Please select Insured part tasks and documents");

      if (
        !tasksState?.hospitalTasksAndDocs?.tasks ||
        tasksState?.hospitalTasksAndDocs?.tasks?.length < 1
      )
        throw new Error("Please select Hospital part tasks and documents");

      const insuredInv = tasksState?.insuredTasksAndDocs?.investigator;

      if (
        dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION &&
        !insuredInv
      )
        throw new Error("Please select an investigator in Insured part");

      const hospitalInv = tasksState?.hospitalTasksAndDocs?.investigator;

      if (
        dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION &&
        !hospitalInv
      )
        throw new Error("Please select an investigator in Hospital part");

      validateTasksAndDocs({
        tasksAndDocs: tasksState?.insuredTasksAndDocs,
        partName: "Insured",
      });
      validateTasksAndDocs({
        tasksAndDocs: tasksState?.hospitalTasksAndDocs,
        partName: "Hospital",
      });

      if (
        dashboardData?.stage !== NumericStage.PENDING_FOR_ALLOCATION &&
        (!insuredInv || !hospitalInv)
      ) {
        setConfirm({
          value: `You have not selected any investigator for ${
            !insuredInv && !hospitalInv
              ? "Insured and Hospital"
              : !insuredInv
              ? "Insured"
              : !hospitalInv
              ? "Hospital"
              : "-"
          } part`,
          visible: true,
        });
        return false;
      }

      return true;
    } catch (err: any) {
      showError(err);
      return false;
    }
  };

  const sendRequest = async () => {
    try {
      setSubmitting(true);

      const insuredDocs = tasksState?.insuredTasksAndDocs?.docs;
      const insuredTasksAndDocs = {
        ...tasksState?.insuredTasksAndDocs,
        docs: insuredDocs
          ? insuredDocs instanceof Map
            ? Array.from(insuredDocs.entries())
            : Array.from(new Map(Object.entries(insuredDocs))?.entries())
          : null,
      };

      const hospitalDocs = tasksState?.hospitalTasksAndDocs?.docs;
      const hospitalTasksAndDocs = {
        ...tasksState?.hospitalTasksAndDocs,
        docs: hospitalDocs
          ? hospitalDocs instanceof Map
            ? Array.from(hospitalDocs.entries())
            : Array.from(new Map(Object.entries(hospitalDocs))?.entries())
          : null,
      };

      const payload = {
        ...tasksState,
        singleTasksAndDocs: null,
        insuredTasksAndDocs,
        hospitalTasksAndDocs,
        caseStatus: "Accepted",
        user,
      };

      if (isChangeTask) {
        if (!dashboardData?.caseId) throw new Error("_id is missing");
        if (!postQaComment) throw new Error("Please add your comment");
        payload.postQaComment = postQaComment;
        payload._id = dashboardData?.caseId as string;
        const { data } = await axios.post<
          SingleResponseType<AssignToInvestigatorRes>
        >(EndPoints.CHANGE_TASK, payload);
        toast.success(data?.message);
        if (onSuccess) onSuccess();
      } else {
        const { data } = await axios.post<
          SingleResponseType<AssignToInvestigatorRes>
        >(EndPoints.ASSIGN_TO_INVESTIGATOR, payload);
        toast.success(data?.message);
        closeConfirm();
        router.replace("/Claims/action-inbox");
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateValues()) {
      setSubmitting(true);
      try {
        await sendRequest();
      } catch (error) {
        showError(error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleGetUrl = (
    id: string,
    name: string,
    url: string,
    action: "Add" | "Remove"
  ) => {
    const urls =
      tasksState?.preQcUploads && tasksState?.preQcUploads?.length > 0
        ? [...tasksState?.preQcUploads, url]
        : [url];

    dispatch({
      type: "change_state",
      value: { ...tasksState, preQcUploads: urls },
    });
  };

  const handleRemove = (index: number) => {
    let urls =
      tasksState?.preQcUploads && tasksState?.preQcUploads?.length > 0
        ? [...tasksState?.preQcUploads]
        : [];

    urls = urls?.filter((_, ind) => ind !== index);
    dispatch({
      type: "change_state",
      value: { ...tasksState, preQcUploads: urls },
    });
  };

  useEffect(() => {
    if (!!dashboardData?.insuredDetails) {
      // Prefill insured address
      dispatch({
        type: "change_state",
        value: {
          ...tasksState,
          insuredAddress: dashboardData?.insuredDetails?.address || "",
          insuredCity: dashboardData?.insuredDetails?.city || "",
          insuredState: dashboardData?.insuredDetails?.state || "",
        },
      });
    }
  }, [dashboardData?.insuredDetails]);

  useEffect(() => {
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
  }, [searchValues.city, dashboardData?.insuredDetails?.city]);

  useEffect(() => {
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
  }, [searchValues.pinCode]);

  useEffect(() => {
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
  }, [searchValues.state, dashboardData?.insuredDetails?.state]);

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <SimpleGrid cols={{ sm: 1, md: 2 }}>
        {tasksState?.allocationType === "Dual" && (
          <>
            <TextInput
              label="Insured Address"
              placeholder="Insured Address"
              required
              value={tasksState?.insuredAddress || ""}
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
              value={tasksState?.insuredCity || ""}
              name="insuredCity"
              onChange={(val) =>
                dispatch({
                  type: "change_state",
                  value: { ...tasksState, insuredCity: val || "" },
                })
              }
              disabled={
                dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
              }
              data={geoOptions?.city}
              searchable
              clearable
              searchValue={searchValues.city || ""}
              onSearchChange={(val) =>
                setSearchValues((prev) => ({ ...prev, city: val || "" }))
              }
            />
            <Select
              label="Insured State"
              placeholder="Insured State"
              required
              value={tasksState?.insuredState || ""}
              name="insuredState"
              onChange={(val) =>
                dispatch({
                  type: "change_state",
                  value: { ...tasksState, insuredState: val || "" },
                })
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
              value={tasksState?.insuredPinCode?.toString() || ""}
              onChange={(val) =>
                dispatch({
                  type: "change_state",
                  value: {
                    ...tasksState,
                    insuredPinCode: val ? parseInt(val) : 0,
                  },
                })
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
          value={tasksState?.caseType || []}
          onChange={(val) => handleSelect("caseType", val)}
          data={mainDropdownOptions}
          checkIconPosition="right"
          searchable
          hidePickedOptions
          clearable
          required={tasksState?.caseType?.length < 1}
          withAsterisk
          disabled={
            dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
          }
        />
        {tasksState?.caseType?.length > 0 &&
          dashboardData?.claimType !== "PreAuth" &&
          tasksState?.caseType?.map((item, ind) => {
            const options =
              dependentOptionsMap[
                item?.slice(0, 3) as keyof typeof dependentOptionsMap
              ];
            return options ? (
              <MultiSelect
                key={ind}
                label={item}
                placeholder={`Select ${item}`}
                value={tasksState?.caseTypeDependencies?.[item] || []}
                onChange={(val) => {
                  dispatch({
                    type: "change_state",
                    value: {
                      ...tasksState,
                      caseTypeDependencies: {
                        ...tasksState.caseTypeDependencies,
                        [item]: val,
                      },
                    },
                  });
                }}
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
          value={tasksState?.preQcObservation || ""}
          required
          onChange={(e) => {
            dispatch({
              type: "change_state",
              value: {
                ...tasksState,
                preQcObservation: e?.currentTarget?.value || "",
              },
            });
          }}
          disabled={
            dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION
          }
        />
        <Box>
          <Text className="font-semibold">Pre-Qc Uploads: </Text>
          {!!tasksState?.preQcUploads &&
            tasksState?.preQcUploads?.length > 0 &&
            tasksState?.preQcUploads?.map((el, ind) => (
              <FileUploadFooter
                key={ind}
                url={el}
                onDelete={() => handleRemove(ind)}
              />
            ))}
          <FileUpload
            doc={tempDocInitials}
            docName="doc"
            getUrl={handleGetUrl}
            claimId={dashboardData?.claimId || 0}
          />
        </Box>

        {dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION && (
          <Textarea
            className="col-span-1 md:col-span-2"
            label="Allocator's comment"
            placeholder="Enter your comment"
            value={tasksState?.allocatorComment || ""}
            required
            onChange={(e) => {
              dispatch({
                type: "change_state",
                value: {
                  ...tasksState,
                  allocatorComment: e?.currentTarget?.value || "",
                },
              });
            }}
          />
        )}

        {tasksState?.caseType?.length > 0 && (
          <DualTasksSelect dashboardData={dashboardData} />
        )}

        <Button loading={submitting} type="submit">
          Submit
        </Button>
      </SimpleGrid>
      {confirm?.visible && (
        <Modal
          opened={confirm?.visible}
          onClose={() =>
            setConfirm((prev) => ({ ...prev, visible: !prev?.visible }))
          }
          title="Confirm"
        >
          {confirm?.value}. If you proceed, the case will be auto assigned to an
          investigator, or it will fall into allocation bucket if no
          investigator found. Are you sure you want to proceed?
          <Flex gap={10} mt={10}>
            <Button
              onClick={() => {
                sendRequest();
              }}
              loading={submitting}
            >
              Proceed
            </Button>
            <Button onClick={closeConfirm} color="red">
              Cancel
            </Button>
          </Flex>
        </Modal>
      )}
    </form>
  );
};

export default DualAllocationTasks;
