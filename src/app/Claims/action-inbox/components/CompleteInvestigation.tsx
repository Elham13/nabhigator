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
  data?: IDashboardData;
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
  onClose: () => void;
};

const CompleteInvestigation = ({
  data,
  caseDetail,
  setCaseDetail,
  onClose,
}: PropTypes) => {
  const {
    preAuthFindings,
    preAuthFindingsHospital,
    rmFindings,
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
            tasksAndDocs={tasksAndDocs}
            rmFindings={rmFindings}
            caseDetail={caseDetail}
            dashboardData={data}
            setCaseDetail={setCaseDetail}
          />
        ) : (
          <CustomAccordion>
            <AccordionItem title="Insured Part">
              <RMInvestigationFindings
                tasksAndDocs={tasksAndDocs}
                rmFindings={rmFindings}
                caseDetail={caseDetail}
                dashboardData={data}
                setCaseDetail={setCaseDetail}
              />
            </AccordionItem>
            <AccordionItem title="Hospital Part">
              <RMInvestigationFindings
                tasksAndDocs={tasksAndDocsHospital}
                rmFindings={rmFindingsHospital}
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
          dashboardData={data || null}
          caseId={caseDetail?._id as string}
          findings={preAuthFindings}
          setCaseDetail={setCaseDetail}
        />
      ) : (
        <CustomAccordion>
          <AccordionItem title="Insured Part">
            <InvestigationFindings
              dashboardData={data || null}
              caseId={caseDetail?._id as string}
              findings={preAuthFindings}
              setCaseDetail={setCaseDetail}
            />
          </AccordionItem>
          <AccordionItem title="Hospital Part">
            <InvestigationFindings
              dashboardData={data || null}
              caseId={caseDetail?._id as string}
              findings={preAuthFindingsHospital}
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
