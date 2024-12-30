import React from "react";
import { View } from "@react-pdf/renderer";
import AssignmentSummary from "./AssignmentSummary";
import { TDocType } from "../page";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import InvestigatorFindings from "./PreaAuth/InvestigatorFindings";
import RMInvestigatorFindings from "./Reimbursement/RMInvestigatorFindings";

type PropTypes = {
  dashboardData: IDashboardData | null;
  caseData: CaseDetail | null;
  docType: TDocType;
};

const FieldInvestigationReport = ({
  dashboardData,
  caseData,
  docType,
}: PropTypes) => {
  return (
    <View>
      <AssignmentSummary
        data={dashboardData}
        caseData={caseData}
        title="Field Investigation Report"
        docType={docType}
      />

      {dashboardData?.claimType === "PreAuth" ? (
        <InvestigatorFindings
          caseData={caseData}
          dashboardData={dashboardData}
        />
      ) : dashboardData?.claimType === "Reimbursement" ? (
        <RMInvestigatorFindings
          caseData={caseData}
          claimType={dashboardData?.claimType}
          claimInvestigators={dashboardData?.claimInvestigators}
          dashboardData={dashboardData}
        />
      ) : null}
    </View>
  );
};

export default FieldInvestigationReport;
