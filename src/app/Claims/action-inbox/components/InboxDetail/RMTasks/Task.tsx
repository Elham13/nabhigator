import React, { Dispatch, ReactNode, SetStateAction, Fragment } from "react";
import { Spin } from "antd";
import dynamic from "next/dynamic";
const NPSConfirmation = dynamic(() => import("./NPSConfirmation"), {
  ssr: false,
  loading: () => <Spin />,
});
const PrePostVerification = dynamic(() => import("./PrePostVerification"), {
  ssr: false,
  loading: () => <Spin />,
});
const HospitalDailyCash = dynamic(() => import("./HospitalDailyCash"), {
  ssr: false,
  loading: () => <Spin />,
});
const OPDVerification = dynamic(() => import("./OPDVerification"), {
  ssr: false,
  loading: () => <Spin />,
});
const AHCVerification = dynamic(() => import("./AHCVerification"), {
  ssr: false,
  loading: () => <Spin />,
});
const ClaimVerification = dynamic(() => import("./ClaimVerification"), {
  ssr: false,
  loading: () => <Spin />,
});
const InsuredVerification = dynamic(() => import("./InsuredVerification"), {
  ssr: false,
  loading: () => <Spin />,
});
const VicinityVerification = dynamic(() => import("./VicinityVerification"), {
  ssr: false,
  loading: () => <Spin />,
});
const HospitalVerification = dynamic(() => import("./HospitalVerification"), {
  ssr: false,
  loading: () => <Spin />,
});
const TreatingDoctorVerification = dynamic(
  () => import("./TreatingDoctorVerification"),
  {
    ssr: false,
    loading: () => <Spin />,
  }
);
const FamilyOrReferringDoctorVerification = dynamic(
  () => import("./FamilyOrReferringDoctorVerification"),
  {
    ssr: false,
    loading: () => <Spin />,
  }
);
const LabOrPathologistVerification = dynamic(
  () => import("./LabOrPathologistVerification"),
  {
    ssr: false,
    loading: () => <Spin />,
  }
);
const ChemistVerification = dynamic(() => import("./ChemistVerification"), {
  ssr: false,
  loading: () => <Spin />,
});
const EmployerVerification = dynamic(() => import("./EmployerVerification"), {
  ssr: false,
  loading: () => <Spin />,
});
const RandomVicinityVerification = dynamic(
  () => import("./RandomVicinityVerification"),
  {
    ssr: false,
    loading: () => <Spin />,
  }
);
const EmploymentAndEstablishmentVerification = dynamic(
  () => import("./EmploymentAndEstablishmentVerification"),
  {
    ssr: false,
    loading: () => <Spin />,
  }
);
const MiscellaneousVerification = dynamic(
  () => import("./MiscellaneousVerification"),
  {
    ssr: false,
    loading: () => <Spin />,
  }
);
import {
  CaseDetail,
  IDashboardData,
  Task as ITask,
} from "@/lib/utils/types/fniDataTypes";

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

  return <Fragment>{tasksMap[task?.name]}</Fragment>;
};

export default Task;
