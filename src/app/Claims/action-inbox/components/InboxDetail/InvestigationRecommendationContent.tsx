import React from "react";
import { ActionIcon, Box, Divider, Text, Title } from "@mantine/core";
import KeyValueContainer from "./KeyValueContainer";
import { BiLink } from "react-icons/bi";
import { RevisedInvestigationFindings } from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  findings?: RevisedInvestigationFindings | null;
};

const InvestigationRecommendationContent = ({ findings }: PropTypes) => {
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
                      `/Claims/action-inbox/documents?url=${doc}&name=Evidence`,
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

export default InvestigationRecommendationContent;
