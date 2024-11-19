import React from "react";
import { CaseDetail, ClaimInvestigator } from "@/lib/utils/types/fniDataTypes";
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
import NPSConfirmation from "./NPSConfirmation";
import OPDVerificationPart from "./OPDVerificationPart";
import PrePostVerification from "./PrePostVerification";
import RandomVicinityVerification from "./RandomVicinityVerification";
import TreatingDoctorVerification from "./TreatingDoctorVerification";
import VicinityVerification from "./VicinityVerification";
import CommonTasks from "./CommonTasks";
import { getTasksAndDocs } from "@/lib/helpers";
import dayjs from "dayjs";
import TwoSectionView from "../../TwoSectionView";

type PropTypes = {
  caseData: CaseDetail | null;
  claimInvestigators?: ClaimInvestigator[];
  claimType?: "PreAuth" | "Reimbursement";
};
const RMInvestigatorFindings = ({
  caseData,
  claimInvestigators,
  claimType,
}: PropTypes) => {
  const { rmFindings, tasksAndDocs } = getTasksAndDocs({
    claimType,
    claimCase: caseData,
  });

  const investigationFooter = [
    {
      key: "Name of investigator",
      value: !!claimInvestigators
        ? claimInvestigators?.map((el) => el.name)?.join(", ")
        : "-",
    },
    {
      key: "Date of report submission",
      value: dayjs(tasksAndDocs?.invReportReceivedDate).format(
        "DD-MMM-YYYY hh:mm:ss a"
      ),
    },
  ];

  return (
    <div>
      {!!rmFindings?.["Insured Verification"] && (
        <InsuredVerification values={rmFindings?.["Insured Verification"]} />
      )}

      {!!rmFindings?.["Hospital Verification"] && (
        <HospitalVerification values={rmFindings?.["Hospital Verification"]} />
      )}
      {!!rmFindings?.["Claim Verification"] && (
        <ClaimVerification values={rmFindings?.["Claim Verification"]} />
      )}
      {!!rmFindings?.["Treating Doctor Verification"] && (
        <TreatingDoctorVerification
          values={rmFindings?.["Treating Doctor Verification"]}
        />
      )}
      {!!rmFindings?.["Chemist Verification"] && (
        <ChemistVerification values={rmFindings?.["Chemist Verification"]} />
      )}
      {!!rmFindings?.["OPD Verification Part"] && (
        <OPDVerificationPart values={rmFindings?.["OPD Verification Part"]} />
      )}
      {!!rmFindings?.["Lab Part/Pathologist Verification"] && (
        <LabOrPathologistVerification
          values={rmFindings?.["Lab Part/Pathologist Verification"]}
        />
      )}
      {!!rmFindings?.["NPS Confirmation"] && (
        <NPSConfirmation values={rmFindings?.["NPS Confirmation"]} />
      )}
      {!!rmFindings?.["AHC Verification Part"] && (
        <AHCVerificationPart values={rmFindings?.["AHC Verification Part"]} />
      )}
      {!!rmFindings?.["Pre-Post Verification"] && (
        <PrePostVerification values={rmFindings?.["Pre-Post Verification"]} />
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

      {!!rmFindings?.[
        "Random Vicinity Hospital/Lab/Doctor/Chemist Verification"
      ] && (
        <RandomVicinityVerification
          values={
            rmFindings?.[
              "Random Vicinity Hospital/Lab/Doctor/Chemist Verification"
            ]
          }
        />
      )}

      {!!rmFindings?.["Vicinity Verification"] && (
        <VicinityVerification values={rmFindings?.["Vicinity Verification"]} />
      )}
      {!!rmFindings?.["Miscellaneous Verification"] && (
        <MiscellaneousVerification
          values={rmFindings?.["Miscellaneous Verification"]}
        />
      )}
      <CommonTasks values={rmFindings} />
      <TwoSectionView data={investigationFooter} topic="" />
    </div>
  );
};

export default RMInvestigatorFindings;
