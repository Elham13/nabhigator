import React from "react";
import { Grid, MultiSelect, Select, TextInput, Textarea } from "@mantine/core";
import { PostQaApproveFormValues } from "@/lib/utils/types/fniDataTypes";
import { getSelectOption } from "@/lib/helpers";

const ClaimsGroundOfRepudiationOptions = [
  "PED/NDC",
  "Fraud/Fabrication",
  "Inflation/Misrepresentation",
  "Policy Exclusion",
  "Non Co-Operation",
];

const providerRecommendationOptions = [
  "De-Empanelment",
  "Add in caution List",
  "Remove from Caution List",
  "Issue SCN",
  "Add in un-preferred provider",
  "NA",
];

const policyRecommendationOptions = [
  "Cancellation",
  "Flag the Contract as caution contract",
  "Flag the Member/Customer ID as Caution Member",
  "Flag the Contact Number/E-Mail ID/PAN Number/Aadhaar Number as caution customer",
  "Stop Renewal",
  "NA",
];

const sourcingRecommendationOptions = [
  "Add sourcing in caution list",
  "Issue SCN",
  "Terminate agency code",
  "Renewal Block",
  "NA",
];

const regulatoryReportingRecommendationOptions = ["Yes", "No", "NA"];

type PropTypes = {
  approvedValues: PostQaApproveFormValues;
  overRulingReason: string;
  recommendation?: string;
  setApprovedValues: React.Dispatch<
    React.SetStateAction<PostQaApproveFormValues>
  >;
  setOverRulingReason: React.Dispatch<React.SetStateAction<string>>;
};

const PostQaApproveForm = ({
  approvedValues,
  overRulingReason,
  recommendation,
  setApprovedValues,
  setOverRulingReason,
}: PropTypes) => {
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
          />
        </Grid.Col>
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
              value={overRulingReason}
              onChange={(e) => setOverRulingReason(e.target.value)}
              required
              withAsterisk
            />
          </Grid.Col>
        ) : null}
      </Grid>
    </form>
  );
};

export default PostQaApproveForm;
