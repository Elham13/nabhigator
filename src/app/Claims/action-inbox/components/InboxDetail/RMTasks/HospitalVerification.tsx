import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Form, FormProps } from "antd";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import HospitalVerificationParts from "./HospitalVerificationParts";
import dayjs from "dayjs";
import { IHospitalVerification } from "@/lib/utils/types/rmDataTypes";
import {
  CaseDetail,
  SingleResponseType,
  TPatientHabit,
} from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";

const taskName = "Hospital Verification";

const initialFormValues: IHospitalVerification = {
  dateOfVisitToHospital: null,
  timeOfVisitToHospital: null,
  hospitalInfrastructure: { value: "" },
  providerCooperation: "",
  remarks: "",
};

type PropTypes = {
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const HospitalVerification = ({ caseDetail, setCaseDetail }: PropTypes) => {
  const [form] = Form.useForm<IHospitalVerification>();

  const { refetch: submit, loading } = useAxios<SingleResponseType<CaseDetail>>(
    {
      config: {
        url: EndPoints.CAPTURE_RM_INVESTIGATION_FINDINGS,
        method: "POST",
      },
      dependencyArr: [],
      isMutation: true,
      onDone: (res) => {
        toast.success(res.message);
        setCaseDetail(res?.data);
      },
    }
  );

  const handleSave: FormProps<IHospitalVerification>["onFinish"] = async (
    values
  ) => {
    const payload: IHospitalVerification = {
      ...values,
      personalOrSocialHabits:
        values?.tempHabits && values?.tempHabits?.length > 0
          ? values?.personalOrSocialHabits?.map((el, ind) => ({
              ...el,
              habit: values?.tempHabits?.[ind] || "",
            }))
          : [],
      pedOrNonDisclosure: {
        ...values?.pedOrNonDisclosure,
        value: values?.pedOrNonDisclosure?.value || "",
        ailmentDetail:
          values?.pedOrNonDisclosure?.ailmentDetail &&
          values?.pedOrNonDisclosure?.ailmentDetail?.length > 0
            ? values?.pedOrNonDisclosure?.ailmentDetail?.map((el, ind) => ({
                ...el,
                ailment: values?.tempAilments?.[ind] || "",
              }))
            : [],
      },
    };

    delete payload?.tempHabits;
    delete payload?.tempAilments;

    submit({ payload, id: caseDetail?._id, name: taskName });
  };

  const handleValuesChange = (
    changedValues: any,
    values: IHospitalVerification
  ) => {
    if (Object?.keys(changedValues)?.[0] === "tempAilments") {
      form?.setFieldValue(
        ["pedOrNonDisclosure", "ailmentDetail"],
        changedValues?.tempAilments?.map((el: string) => ({
          ailment: el,
          diagnosis: "",
          duration: "",
          onMedication: "",
        }))
      );
    }

    if (Object?.keys(changedValues)?.[0] === "tempHabits") {
      const newHabits: TPatientHabit[] = changedValues.tempHabits?.includes(
        "NA"
      )
        ? [{ habit: "NA", duration: "", frequency: "", quantity: "" }]
        : changedValues?.tempHabits?.map((el: string) => ({
            habit: el,
            duration: "",
            frequency: "",
            quantity: "",
          }));

      form.setFieldValue("personalOrSocialHabits", newHabits);
    }
  };

  useEffect(() => {
    const addDefaultValues = (
      values: Record<string, any>,
      prevKey?: string[]
    ) => {
      Object.entries(values).map(([key, value]: any) => {
        if (key === "pedOrNonDisclosure" && value?.ailmentDetail?.length > 0) {
          form.setFieldValue(key, value);
          form.setFieldValue(
            "tempAilments",
            value?.ailmentDetail?.map((el: any) => el?.ailment)
          );
        } else if (Array.isArray(value)) {
          if (key === "personalOrSocialHabits" && value?.length > 0) {
            form.setFieldValue(
              "tempHabits",
              value?.map((el) => el?.habit)
            );
            form.setFieldValue(key, value);
          } else {
            const keys = [key];
            if (prevKey && prevKey.length > 0) keys.unshift(...prevKey);
            form.setFieldValue(keys, value);
          }
        } else if (!!value && typeof value === "object") {
          const tempKey = [key];
          if (prevKey && prevKey.length > 0) tempKey.unshift(...prevKey);
          addDefaultValues(value, tempKey);
        } else if (isNaN(value) && dayjs(new Date(value)).isValid()) {
          const keys = [key];
          if (prevKey && prevKey.length > 0) keys.unshift(...prevKey);
          form.setFieldValue(keys, dayjs(value));
        } else {
          const keys = [key];
          if (prevKey && prevKey.length > 0) keys.unshift(...prevKey);
          form.setFieldValue(keys, value);
        }
      });
    };

    if (caseDetail?.rmFindings?.[taskName]) {
      const obj = caseDetail?.rmFindings?.[taskName];
      addDefaultValues(obj);
    }
  }, [caseDetail?.rmFindings, form]);

  return (
    <FormContainer<IHospitalVerification>
      form={form}
      handleSave={handleSave}
      submitting={loading}
      values={initialFormValues}
      formName={taskName}
      onValuesChange={handleValuesChange}
    >
      <HospitalVerificationParts form={form} />
    </FormContainer>
  );
};

export default HospitalVerification;
