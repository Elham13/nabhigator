import React, { Dispatch, ReactNode, SetStateAction, Suspense } from "react";
import { Spin } from "antd";
const NPSConfirmation = dynamic(() => import("./NPSConfirmation"));
const PrePostVerification = dynamic(() => import("./PrePostVerification"));
const HospitalDailyCash = dynamic(() => import("./HospitalDailyCash"));
const OPDVerification = dynamic(() => import("./OPDVerification"));
const AHCVerification = dynamic(() => import("./AHCVerification"));
const ClaimVerification = dynamic(() => import("./ClaimVerification"));
const InsuredVerification = dynamic(() => import("./InsuredVerification"));
const VicinityVerification = dynamic(() => import("./VicinityVerification"));
const HospitalVerification = dynamic(() => import("./HospitalVerification"));
const TreatingDoctorVerification = dynamic(
  () => import("./TreatingDoctorVerification")
);
const FamilyOrReferringDoctorVerification = dynamic(
  () => import("./FamilyOrReferringDoctorVerification")
);
const LabOrPathologistVerification = dynamic(
  () => import("./LabOrPathologistVerification")
);
const ChemistVerification = dynamic(() => import("./ChemistVerification"));
const EmployerVerification = dynamic(() => import("./EmployerVerification"));
const RandomVicinityVerification = dynamic(
  () => import("./RandomVicinityVerification")
);
const EmploymentAndEstablishmentVerification = dynamic(
  () => import("./EmploymentAndEstablishmentVerification")
);
const MiscellaneousVerification = dynamic(
  () => import("./MiscellaneousVerification")
);
import {
  CaseDetail,
  IDashboardData,
  Task as ITask,
} from "@/lib/utils/types/fniDataTypes";
import dynamic from "next/dynamic";

type PropTypes = {
  task: ITask;
  data: IDashboardData | null;
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const Task = ({ task, data, caseDetail, setCaseDetail }: PropTypes) => {
  const tasksMap: Record<string, ReactNode> = {
    "NPS Confirmation": (
      <NPSConfirmation
        data={data}
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Pre-Post Verification": (
      <PrePostVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Hospital Daily Cash Part": (
      <HospitalDailyCash
        data={data}
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "OPD Verification Part": (
      <OPDVerification caseDetail={caseDetail} setCaseDetail={setCaseDetail} />
    ),
    "AHC Verification Part": (
      <AHCVerification caseDetail={caseDetail} setCaseDetail={setCaseDetail} />
    ),
    "Claim Verification": (
      <ClaimVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Insured Verification": (
      <InsuredVerification
        data={data}
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Vicinity Verification": (
      <VicinityVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Hospital Verification": (
      <HospitalVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Treating Doctor Verification": (
      <TreatingDoctorVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Family Doctor Part/Referring Doctor Verification": (
      <FamilyOrReferringDoctorVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Lab Part/Pathologist Verification": (
      <LabOrPathologistVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Chemist Verification": (
      <ChemistVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Employer Verification": (
      <EmployerVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Random Vicinity Hospital/Lab/Doctor/Chemist Verification": (
      <RandomVicinityVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Employment & Establishment Verification": (
      <EmploymentAndEstablishmentVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
    "Miscellaneous Verification": (
      <MiscellaneousVerification
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
    ),
  };

  return <Suspense fallback={<Spin />}>{tasksMap[task?.name]}</Suspense>;
};

export default Task;
