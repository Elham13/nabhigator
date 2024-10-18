import React, { Dispatch, ReactNode, SetStateAction, Suspense } from "react";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import { IRMFindings } from "@/lib/utils/types/rmDataTypes";
import dynamic from "next/dynamic";
import { BiCog } from "react-icons/bi";

const NPSConfirmation = dynamic(() => import("./modules/NPSConfirmation"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const PrePostVerification = dynamic(
  () => import("./modules/PrePostVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const HospitalDailyCash = dynamic(() => import("./modules/HospitalDailyCash"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const OPDVerification = dynamic(() => import("./modules/OPDVerification"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const AHCVerification = dynamic(() => import("./modules/AHCVerification"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const ClaimVerification = dynamic(() => import("./modules/ClaimVerification"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const InsuredVerification = dynamic(
  () => import("./modules/InsuredVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const VicinityVerification = dynamic(
  () => import("./modules/VicinityVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const HospitalVerification = dynamic(
  () => import("./modules/HospitalVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const TreatingDoctorVerification = dynamic(
  () => import("./modules/TreatingDoctorVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const FamilyOrReferringDoctorVerification = dynamic(
  () => import("./modules/FamilyOrReferringDoctorVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const LabOrPathologistVerification = dynamic(
  () => import("./modules/LabOrPathologistVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const ChemistVerification = dynamic(
  () => import("./modules/ChemistVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const EmployerVerification = dynamic(
  () => import("./modules/EmployerVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const RandomVicinityVerification = dynamic(
  () => import("./modules/RandomVicinityVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const EmploymentAndEstablishmentVerification = dynamic(
  () => import("./modules/EmploymentAndEstablishmentVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const MiscellaneousVerification = dynamic(
  () => import("./modules/MiscellaneousVerification"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);

type PropTypes = {
  taskName: string;
  data: IDashboardData | null;
  caseId?: string;
  findings: IRMFindings | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const Tasks = ({
  data,
  caseId,
  findings,
  taskName,
  setCaseDetail,
}: PropTypes) => {
  const tasksMap: Record<string, ReactNode> = {
    "NPS Confirmation": (
      <NPSConfirmation
        data={data}
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Pre-Post Verification": (
      <PrePostVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Hospital Daily Cash Part": (
      <HospitalDailyCash
        data={data}
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "OPD Verification Part": (
      <OPDVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "AHC Verification Part": (
      <AHCVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Claim Verification": (
      <ClaimVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Insured Verification": (
      <InsuredVerification
        data={data}
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Vicinity Verification": (
      <VicinityVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Hospital Verification": (
      <HospitalVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Treating Doctor Verification": (
      <TreatingDoctorVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Family Doctor Part/Referring Doctor Verification": (
      <FamilyOrReferringDoctorVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Lab Part/Pathologist Verification": (
      <LabOrPathologistVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Chemist Verification": (
      <ChemistVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Employer Verification": (
      <EmployerVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Random Vicinity Hospital/Lab/Doctor/Chemist Verification": (
      <RandomVicinityVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Employment & Establishment Verification": (
      <EmploymentAndEstablishmentVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Miscellaneous Verification": (
      <MiscellaneousVerification
        caseId={caseId}
        findings={findings}
        setCaseDetail={setCaseDetail}
      />
    ),
  };
  return (
    <Suspense fallback={<BiCog className="animate-spin" />}>
      {tasksMap[taskName]}
    </Suspense>
  );
};

export default Tasks;
