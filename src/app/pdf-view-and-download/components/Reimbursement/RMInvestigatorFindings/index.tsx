import React from "react";
import { CaseDetail } from "@/lib/utils/types/fniDataTypes";
import AHCVerificationPart from "./AHCVerificationPart";
import ChemistVerification from "./ChemistVerification";

type PropTypes = {
  caseData: CaseDetail | null;
};
const RMInvestigatorFindings = ({ caseData }: PropTypes) => {
  const rmFindings = caseData?.rmFindings;

  return (
    <div>
      {!!rmFindings?.["AHC Verification Part"] && (
        <AHCVerificationPart values={rmFindings?.["AHC Verification Part"]} />
      )}
      {!!rmFindings?.["Chemist Verification"] && (
        <ChemistVerification values={rmFindings?.["Chemist Verification"]} />
      )}
    </div>
  );
};

export default RMInvestigatorFindings;
