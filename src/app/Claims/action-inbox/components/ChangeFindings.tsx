import React, { Dispatch, SetStateAction } from "react";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  data?: IDashboardData;
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const ChangeFindings = ({ data, caseDetail, setCaseDetail }: PropTypes) => {
  return data?.claimType === "PreAuth" ? (
    <h1>InvestigationFindings Coming Soon</h1>
  ) : (
    <h1> RMInvestigationFindings Coming Soon</h1>
  );
};

export default ChangeFindings;
