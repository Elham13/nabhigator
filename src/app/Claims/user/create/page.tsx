"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Button,
  ComboboxItem,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { Text } from "@mantine/core";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
import {
  IDType,
  ILoadings,
  INewCityMaster,
  INewPinCodeMaster,
  IUser,
  IZoneStateMaster,
  ResponseType,
  Role,
  ValueLabel,
} from "@/lib/utils/types/fniDataTypes";
import { usersInitials } from "@/lib/utils/constants";
import {
  claimAmountThresholdOptions,
  leadViewOptionsArray,
  roleOptions,
  yesNoOptions,
  zoneOptions,
} from "@/lib/utils/constants/options";
import { EndPoints } from "@/lib/utils/types/enums";
import { buildUrl, showError } from "@/lib/helpers";
import {
  getCities,
  getDistricts,
  getPinCodes,
  getStates,
} from "@/lib/helpers/getLocations";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";
import { TimeInput } from "@mantine/dates";
import { BsClock } from "react-icons/bs";
import dayjs from "dayjs";

const loadingsInitials: ILoadings = {
  state: false,
  district: false,
  city: false,
  pinCode: false,
};

const UserEdit = () => {
  const isFirstMount = useRef<boolean>(true);
  const fromTimeRef = useRef<HTMLInputElement>(null);
  const toTimeRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<IUser>(usersInitials);
  const [teamLeadOptions, setTeamLeadsOptions] = useState<ValueLabel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [usersMaster, setUsersMaster] = useState<IUser[]>([]);
  const [pinCodeOptions, setPinCodeOptions] = useState<INewPinCodeMaster[]>([]);
  const [cityOptions, setCityOptions] = useState<INewCityMaster[]>([]);
  const [stateOptions, setStateOptions] = useState<IZoneStateMaster[]>([]);
  const [districtOptions, setDistrictOptions] = useState<IDType[]>([]);
  const [loadings, setLoadings] = useState<ILoadings>(loadingsInitials);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name: keyof IUser, value: string | string[] | null) => {
    if (
      name === "role" &&
      Array.isArray(value) &&
      value?.includes(Role.ADMIN)
    ) {
      setValues((prev) => ({ ...prev, role: value as Role[], config: {} }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleZoneChange = (val: string[]) => {
    if (val?.includes("All")) {
      setValues((prev) => ({
        ...prev,
        zone: zoneOptions
          ?.filter((zo: ComboboxItem) => zo.value !== "All")
          ?.map((zo: ComboboxItem) => zo?.value),
        state: ["All"],
        city: "All",
        district: "All",
        pinCode: "All",
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        zone: val,
      }));
    }
  };

  const handleChangeState = (val: string[]) => {
    if (val?.includes("All")) {
      setValues((prev) => ({
        ...prev,
        state: ["All"],
        district: "All",
        city: "All",
        pinCode: "All",
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        state: val,
      }));
    }
  };

  const handleChangeCity = (val: string | null) => {
    if (val === "All") {
      setValues((prev) => ({
        ...prev,
        city: "All",
        district: "All",
        pinCode: "All",
      }));
    }
    setValues((prev) => ({ ...prev, city: val || "" }));
  };

  const handleChangeDistrict = (val: string | null) => {
    if (val === "All") {
      handleSelect("district", "All");
    } else {
      handleSelect("district", val);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...values,
      _id: undefined,
      team: values?.team || undefined,
      zone: zoneOptions
        ?.filter((el: ComboboxItem) => values?.zone?.includes(el?.value))
        ?.map((el: ComboboxItem) => el?.label),
      state:
        values?.state && !values?.state?.includes("All")
          ? stateOptions
              ?.filter((el) => values?.state?.includes(el?.State_code))
              ?.map((el) => el?.State)
          : values?.state,
      city:
        values?.city && !values?.city?.includes("All")
          ? cityOptions?.find((el) => el?.City_code === values?.city)?.Title ||
            ""
          : values?.city,
    };

    try {
      const passwordRegex =
        /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;
      if (!passwordRegex.test(values?.password)) {
        throw new Error(
          "Password must be at least 9 characters, at least one special character, one number, one uppercase letter, and one lowercase letter"
        );
      }

      const { data } = await axios.post(EndPoints.USER, {
        action: "create",
        payload,
      });
      toast.success(data?.message);
      if (typeof window !== undefined) window.location.href = "/Claims/user";
    } catch (error: any) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Getting users master
    const getUsersMaster = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<ResponseType<IUser>>(
          buildUrl(EndPoints.USER_MASTER, { newUsers: "true" })
        );
        setUsersMaster(data?.data);
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    };

    if (isFirstMount.current) {
      getUsersMaster();
    }
    isFirstMount.current = false;
  }, []);

  useEffect(() => {
    if (usersMaster?.length > 0 && values?.userId && !values?._id) {
      const foundUser =
        usersMaster.find((el) => el.userId === values?.userId) || usersInitials;
      setValues(foundUser);

      // Getting TeamLeads
      if (!foundUser?.role?.includes(Role.TL)) {
        const getTeamLeads = async () => {
          setLoadings((prev) => ({ ...prev, leaders: true }));
          try {
            const { data } = await axios.post<ResponseType<IUser>>(
              EndPoints.USER,
              {
                role: Role.TL,
                limit: 1000,
              }
            );
            if (data?.data?.length > 0) {
              setTeamLeadsOptions(
                data?.data?.map((el) => ({ value: el._id, label: el.name }))
              );
            }
          } catch (error) {
            showError(error);
          } finally {
            setLoadings((prev) => ({ ...prev, leaders: false }));
          }
        };
        getTeamLeads();
      }
    }
  }, [values.userId, usersMaster, values?._id]);

  useEffect(() => {
    // Getting states
    if (values?.zone?.length > 0 && !values?.zone?.includes("All")) {
      getStates({
        zoneId: values?.zone,
        getOptions: (options) => setStateOptions(options),
        getLoading: (status) => {
          setLoadings((prev) => ({ ...prev, state: status }));
        },
      });
    }
  }, [values?.zone]);

  useEffect(() => {
    // Getting Cities
    if (values?.state?.length > 0 && !values?.state?.includes("All")) {
      getCities({
        stateCode: values?.state,
        getLoading: (status) =>
          setLoadings((prev) => ({ ...prev, city: status })),
        getOptions: (options) => setCityOptions(options),
      });
    }
  }, [values?.state]);

  useEffect(() => {
    // Getting Districts
    if (
      values?.state?.length > 0 &&
      !values?.state.includes("All") &&
      values?.city &&
      values?.city !== "All"
    ) {
      getDistricts({
        stateCode: values?.state,
        limit: 1000,
        getOptions: (options) => setDistrictOptions(options),
        getLoading: (status) => {
          setLoadings((prev) => ({ ...prev, district: status }));
        },
      });
    }
  }, [values?.state, values?.city]);

  useEffect(() => {
    // Getting PinCodes
    if (values?.city && values?.city !== "All") {
      getPinCodes({
        cityCode: values?.city,
        getLoading: (status) =>
          setLoadings((prev) => ({ ...prev, pinCode: status })),
        getOptions: (options) => setPinCodeOptions(options),
      });
    }
  }, [values?.city]);

  return (
    <PageWrapper title="" showBackBtn>
      <Paper shadow="md" radius="lg">
        <div className="p-4 md:p-8">
          <div className="p-4">
            <Text size="lg" fw={700} mb={10}>
              User information
            </Text>
          </div>

          <form className="p-4" onSubmit={handleSubmit}>
            <Text size="lg" fw={700} mb={10}>
              Creating {values?.name}
            </Text>

            <div className="">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Select
                  label="User Id"
                  placeholder="Select user id"
                  required
                  value={values.userId}
                  name="userId"
                  onChange={(val) => handleSelect("userId", val)}
                  data={usersMaster?.map((el) => el.userId)}
                  checkIconPosition="right"
                  clearable
                  searchable
                />

                {loading ? (
                  <AiOutlineLoading className="animate-spin" size={44} />
                ) : values?._id ? (
                  <>
                    <TextInput
                      label="Name"
                      placeholder="Name"
                      required
                      value={values?.name}
                      name="name"
                      onChange={handleChange}
                      disabled
                    />
                    <MultiSelect
                      label="Role"
                      placeholder="Role"
                      value={values.role}
                      name="role"
                      onChange={(val) => handleSelect("role", val)}
                      data={roleOptions}
                      checkIconPosition="right"
                      clearable
                      searchable
                      hidePickedOptions
                    />
                    <TextInput
                      label="Email"
                      placeholder="hello@nivabupa.dev"
                      required
                      value={values?.email}
                      name="email"
                      onChange={handleChange}
                      disabled
                    />
                    <TextInput
                      label="Phone"
                      placeholder="91********"
                      required
                      value={values?.phone}
                      name="phone"
                      onChange={handleChange}
                      disabled
                    />
                    <TextInput
                      label="Password"
                      placeholder="Password"
                      required
                      value={values?.password}
                      name="password"
                      onChange={handleChange}
                    />

                    <MultiSelect
                      label="Zone"
                      className="w-full"
                      placeholder="User zone"
                      value={values.zone}
                      onChange={handleZoneChange}
                      data={zoneOptions}
                      checkIconPosition="right"
                      searchable
                      hidePickedOptions
                      clearable
                      required
                      withAsterisk
                    />

                    <MultiSelect
                      label="State"
                      placeholder="User state"
                      value={values.state}
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
                      disabled={
                        values?.zone?.length < 1 ||
                        loadings?.state ||
                        values?.zone?.includes("All")
                      }
                    />

                    <div className="flex items-end">
                      <Select
                        label="City"
                        className="w-full"
                        placeholder="City"
                        value={values.city}
                        name="city"
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
                          values?.state?.length < 1 ||
                          values?.state.includes("All") ||
                          loadings.city
                        }
                      />
                      {loadings.city && <Loader size="md" type="dots" />}
                    </div>

                    <div className="flex items-end">
                      <Select
                        label="District"
                        className="w-full"
                        placeholder="District"
                        value={values.district || ""}
                        name="district"
                        data={[
                          "All",
                          ...new Set(
                            districtOptions?.map((el) => el?._id) || []
                          ),
                        ]}
                        checkIconPosition="right"
                        searchable
                        clearable
                        onChange={handleChangeDistrict}
                        disabled={
                          values?.state.includes("All") ||
                          loadings.district ||
                          values?.state?.length < 1
                        }
                      />
                      {loadings.district && <Loader size="md" type="dots" />}
                    </div>

                    <div className="flex items-end">
                      <Select
                        label="PinCode"
                        className="w-full"
                        placeholder="PinCode"
                        value={values.pinCode}
                        name="pinCode"
                        data={[
                          "All",
                          ...pinCodeOptions?.map((el) => el.PIN_CODE),
                        ]}
                        checkIconPosition="right"
                        searchable
                        clearable
                        onChange={(val) => {
                          handleSelect("pinCode", val);
                        }}
                        disabled={
                          values?.state.includes("All") ||
                          !values?.city ||
                          values?.city === "All" ||
                          loadings.pinCode
                        }
                      />
                      {loadings.pinCode && <Loader size="md" type="dots" />}
                    </div>

                    <Select
                      label="User status"
                      placeholder="status"
                      value={values.status}
                      name="status"
                      onChange={(val) => handleSelect("status", val)}
                      data={["Active", "Inactive"]}
                      checkIconPosition="right"
                      clearable
                      required
                      withAsterisk
                    />

                    {!values?.role?.includes(Role.TL) ? (
                      <div className="flex items-end">
                        <Select
                          label="Team Lead"
                          placeholder="Select team lead"
                          className="w-full"
                          value={(values.team as string) || ""}
                          name="team"
                          onChange={(val) => handleSelect("team", val)}
                          data={teamLeadOptions}
                          checkIconPosition="right"
                          searchable
                          clearable
                        />
                        {loadings.leaders && <Loader size="md" type="dots" />}
                      </div>
                    ) : null}

                    <Select
                      label="Claim amount threshold"
                      placeholder="Select Claim amount threshold"
                      required
                      value={values.claimAmountThreshold}
                      name="claimAmountThreshold"
                      onChange={(val) =>
                        handleSelect(
                          "claimAmountThreshold",
                          val as typeof values.claimAmountThreshold
                        )
                      }
                      data={claimAmountThresholdOptions}
                      checkIconPosition="right"
                      clearable
                    />
                    <Select
                      label="Can see Failed cases"
                      placeholder="Select Can see Failed cases"
                      required
                      value={values?.config?.canSeeFailedCases}
                      onChange={(val) =>
                        setValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            canSeeFailedCases: (val as "Yes" | "No") || "No",
                          },
                        }))
                      }
                      data={yesNoOptions}
                      checkIconPosition="right"
                      clearable
                    />
                    <Select
                      label="Trigger Sub type"
                      placeholder="Select Trigger Sub type"
                      required
                      value={values.config?.triggerSubType || ""}
                      onChange={(val) =>
                        setValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            triggerSubType: val as
                              | "Mandatory"
                              | "Non Mandatory",
                          },
                        }))
                      }
                      data={["Mandatory", "Non Mandatory"]}
                      checkIconPosition="right"
                      clearable
                    />
                    {values?.role?.length > 0 &&
                      !values.role?.includes(Role.ADMIN) && (
                        <MultiSelect
                          label="Claim Type"
                          placeholder="Specify the leads which should be visible to him"
                          value={values.config?.leadView}
                          onChange={(val) => {
                            setValues((prev) => ({
                              ...prev,
                              config: { ...prev.config, leadView: val },
                            }));
                          }}
                          data={leadViewOptionsArray}
                          checkIconPosition="right"
                          searchable
                          hidePickedOptions
                          clearable
                        />
                      )}
                    <Select
                      label="User type"
                      placeholder="Select user type"
                      required
                      value={values.userType}
                      name="userType"
                      onChange={(val) =>
                        handleSelect("userType", val as typeof values.userType)
                      }
                      data={["Internal", "External"]}
                      checkIconPosition="right"
                      clearable
                    />
                    <Select
                      label="Can see consolidated inbox"
                      placeholder="Decide whether this user can see the consolidated inbox"
                      required
                      value={values?.config?.canSeeConsolidatedInbox}
                      onChange={(val) =>
                        setValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            canSeeConsolidatedInbox: val as "Yes" | "No",
                          },
                        }))
                      }
                      data={["Yes", "No"]}
                      checkIconPosition="right"
                      clearable
                    />
                    <Select
                      label="Can export consolidated inbox"
                      placeholder="Decide whether this user can export as excel the consolidated inbox"
                      required
                      value={values?.config?.canExportConsolidatedInbox}
                      onChange={(val) =>
                        setValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            canExportConsolidatedInbox: val as "Yes" | "No",
                          },
                        }))
                      }
                      data={["Yes", "No"]}
                      checkIconPosition="right"
                      clearable
                    />
                  </>
                ) : null}
              </SimpleGrid>

              <Group justify="flex-end" mt="md">
                <Button
                  type="submit"
                  className="sm:flex-1"
                  loading={submitting}
                >
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

export default UserEdit;
