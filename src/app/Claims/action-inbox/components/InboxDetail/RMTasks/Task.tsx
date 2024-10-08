import React, { Dispatch, ReactNode, SetStateAction, Fragment } from "react";
import dynamic from "next/dynamic";
const NPSConfirmation = dynamic(() => import("./NPSConfirmation"), {
  ssr: false,
  loading: () => <Loading />,
});
const PrePostVerification = dynamic(() => import("./PrePostVerification"), {
  ssr: false,
  loading: () => <Loading />,
});
const HospitalDailyCash = dynamic(() => import("./HospitalDailyCash"), {
  ssr: false,
  loading: () => <Loading />,
});
const OPDVerification = dynamic(() => import("./OPDVerification"), {
  ssr: false,
  loading: () => <Loading />,
});
const AHCVerification = dynamic(() => import("./AHCVerification"), {
  ssr: false,
  loading: () => <Loading />,
});
const ClaimVerification = dynamic(() => import("./ClaimVerification"), {
  ssr: false,
  loading: () => <Loading />,
});
const InsuredVerification = dynamic(() => import("./InsuredVerification"), {
  ssr: false,
  loading: () => <Loading />,
});
const VicinityVerification = dynamic(() => import("./VicinityVerification"), {
  ssr: false,
  loading: () => <Loading />,
});
const HospitalVerification = dynamic(() => import("./HospitalVerification"), {
  ssr: false,
  loading: () => <Loading />,
});
const TreatingDoctorVerification = dynamic(
  () => import("./TreatingDoctorVerification"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const FamilyOrReferringDoctorVerification = dynamic(
  () => import("./FamilyOrReferringDoctorVerification"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const LabOrPathologistVerification = dynamic(
  () => import("./LabOrPathologistVerification"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const ChemistVerification = dynamic(() => import("./ChemistVerification"), {
  ssr: false,
  loading: () => <Loading />,
});
const EmployerVerification = dynamic(() => import("./EmployerVerification"), {
  ssr: false,
  loading: () => <Loading />,
});
const RandomVicinityVerification = dynamic(
  () => import("./RandomVicinityVerification"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const EmploymentAndEstablishmentVerification = dynamic(
  () => import("./EmploymentAndEstablishmentVerification"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const MiscellaneousVerification = dynamic(
  () => import("./MiscellaneousVerification"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
import {
  CaseDetail,
  IDashboardData,
  Task as ITask,
} from "@/lib/utils/types/fniDataTypes";
import Loading from "@/components/Loading";

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
