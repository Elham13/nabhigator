import { CaseDetail } from "@/lib/utils/types/fniDataTypes";
import React from "react";
import AHCVerificationPart from "./AHCVerificationPart";

type PropTypes = {
  caseData: CaseDetail | null;
};
const RMInvestigatorFindings = ({ caseData }: PropTypes) => {
  const rmFindings = caseData?.rmFindings;

  return (
    <div>
      {rmFindings?.["AHC Verification Part"] ? (
        <AHCVerificationPart values={rmFindings?.["AHC Verification Part"]} />
      ) : null}
    </div>
  );
};

export default RMInvestigatorFindings;
