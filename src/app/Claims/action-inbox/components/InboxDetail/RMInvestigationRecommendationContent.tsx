import React from "react";
import { ActionIcon, Box, Divider, Text, Title } from "@mantine/core";
import KeyValueContainer from "./KeyValueContainer";
import { BiLink } from "react-icons/bi";
import {
  IOtherRecommendation,
  IRecommendation,
} from "@/lib/utils/types/rmDataTypes";
import { CaseDetail } from "@/lib/utils/types/fniDataTypes";
import { getTasksAndDocs } from "@/lib/helpers";
import { AccordionItem, CustomAccordion } from "@/components/CustomAccordion";

const Recommendation = ({
  recommendation,
  otherRecommendation,
}: {
  recommendation?: IRecommendation;
  otherRecommendation?: IOtherRecommendation[];
}) => {
  return (
    <Box>
      {recommendation || otherRecommendation ? (
        <>
          <KeyValueContainer
            label="Recommendation"
            value={recommendation?.value?.split("_")[0]}
          />

          {recommendation?.inconclusiveRemark && (
            <KeyValueContainer
              label="Inconclusive Remark"
              value={recommendation?.inconclusiveRemark}
            />
          )}

          <KeyValueContainer
            label="FRCU Ground of Repudiation"
            value={
              recommendation?.groundOfRepudiation &&
              recommendation?.groundOfRepudiation?.length > 0
                ? recommendation?.groundOfRepudiation?.join(", ")
                : "-"
            }
          />

          {recommendation?.nonCooperationOf && (
            <KeyValueContainer
              label="Ground of repudiation non-cooperation of"
              value={recommendation?.nonCooperationOf}
            />
          )}

          {recommendation?.hasEvidence && (
            <KeyValueContainer
              label="Has Evidence"
              value={recommendation?.hasEvidence}
            />
          )}

          {recommendation?.reasonOfEvidenceNotAvailable && (
            <KeyValueContainer
              label="Reason of Evidence not available"
              value={recommendation?.reasonOfEvidenceNotAvailable}
            />
          )}

          {recommendation?.evidences &&
          recommendation?.evidences?.length > 0 ? (
            <Box mt={16}>
              <Title order={6} c="orange" my={4}>
                Evidences Uploaded
              </Title>
              {recommendation?.evidences?.map((doc, ind) => (
                <ActionIcon
                  className="mr-4"
                  key={ind}
                  variant="light"
                  onClick={() => {
                    window.open(
                      `/Claims/action-inbox/documents?url=${encodeURIComponent(
                        doc
                      )}&name=Evidence`,
                      "_blank"
                    );
                  }}
                >
                  <BiLink />
                </ActionIcon>
              ))}
            </Box>
          ) : null}

          {otherRecommendation && otherRecommendation?.length > 0 ? (
            <Box mt={20}>
              <Title order={6} c="orange" my={4}>
                Other Recommendations
              </Title>
              {otherRecommendation?.map((el, ind) => (
                <Box key={ind} mb={16}>
                  <Text c="blue">
                    {ind + 1}- {el?.value}
                  </Text>
                  {el?.recommendationFor?.length > 0
                    ? el?.recommendationFor?.map((detail, index) => (
                        <KeyValueContainer
                          key={index}
                          label={detail?.value}
                          value={detail?.remark}
                        />
                      ))
                    : null}
                  <Divider />
                </Box>
              ))}
            </Box>
          ) : null}
        </>
      ) : (
        <Text ta="center" c="red">
          No Data
        </Text>
      )}
    </Box>
  );
};

type PropTypes = {
  claimType?: "PreAuth" | "Reimbursement";
  caseData: CaseDetail | null;
};

const RMInvestigationRecommendationContent = ({
  claimType,
  caseData,
}: PropTypes) => {
  const { rmFindings, rmFindingsHospital } = getTasksAndDocs({
    claimType,
    claimCase: caseData,
  });

  return caseData?.allocationType === "Single" ? (
    <Recommendation
      recommendation={rmFindings?.recommendation}
      otherRecommendation={rmFindings?.otherRecommendation}
    />
  ) : (
    <>
      <CustomAccordion>
        <AccordionItem title="Insured Part">
          <Recommendation
            recommendation={rmFindings?.recommendation}
            otherRecommendation={rmFindings?.otherRecommendation}
          />
        </AccordionItem>
        <AccordionItem title="Hospital Part">
          <Recommendation
            recommendation={rmFindingsHospital?.recommendation}
            otherRecommendation={rmFindingsHospital?.otherRecommendation}
          />
        </AccordionItem>
      </CustomAccordion>
    </>
  );
};

export default RMInvestigationRecommendationContent;
