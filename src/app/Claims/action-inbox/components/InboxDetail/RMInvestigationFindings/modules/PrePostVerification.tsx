import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import PrePostDynamicFormParts from "./FormParts/PrePostDynamicFormParts";
import PrePostOtherBillsDynamicFormParts from "./FormParts/PrePostOtherBillsDynamicFormParts";
import ConsultationPapersDynamicFormPart from "./FormParts/ConsultationPapersDynamicFormPart";
import MainClaimVerification from "./FormParts/MainClaimVerification";
import { Button, Divider, Grid, Select, Textarea, Title } from "@mantine/core";
import {
  ILab,
  IOtherBill,
  IPharmacy,
  IPrePostVerification,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { useLocalStorage } from "@mantine/hooks";
import { yesNAOptions } from "@/lib/utils/constants/options";

const taskName = "Pre-Post Verification";

const pharmacyInitials: IPharmacy = {
  name: "",
  address: "",
  billsVerified: "",
  city: "",
  qrCodeAvailableOnBill: "",
};

const labInitials: ILab = {
  name: "",
  address: "",
  billsVerified: "",
  city: "",
  qrCodeAvailableOnBill: "",
  finalObservation: "",
};

const otherBillInitials: IOtherBill = {
  nameOfEntity: "",
  address: "",
  billsAndReportsVerified: "",
  city: "",
  typeOfEntity: "",
};

const initialFormValues: IPrePostVerification = {
  pharmacyBillVerified: "",
  consultationPaperAndDoctorVerified: "",
  labVerified: "",
  pharmacies: [],
  labs: [],
  mainClaimIsVerified: "",
  otherBillVerified: "",
  consultationPaperAndDoctorDetail: {
    consultationIsRelatedToDiagnosis: "",
    consultationOrFollowUpConfirmation: "",
    doctorName: "",
    observation: "",
  },
  mainClaimDetail: {
    discrepancyStatus: "",
    observation: "",
  },
  insuredIsVerified: "",
  insuredVerificationDetail: {
    discrepancyStatus: "",
    observation: "",
  },
};

type PropTypes = {
  isQa?: boolean;
  findings: IRMFindings | null;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const PrePostVerification = ({
  isQa,
  caseId,
  findings,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] = useState<IPrePostVerification>(initialFormValues);

  const { refetch: submit, loading } = useAxios<
    SingleResponseType<CaseDetail | null>
  >({
    config: {
      url: EndPoints.CAPTURE_RM_INVESTIGATION_FINDINGS,
      method: "POST",
    },
    dependencyArr: [],
    isMutation: true,
    onDone: (res) => {
      if (res?.data) setCaseDetail(res?.data);
    },
  });

  const handleBlur = ({
    key,
    value,
  }: {
    key: keyof IPrePostVerification;
    value: any;
  }) => {
    const payload: Record<string, any> = {
      id: caseId,
      userId: user?._id,
      name: taskName,
      isQa,
    };

    if (payload?.id && payload?.userId && !!value) {
      payload.payload = { key, value };
      submit(payload);
    }
  };

  const handleAddMorePharmacy = (name: "pharmacies") => {
    let arr = !!values && !!values?.pharmacies ? values?.pharmacies : [];
    const newItems =
      arr?.length > 0 ? [...arr, pharmacyInitials] : [pharmacyInitials];
    setValues((prev) => ({
      ...prev,
      pharmacies: newItems,
    }));
    handleBlur({ key: name, value: newItems });
  };

  const handleAddMoreLab = (name: "labs") => {
    let arr = !!values && !!values?.labs ? values?.labs : [];
    const newItems = arr?.length > 0 ? [...arr, labInitials] : [labInitials];
    setValues((prev) => ({
      ...prev,
      [name]: newItems,
    }));
    handleBlur({ key: name, value: newItems });
  };

  const handleAddMoreOtherBill = (name: "otherBills") => {
    let arr = !!values && !!values?.otherBills ? values?.otherBills : [];
    const newItems =
      arr?.length > 0 ? [...arr, otherBillInitials] : [otherBillInitials];
    setValues((prev) => ({
      ...prev,
      otherBills: newItems,
    }));
    handleBlur({ key: name, value: newItems });
  };

  const handleChange = (key: keyof IPrePostVerification, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleListChangePharmacy = (
    name: keyof IPharmacy,
    index: number,
    value: any
  ) => {
    const newItems =
      values?.pharmacies && values?.pharmacies?.length > 0
        ? values?.pharmacies?.map((el, ind) =>
            ind === index ? { ...el, [name]: value } : el
          )
        : ([{ [name]: value }] as IPharmacy[]);

    setValues((prev) => ({ ...prev, pharmacies: newItems }));
  };

  const handleListChangeLab = (name: keyof ILab, index: number, value: any) => {
    const newItems =
      values?.labs && values?.labs?.length > 0
        ? values?.labs?.map((el, ind) =>
            ind === index ? { ...el, [name]: value } : el
          )
        : ([{ [name]: value }] as ILab[]);

    setValues((prev) => ({ ...prev, labs: newItems }));
  };

  const handleListChangeOtherBill = (
    name: keyof IOtherBill,
    index: number,
    value: any
  ) => {
    const newItems =
      values?.otherBills && values?.otherBills?.length > 0
        ? values?.otherBills?.map((el, ind) =>
            ind === index ? { ...el, [name]: value } : el
          )
        : ([{ [name]: value }] as IOtherBill[]);

    setValues((prev) => ({ ...prev, otherBills: newItems }));
  };

  const handleRemovePharmacy = (ind: number) => {
    const newItems =
      values?.pharmacies && values?.pharmacies?.length > 0
        ? values?.pharmacies?.filter((_, index) => index !== ind)
        : [];

    setValues((prev) => ({ ...prev, pharmacies: newItems }));
    handleBlur({ key: "pharmacies", value: newItems });
  };

  const handleRemoveLab = (ind: number) => {
    const newItems =
      values?.labs && values?.labs?.length > 0
        ? values?.labs?.filter((_, index) => index !== ind)
        : [];

    setValues((prev) => ({ ...prev, labs: newItems }));
    handleBlur({ key: "labs", value: newItems });
  };

  const handleRemoveOtherBill = (ind: number) => {
    const newItems =
      values?.otherBills && values?.otherBills?.length > 0
        ? values?.otherBills?.filter((_, index) => index !== ind)
        : [];

    setValues((prev) => ({ ...prev, otherBills: newItems }));
    handleBlur({ key: "otherBills", value: newItems });
  };

  useEffect(() => {
    if (!!findings && findings[taskName]) {
      Object.entries(findings[taskName]).map(([key, value]) => {
        setValues((prev) => ({ ...prev, [key]: value }));
      });
    }
  }, [findings]);

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={5}>Pharmacy Bill Verification Summary</Title>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Pharmacy Bill Verified?"
          placeholder="Pharmacy Bill Verified?"
          value={values?.pharmacyBillVerified || ""}
          withAsterisk
          required
          data={yesNAOptions}
          onChange={(value) => handleChange("pharmacyBillVerified", value)}
          onBlur={() =>
            handleBlur({
              key: "pharmacyBillVerified",
              value: values?.pharmacyBillVerified,
            })
          }
        />
      </Grid.Col>
      {values?.pharmacyBillVerified === "Yes" ? (
        <Fragment>
          {!!values?.pharmacies &&
            values?.pharmacies?.length > 0 &&
            values?.pharmacies?.map((pharmacy, index) => (
              <PrePostDynamicFormParts
                key={index}
                el={pharmacy}
                index={index}
                listName="pharmacies"
                onChange={(name, ind, val) =>
                  handleListChangePharmacy(name, ind, val)
                }
                remove={(ind) => handleRemovePharmacy(ind)}
                onBlur={() => {
                  handleBlur({
                    key: "pharmacies",
                    value: values?.pharmacies,
                  });
                }}
              />
            ))}
          <Grid.Col span={12}>
            <Button
              fullWidth
              onClick={() => handleAddMorePharmacy("pharmacies")}
              variant="subtle"
            >
              Add
              {!!values?.pharmacies && values?.pharmacies?.length > 0
                ? " more "
                : " "}
              Pharmacy
            </Button>
          </Grid.Col>
        </Fragment>
      ) : null}
      <Divider my="md" />
      <Grid.Col span={12}>
        <Title order={5}>Lab Verification Summary</Title>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Lab Verified?"
          placeholder="Lab Verified?"
          value={values?.labVerified || ""}
          withAsterisk
          required
          data={yesNAOptions}
          onChange={(value) => handleChange("labVerified", value)}
          onBlur={() =>
            handleBlur({
              key: "labVerified",
              value: values?.labVerified,
            })
          }
        />
      </Grid.Col>

      {values?.labVerified === "Yes" && (
        <Fragment>
          {!!values?.labs &&
            values?.labs?.length > 0 &&
            values?.labs?.map((lab, index) => (
              <PrePostDynamicFormParts
                key={index}
                el={lab}
                index={index}
                listName="labs"
                onChange={(name, ind, val) =>
                  handleListChangeLab(name, ind, val)
                }
                remove={(ind) => handleRemoveLab(ind)}
                onBlur={() => {
                  handleBlur({
                    key: "labs",
                    value: values?.labs,
                  });
                }}
              />
            ))}
          <Grid.Col span={12}>
            <Button
              fullWidth
              onClick={() => handleAddMoreLab("labs")}
              variant="subtle"
            >
              Add
              {!!values?.labs && values?.labs?.length > 0 ? " more " : " "}
              Lab
            </Button>
          </Grid.Col>
        </Fragment>
      )}

      <Divider my="md" />
      <Grid.Col span={12}>
        <Title order={5}>Other bill Verification Summary</Title>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Other bills Verified?"
          placeholder="Other bills Verified?"
          withAsterisk
          required
          value={values?.otherBillVerified || ""}
          data={yesNAOptions}
          onChange={(value) => handleChange("otherBillVerified", value)}
          onBlur={() =>
            handleBlur({
              key: "otherBillVerified",
              value: values?.otherBillVerified,
            })
          }
        />
      </Grid.Col>

      {values?.otherBillVerified === "Yes" && (
        <Fragment>
          {!!values?.otherBills &&
            values?.otherBills?.length > 0 &&
            values?.otherBills?.map((lab, index) => (
              <PrePostOtherBillsDynamicFormParts
                key={index}
                el={lab}
                index={index}
                onChange={(name, ind, val) =>
                  handleListChangeOtherBill(name, ind, val)
                }
                remove={(ind) => handleRemoveOtherBill(ind)}
                onBlur={() => {
                  handleBlur({
                    key: "otherBills",
                    value: values?.otherBills,
                  });
                }}
              />
            ))}
          <Grid.Col span={12}>
            <Button
              fullWidth
              onClick={() => handleAddMoreOtherBill("otherBills")}
              variant="subtle"
            >
              Add
              {!!values?.otherBills && values?.otherBills?.length > 0
                ? " more "
                : " "}
              Other Bills
            </Button>
          </Grid.Col>
        </Fragment>
      )}

      <ConsultationPapersDynamicFormPart
        values={values}
        setValues={setValues}
        onBlur={handleBlur}
      />

      <Grid.Col>
        <Textarea
          label="Final Observation"
          placeholder="Final Observation"
          resize="vertical"
          required
          withAsterisk
          value={values?.finalObservation || ""}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, finalObservation: e.target.value }))
          }
          onBlur={() =>
            handleBlur({
              key: "finalObservation",
              value: values?.finalObservation,
            })
          }
        />
      </Grid.Col>

      <MainClaimVerification
        fieldName="mainClaimIsVerified"
        objectName="mainClaimDetail"
        values={values}
        setValues={setValues}
        onBlur={handleBlur}
      />
      <MainClaimVerification
        fieldName="insuredIsVerified"
        objectName="insuredVerificationDetail"
        values={values}
        setValues={setValues}
        onBlur={handleBlur}
      />
    </Grid>
  );
};

export default PrePostVerification;
