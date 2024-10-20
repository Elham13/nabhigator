import React, { Fragment, ReactNode } from "react";
import { IRMFindings } from "@/lib/utils/types/rmDataTypes";
import { ActionIcon, Box, Flex, Title } from "@mantine/core";
import { BiLink } from "react-icons/bi";

type PropTypes = {
  rmFindings: IRMFindings | null;
};

const ExtraUploadsReimbursement = ({ rmFindings }: PropTypes) => {
  let renderJSX: ReactNode[] = [];

  const insuredVerification = rmFindings?.["Insured Verification"];
  const insuredNotVisitProof =
    insuredVerification?.reasonOfInsuredNotVisit?.proof;
  const policyOtherThanNBHIDocs =
    insuredVerification?.anyInsurancePolicyOtherThanNBHI?.documents;

  if (!!insuredNotVisitProof && insuredNotVisitProof?.length > 0) {
    renderJSX?.push(
      <Box>
        <Title order={5} c="green">
          Insured not visit reason proofs
        </Title>
        <Flex gap={10}>
          {insuredNotVisitProof?.map((proof, ind) => (
            <ActionIcon
              key={ind}
              disabled={!proof}
              variant="light"
              onClick={() => {
                window.open(
                  `/Claims/action-inbox/documents?url=${encodeURIComponent(
                    proof
                  )}&name=Insured not visit reason proof`,
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

  if (!!policyOtherThanNBHIDocs && policyOtherThanNBHIDocs?.length > 0) {
    renderJSX?.push(
      <Box>
        <Title order={5} c="green">
          Insurance Policy other than NBHI Documents
        </Title>
        <Flex gap={10}>
          {policyOtherThanNBHIDocs?.map((doc, ind) => (
            <ActionIcon
              key={ind}
              disabled={!doc}
              variant="light"
              onClick={() => {
                window.open(
                  `/Claims/action-inbox/documents?url=${encodeURIComponent(
                    doc
                  )}&name=Insurance Policy other than NBHI Document`,
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

  if (!!insuredVerification?.prevInsurancePolicyCopy) {
    renderJSX?.push(
      <Box>
        <Title order={5} c="green">
          Previous Insurance Policy Copy
        </Title>
        <ActionIcon
          variant="light"
          onClick={() => {
            window.open(
              `/Claims/action-inbox/documents?url=${encodeURIComponent(
                insuredVerification?.prevInsurancePolicyCopy!
              )}&name=Previous Insurance Policy Copy `,
              "_blank"
            );
          }}
        >
          <BiLink />
        </ActionIcon>
      </Box>
    );
  }

  if (
    rmFindings?.recommendation?.evidences &&
    rmFindings?.recommendation?.evidences?.length > 0
  ) {
    renderJSX?.push(
      <Box>
        <Title order={5} c="green">
          Repudiation Evidences
        </Title>
        <Flex gap={10}>
          {rmFindings?.recommendation?.evidences?.map((evidence, ind) => (
            <ActionIcon
              key={ind}
              disabled={!evidence}
              variant="light"
              onClick={() => {
                window.open(
                  `/Claims/action-inbox/documents?url=${encodeURIComponent(
                    evidence
                  )}&name=Repudiation Evidence`,
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

export default ExtraUploadsReimbursement;
