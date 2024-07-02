import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Button,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import { DateInput, DatePicker } from "@mantine/dates";
import {
  DashboardFilters,
  IMoreFiltersOptions,
  IUser,
  Investigator,
  NumericStage,
  ResponseType,
  Role,
  TDashboardOrigin,
  ValueLabel,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import {
  benefitTypeOptions,
  cashlessTypeOptions,
  claimAmountOptions,
  claimSubTypeOptions,
  claimTypeOptions,
  colorCodeOptions,
  investigatorRecommendationOptions,
  lossTypeOptions,
  moreFiltersOptions,
} from "@/lib/utils/constants/options";
import { dateParser, getStageLabel, showError } from "@/lib/helpers";

type PropTypes = {
  open: boolean;
  origin: TDashboardOrigin;
  filters: DashboardFilters;
  showClearBtn: boolean;
  setFilters: Dispatch<SetStateAction<DashboardFilters>>;
  handleClose: () => void;
  handleFilter: (e: React.FormEvent<HTMLFormElement>) => void;
};

interface Options {
  clusterManager: ValueLabel[];
  claimInvestigators: ValueLabel[];
  lossType: ValueLabel[];
  colorCode: ValueLabel[];
  investigatorRecommendation: ValueLabel[];
}

const FilterModal = ({
  open,
  origin,
  filters,
  showClearBtn,
  setFilters,
  handleClose,
  handleFilter,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [teamLeadOptions, setTeamLeadsOptions] = useState<ValueLabel[]>([]);
  const [options, setOptions] = useState<Options>({
    clusterManager: [],
    claimInvestigators: [],
    lossType: lossTypeOptions,
    colorCode: colorCodeOptions,
    investigatorRecommendation: investigatorRecommendationOptions,
  });

  const stageOptions = useMemo(() => {
    const stages = [
      {
        value: NumericStage.PENDING_FOR_PRE_QC.toString(),
        label: getStageLabel(NumericStage.PENDING_FOR_PRE_QC),
      },
      {
        value: NumericStage.PENDING_FOR_ALLOCATION.toString(),
        label: getStageLabel(NumericStage.PENDING_FOR_ALLOCATION),
      },
      {
        value: NumericStage.PENDING_FOR_RE_ALLOCATION.toString(),
        label: getStageLabel(NumericStage.PENDING_FOR_RE_ALLOCATION),
      },
      {
        value: NumericStage.IN_FIELD_FRESH.toString(),
        label: getStageLabel(NumericStage.IN_FIELD_FRESH),
      },
      {
        value: NumericStage.POST_QC.toString(),
        label: getStageLabel(NumericStage.POST_QC),
      },
      {
        value: NumericStage.IN_FIELD_REINVESTIGATION.toString(),
        label: getStageLabel(NumericStage.IN_FIELD_REINVESTIGATION),
      },
      {
        value: NumericStage.IN_FIELD_REWORK.toString(),
        label: getStageLabel(NumericStage.IN_FIELD_REWORK),
      },
      {
        value: NumericStage.CLOSED.toString(),
        label: getStageLabel(NumericStage.CLOSED),
      },
      {
        value: NumericStage.REJECTED.toString(),
        label: getStageLabel(NumericStage.REJECTED),
      },
      {
        value: NumericStage.INVESTIGATION_ACCEPTED.toString(),
        label: getStageLabel(NumericStage.INVESTIGATION_ACCEPTED),
      },
      {
        value: NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING.toString(),
        label: getStageLabel(NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING),
      },
      {
        value: NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING.toString(),
        label: getStageLabel(
          NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING
        ),
      },
    ];
    return stages;
  }, []);

  const getTeamLeads = useCallback(async () => {
    try {
      const { data } = await axios.post<ResponseType<IUser>>(EndPoints.USER, {
        role: "TL",
        limit: 1000,
      });
      if (data?.data?.length > 0) {
        setTeamLeadsOptions(
          data?.data?.map((el) => ({ value: el._id, label: el.name }))
        );
      }
    } catch (error) {
      showError(error);
    }
  }, []);

  const getClusterManager = useCallback(async () => {
    try {
      const { data } = await axios.post<ResponseType<IUser>>(EndPoints.USER, {
        role: Role.CLUSTER_MANAGER,
        limit: 1000,
      });
      if (data?.data?.length > 0) {
        setOptions((prev) => ({
          ...prev,
          clusterManager: data?.data?.map((el) => ({
            value: el._id,
            label: el.name,
          })),
        }));
      }
    } catch (error) {
      showError(error);
    }
  }, []);

  const getInvestigators = useCallback(async () => {
    try {
      const { data } = await axios.post<ResponseType<Investigator>>(
        EndPoints.INVESTIGATORS,
        {}
      );
      if (data?.data?.length > 0) {
        setOptions((prev) => ({
          ...prev,
          claimInvestigators: data?.data?.map((el) => ({
            value: el._id,
            label: el.investigatorName,
          })),
        }));
      }
    } catch (error) {
      showError(error);
    }
  }, []);

  const handleChange = (
    name: keyof DashboardFilters,
    val: string | string[] | null
  ) => {
    setFilters((prev) => ({ ...prev, [name]: val, filterApplied: !!val }));
  };

  useEffect(() => {
    getTeamLeads();
  }, [getTeamLeads]);

  useEffect(() => {
    if (filters?.moreFilters && filters?.moreFilters?.length > 0) {
      if (
        filters?.moreFilters?.includes("clusterManager") &&
        options.clusterManager?.length === 0
      )
        getClusterManager();

      if (
        filters?.moreFilters?.includes("claimInvestigators") &&
        options.claimInvestigators?.length === 0
      ) {
        getInvestigators();
      }
    }
    moreFiltersOptions.map((op) => {
      if (
        !filters?.moreFilters ||
        (!!filters[op.value] && !filters.moreFilters.includes(op.value))
      ) {
        delete filters[op.value];
      }
    });
  }, [
    filters,
    getInvestigators,
    getClusterManager,
    options?.claimInvestigators?.length,
    options?.clusterManager?.length,
  ]);

  const filterNotEmpty = Object.values({ ...filters })?.some((val) =>
    Array.isArray(val) ? val?.length > 0 : val !== undefined
  );

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      title="Filters"
      centered
      size="lg"
    >
      <form onSubmit={handleFilter} className="p-2">
        <SimpleGrid cols={{ sm: 1, md: 2 }} mb={20}>
          {origin === "Consolidated" ||
          (origin === "Inbox" &&
            [
              Role.ADMIN,
              Role.TL,
              Role.CLUSTER_MANAGER,
              Role.CENTRAL_OPERATION,
            ].includes(user?.activeRole)) ? (
            <MultiSelect
              label="Stage"
              placeholder="Investigation Stage"
              value={filters?.stage || []}
              onChange={(val) => handleChange("stage", val)}
              data={stageOptions}
              checkIconPosition="right"
              hidePickedOptions
              searchable
            />
          ) : null}
          <Select
            label="Claim Type"
            placeholder="Claim Type"
            value={filters?.claimType || ""}
            onChange={(val) => handleChange("claimType", val)}
            data={claimTypeOptions}
            checkIconPosition="right"
            clearable
            searchable
          />
          {filters?.claimType === "PreAuth" ? (
            <Select
              label="Admission Type"
              placeholder="Admission Type"
              value={filters["hospitalizationDetails.admissionType"] || ""}
              onChange={(val) =>
                handleChange("hospitalizationDetails.admissionType", val)
              }
              data={cashlessTypeOptions}
              checkIconPosition="right"
              clearable
              searchable
            />
          ) : null}
          <MultiSelect
            label="Claim SubType"
            placeholder="Claim SubType"
            value={filters?.claimSubType || []}
            onChange={(val) => handleChange("claimSubType", val)}
            data={claimSubTypeOptions}
            checkIconPosition="right"
            hidePickedOptions
            searchable
            clearable
          />
          <Select
            label="Claim Amount"
            placeholder="Claim Amount"
            value={filters["claimDetails.claimAmount"] || ""}
            onChange={(val) => handleChange("claimDetails.claimAmount", val)}
            data={claimAmountOptions}
            checkIconPosition="right"
            clearable
            searchable
          />
          <MultiSelect
            label="Benefit Type"
            placeholder="Benefit Type"
            value={filters?.benefitType || []}
            onChange={(val) => handleChange("benefitType", val)}
            data={benefitTypeOptions}
            checkIconPosition="right"
            hidePickedOptions
            searchable
            clearable
          />
          <Select
            label="Team Lead"
            placeholder="Team Lead"
            value={filters?.teamLead || ""}
            onChange={(val) => handleChange("teamLead", val)}
            data={teamLeadOptions}
            searchable
            clearable
          />
          {filters?.moreFilters &&
            filters?.moreFilters?.length > 0 &&
            filters?.moreFilters?.map((elem, ind) => {
              const found = moreFiltersOptions?.find((el) => el.value === elem);
              return found?.type === "array" ? (
                <MultiSelect
                  key={ind}
                  label={found?.label}
                  placeholder={found?.label}
                  value={filters?.[found.value] || []}
                  onChange={(val) => handleChange(found.value, val)}
                  data={options[found.value as keyof Options]}
                  hidePickedOptions
                  searchable
                  clearable
                />
              ) : found?.type === "select" ? (
                <Select
                  key={ind}
                  label={found?.label}
                  placeholder={found?.label}
                  value={filters?.[found?.value] || ""}
                  onChange={(val) => handleChange(found.value, val)}
                  data={options[found.value as keyof Options]}
                  searchable
                  clearable
                />
              ) : found?.type === "number" ? (
                <NumberInput
                  key={ind}
                  label={found.label}
                  placeholder={found.label}
                  value={filters?.[found.value] || ""}
                  onChange={(val) => {
                    setFilters((prev) => ({
                      ...prev,
                      [found.value]: val,
                      filterApplied: !!val,
                    }));
                  }}
                />
              ) : found?.type === "date" ? (
                <DateInput
                  key={ind}
                  dateParser={dateParser}
                  valueFormat="DD/MM/YYYY"
                  label={found.label}
                  placeholder={found.label}
                  value={(filters?.[found.value] as Date) || null}
                  onChange={(val) =>
                    setFilters((prev) => ({
                      ...prev,
                      [found.value]: val,
                      filterApplied: !!val,
                    }))
                  }
                  clearable
                />
              ) : found?.type === "dateRange" ? (
                <DatePicker
                  key={ind}
                  type="range"
                  value={filters?.[found?.value]}
                  onChange={(val) =>
                    setFilters((prev) => ({
                      ...prev,
                      [found?.value || ""]: val,
                      filterApplied: !!val,
                    }))
                  }
                />
              ) : found?.type === "text" ? (
                <TextInput
                  key={ind}
                  label={found?.label}
                  placeholder={found?.label}
                  value={filters?.[found?.value || ""] || ""}
                  onChange={(e) => {
                    const val = e.currentTarget.value;
                    setFilters((prev) => ({
                      ...prev,
                      [found?.value || ""]: val,
                      filterApplied: !!val,
                    }));
                  }}
                />
              ) : null;
            })}
          <MultiSelect
            label="More Filters"
            placeholder="More Filters"
            value={filters?.moreFilters || []}
            onChange={(val) => handleChange("moreFilters", val)}
            data={moreFiltersOptions}
            hidePickedOptions
            searchable
            clearable
          />
        </SimpleGrid>
        <Button disabled={!filterNotEmpty && !showClearBtn} type="submit">
          Filter
        </Button>
      </form>
    </Modal>
  );
};

export default FilterModal;
