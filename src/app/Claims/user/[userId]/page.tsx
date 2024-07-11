"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  TextInput,
  Title,
} from "@mantine/core";
import { Text } from "@mantine/core";
import { useParams } from "next/navigation";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
import UserEditForm from "./components/UserEditForm";
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
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import {
  claimAmountThresholdOptions,
  leadViewOptionsArray,
  roleOptions,
  yesNoOptions,
  zoneOptions,
} from "@/lib/utils/constants/options";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { usersInitials } from "@/lib/utils/constants";
import { showError } from "@/lib/helpers";
import {
  getCities,
  getDistricts,
  getPinCodes,
  getStates,
} from "@/lib/helpers/getLocations";
import PageWrapper from "@/components/ClaimsComponents/PageWrapper";
import { BsClock } from "react-icons/bs";
import { TimeInput } from "@mantine/dates";
import dayjs from "dayjs";

const loadingsInitials: ILoadings = {
  state: false,
  district: false,
  city: false,
  pinCode: false,
};

const UserEdit = () => {
  const params = useParams();
  const isFirstMount = useRef<boolean>(true);
  const fromTimeRef = useRef<HTMLInputElement>(null);
  const toTimeRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useLocalStorage<IUserFromSession | null>({
    key: StorageKeys.USER,
  });
  const [values, setValues] = useState<IUser>(usersInitials);
  const [teamLeadOptions, setTeamLeadsOptions] = useState<ValueLabel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [usersMaster, setUsersMaster] = useState<IUser[]>([]);
  const [updatedValues, setUpdatedValues] = useState<Partial<IUser>>({});
  const [pinCodeOptions, setPinCodeOptions] = useState<INewPinCodeMaster[]>([]);
  const [cityOptions, setCityOptions] = useState<INewCityMaster[]>([]);
  const [stateOptions, setStateOptions] = useState<IZoneStateMaster[]>([]);
  const [districtOptions, setDistrictOptions] = useState<IDType[]>([]);
  const [loadings, setLoadings] = useState<ILoadings>(loadingsInitials);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedValues((prev) => ({ ...prev, [name]: value }));
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name: keyof IUser, value: string | string[] | null) => {
    if (
      name === "role" &&
      Array.isArray(value) &&
      value?.includes(Role.ADMIN)
    ) {
      setUpdatedValues((prev) => ({
        ...prev,
        role: value as Role[],
        config: {},
      }));

      setValues((prev) => ({ ...prev, role: value as Role[], config: {} }));
    } else {
      setUpdatedValues((prev) => ({ ...prev, [name]: value }));
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleZoneChange = (val: string[]) => {
    if (val?.includes("All")) {
      setValues((prev) => ({
        ...prev,
        zone: zoneOptions
          ?.filter((zo) => zo.value !== "All")
          ?.map((zo) => zo?.value),
        state: ["All"],
        district: "All",
        city: "All",
        pinCode: "All",
      }));
      setUpdatedValues((prev) => ({
        ...prev,
        zone: zoneOptions
          ?.filter((zo) => zo.value !== "All")
          ?.map((zo) => zo?.label),
        state: ["All"],
        district: "All",
        city: "All",
        pinCode: "All",
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        zone: val,
      }));
      setUpdatedValues((prev) => ({
        ...prev,
        zone: zoneOptions
          ?.filter((el) => val?.includes(el?.value))
          ?.map((el) => el?.label),
      }));
    }
  };

  const handleChangeState = (val: string[]) => {
    if (val?.includes("All")) {
      setUpdatedValues((prev) => ({
        ...prev,
        state: ["All"],
        district: "All",
        city: "All",
        pinCode: "All",
      }));
      setValues((prev) => ({
        ...prev,
        state: ["All"],
        district: "All",
        city: "All",
        pinCode: "All",
      }));
    } else {
      setUpdatedValues((prev) => ({
        ...prev,
        state: stateOptions
          ?.filter((el) => val?.includes(el?.State_code))
          ?.map((el) => el?.State),
      }));
      setValues((prev) => ({
        ...prev,
        state: val,
      }));
    }
  };

  const handleChangeCity = (val: string | null) => {
    if (val === "All") {
      setUpdatedValues((prev) => ({
        ...prev,
        city: "All",
        district: "All",
        pinCode: "All",
      }));
      setValues((prev) => ({
        ...prev,
        city: "All",
        district: "All",
        pinCode: "All",
      }));
    }
    setUpdatedValues((prev) => ({
      ...prev,
      city: cityOptions?.find((el) => el?.City_code === val)?.Title || "",
    }));
    setValues((prev) => ({ ...prev, city: val || "" }));
  };

  const handleChangeDistrict = (val: string | null) => {
    if (val === "All") {
      setUpdatedValues((prev) => ({
        ...prev,
        district: "All",
      }));
      handleSelect("district", "All");
    } else {
      setUpdatedValues((prev) => ({
        ...prev,
        district: val || "",
      }));
      handleSelect("district", val);
    }
  };

  const handleChangePinCode = (val: string | null) => {
    setUpdatedValues((prev) => ({
      ...prev,
      pinCode: val || "",
    }));
    setValues((prev) => ({
      ...prev,
      pinCode: val || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const updatePayload = {
      _id: values._id,
      ...updatedValues,
    };

    try {
      const passwordRegex =
        /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;
      if (
        updatePayload?.password &&
        !passwordRegex.test(updatePayload?.password)
      ) {
        throw new Error(
          "Password must be at least 9 characters, at least one special character, one number, one uppercase letter, and one lowercase letter"
        );
      }

      const { data } = await axios.post(EndPoints.USER, {
        action: "edit",
        payload: updatePayload,
      });
      if (user?._id === data?.data?._id) setUser(data?.data);
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
          `${EndPoints.USER_MASTER}`
        );
        setUsersMaster(data?.data);
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    };

    // Getting TeamLeads
    const getTeamLead = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post<ResponseType<IUser>>(EndPoints.USER, {
          role: Role.TL,
          limit: 1000,
        });
        if (data?.data?.length > 0) {
          setTeamLeadsOptions(
            data?.data?.map((el) => ({ value: el._id, label: el.name }))
          );
        }
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    };

    if (isFirstMount.current) {
      getUsersMaster();
      getTeamLead();
    }
    isFirstMount.current = false;
  }, []);

  useEffect(() => {
    setValues((prev) => ({ ...prev, userId: params?.userId as string }));
  }, [params?.userId]);

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

  if (!params?.userId) {
    return (
      <PageWrapper title="User Id not found!">
        <Title order={2} mt={20} ta="center" c="red">
          User Id not found!
        </Title>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="" showBackBtn>
      <Paper shadow="md" radius="lg">
        <div className="p-4 md:p-8">
          <div className="p-4">
            <Text size="lg" fw={700} mb={10}>
              User information
            </Text>

            <UserEditForm
              userId={values?.userId}
              getUserId={(id) => setValues((prev) => ({ ...prev, _id: id }))}
            />
          </div>

          <form className="p-4" onSubmit={handleSubmit}>
            <Text size="lg" fw={700} mb={10}>
              Editing {values?.name}
            </Text>

            <div className="">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Select
                  label="User Id"
                  placeholder="Select user id"
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
                ) : values?.userId ? (
                  <>
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
                      label="Password"
                      placeholder="Password"
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
                        onChange={handleChangePinCode}
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
                    />
                    <Select
                      label="Team Lead"
                      placeholder="Select team lead"
                      value={(values.team as string) || ""}
                      name="team"
                      onChange={(val) => handleSelect("team", val)}
                      data={teamLeadOptions}
                      checkIconPosition="right"
                      searchable
                      clearable
                    />
                    <Select
                      label="Claim amount threshold"
                      placeholder="Select Claim amount threshold"
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
                        setUpdatedValues((prev) => ({
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
                    <MultiSelect
                      label="Claim Type"
                      placeholder="Specify the leads which should be visible to him"
                      value={values.config?.leadView}
                      onChange={(val) => {
                        setUpdatedValues((prev) => ({
                          ...prev,
                          config: { ...prev.config, leadView: val },
                        }));
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
                    <TimeInput
                      label="Report received time From"
                      ref={fromTimeRef}
                      rightSection={
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => fromTimeRef.current?.showPicker()}
                        >
                          <BsClock />
                        </ActionIcon>
                      }
                      onChange={(e) => {
                        setUpdatedValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            reportReceivedTime: {
                              ...prev.config?.reportReceivedTime,
                              from: dayjs(e.target.value, "hh:mm").toDate(),
                            },
                          },
                        }));
                      }}
                    />
                    <TimeInput
                      label="Report received time To"
                      ref={toTimeRef}
                      rightSection={
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => toTimeRef.current?.showPicker()}
                        >
                          <BsClock />
                        </ActionIcon>
                      }
                      onChange={(e) =>
                        setUpdatedValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            reportReceivedTime: {
                              ...prev.config?.reportReceivedTime,
                              to: dayjs(e.target.value, "hh:mm").toDate(),
                            },
                          },
                        }))
                      }
                    />
                    <NumberInput
                      label="Daily threshold"
                      onChange={(val) =>
                        setUpdatedValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            dailyThreshold: val as number,
                          },
                        }))
                      }
                    />
                    <Select
                      label="User type"
                      placeholder="Select user type"
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
                      value={values?.config?.canSeeConsolidatedInbox}
                      onChange={(val) => {
                        setValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            canSeeConsolidatedInbox: val as "Yes" | "No",
                          },
                        }));
                        setUpdatedValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            canSeeConsolidatedInbox: val as "Yes" | "No",
                          },
                        }));
                      }}
                      data={["Yes", "No"]}
                      checkIconPosition="right"
                      clearable
                    />
                    <Select
                      label="Trigger Sub type"
                      placeholder="Select Trigger Sub type"
                      value={values.config?.triggerSubType || ""}
                      onChange={(val) => {
                        setValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            triggerSubType: val as
                              | "Mandatory"
                              | "Non Mandatory",
                          },
                        }));
                        setUpdatedValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            triggerSubType: val as
                              | "Mandatory"
                              | "Non Mandatory",
                          },
                        }));
                      }}
                      data={["Mandatory", "Non Mandatory"]}
                      checkIconPosition="right"
                      clearable
                    />
                    <Select
                      label="Can export consolidated inbox"
                      placeholder="Decide whether this user can export as excel the consolidated inbox"
                      value={values?.config?.canExportConsolidatedInbox}
                      onChange={(val) => {
                        setValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            canExportConsolidatedInbox: val as "Yes" | "No",
                          },
                        }));
                        setUpdatedValues((prev) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            canExportConsolidatedInbox: val as "Yes" | "No",
                          },
                        }));
                      }}
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
