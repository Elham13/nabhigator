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
  Button,
  Flex,
  Modal,
  MultiSelect,
  Select,
  SimpleGrid,
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
  const { values, setValues } = useTasks();
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
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (
    name: keyof AcceptedValues,
    value: string | string[] | null
  ) => {
    setValues((prev) => ({ ...prev, [name]: value }));
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

      if (!values?.preQcObservation)
        throw new Error("Pre-Qc observation is required!");

      if (values?.tasksAndDocs?.length < 1)
        throw new Error("Please select Insured part tasks and documents");

      if (values?.tasksAndDocs?.length < 2)
        throw new Error("Please select Hospital part tasks and documents");

      const insuredInv = values?.tasksAndDocs[0]?.investigator;

      if (
        dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION &&
        !insuredInv
      )
        throw new Error("Please select an investigator in Insured part");

      const hospitalInv = values?.tasksAndDocs[1]?.investigator;

      if (
        dashboardData?.stage === NumericStage.PENDING_FOR_ALLOCATION &&
        !hospitalInv
      )
        throw new Error("Please select an investigator in Hospital part");

      validateTasksAndDocs({ tasksAndDocs: values?.tasksAndDocs, ind: 0 });
      validateTasksAndDocs({ tasksAndDocs: values?.tasksAndDocs, ind: 1 });

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
      const tasksAndDocs = values?.tasksAndDocs?.map((el) => ({
        ...el,
        docs: el?.docs
          ? el?.docs instanceof Map
            ? Array.from(el?.docs?.entries())
            : Array.from(new Map(Object.entries(el?.docs)).entries())
          : null,
      }));

      const payload = {
        ...values,
        tasksAndDocs,
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

  useEffect(() => {
    if (!!dashboardData?.insuredDetails) {
      // Prefill insured address
      setValues((prev) => ({
        ...prev,
        insuredAddress: dashboardData?.insuredDetails?.address || "",
        insuredCity: dashboardData?.insuredDetails?.city || "",
        insuredState: dashboardData?.insuredDetails?.state || "",
      }));
    }
  }, [dashboardData?.insuredDetails, setValues]);

  return (
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

        {values?.caseType?.length > 0 && (
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
