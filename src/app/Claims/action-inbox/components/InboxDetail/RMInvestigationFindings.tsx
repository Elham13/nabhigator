import React, { Dispatch, SetStateAction, useMemo } from "react";
import {
  CaseDetail,
  IDashboardData,
  Task as ITask,
} from "@/lib/utils/types/fniDataTypes";

type PropTypes = {
  dashboardData?: IDashboardData;
  caseDetail: CaseDetail | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
};

const RMInvestigationFindings = ({
  dashboardData,
  caseDetail,
  setCaseDetail,
}: PropTypes) => {
  return <div>Coming soon</div>;
};

export default RMInvestigationFindings;

// import React, { Dispatch, SetStateAction, useMemo } from "react";
// import Task from "./RMTasks/Task";
// import {
//   CaseDetail,
//   IDashboardData,
//   Task as ITask,
// } from "@/lib/utils/types/fniDataTypes";
// import CommonFormComponent from "./CommonFormComponent";
// import { AccordionItem, CustomAccordion } from "@/components/CustomAccordion";

// type PropTypes = {
//   dashboardData?: IDashboardData;
//   caseDetail: CaseDetail | null;
//   setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
// };

// const RMInvestigationFindings = ({
//   dashboardData,
//   caseDetail,
//   setCaseDetail,
// }: PropTypes) => {
//   const items = useMemo(() => {
//     if (
//       caseDetail?.allocationType === "Dual" &&
//       (!caseDetail?.insuredTasksAndDocs || !caseDetail?.hospitalTasksAndDocs)
//     )
//       return [];

//     let tasks: ITask[] = [];

//     if (caseDetail?.allocationType === "Single")
//       tasks = caseDetail?.singleTasksAndDocs?.tasks || [];

//     if (caseDetail?.allocationType === "Dual") {
//       tasks = caseDetail?.insuredTasksAndDocs?.tasks || [];
//     }

//     if (tasks?.length > 0) {
//       return tasks?.map((task, index) => (
//         <AccordionItem key={task?.name} title={task?.name}>
//           <Task
//             task={task}
//             data={dashboardData || null}
//             setCaseDetail={setCaseDetail}
//             caseDetail={caseDetail}
//           />
//         </AccordionItem>
//       ));
//     } else return [];
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [caseDetail, dashboardData]);

//   return (
//     <div>
//       <h1 className="mb-8 text-center font-bold text-3xl text-blue-500">
//         Tasks Assigned
//       </h1>

//       <CustomAccordion>{items}</CustomAccordion>

//       <CommonFormComponent
//         caseDetail={caseDetail}
//         setCaseDetail={setCaseDetail}
//         claimId={dashboardData?.claimId || 0}
//       />
//     </div>
//   );
// };

// export default RMInvestigationFindings;
