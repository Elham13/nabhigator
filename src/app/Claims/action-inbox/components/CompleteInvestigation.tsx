import React, { Dispatch, SetStateAction } from "react";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
import { getTasksAndDocs } from "@/lib/helpers";
import { AccordionItem, CustomAccordion } from "@/components/CustomAccordion";

const RMInvestigationFindings = dynamic(
  () => import("./InboxDetail/RMInvestigationFindings"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

const InvestigationFindings = dynamic(
  () => import("./InboxDetail/InvestigationFindings"),
  {
    ssr: false,
    loading: () => <Loading />,
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

  //   TODO: Add this
  if (data?.claimType === "Reimbursement")
    return caseDetail?.allocationType === "Single" ? (
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
    );

  return caseDetail?.allocationType === "Single" ? (
    <InvestigationFindings
      dashboardData={data || null}
      caseId={caseDetail?._id as string}
      findings={preAuthFindings}
      onClose={onClose}
      setCaseDetail={setCaseDetail}
    />
  ) : (
    <CustomAccordion>
      <AccordionItem title="Insured Part">
        <InvestigationFindings
          dashboardData={data || null}
          caseId={caseDetail?._id as string}
          findings={preAuthFindings}
          onClose={onClose}
          setCaseDetail={setCaseDetail}
        />
      </AccordionItem>
      <AccordionItem title="Hospital Part">
        <InvestigationFindings
          dashboardData={data || null}
          caseId={caseDetail?._id as string}
          findings={preAuthFindingsHospital}
          onClose={onClose}
          setCaseDetail={setCaseDetail}
        />
      </AccordionItem>
    </CustomAccordion>
  );
};

export default CompleteInvestigation;
