import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Form, FormProps } from "antd";
import { toast } from "react-toastify";
import FormContainer from "./CommonForm/FormContainer";
import InsuredVerificationParts from "./InsuredVerificationParts";
import dayjs from "dayjs";
import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";
import {
  CaseDetail,
  IDashboardData,
  SingleResponseType,
  TPatientHabit,
} from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";

const taskName = "Insured Verification";

const initialFormValues: IInsuredVerification = {
  insuredVisit: "",
  verificationSummary: "",
};

type PropTypes = {
  data: IDashboardData | null;
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const InsuredVerification = ({
  data,
  caseDetail,
  setCaseDetail,
}: PropTypes) => {
  const [form] = Form.useForm<IInsuredVerification>();

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

  const handleSave: FormProps<IInsuredVerification>["onFinish"] = async (
    values
  ) => {
    const payload: IInsuredVerification = {
      ...values,
      reasonOfInsuredNotVisit: values?.reasonOfInsuredNotVisit
        ? {
            ...values?.reasonOfInsuredNotVisit,
            proof:
              values?.reasonOfInsuredNotVisit?.proof &&
              values?.reasonOfInsuredNotVisit?.proof?.length > 0
                ? values?.reasonOfInsuredNotVisit?.proof?.filter(Boolean)
                : [],
          }
        : undefined,
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
    values: IInsuredVerification
  ) => {
    const amountKeys: string[] = [
      "medicinesDetail",
      "medicinesDetail",
      "amountPaidToHospital",
      "amountPaidForDiagnosticTests",
      "anyOtherAmountPaid",
    ];

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

    if (amountKeys?.includes(Object.keys(changedValues)?.[0])) {
      const costOfMedicineBill = parseInt(
        values?.medicinesDetail?.costOfMedicineBill
          ? values?.medicinesDetail?.costOfMedicineBill?.toString()
          : "0"
      );
      const amountRefunded = parseInt(
        values?.medicinesDetail?.amountRefunded
          ? values?.medicinesDetail?.amountRefunded?.toString()
          : "0"
      );
      const amountPaidToHospital = parseInt(
        values?.amountPaidToHospital?.value
          ? values?.amountPaidToHospital?.value?.toString()
          : "0"
      );
      const amountPaidForDiagnosticTests = parseInt(
        values?.amountPaidForDiagnosticTests?.value
          ? values?.amountPaidForDiagnosticTests?.value?.toString()
          : "0"
      );
      const anyOtherAmountPaid = parseInt(
        values?.anyOtherAmountPaid?.amount
          ? values?.anyOtherAmountPaid?.amount?.toString()
          : "0"
      );

      const total =
        costOfMedicineBill +
        amountPaidToHospital +
        amountPaidForDiagnosticTests +
        anyOtherAmountPaid -
        amountRefunded;

      form.setFieldValue("totalAmountPaid", total?.toString());
    }
  };

  useEffect(() => {
    if (data?.insuredDetails?.insuredName) {
      const name = data?.insuredDetails?.insuredName;
      form.setFieldValue("nameOfPatientSystem", name);
      form.setFieldValue("nameOfPatientUser", name);
    }
    if (data?.insuredDetails?.age) {
      const age = data?.insuredDetails?.age;
      form.setFieldValue("ageOfPatientSystem", age);
      form.setFieldValue("ageOfPatientUser", age);
    }
    if (data?.insuredDetails?.gender) {
      const gender = data?.insuredDetails?.gender;
      form.setFieldValue("genderOfPatientSystem", gender);
      form.setFieldValue("genderOfPatientUser", gender);
    }
    if (data?.hospitalDetails?.providerName) {
      const name = data?.hospitalDetails?.providerName;
      form.setFieldValue("nameOfHospitalSystem", name);
      form.setFieldValue("nameOfHospitalUser", name);
    }
    if (data?.hospitalizationDetails?.dateOfAdmission) {
      const date = dayjs(data?.hospitalizationDetails?.dateOfAdmission);
      form.setFieldValue("dateOfAdmissionSystem", date);
      form.setFieldValue("dateOfAdmissionUser", date);
    }
    if (data?.hospitalizationDetails?.dateOfDischarge) {
      const date = dayjs(data?.hospitalizationDetails?.dateOfDischarge);
      form.setFieldValue("dateOfDischargeSystem", date);
      form.setFieldValue("dateOfDischargeUser", date);
    }
  }, [data, form]);

  useEffect(() => {
    const addDefaultValues = (
      values: Record<string, any>,
      prevKey?: string
    ) => {
      Object.entries(values).map(([key, value]: any) => {
        if (key === "pedOrNonDisclosure" && value?.ailmentDetail?.length > 0) {
          form.setFieldValue(key, value);
          form.setFieldValue(
            "tempAilments",
            value?.ailmentDetail?.map((el: any) => el?.ailment)
          );
        } else if (Array.isArray(value)) {
          if (key === "classOfAccommodationDetails") {
            form.setFieldValue(
              key,
              value?.map((el) => ({
                fromDate: dayjs(el?.fromDate),
                toDate: dayjs(el?.toDate),
              }))
            );
          } else if (key === "personalOrSocialHabits" && value?.length > 0) {
            form.setFieldValue(
              "tempHabits",
              value?.map((el) => el?.habit)
            );
            form.setFieldValue(key, value);
          } else {
            const keys = [key];
            if (prevKey) keys.unshift(prevKey);
            form.setFieldValue(keys, value);
          }
        } else if (!!value && typeof value === "object") {
          addDefaultValues(value, key);
        } else if (isNaN(value) && dayjs(new Date(value)).isValid()) {
          const keys = [key];
          if (prevKey) keys.unshift(prevKey);
          form.setFieldValue(keys, dayjs(value));
        } else {
          const keys = [key];
          if (prevKey) keys.unshift(prevKey);
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
    <FormContainer<IInsuredVerification>
      form={form}
      handleSave={handleSave}
      submitting={loading}
      values={initialFormValues}
      onValuesChange={handleValuesChange}
      formName={taskName}
    >
      <InsuredVerificationParts claimId={data?.claimId} form={form} />
    </FormContainer>
  );
};

export default InsuredVerification;
