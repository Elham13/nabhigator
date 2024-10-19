import React, { Dispatch, SetStateAction, Fragment } from "react";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import dynamic from "next/dynamic";
import { getTasksAndDocs } from "@/lib/helpers";
import { AccordionItem, CustomAccordion } from "@/components/CustomAccordion";
import { BiCog } from "react-icons/bi";
import { ActionIcon, Box, Button } from "@mantine/core";
import { IoIosClose } from "react-icons/io";

const RMInvestigationFindings = dynamic(
  () => import("./InboxDetail/RMInvestigationFindings"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);

const InvestigationFindings = dynamic(
  () => import("./InboxDetail/InvestigationFindings"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);

type PropTypes = {
  isQa?: boolean;
  data?: IDashboardData;
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
  onClose: () => void;
};

const CompleteInvestigation = ({
  isQa,
  data,
  caseDetail,
  setCaseDetail,
  onClose,
}: PropTypes) => {
  const {
    preAuthFindings,
    preAuthFindingsHospital,
    preAuthFindingsQA,
    preAuthFindingsQAHospital,
    rmFindings,
    rmFindingsQA,
    rmFindingsQAHospital,
    rmFindingsHospital,
    tasksAndDocs,
    tasksAndDocsHospital,
  } = getTasksAndDocs({
    claimType: data?.claimType,
    claimCase: caseDetail,
  });

  if (data?.claimType === "Reimbursement")
    return (
      <Box className="relative bg-white">
        <Box className="absolute top-0 right-0">
          <ActionIcon color="red" onClick={onClose}>
            <IoIosClose />
          </ActionIcon>
        </Box>
        {caseDetail?.allocationType === "Single" ? (
          <RMInvestigationFindings
            isQa={isQa}
            tasksAndDocs={tasksAndDocs}
            rmFindings={isQa ? rmFindingsQA : rmFindings}
            caseDetail={caseDetail}
            dashboardData={data}
            setCaseDetail={setCaseDetail}
          />
        ) : (
          <CustomAccordion>
            <AccordionItem title="Insured Part">
              <RMInvestigationFindings
                isQa={isQa}
                tasksAndDocs={tasksAndDocs}
                rmFindings={isQa ? rmFindingsQA : rmFindings}
                caseDetail={caseDetail}
                dashboardData={data}
                setCaseDetail={setCaseDetail}
              />
            </AccordionItem>
            <AccordionItem title="Hospital Part">
              <RMInvestigationFindings
                isQa={isQa}
                tasksAndDocs={tasksAndDocsHospital}
                rmFindings={isQa ? rmFindingsQAHospital : rmFindingsHospital}
                caseDetail={caseDetail}
                dashboardData={data}
                setCaseDetail={setCaseDetail}
              />
            </AccordionItem>
          </CustomAccordion>
        )}

        <Button mt={20} onClick={onClose}>
          Submit
        </Button>
      </Box>
    );

  return (
    <Box className="relative bg-white">
      <Box className="absolute top-0 right-0">
        <ActionIcon color="red" onClick={onClose}>
          <IoIosClose />
        </ActionIcon>
      </Box>
      {caseDetail?.allocationType === "Single" ? (
        <InvestigationFindings
          isQa={isQa}
          dashboardData={data || null}
          caseId={caseDetail?._id as string}
          findings={isQa ? preAuthFindingsQA : preAuthFindings}
          setCaseDetail={setCaseDetail}
        />
      ) : (
        <CustomAccordion>
          <AccordionItem title="Insured Part">
            <InvestigationFindings
              isQa={isQa}
              dashboardData={data || null}
              caseId={caseDetail?._id as string}
              findings={isQa ? preAuthFindingsQA : preAuthFindings}
              setCaseDetail={setCaseDetail}
            />
          </AccordionItem>
          <AccordionItem title="Hospital Part">
            <InvestigationFindings
              isQa={isQa}
              dashboardData={data || null}
              caseId={caseDetail?._id as string}
              findings={
                isQa ? preAuthFindingsQAHospital : preAuthFindingsHospital
              }
              setCaseDetail={setCaseDetail}
            />
          </AccordionItem>
        </CustomAccordion>
      )}

      <Button mt={20} onClick={onClose}>
        Submit
      </Button>
    </Box>
  );
};

export default CompleteInvestigation;
