import React, { useState } from "react";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  data?: IDashboardData;
};

const ChangeFindings = ({ data }: PropTypes) => {
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  return data?.claimType === "PreAuth" ? (
    <h1>InvestigationFindings Coming Soon</h1>
  ) : (
    <h1> RMInvestigationFindings Coming Soon</h1>
  );
};

export default ChangeFindings;
