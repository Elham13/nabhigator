import React, {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAxios } from "@/lib/hooks/useAxios";
import {
  Grid,
  MultiSelect,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IOtherRecommendation,
  IRecommendation,
  IRMFindings,
} from "@/lib/utils/types/rmDataTypes";
import { CaseDetail, SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { getSelectOption } from "@/lib/helpers";
import {
  groundOfRepudiationOptions,
  nonCooperationOfOptions,
  otherRecommendationDetailsOptions,
  otherRecommendationOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";
import FileUpload from "@/components/ClaimsComponents/FileUpload";
import FileUploadFooter from "@/components/ClaimsComponents/FileUpload/FileUploadFooter";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { useLocalStorage } from "@mantine/hooks";

const formName = "TheCommonForm";

interface IInitialValues {
  investigationSummary: string;
  discrepanciesOrIrregularitiesObserved: string;
  recommendation: IRecommendation;
  otherRecommendation: IOtherRecommendation[];
}

const initialFormValues: IInitialValues = {
  investigationSummary: "",
  discrepanciesOrIrregularitiesObserved: "",
  recommendation: { value: "", code: "" },
  otherRecommendation: [],
};

const tempDoc = {
  _id: "",
  docUrl: [],
  name: "",
  location: null,
  hiddenDocUrls: [],
  replacedDocUrls: [],
};

type PropTypes = {
  formPart?: "Insured" | "Hospital";
  isQa?: boolean;
  findings: IRMFindings | null;
  claimId?: number;
  caseId?: string;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const CommonFormComponent = ({
  formPart,
  isQa,
  findings,
  claimId,
  caseId,
  setCaseDetail,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [values, setValues] = useState<IInitialValues>(initialFormValues);

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

  const handleBlur = ({ key, value }: { key: string; value: any }) => {
    const payload: Record<string, any> = {
      id: caseId,
      name: formName,
      userId: user?._id,
      isQa,
      formPart,
    };

    if (payload?.id && payload?.userId) {
      payload.payload = { key, value };
      submit(payload);
    }
  };

  const handleRecommendationBlur = () =>
    handleBlur({ key: "recommendation", value: values?.recommendation });

  const handleOtherRecommendationBlur = () =>
    handleBlur({
      key: "otherRecommendation",
      value: values?.otherRecommendation,
    });

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value, name } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemove = (index: number) => {
    const recommendation = {
      ...values?.recommendation,
      evidences: values?.recommendation?.evidences?.filter(
        (_, ind) => ind !== index
      ),
    };
    setValues((prev) => ({
      ...prev,
      recommendation,
    }));
    handleBlur({ key: "recommendation", value: recommendation });
  };

  const handleGetUrl = (
    id: string,
    name: string,
    url: string,
    action: "Add" | "Remove"
  ) => {
    const docArr = values?.recommendation?.evidences;
    let recommendation = values?.recommendation;
    if (docArr && Array.isArray(docArr) && docArr?.length > 0) {
      recommendation = { ...recommendation, evidences: [...docArr, url] };
    } else {
      recommendation = { ...recommendation, evidences: [url] };
    }
    setValues((prev) => ({ ...prev, recommendation }));
    handleBlur({ key: "recommendation", value: recommendation });
  };

  const updateFormField = useCallback((key: string, value: any) => {
    if (value) {
      setValues((prev) => ({ ...prev, [key]: value }));
    }
  }, []);

  useEffect(() => {
    if (findings) {
      updateFormField(
        "discrepanciesOrIrregularitiesObserved",
        findings.discrepanciesOrIrregularitiesObserved
      );
      updateFormField("investigationSummary", findings.investigationSummary);
      updateFormField("recommendation", findings.recommendation);

      if (
        !!findings?.otherRecommendation &&
        findings?.otherRecommendation?.length > 0 &&
        findings?.otherRecommendation?.every((el: any) => !!el?.value)
      ) {
        updateFormField("otherRecommendation", findings?.otherRecommendation);
      }
    }
  }, [findings, updateFormField]);

  return (
    <Grid mt={40}>
      <Grid.Col span={12}>
        <Title order={5}>The Common Tasks</Title>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Textarea
          label="Investigation Summary"
          placeholder="Investigation Summary"
          name="investigationSummary"
          value={values?.investigationSummary || ""}
          onChange={handleChange}
          resize="vertical"
          required
          withAsterisk
          onBlur={(e) =>
            handleBlur({ key: "investigationSummary", value: e.target.value })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Textarea
          label="Discrepancies Or Irregularities Observed"
          placeholder="Discrepancies Or Irregularities Observed"
          name="discrepanciesOrIrregularitiesObserved"
          value={values?.discrepanciesOrIrregularitiesObserved || ""}
          onChange={handleChange}
          resize="vertical"
          required
          withAsterisk
          onBlur={(e) =>
            handleBlur({
              key: "discrepanciesOrIrregularitiesObserved",
              value: e.target.value,
            })
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select
          label="Recommendation"
          placeholder="Recommendation"
          data={getSelectOption("recommendations")}
          searchable
          clearable
          withAsterisk
          required
          value={values?.recommendation?.value || ""}
          onChange={(val) =>
            setValues((prev) => ({
              ...prev,
              recommendation: { ...prev.recommendation, value: val || "" },
            }))
          }
          onBlur={handleRecommendationBlur}
        />
      </Grid.Col>
      {!!values?.recommendation?.value && (
        <Fragment>
          {values?.recommendation?.value === "Repudiation" ? (
            <Fragment>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <MultiSelect
                  label="Ground of repudiation"
                  placeholder="Ground of repudiation"
                  data={groundOfRepudiationOptions}
                  searchable
                  clearable
                  withAsterisk
                  required
                  hidePickedOptions
                  value={values?.recommendation?.groundOfRepudiation || []}
                  onChange={(val) =>
                    setValues((prev) => ({
                      ...prev,
                      recommendation: {
                        ...prev.recommendation,
                        groundOfRepudiation: val || [],
                      },
                    }))
                  }
                  onBlur={handleRecommendationBlur}
                />
              </Grid.Col>
              {!!values?.recommendation?.groundOfRepudiation &&
                values?.recommendation?.groundOfRepudiation?.length > 0 &&
                values?.recommendation?.groundOfRepudiation?.includes(
                  "Non Co-Operation"
                ) && (
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                      label="Non Co-Operation of"
                      placeholder="Non Co-Operation of"
                      data={nonCooperationOfOptions}
                      searchable
                      clearable
                      withAsterisk
                      required
                      value={values?.recommendation?.nonCooperationOf || ""}
                      onBlur={handleRecommendationBlur}
                      onChange={(val) =>
                        setValues((prev) => ({
                          ...prev,
                          recommendation: {
                            ...prev.recommendation,
                            nonCooperationOf: val || "",
                          },
                        }))
                      }
                    />
                  </Grid.Col>
                )}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Has Evidence?"
                  placeholder="Has Evidence?"
                  data={yesNoOptions}
                  searchable
                  clearable
                  withAsterisk
                  required
                  value={values?.recommendation?.hasEvidence || ""}
                  onBlur={handleRecommendationBlur}
                  onChange={(val) =>
                    setValues((prev) => ({
                      ...prev,
                      recommendation: {
                        ...prev.recommendation,
                        hasEvidence: val || "",
                      },
                    }))
                  }
                />
              </Grid.Col>

              {values?.recommendation?.hasEvidence === "Yes" ? (
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text className="font-semibold">Evidences: </Text>
                  {!!values?.recommendation?.evidences &&
                    values?.recommendation?.evidences?.length > 0 &&
                    values?.recommendation?.evidences?.map((el, ind) => (
                      <FileUploadFooter
                        key={ind}
                        url={el}
                        onDelete={() => handleRemove(ind)}
                      />
                    ))}
                  <FileUpload
                    doc={tempDoc}
                    docName="doc"
                    getUrl={handleGetUrl}
                    claimId={claimId || 0}
                  />
                </Grid.Col>
              ) : values?.recommendation?.hasEvidence === "No" ? (
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Reason for evidence not available"
                    placeholder="Reason for evidence not available"
                    withAsterisk
                    required
                    value={
                      values?.recommendation?.reasonOfEvidenceNotAvailable || ""
                    }
                    onBlur={handleRecommendationBlur}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        recommendation: {
                          ...prev.recommendation,
                          reasonOfEvidenceNotAvailable: e.target?.value,
                        },
                      }))
                    }
                  />
                </Grid.Col>
              ) : null}
            </Fragment>
          ) : values?.recommendation?.value === "Inconclusive" ? (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Inconclusive Remarks"
                placeholder="Inconclusive Remarks"
                withAsterisk
                required
                value={values?.recommendation?.inconclusiveRemark || ""}
                onBlur={handleRecommendationBlur}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    recommendation: {
                      ...prev.recommendation,
                      inconclusiveRemark: e.target?.value,
                    },
                  }))
                }
              />
            </Grid.Col>
          ) : null}
        </Fragment>
      )}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <MultiSelect
          label="Other Recommendation"
          placeholder="Other Recommendation"
          data={otherRecommendationOptions?.filter(
            (el: any) => el?.value !== "NA"
          )}
          searchable
          clearable
          withAsterisk
          required
          hidePickedOptions
          value={
            values?.otherRecommendation &&
            values?.otherRecommendation?.length > 0
              ? values?.otherRecommendation?.map((el) => el?.value as string)
              : []
          }
          onBlur={handleOtherRecommendationBlur}
          onChange={(val) => {
            const otherRecommendation = val?.map((v) => ({
              value: v,
              recommendationFor: [],
            }));

            setValues((prev) => ({
              ...prev,
              otherRecommendation,
            }));
          }}
        />
      </Grid.Col>
      {!!values?.otherRecommendation &&
        values?.otherRecommendation?.length > 0 &&
        values?.otherRecommendation?.map((el, index) => (
          <Fragment key={index}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <MultiSelect
                label={`Recommendation For ${el?.value}`}
                placeholder={`Recommendation For ${el?.value}`}
                data={otherRecommendationDetailsOptions}
                searchable
                clearable
                withAsterisk
                required
                hidePickedOptions
                value={
                  el?.recommendationFor && el?.recommendationFor?.length > 0
                    ? el?.recommendationFor?.map((rf) => rf?.value as string)
                    : []
                }
                onBlur={handleOtherRecommendationBlur}
                onChange={(val) => {
                  const otherRecommendation = values?.otherRecommendation || [];
                  let recFor = [];
                  if (val?.includes("NA"))
                    recFor = [{ value: "NA", remark: "" }];
                  else recFor = val?.map((v) => ({ value: v, remark: "" }));
                  otherRecommendation[index].recommendationFor = recFor;

                  setValues((prev) => ({
                    ...prev,
                    otherRecommendation,
                  }));
                }}
              />
            </Grid.Col>
            {!!el?.recommendationFor &&
              el?.recommendationFor?.length > 0 &&
              el?.recommendationFor?.map((rf, rfInd) => {
                if (rf?.value === "NA") return null;
                return (
                  <Grid.Col span={{ base: 12, md: 6 }} key={rfInd}>
                    <TextInput
                      label={`Remark For ${rf?.value} of ${el?.value}`}
                      placeholder={`Remarks For ${rf?.value} of ${el?.value}`}
                      withAsterisk
                      required
                      value={rf?.remark || ""}
                      onBlur={handleOtherRecommendationBlur}
                      onChange={(e) => {
                        const { value } = e.target;
                        const otherRecommendation =
                          values?.otherRecommendation || [];
                        const recFor =
                          otherRecommendation[index]?.recommendationFor || [];
                        recFor[rfInd].remark = value;
                        otherRecommendation[index].recommendationFor = recFor;

                        setValues((prev) => ({
                          ...prev,
                          otherRecommendation,
                        }));
                      }}
                    />
                  </Grid.Col>
                );
              })}
          </Fragment>
        ))}
    </Grid>
  );
};

export default CommonFormComponent;
