import React from "react";
import { CaseDetail } from "@/lib/utils/types/fniDataTypes";
import AHCVerificationPart from "./AHCVerificationPart";
import ChemistVerification from "./ChemistVerification";
import ClaimVerification from "./ClaimVerification";
import EmployerVerification from "./EmployerVerification";
import EmploymentAndEstablishmentVerification from "./EmploymentAndEstablishmentVerification";
import FamilyDoctorPartReferringDoctorVerification from "./FamilyDoctorPartReferringDoctorVerification";
import HospitalDailyCashPart from "./HospitalDailyCashPart";
import HospitalVerification from "./HospitalVerification";
import InsuredVerification from "./InsuredVerification";
import LabOrPathologistVerification from "./LabOrPathologistVerification";
import MiscellaneousVerification from "./MiscellaneousVerification";

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
      {!!rmFindings?.["Claim Verification"] && (
        <ClaimVerification values={rmFindings?.["Claim Verification"]} />
      )}
      {!!rmFindings?.["Employer Verification"] && (
        <EmployerVerification values={rmFindings?.["Employer Verification"]} />
      )}
      {!!rmFindings?.["Employment & Establishment Verification"] && (
        <EmploymentAndEstablishmentVerification
          values={rmFindings?.["Employment & Establishment Verification"]}
        />
      )}
      {!!rmFindings?.["Family Doctor Part/Referring Doctor Verification"] && (
        <FamilyDoctorPartReferringDoctorVerification
          values={
            rmFindings?.["Family Doctor Part/Referring Doctor Verification"]
          }
        />
      )}
      {!!rmFindings?.["Hospital Daily Cash Part"] && (
        <HospitalDailyCashPart
          values={rmFindings?.["Hospital Daily Cash Part"]}
        />
      )}
      {!!rmFindings?.["Hospital Verification"] && (
        <HospitalVerification values={rmFindings?.["Hospital Verification"]} />
      )}
      {!!rmFindings?.["Insured Verification"] && (
        <InsuredVerification values={rmFindings?.["Insured Verification"]} />
      )}
      {!!rmFindings?.["Lab Part/Pathologist Verification"] && (
        <LabOrPathologistVerification
          values={rmFindings?.["Lab Part/Pathologist Verification"]}
        />
      )}
      {!!rmFindings?.["Miscellaneous Verification"] && (
        <MiscellaneousVerification
          values={rmFindings?.["Miscellaneous Verification"]}
        />
      )}
    </div>
  );
};

export default RMInvestigatorFindings;
