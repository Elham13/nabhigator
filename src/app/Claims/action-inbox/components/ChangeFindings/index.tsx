import React, { Dispatch, SetStateAction } from "react";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import CompleteInvestigation from "../CompleteInvestigation";

type PropTypes = {
  data?: IDashboardData;
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const ChangeFindings = ({ data, caseDetail, setCaseDetail }: PropTypes) => {
  return (
    <CompleteInvestigation
      isQa={true}
      caseDetail={caseDetail}
      data={data}
      setCaseDetail={setCaseDetail}
      onClose={() => {}}
    />
  );
};

export default ChangeFindings;
