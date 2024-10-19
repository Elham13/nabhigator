import React, { Dispatch, Fragment, SetStateAction } from "react";
import {
  CaseDetail,
  IDashboardData,
  IShowElement,
} from "@/lib/utils/types/fniDataTypes";
import { BiCog } from "react-icons/bi";
import dynamic from "next/dynamic";
const TasksAndDocsButtons = dynamic(() => import("./TasksAndDocsButtons"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const CompleteInvestigation = dynamic(
  () => import("../CompleteInvestigation"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const CompleteDocuments = dynamic(
  () => import("./RMContent/CompleteDocuments"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);

type PropTypes = {
  data?: IDashboardData;
  caseDetail: CaseDetail | null;
  showElement: IShowElement;
  setShowElement: Dispatch<SetStateAction<IShowElement>>;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const CompleteInvestigationFooter = ({
  data,
  caseDetail,
  showElement,
  setShowElement,
  setCaseDetail,
}: PropTypes) => {
  return (
    <Fragment>
      {!showElement.completeTasks && !showElement.completeDocuments ? (
        <TasksAndDocsButtons
          id={(data?._id as string) || ""}
          claimType={data?.claimType}
          caseData={caseDetail}
          setShowElement={setShowElement}
        />
      ) : showElement.completeTasks && !showElement.completeDocuments ? (
        <CompleteInvestigation
          caseDetail={caseDetail}
          data={data}
          setCaseDetail={setCaseDetail}
          onClose={() =>
            setShowElement((prev) => ({
              ...prev,
              completeTasks: false,
            }))
          }
        />
      ) : showElement.completeDocuments && !showElement.completeTasks ? (
        <CompleteDocuments
          caseDetail={caseDetail}
          claimId={data?.claimId}
          setCaseDetail={setCaseDetail}
          claimType={data?.claimType}
          onClose={() =>
            setShowElement((prev) => ({
              ...prev,
              completeDocuments: false,
            }))
          }
        />
      ) : null}
    </Fragment>
  );
};

export default CompleteInvestigationFooter;
