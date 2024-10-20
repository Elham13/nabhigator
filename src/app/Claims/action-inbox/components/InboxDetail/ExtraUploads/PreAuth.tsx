import React, { Fragment, ReactNode } from "react";
import { RevisedInvestigationFindings } from "@/lib/utils/types/fniDataTypes";
import { ActionIcon, Box, Flex, Title } from "@mantine/core";
import { BiLink } from "react-icons/bi";

type PropTypes = {
  findings: RevisedInvestigationFindings | null;
};

const ExtraUploadPreAuth = ({ findings }: PropTypes) => {
  let renderJSX: ReactNode[] = [];

  if (
    findings?.recommendation?.value === "Repudiation" &&
    findings?.evidenceDocs &&
    findings?.evidenceDocs?.length > 0
  ) {
    renderJSX.push(
      <Box>
        <Title order={5} c="green">
          Repudiation Evidences
        </Title>
        <Flex gap={10}>
          {findings?.evidenceDocs?.map((evidence, ind) => (
            <ActionIcon
              key={ind}
              disabled={!evidence}
              variant="light"
              onClick={() => {
                window.open(
                  `/Claims/action-inbox/documents?url=${encodeURIComponent(
                    evidence
                  )}&name=Repudiation Evidences`,
                  "_blank"
                );
              }}
            >
              <BiLink />
            </ActionIcon>
          ))}
        </Flex>
      </Box>
    );
  }

  return renderJSX?.length > 0 ? (
    <Box mt={20}>
      {renderJSX?.map((jsx, ind) => (
        <Fragment key={ind}>{jsx}</Fragment>
      ))}
    </Box>
  ) : null;
};

export default ExtraUploadPreAuth;
