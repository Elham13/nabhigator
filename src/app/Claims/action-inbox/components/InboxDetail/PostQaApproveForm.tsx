import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Grid,
  MultiSelect,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import {
  CaseDetail,
  IDashboardData,
  PostQaApproveFormValues,
} from "@/lib/utils/types/fniDataTypes";
import { getSelectOption } from "@/lib/helpers";
import FileUploadFooter from "@/components/ClaimsComponents/FileUpload/FileUploadFooter";
import { useAxios } from "@/lib/hooks/useAxios";
import { EndPoints } from "@/lib/utils/types/enums";
import FileUpload from "@/components/ClaimsComponents/FileUpload";
import { tempDocInitials } from "@/lib/utils/constants";
import {
  ClaimsGroundOfRepudiationOptions,
  policyRecommendationOptions,
  providerRecommendationOptions,
  sourcingRecommendationOptions,
} from "@/lib/utils/constants/options";

const regulatoryReportingRecommendationOptions = ["Yes", "No", "NA"];

type PropTypes = {
  dashboardData: IDashboardData | null;
  caseDetail: CaseDetail | null;
  approvedValues: PostQaApproveFormValues;
  recommendation?: string;
  setApprovedValues: Dispatch<SetStateAction<PostQaApproveFormValues>>;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const PostQaApproveForm = ({
  caseDetail,
  dashboardData,
  approvedValues,
  recommendation,
  setCaseDetail,
  setApprovedValues,
}: PropTypes) => {
  const [overRulingReason, setOverRulingReason] = useState("");
  const handleChangeFRCU = (val: string | null) => {
    if (val !== "Repudiation") {
      if (approvedValues.frcuGroundOfRepudiation?.length > 0)
        setApprovedValues((prev) => ({
          ...prev,
          frcuGroundOfRepudiation: [],
        }));
      if (approvedValues.claimsGroundOfRepudiation?.length > 0)
        setApprovedValues((prev) => ({
          ...prev,
          claimsGroundOfRepudiation: [],
        }));
    }

    if (val !== "Query to Raise_NC" && approvedValues.queriesToRaise) {
      setApprovedValues((prev) => ({
        ...prev,
        queriesToRaise: "",
      }));
    }

    setApprovedValues((prev) => ({
      ...prev,
      frcuRecommendationOnClaims: val || "",
    }));
  };

  const { refetch: submit } = useAxios<any>({
    config: { url: EndPoints.UPDATE_CASE_DETAIL, method: "POST" },
    dependencyArr: [],
    isMutation: true,
    onDone: (res) => {
      if (res?.updatedCase) setCaseDetail(res?.updatedCase);
    },
  });

  const handleRemove = (index: number) => {
    const payload = {
      id: caseDetail?._id,
      action: "AddPostQADocument",
      index,
    };
    submit(payload);
  };

  const handleGetUrl = (
    id: string,
    name: string,
    url: string,
    action: "Add" | "Remove"
  ) => {
    const payload = {
      id: caseDetail?._id,
      action: "AddPostQADocument",
      postQaDoc: url,
    };

    submit(payload);
  };

  const handleBlur = (field: string, value: any) => {
    const payload = {
      id: caseDetail?._id,
      action: "AddPostQAValues",
      field,
      value,
    };

    submit(payload);
  };

  useEffect(() => {
    if (!!caseDetail?.postQaOverRulingReason) {
      setOverRulingReason(caseDetail?.postQaOverRulingReason);
    }
  }, [caseDetail]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Grid>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Textarea
            autosize
            minRows={5}
            resize="vertical"
            label="Summary of investigation"
            placeholder="Brief summary of investigation"
            required
            withAsterisk
            value={approvedValues.summaryOfInvestigation}
            onChange={(e) =>
              setApprovedValues((prev) => ({
                ...prev,
                summaryOfInvestigation: e.target.value,
              }))
            }
            onBlur={(e) => handleBlur("summaryOfInvestigation", e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Textarea
            autosize
            minRows={5}
            resize="vertical"
            label="QA Remarks"
            placeholder="Enter QA Remarks"
            required
            withAsterisk
            value={approvedValues.qaRemarks}
            onChange={(e) =>
              setApprovedValues((prev) => ({
                ...prev,
                qaRemarks: e.target.value,
              }))
            }
            onBlur={(e) => handleBlur("qaRemarks", e.target.value)}
          />
        </Grid.Col>
        {dashboardData?.isReInvestigated && (
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <Textarea
              autosize
              minRows={5}
              resize="vertical"
              label="Re-Investigation Remarks"
              placeholder="Enter Re-Investigation Remarks"
              required
              withAsterisk
              value={approvedValues.reInvestigationRemarks}
              onChange={(e) =>
                setApprovedValues((prev) => ({
                  ...prev,
                  reInvestigationRemarks: e.target.value,
                }))
              }
              onBlur={(e) =>
                handleBlur("reInvestigationRemarks", e.target.value)
              }
            />
          </Grid.Col>
        )}
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Select
            label="FRCU Recommendation on Claims"
            placeholder="FRCU Recommendation on Claims"
            required
            withAsterisk
            value={approvedValues.frcuRecommendationOnClaims || ""}
            onChange={handleChangeFRCU}
            data={getSelectOption("FRCU")}
            clearable
            onBlur={() => {
              const value =
                approvedValues?.frcuRecommendationOnClaims?.split("_")?.[0] ||
                "";
              const code =
                approvedValues?.frcuRecommendationOnClaims?.split("_")?.[1] ||
                "";
              handleBlur("frcuRecommendationOnClaims", { value, code });
            }}
          />
        </Grid.Col>
        {approvedValues.frcuRecommendationOnClaims === "Repudiation" ? (
          <>
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <MultiSelect
                label="FRCU Ground of Repudiation"
                placeholder="FRCU Ground of Repudiation"
                required
                withAsterisk
                value={approvedValues.frcuGroundOfRepudiation || []}
                onChange={(val) =>
                  setApprovedValues((prev) => ({
                    ...prev,
                    frcuGroundOfRepudiation: val || [],
                  }))
                }
                data={getSelectOption("FRCUGroundOfRepQa")}
                clearable
                hidePickedOptions
              />
            </Grid.Col>
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <MultiSelect
                label="Claim Ground of Repudiation"
                placeholder="Claim Ground of Repudiation"
                required
                withAsterisk
                value={approvedValues.claimsGroundOfRepudiation || []}
                onChange={(val) =>
                  setApprovedValues((prev) => ({
                    ...prev,
                    claimsGroundOfRepudiation: val || [],
                  }))
                }
                data={ClaimsGroundOfRepudiationOptions}
                clearable
                hidePickedOptions
              />
            </Grid.Col>

            <Grid.Col span={{ sm: 12, md: 6 }}>
              <Text className="font-semibold">Upload Document: </Text>
              {!!approvedValues?.documents &&
                approvedValues?.documents?.length > 0 &&
                approvedValues?.documents?.map((el, ind) => (
                  <FileUploadFooter
                    key={ind}
                    url={el}
                    onDelete={() => handleRemove(ind)}
                  />
                ))}
              <FileUpload
                doc={tempDocInitials}
                docName="doc"
                getUrl={handleGetUrl}
                claimId={dashboardData?.claimId || 0}
              />
            </Grid.Col>
          </>
        ) : null}
        {["Query to Raise_NC", "Query to Raise_QR"].includes(
          approvedValues.frcuRecommendationOnClaims
        ) ? (
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <TextInput
              label="Queries required to raise"
              placeholder="Specify Queries required to raise"
              required
              withAsterisk
              value={approvedValues.queriesToRaise}
              onChange={(e) =>
                setApprovedValues((prev) => ({
                  ...prev,
                  queriesToRaise: e.target.value,
                }))
              }
            />
          </Grid.Col>
        ) : null}
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Select
            label="Provider Recommendation"
            placeholder="Provider Recommendation"
            required
            withAsterisk
            value={approvedValues.providerRecommendation}
            onChange={(val) =>
              setApprovedValues((prev) => ({
                ...prev,
                providerRecommendation: val || "",
              }))
            }
            data={providerRecommendationOptions}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Select
            label="Policy Recommendation"
            placeholder="Policy Recommendation"
            required
            withAsterisk
            value={approvedValues.policyRecommendation}
            onChange={(val) =>
              setApprovedValues((prev) => ({
                ...prev,
                policyRecommendation: val || "",
              }))
            }
            data={policyRecommendationOptions}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Select
            label="Sourcing Recommendation"
            placeholder="Sourcing Recommendation"
            required
            withAsterisk
            value={approvedValues.sourcingRecommendation}
            onChange={(val) =>
              setApprovedValues((prev) => ({
                ...prev,
                sourcingRecommendation: val || "",
              }))
            }
            data={sourcingRecommendationOptions}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Select
            label="Regulatory Reporting Recommendation"
            placeholder="Regulatory Reporting Recommendation"
            required
            withAsterisk
            value={approvedValues.regulatoryReportingRecommendation}
            onChange={(val) =>
              setApprovedValues((prev) => ({
                ...prev,
                regulatoryReportingRecommendation: val || "",
              }))
            }
            data={regulatoryReportingRecommendationOptions}
            clearable
          />
        </Grid.Col>
        {recommendation &&
        recommendation !== approvedValues?.frcuRecommendationOnClaims ? (
          <Grid.Col span={{ sm: 12, md: 6 }}>
            <TextInput
              label="Over ruling reason"
              placeholder="Enter Over ruling reason"
              value={overRulingReason || ""}
              onChange={(e) => setOverRulingReason(e.target.value)}
              required
              withAsterisk
              onBlur={(e) => {
                const payload = {
                  id: caseDetail?._id,
                  action: "AddOverRulingReason",
                  postQaOverRulingReason: e.target.value,
                };

                submit(payload);
              }}
            />
          </Grid.Col>
        ) : null}
      </Grid>
    </form>
  );
};

export default PostQaApproveForm;
