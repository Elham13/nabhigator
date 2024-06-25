import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import { toast } from "react-toastify";
import Task from "./RMTasks/Task";
import FormContainer from "./RMTasks/CommonForm/FormContainer";
import { Button, FileButton, Progress, Text } from "@mantine/core";
import { RiUploadCloudLine } from "react-icons/ri";
import {
  IOtherRecommendation,
  IRecommendation,
} from "@/lib/utils/types/rmDataTypes";
import {
  CaseDetail,
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import { getSelectOption, showError, uploadFile } from "@/lib/helpers";
import {
  groundOfRepudiationOptions,
  nonCooperationOfOptions,
  otherRecommendationDetailsOptions,
  otherRecommendationOptions,
  yesNoOptions,
} from "@/lib/utils/constants/options";

const formName = "TheCommonForm";

interface IInitialValues {
  investigationSummary: string;
  discrepanciesOrIrregularitiesObserved: string;
  recommendation: IRecommendation;
  otherRecommendation: IOtherRecommendation[];
  tempOtherRecommendation?: string[];
}

const initialFormValues: IInitialValues = {
  investigationSummary: "",
  discrepanciesOrIrregularitiesObserved: "",
  recommendation: {
    value: "",
    hasEvidence: "",
    evidences: [],
    reasonOfEvidenceNotAvailable: "",
    inconclusiveRemark: "",
    groundOfRepudiation: [],
    nonCooperationOf: "",
  },
  otherRecommendation: [
    {
      value: "",
      recommendationFor: [{ value: "", remark: "" }],
      tempRecommendationFor: [],
    },
  ],
  tempOtherRecommendation: [],
};

type PropTypes = {
  dashboardData?: IDashboardData;
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

// TODO: Handle this for the post qa change investigation findings

const RMInvestigationFindings = ({
  dashboardData,
  caseDetail,
  setCaseDetail,
}: PropTypes) => {
  const [progress, setProgress] = useState(0);
  const [form] = Form.useForm();

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

  const handleUploadEvidence = async (file: File | null) => {
    if (!file) return;

    try {
      setProgress(10);
      //  TODO: Need to increase the progress from 0 to 100 somehow
      const docKey = await uploadFile(file, dashboardData?.claimId || 0);

      let evidenceDocs = form.getFieldValue(["recommendation", "evidences"]);

      if (
        evidenceDocs &&
        Array.isArray(evidenceDocs) &&
        evidenceDocs?.length > 0
      ) {
        evidenceDocs.push(docKey);
      } else {
        evidenceDocs = [docKey];
      }
      setProgress(100);
    } catch (error: any) {
      showError(error);
    } finally {
      setProgress(0);
    }
  };

  const items = useMemo(() => {
    if (caseDetail && caseDetail?.tasksAssigned?.length > 0) {
      return caseDetail?.tasksAssigned?.map((task, index) => ({
        key: index,
        label: task?.name,
        children: (
          <Task
            task={task}
            data={dashboardData || null}
            setCaseDetail={setCaseDetail}
            caseDetail={caseDetail}
          />
        ),
      }));
    } else return [];
  }, [caseDetail, dashboardData, setCaseDetail]);

  useEffect(() => {
    if (caseDetail?.rmFindingsPostQA) {
      const values = caseDetail?.rmFindingsPostQA;
      if (values?.discrepanciesOrIrregularitiesObserved) {
        form.setFieldValue(
          "discrepanciesOrIrregularitiesObserved",
          values?.discrepanciesOrIrregularitiesObserved
        );
      }
      if (values?.investigationSummary) {
        form.setFieldValue(
          "investigationSummary",
          values?.investigationSummary
        );
      }

      if (values?.recommendation) {
        form.setFieldValue("recommendation", values?.recommendation);
      }

      if (
        values?.otherRecommendation &&
        values?.otherRecommendation?.length > 0
      ) {
        values.otherRecommendation = values?.otherRecommendation?.map((el) => ({
          ...el,
          tempRecommendationFor: el?.recommendationFor?.map(
            (rf) => rf?.value || ""
          ),
        }));
        form.setFieldValue("otherRecommendation", values?.otherRecommendation);
        form.setFieldValue(
          "tempOtherRecommendation",
          values?.otherRecommendation?.map((el) => el?.value)
        );
      }
    }
  }, [caseDetail?.rmFindingsPostQA, form]);

  return (
    <div>
      <h1 className="mb-8 text-center font-bold text-3xl text-blue-500">
        Tasks Assigned
      </h1>

      <Collapse items={items} size="small" accordion destroyInactivePanel />

      <FormContainer<IInitialValues>
        form={form}
        handleSave={(values) => {
          const payload = { ...values };
          if (
            payload?.tempOtherRecommendation &&
            payload?.tempOtherRecommendation?.length > 0
          ) {
            payload.otherRecommendation = payload?.otherRecommendation?.map(
              (el, ind) => {
                const preparedObj = {
                  ...el,
                  recommendationFor: el?.recommendationFor?.map((re, i) => ({
                    ...re,
                    value: el?.tempRecommendationFor?.[i] || "",
                  })),
                  value: payload?.tempOtherRecommendation?.[ind] || "",
                };
                delete el.tempRecommendationFor;
                return preparedObj;
              }
            );
          }
          delete payload?.tempOtherRecommendation;
          submit({ payload, id: caseDetail?._id, name: formName });
        }}
        submitting={loading}
        values={initialFormValues}
        formName={formName}
      >
        <div className="mt-12">
          <Divider orientation="left" orientationMargin="0">
            <Typography.Title level={4}>The common Tasks</Typography.Title>
          </Divider>
          <Row gutter={10}>
            <Col md={12} xs={24}>
              <Form.Item<IInitialValues>
                name="investigationSummary"
                label="Investigation Summary"
                rules={[{ required: true, message: "Please Fill" }]}
              >
                <Input.TextArea placeholder="Investigation Summary" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item<IInitialValues>
                name="discrepanciesOrIrregularitiesObserved"
                label="Discrepancies Or Irregularities Observed"
                rules={[{ required: true, message: "Please Fill" }]}
              >
                <Input.TextArea placeholder="Discrepancies Or Irregularities Observed" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={10}>
            <Col xs={24}>
              <Form.Item<IInitialValues>
                name={["recommendation", "value"]}
                label="Recommendation"
                rules={[{ required: true, message: "Please Select" }]}
              >
                <Select
                  placeholder="Recommendation"
                  options={getSelectOption("recommendations")}
                  allowClear
                  showSearch
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item<IInitialValues>
            noStyle
            shouldUpdate={(prev, curr) =>
              prev?.recommendation?.value !== curr?.recommendation?.value
            }
          >
            {({ getFieldValue }) => {
              const value = getFieldValue(["recommendation", "value"]);
              return value === "Repudiation" ? (
                <Fragment>
                  <Row gutter={10}>
                    <Col md={12} xs={24}>
                      <Form.Item<IInitialValues>
                        name={["recommendation", "groundOfRepudiation"]}
                        label="Ground of Repudiation"
                        rules={[{ required: true, message: "Please Select" }]}
                      >
                        <Select
                          placeholder="Ground of Repudiation"
                          options={groundOfRepudiationOptions}
                          allowClear
                          showSearch
                          mode="multiple"
                        />
                      </Form.Item>
                    </Col>
                    <Form.Item<IInitialValues>
                      noStyle
                      shouldUpdate={(prev, curr) =>
                        prev?.recommendation?.groundOfRepudiation?.length !==
                        curr?.recommendation?.groundOfRepudiation?.length
                      }
                    >
                      {({ getFieldValue }) => {
                        const values: string[] = getFieldValue([
                          "recommendation",
                          "groundOfRepudiation",
                        ]);
                        return values?.length > 0 &&
                          values?.includes("Non Co-Operation") ? (
                          <Col md={12} xs={24}>
                            <Form.Item<IInitialValues>
                              name={["recommendation", "nonCooperationOf"]}
                              label="Non Cooperation of"
                              rules={[
                                { required: true, message: "Please Select" },
                              ]}
                            >
                              <Select
                                placeholder="Non Cooperation of"
                                options={nonCooperationOfOptions}
                                allowClear
                                showSearch
                              />
                            </Form.Item>
                          </Col>
                        ) : null;
                      }}
                    </Form.Item>
                  </Row>
                  <Row gutter={10}>
                    <Col md={12} xs={24}>
                      <Form.Item<IInitialValues>
                        name={["recommendation", "hasEvidence"]}
                        label="Has Evidence?"
                        rules={[{ required: true, message: "Please Select" }]}
                      >
                        <Select
                          placeholder="Has Evidence?"
                          options={yesNoOptions}
                          allowClear
                          showSearch
                        />
                      </Form.Item>
                    </Col>

                    <Form.Item<IInitialValues>
                      noStyle
                      shouldUpdate={(prev, curr) =>
                        prev?.recommendation?.hasEvidence !==
                        curr?.recommendation?.hasEvidence
                      }
                    >
                      {({ getFieldValue }) => {
                        const value = getFieldValue([
                          "recommendation",
                          "hasEvidence",
                        ]);
                        return value === "Yes" ? (
                          <Col md={12} xs={24}>
                            <Form.Item<IInitialValues>
                              noStyle
                              shouldUpdate={(prev, curr) =>
                                prev?.recommendation?.evidences?.length !==
                                curr?.recommendation?.evidences?.length
                              }
                            >
                              <Form.List name={["recommendation", "evidences"]}>
                                {(fields, { add, remove }) => (
                                  <Fragment>
                                    {fields?.map((field, ind) => (
                                      <Text key={ind}>{field?.name}</Text>
                                    ))}
                                    <Form.Item>
                                      <FileButton
                                        onChange={handleUploadEvidence}
                                      >
                                        {(props) => (
                                          <Button {...props} color="cyan">
                                            Upload Evidence&nbsp;
                                            <RiUploadCloudLine />
                                          </Button>
                                        )}
                                      </FileButton>
                                      {progress > 0 ? (
                                        <Progress
                                          striped
                                          animated
                                          value={progress}
                                        />
                                      ) : null}
                                    </Form.Item>
                                  </Fragment>
                                )}
                              </Form.List>
                            </Form.Item>
                          </Col>
                        ) : value === "No" ? (
                          <Col md={12} xs={24}>
                            <Form.Item<IInitialValues>
                              name={[
                                "recommendation",
                                "reasonOfEvidenceNotAvailable",
                              ]}
                              label="Reason of evidence not available?"
                              rules={[
                                { required: true, message: "Please Fill" },
                              ]}
                            >
                              <Input placeholder="Reason of evidence not available?" />
                            </Form.Item>
                          </Col>
                        ) : null;
                      }}
                    </Form.Item>
                  </Row>
                </Fragment>
              ) : value?.includes("Inconclusive") ? (
                <Col md={12} xs={24}>
                  <Form.Item<IInitialValues>
                    name={["recommendation", "inconclusiveRemark"]}
                    label="Inconclusive Remark"
                    rules={[{ required: true, message: "Please Fill" }]}
                  >
                    <Input placeholder="Inconclusive Remark" />
                  </Form.Item>
                </Col>
              ) : null;
            }}
          </Form.Item>

          <Row gutter={10}>
            <Col md={12} xs={24}>
              <Form.Item<IInitialValues>
                name="tempOtherRecommendation"
                label="Other Recommendation"
                rules={[{ required: true, message: "Please Fill" }]}
              >
                <Select
                  placeholder="Other Recommendation"
                  options={otherRecommendationOptions?.filter(
                    (el: any) => el?.value !== "NA"
                  )}
                  mode="multiple"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item<IInitialValues>
            noStyle
            shouldUpdate={(prev, curr) =>
              prev?.tempOtherRecommendation?.length !==
              curr?.tempOtherRecommendation?.length
            }
          >
            {({ getFieldValue }) => {
              const value: string[] = getFieldValue("tempOtherRecommendation");
              return value?.map((el, ind) => (
                <Fragment key={ind}>
                  <Row gutter={10}>
                    <Col xs={24}>
                      <Form.Item<IInitialValues>
                        name={[
                          "otherRecommendation",
                          ind,
                          "tempRecommendationFor",
                        ]}
                        label={`Recommendation For ${el}`}
                        rules={[{ required: true, message: "Please select" }]}
                      >
                        <Select
                          placeholder={`Recommendation For ${el}`}
                          options={otherRecommendationDetailsOptions}
                          mode="multiple"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item<IInitialValues>
                    noStyle
                    shouldUpdate={(prev, curr) =>
                      prev?.otherRecommendation[ind]?.tempRecommendationFor
                        ?.length !==
                      curr?.otherRecommendation[ind]?.tempRecommendationFor
                        ?.length
                    }
                  >
                    {({ getFieldValue }) => {
                      const values = getFieldValue([
                        "otherRecommendation",
                        ind,
                        "tempRecommendationFor",
                      ]) as string[];
                      return values?.length > 0
                        ? values?.map((el2, ind2) =>
                            el2 === "NA" ? null : (
                              <Row gutter={10} key={ind2}>
                                <Col xs={24}>
                                  <Form.Item<IInitialValues>
                                    name={[
                                      "otherRecommendation",
                                      ind,
                                      "recommendationFor",
                                      ind2,
                                      "remark",
                                    ]}
                                    label={`Remarks of ${el2}`}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please select",
                                      },
                                    ]}
                                  >
                                    <Input placeholder={`Remarks of ${el2}`} />
                                  </Form.Item>
                                </Col>
                              </Row>
                            )
                          )
                        : null;
                    }}
                  </Form.Item>
                </Fragment>
              ));
            }}
          </Form.Item>
        </div>
      </FormContainer>
    </div>
  );
};

export default RMInvestigationFindings;
