"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  TextInput,
  Text,
  Title,
  MultiSelect,
  Loader,
  ComboboxData,
  ActionIcon,
} from "@mantine/core";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { DateInput } from "@mantine/dates";
import { useDebouncedValue } from "@mantine/hooks";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FiMinusCircle } from "react-icons/fi";
import {
  HospitalProviderDetail,
  IDType,
  ILoadings,
  INewCityMaster,
  INewPinCodeMaster,
  IUserSearchValues,
  IZoneStateMaster,
  Investigator,
  ResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { EndPoints } from "@/lib/utils/types/enums";
import {
  buildUrl,
  dateParser,
  removeEmptyProperties,
  showError,
} from "@/lib/helpers";
import {
  getCities,
  getDistricts,
  getPinCodes,
  getStates,
} from "@/lib/helpers/getLocations";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";

const typeOptions = [
  { value: "Internal", label: "Internal" },
  { value: "External", label: "External" },
];

const modeOptions = [
  { value: "Specialized", label: "Specialized" },
  { value: "Mixed", label: "Mixed" },
];

const assignmentOptions = [
  "All",
  "PreAuth",
  "Reimbursement",
  "Personal Accident",
  "Critical Illness",
  "AHC",
  "HDC",
  "Spot",
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const roleOptions = [
  { value: "Leader", label: "Leader" },
  { value: "TeamMate", label: "Team Mate" },
];

const usersInitials: Investigator = {
  _id: "",
  phone: "",
  email: ["test@gmail.com"],
  password: "",
  investigatorName: "",
  investigatorCode: "",
  Type: "Internal",
  Mode: "",
  assignmentPreferred: [],
  dailyThreshold: 0,
  monthlyThreshold: 0,
  dailyAssign: 0,
  monthlyAssigned: 0,
  userStatus: "",
  hitRate: 0,
  TAT: 0,
  performance: 0,
  cities: [],
  states: [],
  district: [],
  pinCodes: [],
  providers: [],
  updatedDate: new Date(),
  updates: { expedition: [] },
  createdAt: "",
  updatedAt: "",
  failedAttempts:0,
  blockedUntil:0
};

const searchValuesInitials: IUserSearchValues = {
  pinCode: "",
  city: "",
  district: "",
  state: "",
  providers: "",
  leaders: "",
};

const loadingsInitials: ILoadings = {
  state: false,
  district: false,
  city: false,
  pinCode: false,
  provider: false,
  leaders: false,
};

const InvestigatorCreateEdit = () => {
  const router = useRouter();
  const isFirstMount = useRef<boolean>(true);
  const params = useParams();
  const [values, setValues] = useState<Investigator>(usersInitials);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadings, setLoadings] = useState<ILoadings>(loadingsInitials);
  const [cityOptions, setCityOptions] = useState<INewCityMaster[]>([]);
  const [providersOptions, setProvidersOptions] = useState<string[]>([]);
  const [stateOptions, setStateOptions] = useState<IZoneStateMaster[]>([]);
  const [districtOptions, setDistrictOptions] = useState<IDType[]>([]);
  const [pinCodeOptions, setPinCodeOptions] = useState<INewPinCodeMaster[]>([]);
  const [leadersOptions, setLeadersOptions] = useState<ComboboxData>([]);
  const [searchValues, setSearchValues] =
    useState<IUserSearchValues>(searchValuesInitials);
  const [debouncedDist] = useDebouncedValue(searchValues?.district, 300);
  const [debouncedProvider] = useDebouncedValue(searchValues?.providers, 300);
  const [debouncedLeader] = useDebouncedValue(searchValues?.leaders, 300);
  const action = params?.id === "create" ? "create" : "edit";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (
    val: number | string,
    name: keyof Investigator
  ) => {
    setValues((prev) => ({ ...prev, [name]: val }));
  };

  const handleSelect = (
    name: keyof Investigator,
    value: string | string[] | null
  ) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeState = (val: string[]) => {
    if (val?.includes("All")) {
      handleSelect("states", ["All"]);
      handleSelect("district", ["All"]);
      handleSelect("cities", ["All"]);
      handleSelect("pinCodes", ["All"]);
    } else {
      handleSelect("states", val);
    }
  };

  const handleChangeCity = (val: string[]) => {
    if (val?.includes("All")) {
      handleSelect("cities", ["All"]);
      handleSelect("district", ["All"]);
      handleSelect("pinCodes", ["All"]);
    }
    handleSelect("cities", val);
  };

  const handleChangeDistrict = (val: string[]) => {
    if (val?.includes("All")) {
      handleSelect("district", ["All"]);
      handleSelect("pinCodes", ["All"]);
    } else {
      handleSelect("district", val);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...values,
      _id: action === "edit" ? values._id : undefined,
    };
    try {
      if (action === "create") {
        const passwordRegex =
          /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;
        if (!passwordRegex.test(values?.password)) {
          throw new Error(
            "Password must be at least 9 characters, at least one special character, one number, one uppercase letter, and one lowercase letter"
          );
        }
      }

      const { data } = await axios.put(EndPoints.INVESTIGATORS, {
        action,
        payload: removeEmptyProperties(payload),
      });
      toast.success(data?.message);
      router.replace("/Claims/investigators");
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Getting states
    if (isFirstMount?.current) {
      getStates({
        getOptions: (options) => setStateOptions(options),
        getLoading: (status) => {
          setLoadings((prev) => ({ ...prev, state: status }));
        },
      });
    }
    isFirstMount.current = false;
  }, []);

  useEffect(() => {
    const getValues = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${EndPoints.INVESTIGATORS}?id=${params?.id}`
        );
        setValues(data?.data);
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id && action === "edit") {
      getValues();
    }
  }, [params?.id, action]);

  useEffect(() => {
    const getProviders = async () => {
      setLoadings((prev) => ({ ...prev, provider: true }));
      try {
        const { data } = await axios.get<ResponseType<HospitalProviderDetail>>(
          buildUrl(EndPoints.HOSPITAL_PROVIDER, {
            limit: 10,
            name: debouncedProvider,
          })
        );
        setProvidersOptions(data?.data?.map((el) => el?.providerName));
      } catch (error: any) {
        showError(error);
      } finally {
        setLoadings((prev) => ({ ...prev, provider: false }));
      }
    };

    getProviders();
  }, [debouncedProvider]);

  useEffect(() => {
    // Getting Districts
    if (
      values?.states?.length > 0 &&
      !values?.states.includes("All") &&
      values?.cities &&
      !values?.cities?.includes("All")
    ) {
      getDistricts({
        stateCode: values?.states,
        districtName: debouncedDist,
        limit: 100,
        getOptions: (options) => setDistrictOptions(options),
        getLoading: (status) => {
          setLoadings((prev) => ({ ...prev, district: status }));
        },
      });
    }
  }, [debouncedDist, values?.states, values?.cities]);

  useEffect(() => {
    // Getting Cities
    if (values?.states?.length > 0 && !values?.states?.includes("All")) {
      getCities({
        stateCode: values?.states,
        getLoading: (status) =>
          setLoadings((prev) => ({ ...prev, city: status })),
        getOptions: (options) => setCityOptions(options),
      });
    }
  }, [values?.states]);

  useEffect(() => {
    // Getting PinCodes
    if (values?.cities && !values?.cities?.includes("All")) {
      getPinCodes({
        cityCode: values?.cities,
        getLoading: (status) =>
          setLoadings((prev) => ({ ...prev, pinCode: status })),
        getOptions: (options) => setPinCodeOptions(options),
      });
    }
  }, [values?.cities]);

  useEffect(() => {
    const getLeaders = async () => {
      setLoadings((prev) => ({ ...prev, leaders: true }));
      try {
        const { data } = await axios.post<ResponseType<Investigator>>(
          EndPoints.EXTERNAL_INV_LIST,
          { name: debouncedLeader }
        );
        setLeadersOptions(
          data?.data?.map((el) => ({
            label: el?.investigatorName,
            value: el?._id,
          }))
        );
      } catch (error) {
        showError(error);
      } finally {
        setLoadings((prev) => ({ ...prev, leaders: false }));
      }
    };
    if (!isFirstMount.current && values?.role === "TeamMate") {
      getLeaders();
    }
  }, [values?.role, debouncedLeader]);

  if (!params?.id) {
    return (
      <PageWrapper title="Something went wrong">
        <Title order={2} mt={20} ta="center" c="red">
          Something went wrong
        </Title>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Investigators Details">
      <Paper shadow="md" radius="lg">
        <div className="p-4 md:p-8">
          <form className="p-4" onSubmit={handleSubmit} autoComplete="off">
            <Text size="lg" fw={700} mb={10}>
              {action === "edit" ? "Editing" : "Creating"}{" "}
              {values?.investigatorName}
            </Text>

            <div className="">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  label="Name"
                  placeholder="Investigator name"
                  required
                  value={values?.investigatorName || ""}
                  name="investigatorName"
                  onChange={handleChange}
                  withAsterisk
                />
                <TextInput
                  label="Phone"
                  placeholder="Investigator phone"
                  required
                  value={values?.phone || ""}
                  name="phone"
                  onChange={handleChange}
                />
                {values?.email?.length > 0
                  ? values?.email?.map((mail, ind) => (
                      <div key={ind} className="flex items-end gap-x-2">
                        <TextInput
                          className="w-full"
                          label="Email"
                          placeholder="Investigator email"
                          required
                          value={mail || ""}
                          name="email"
                          onChange={(e) => {
                            const val = e.target.value;
                            const email = [...values.email];
                            email[ind] = val;

                            setValues((prev) => ({ ...prev, email }));
                          }}
                          withAsterisk
                        />
                        {values?.Type === "External" &&
                        values?.role === "Leader" ? (
                          <>
                            <ActionIcon
                              variant="outline"
                              title="Add"
                              onClick={() =>
                                setValues((prev) => ({
                                  ...prev,
                                  email: [...prev.email, "changeMe@gmail.com"],
                                }))
                              }
                            >
                              <IoIosAddCircleOutline />
                            </ActionIcon>
                            <ActionIcon
                              variant="outline"
                              color="red"
                              title="Remove"
                              onClick={() => {
                                const email = [...values?.email];
                                email.splice(ind, 1);
                                setValues((prev) => ({ ...prev, email }));
                              }}
                            >
                              <FiMinusCircle />
                            </ActionIcon>
                          </>
                        ) : null}
                      </div>
                    ))
                  : null}
                <TextInput
                  label="Code"
                  placeholder="Investigator code"
                  required
                  value={values?.investigatorCode || ""}
                  name="investigatorCode"
                  onChange={handleChange}
                  withAsterisk
                />
                <TextInput
                  label="Password"
                  placeholder="Investigator password"
                  required={action === "create"}
                  value={values?.password || ""}
                  name="password"
                  onChange={handleChange}
                />
                <Select
                  label="Type"
                  placeholder="Investigator Type"
                  required
                  value={values.Type || ""}
                  name="Type"
                  onChange={(val) => handleSelect("Type", val)}
                  data={typeOptions}
                  checkIconPosition="right"
                  clearable
                  withAsterisk
                />

                {values?.Type === "External" ? (
                  <>
                    <Select
                      label="Role"
                      placeholder="Investigator Role"
                      required
                      value={values.role || ""}
                      name="role"
                      onChange={(val) => handleSelect("role", val)}
                      data={roleOptions}
                      checkIconPosition="right"
                      clearable
                      withAsterisk
                    />
                    {values?.role === "TeamMate" ? (
                      <div className="flex items-end">
                        <Select
                          label="Leader"
                          className="w-full"
                          placeholder="Who is your leader?"
                          required
                          value={values.leader || ""}
                          name="leader"
                          onChange={(val) => handleSelect("leader", val)}
                          data={leadersOptions}
                          checkIconPosition="right"
                          clearable
                          withAsterisk
                          searchable
                          searchValue={searchValues?.leaders}
                          onSearchChange={(val) =>
                            setSearchValues((prev) => ({
                              ...prev,
                              leaders: val,
                            }))
                          }
                          disabled={loadings?.leaders}
                        />
                        {loadings.leaders && <Loader size="md" type="dots" />}
                      </div>
                    ) : null}
                  </>
                ) : null}

                <Select
                  label="Mode"
                  placeholder="Investigator Mode"
                  value={values.Mode || ""}
                  name="Mode"
                  onChange={(val) => handleSelect("Mode", val)}
                  data={modeOptions}
                  checkIconPosition="right"
                  clearable
                />
                <MultiSelect
                  label="Assignment Preferred"
                  placeholder="Assignment Preferred"
                  value={values.assignmentPreferred || []}
                  onChange={(val) => {
                    if (val?.includes("All")) {
                      setValues((prev) => ({
                        ...prev,
                        assignmentPreferred: assignmentOptions.slice(1),
                      }));
                    } else {
                      setValues((prev) => ({
                        ...prev,
                        assignmentPreferred: val,
                      }));
                    }
                  }}
                  data={assignmentOptions}
                  checkIconPosition="right"
                  searchable
                  hidePickedOptions
                  clearable
                />

                <div className="flex items-end">
                  <MultiSelect
                    label="Provider"
                    className="w-full"
                    placeholder="Investigator Provider"
                    value={values.providers || []}
                    name="providers"
                    onChange={(val) => handleSelect("providers", val)}
                    data={providersOptions}
                    checkIconPosition="right"
                    searchable
                    clearable
                    hidePickedOptions
                    searchValue={searchValues?.providers}
                    onSearchChange={(val) =>
                      setSearchValues((prev) => ({ ...prev, providers: val }))
                    }
                    disabled={loadings?.provider}
                  />
                  {loadings.provider && <Loader size="md" type="dots" />}
                </div>

                <MultiSelect
                  label="State"
                  placeholder="User state"
                  value={values.states}
                  onChange={handleChangeState}
                  data={[
                    "All",
                    ...stateOptions?.map((el) => ({
                      value: el?.State_code,
                      label: el?.State,
                    })),
                  ]}
                  checkIconPosition="right"
                  searchable
                  hidePickedOptions
                  clearable
                  required
                  withAsterisk
                  disabled={loadings?.state}
                />

                <div className="flex items-end">
                  <MultiSelect
                    label="City"
                    className="w-full"
                    placeholder="City"
                    value={values.cities}
                    data={[
                      "All",
                      ...cityOptions?.map((el) => ({
                        value: el?.City_code,
                        label: el?.Title,
                      })),
                    ]}
                    checkIconPosition="right"
                    searchable
                    clearable
                    onChange={handleChangeCity}
                    disabled={
                      values?.states?.length < 1 ||
                      values?.states.includes("All") ||
                      loadings.city
                    }
                  />
                  {loadings.city && <Loader size="md" type="dots" />}
                </div>

                <div className="flex items-end">
                  <MultiSelect
                    label="District"
                    className="w-full"
                    placeholder="District"
                    value={values.district || ""}
                    name="district"
                    data={[
                      "All",
                      ...new Set(districtOptions?.map((el) => el?._id) || []),
                    ]}
                    checkIconPosition="right"
                    searchable
                    clearable
                    onChange={handleChangeDistrict}
                    onSearchChange={(val) =>
                      setSearchValues((prev) => ({
                        ...prev,
                        district: val,
                      }))
                    }
                    searchValue={searchValues?.district}
                    disabled={
                      values?.states.includes("All") ||
                      loadings.district ||
                      values?.states?.length < 1
                    }
                  />
                  {loadings.district && <Loader size="md" type="dots" />}
                </div>

                <div className="flex items-end">
                  <MultiSelect
                    label="PinCode"
                    className="w-full"
                    placeholder="PinCode"
                    value={values.pinCodes}
                    name="pinCodes"
                    data={["All", ...pinCodeOptions?.map((el) => el.PIN_CODE)]}
                    checkIconPosition="right"
                    searchable
                    clearable
                    onChange={(val) => {
                      handleSelect("pinCodes", val);
                    }}
                    disabled={
                      values?.states.includes("All") ||
                      !values?.cities ||
                      values?.cities?.includes("All") ||
                      loadings.pinCode
                    }
                  />
                  {loadings.pinCode && <Loader size="md" type="dots" />}
                </div>
                <NumberInput
                  label="Daily Threshold"
                  placeholder="Investigator Daily Threshold"
                  required
                  value={values.dailyThreshold || 0}
                  name="dailyThreshold"
                  onChange={(val) => handleNumberChange(val, "dailyThreshold")}
                  allowNegative={false}
                  withAsterisk
                />
                <NumberInput
                  label="Monthly Threshold"
                  placeholder="Investigator Monthly Threshold"
                  required
                  withAsterisk
                  value={values.monthlyThreshold || 0}
                  name="monthlyThreshold"
                  onChange={(val) =>
                    handleNumberChange(val, "monthlyThreshold")
                  }
                  allowNegative={false}
                />

                {action !== "create" && (
                  <>
                    {values.dailyThreshold > 0 && (
                      <NumberInput
                        label="Daily Assign"
                        placeholder="Investigator Daily Assign"
                        value={values.dailyAssign || 0}
                        name="dailyAssign"
                        onChange={(val) =>
                          handleNumberChange(val, "dailyAssign")
                        }
                        allowNegative={false}
                        max={values.dailyThreshold}
                        clampBehavior="strict"
                      />
                    )}
                    {values.monthlyThreshold > 0 && (
                      <NumberInput
                        label="Monthly Assign"
                        placeholder="Investigator Monthly Assign"
                        value={values.monthlyAssigned || 0}
                        name="monthlyAssigned"
                        onChange={(val) =>
                          handleNumberChange(val, "monthlyAssigned")
                        }
                        allowNegative={false}
                        max={values.monthlyThreshold}
                        clampBehavior="strict"
                      />
                    )}
                  </>
                )}
                <Select
                  label="User status"
                  placeholder="Investigators Status"
                  value={values.userStatus || ""}
                  required
                  withAsterisk
                  name="userStatus"
                  onChange={(val) => handleSelect("userStatus", val)}
                  data={statusOptions}
                  checkIconPosition="right"
                  clearable
                />
                {values?.userStatus === "inactive" && (
                  <>
                    <TextInput
                      label="Inactive Reason"
                      placeholder="Inactive Reason"
                      value={values?.inactiveReason || ""}
                      name="inactiveReason"
                      onChange={handleChange}
                    />
                    <DateInput
                      dateParser={dateParser}
                      valueFormat="DD/MM/YYYY"
                      label="Inactive From"
                      placeholder="Inactive From"
                      value={(values.inactiveFrom as Date) || null}
                      onChange={(val) =>
                        setValues((prev) => ({ ...prev, inactiveFrom: val }))
                      }
                    />
                    <DateInput
                      dateParser={dateParser}
                      valueFormat="DD/MM/YYYY"
                      label="Inactive To"
                      placeholder="Inactive To"
                      value={(values.inactiveTo as Date) || null}
                      onChange={(val) =>
                        setValues((prev) => ({ ...prev, inactiveTo: val }))
                      }
                    />
                  </>
                )}
              </SimpleGrid>

              <Group justify="flex-end" mt="md">
                <Button type="submit" className="sm:flex-1" loading={loading}>
                  Confirm
                </Button>
              </Group>
            </div>
          </form>
        </div>
      </Paper>
    </PageWrapper>
  );
};

export default InvestigatorCreateEdit;
