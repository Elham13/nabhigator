import React from "react";
import { ActionIcon, Box, Divider, Text, Title } from "@mantine/core";
import KeyValueContainer from "./KeyValueContainer";
import { BiLink } from "react-icons/bi";
import {
  CaseDetail,
  RevisedInvestigationFindings,
} from "@/lib/utils/types/fniDataTypes";
import { getTasksAndDocs } from "@/lib/helpers";
import { AccordionItem, CustomAccordion } from "@/components/CustomAccordion";

const Recommendations = ({
  findings,
}: {
  findings: RevisedInvestigationFindings | null;
}) => {
  return (
    <Box>
      {findings ? (
        <>
          <KeyValueContainer
            label="Recommendation"
            value={findings?.recommendation?.value}
          />

          {findings?.inconclusiveRemark && (
            <KeyValueContainer
              label="Inconclusive Remark"
              value={findings?.inconclusiveRemark}
            />
          )}

          <KeyValueContainer
            label="FRCU Ground of Repudiation"
            value={
              !!findings?.frcuGroundOfRepudiation &&
              findings?.frcuGroundOfRepudiation?.length > 0
                ? findings?.frcuGroundOfRepudiation
                    ?.map((el) => el?.value)
                    ?.join(", ")
                : "-"
            }
          />

          {findings?.groundOfRepudiationNonCooperationOf && (
            <KeyValueContainer
              label="Ground of repudiation non-cooperation of"
              value={findings?.groundOfRepudiationNonCooperationOf}
            />
          )}

          {findings?.repudiationReason && (
            <KeyValueContainer
              label="Repudiation reason"
              value={findings?.repudiationReason}
            />
          )}

          {findings?.evidenceOfRepudiation && (
            <KeyValueContainer
              label="Evidence of repudiation"
              value={findings?.evidenceOfRepudiation}
            />
          )}

          {!!findings?.evidenceDocs && findings?.evidenceDocs?.length > 0 ? (
            <Box mt={16}>
              <Title order={6} c="orange" my={4}>
                Evidences Uploaded
              </Title>
              {findings?.evidenceDocs?.map((doc, ind) => (
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

          {!!findings?.otherRecommendation &&
          findings?.otherRecommendation?.length > 0 ? (
            <Box mt={20}>
              <Title order={6} c="orange" my={4}>
                Other Recommendations
              </Title>
              {findings?.otherRecommendation?.map((el, ind) => (
                <Box key={ind} mb={16}>
                  <Text c="blue">
                    {ind + 1}- {el?.value}
                  </Text>
                  {el?.detail?.length > 0
                    ? el?.detail?.map((detail, index) => (
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

const InvestigationRecommendationContent = ({
  claimType,
  caseData,
}: PropTypes) => {
  const { preAuthFindings, preAuthFindingsHospital } = getTasksAndDocs({
    claimType,
    claimCase: caseData,
  });

  return caseData?.allocationType === "Single" ? (
    <Recommendations findings={preAuthFindings} />
  ) : (
    <>
      <CustomAccordion>
        <AccordionItem title="Insured Part">
          <Recommendations findings={preAuthFindings} />
        </AccordionItem>
        <AccordionItem title="Hospital Part">
          <Recommendations findings={preAuthFindingsHospital} />
        </AccordionItem>
      </CustomAccordion>
    </>
  );
};

export default InvestigationRecommendationContent;
