import { ITableHeader } from "../types/fniDataTypes";

export const mainDashboardTableHeaders: ITableHeader[] = [
  {
    value: "claimId",
    label: "Pre Auth/Claim Number",
    sortable: true,
  },
  {
    value: "claimType",
    label: "Claim Type",
    sortable: true,
  },
  {
    value: "claimSubType",
    label: "Claim SubType",
    sortable: true,
  },
  {
    value: "lossType",
    label: "Loss Type",
    sortable: true,
  },
  {
    value: "benefitType",
    label: "Benefit Type",
    sortable: true,
  },
  {
    value: "stage",
    label: "Stage",
    sortable: true,
  },
  {
    value: "claimDetails.claimAmount",
    label: "Claim Amount",
    sortable: true,
  },
  {
    value: "insuredDetails.insuredName",
    label: "Insured Name",
    sortable: true,
  },
  {
    value: "hospitalDetails.providerName",
    label: "Hospital Name",
    sortable: true,
  },
  {
    value: "hospitalDetails.providerCity",
    label: "Hospital City",
    sortable: true,
  },
  {
    value: "hospitalDetails.providerState",
    label: "Hospital State",
    sortable: true,
  },
  {
    value: "hospitalizationDetails.dateOfAdmission",
    label: "DOA",
    sortable: false,
  },
  {
    value: "intimationDate",
    label: "Date of Int",
    sortable: true,
  },
  {
    value: "dateOfOS",
    label: "Date of OS",
    sortable: true,
  },
  {
    value: "dateOfFallingIntoPostQaBucket",
    label: "Date Of Falling In Post QA",
    sortable: true,
  },
  {
    value: "invReportReceivedDate",
    label: "Report Received Date",
    sortable: true,
  },
  {
    value: "dateOfClosure",
    label: "Date of Closure",
    sortable: true,
  },
  {
    value: "teamLead",
    label: "TL",
    sortable: false,
  },
  {
    value: "clusterManager",
    label: "Cluster Manager",
    sortable: false,
  },
  {
    value: "postQa",
    label: "Post QA Name",
    sortable: false,
  },
  {
    value: "finalOutcome",
    label: "Final Outcome",
    sortable: false,
  },
  {
    value: "investigatorRecommendation",
    label: "Investigator Recommendation",
    sortable: true,
  },
  {
    value: "claimInvestigators",
    label: "Field Investigator",
    sortable: true,
  },
  {
    value: "allocationType",
    label: "Allocation Type",
    sortable: true,
  },
  {
    value: "openTAT",
    label: "Open TAT",
    sortable: true,
  },
  {
    value: "closureTAT",
    label: "Closure TAT",
    sortable: true,
  },
  {
    value: "actions",
    label: "Actions",
    sortable: false,
  },
];

export const historyTableHeadings: ITableHeader[] = [
  { value: "claim_number", label: "Claim Number", sortable: true },
  { value: "dsClaimId", label: "DS Claim ID", sortable: true },
  { value: "claims_Status", label: "Claim Status", sortable: true },
  { value: "fcu", label: "FCU Status", sortable: false },
  { value: "hospital", label: "Hospital", sortable: true },
  { value: "diagnosis", label: "Diagnosis", sortable: true },
  { value: "DOA", label: "Date of admission", sortable: true },
  { value: "DOD", label: "Date of discharge", sortable: true },
];

export const investigatorsTableHead: ITableHeader[] = [
  {
    value: "investigatorName",
    label: "Name",
    sortable: true,
  },
  {
    value: "phone",
    label: "Phone",
    sortable: true,
  },
  {
    value: "email",
    label: "Email",
    sortable: false,
  },
  {
    value: "dailyThreshold",
    label: "Daily Threshold",
    sortable: true,
  },
  {
    value: "monthlyThreshold",
    label: "Monthly Threshold",
    sortable: true,
  },
  {
    value: "Type",
    label: "Type",
    sortable: false,
  },
  {
    value: "Mode",
    label: "Mode",
    sortable: false,
  },
  {
    value: "assignmentPreferred",
    label: "Assignement Preferred",
    sortable: false,
  },
  {
    value: "State",
    label: "State",
    sortable: true,
  },
  {
    value: "userStatus",
    label: "User Status",
    sortable: true,
  },
  {
    value: "performance",
    label: "Performance",
    sortable: true,
  },
  {
    value: "dailyAssign",
    label: "Daily Assign",
    sortable: true,
  },
  {
    value: "monthlyAssigned",
    label: "Monthly Assign",
    sortable: true,
  },
  {
    value: "updatedDate",
    label: "Updated Date",
    sortable: true,
  },
  {
    value: "",
    label: "Actions",
    sortable: false,
  },
];

export const feedingLogsTableHeaders: ITableHeader[] = [
  {
    value: "claimId",
    label: "Claim Id",
    sortable: true,
  },
  {
    value: "failureReason",
    label: "Failure Reason",
    sortable: false,
  },
];

export const assignCaseTableHeaders: ITableHeader[] = [
  {
    value: "claimId",
    label: "Claim Id",
    sortable: false,
  },
  {
    value: "claimType",
    label: "Claim Type",
    sortable: false,
  },
];

export const multipleEventTableHeading: ITableHeader[] = [
  {
    value: "claimId",
    label: "Claim No",
    sortable: false,
  },
  {
    value: "claimType",
    label: "Claim Type",
    sortable: false,
  },
  {
    value: "intimationDate",
    label: "Intimation Date",
    sortable: false,
  },
  {
    value: "status",
    label: "Status",
    sortable: false,
  },
  {
    value: "recommendation",
    label: "Recommendation",
    sortable: false,
  },
  {
    value: "closureDate",
    label: "Closure Date",
    sortable: false,
  },
  {
    value: "investigator",
    label: "Investigator",
    sortable: false,
  },
  {
    value: "clusterManager",
    label: "Cluster Manager",
    sortable: false,
  },
  {
    value: "zonalManager",
    label: "Zonal Manager",
    sortable: false,
  },
  {
    value: "qaBy",
    label: "QA By",
    sortable: false,
  },
];

export const singleEventTableHeading: ITableHeader[] = [
  {
    value: "eventName",
    label: "Event Name",
    sortable: false,
  },
  {
    value: "eventDate",
    label: "Event Date",
    sortable: false,
  },
  {
    value: "eventDate",
    label: "Event Time",
    sortable: false,
  },
  {
    value: "userName",
    label: "User Name",
    sortable: false,
  },
  {
    value: "eventRemarks",
    label: "Event Remarks",
    sortable: false,
  },
];

export const usersTableHeaders: ITableHeader[] = [
  {
    value: "name",
    label: "Name",
    sortable: true,
  },
  {
    value: "userId",
    label: "User ID",
    sortable: true,
  },
  {
    value: "phone",
    label: "Phone",
    sortable: true,
  },
  {
    value: "password",
    label: "Password",
    sortable: true,
  },
  {
    value: "role",
    label: "Role",
    sortable: false,
  },
  {
    value: "status",
    label: "User Status",
    sortable: false,
  },
  {
    value: "",
    label: "Actions",
    sortable: false,
  },
];

export const postQaTableHeaders: ITableHeader[] = [
  {
    value: "name",
    label: "Name",
    sortable: true,
  },
  {
    value: "userId",
    label: "User ID",
    sortable: true,
  },
  {
    value: "dailyThreshold",
    label: "Daily Threshold",
    sortable: false,
  },
  {
    value: "dailyAssign",
    label: "Daily Assign",
    sortable: false,
  },
  {
    value: "status",
    label: "Status",
    sortable: true,
  },
  {
    value: "shiftTime",
    label: "Shift Time",
    sortable: true,
  },
  {
    value: "leadView",
    label: "Claim Type",
    sortable: true,
  },
  {
    value: "role",
    label: "Role",
    sortable: false,
  },
  {
    value: "",
    label: "Action",
    sortable: false,
  },
];
