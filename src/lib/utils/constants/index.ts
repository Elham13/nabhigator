import {
  AcceptedValues,
  IUser,
  IVisibleColumn,
  Role,
  TClaimAmountThreshold,
} from "../types/fniDataTypes";

export const visibleColumnsOptions: IVisibleColumn[] = [
  {
    value: "claimId",
    label: "Pre Auth/Claim Number",
    visible: true,
  },
  {
    value: "claimType",
    label: "Claim Type",
    visible: true,
  },
  {
    value: "claimSubType",
    label: "Claim SubType",
    visible: true,
  },
  {
    value: "lossType",
    label: "Loss Type",
    visible: true,
  },
  {
    value: "benefitType",
    label: "Benefit Type",
    visible: true,
  },
  {
    value: "stage",
    label: "Stage",
    visible: true,
  },
  {
    value: "claimDetails.claimAmount",
    label: "Claim Amount",
    visible: true,
  },
  {
    value: "insuredDetails.insuredName",
    label: "Insured Name",
    visible: true,
  },
  {
    value: "hospitalDetails.providerName",
    label: "Hospital Name",
    visible: true,
  },
  {
    value: "hospitalDetails.providerCity",
    label: "Hospital City",
    visible: true,
  },
  {
    value: "hospitalDetails.providerState",
    label: "Hospital State",
    visible: true,
  },
  {
    value: "hospitalizationDetails.dateOfAdmission",
    label: "DOA",
    visible: true,
  },
  {
    value: "intimationDate",
    label: "Date of Int",
    visible: true,
  },
  {
    value: "dateOfOS",
    label: "Date of OS",
    visible: true,
  },
  {
    value: "dateOfFallingIntoPostQaBucket",
    label: "Date Of Falling In Post QA",
    visible: true,
  },
  {
    value: "invReportReceivedDate",
    label: "Report Received Date",
    visible: true,
  },
  {
    value: "dateOfClosure",
    label: "Date of Closure",
    visible: true,
  },
  {
    value: "teamLead",
    label: "TL",
    visible: true,
  },
  {
    value: "clusterManager",
    label: "Cluster Manager",
    visible: true,
  },
  {
    value: "postQa",
    label: "Post QA Name",
    visible: true,
  },
  {
    value: "finalOutcome",
    label: "Final Outcome",
    visible: true,
  },
  {
    value: "investigatorRecommendation",
    label: "Investigator Recommendation",
    visible: true,
  },
  {
    value: "claimInvestigators",
    label: "Field Investigator",
    visible: true,
  },
  {
    value: "allocationType",
    label: "Allocation Type",
    visible: true,
  },
  {
    value: "openTAT",
    label: "Open TAT",
    visible: true,
  },
  {
    value: "closureTAT",
    label: "Closure TAT",
    visible: true,
  },
  {
    value: "actions",
    label: "Actions",
    visible: true,
  },
];

export const usersInitials: IUser = {
  _id: "",
  config: {},
  email: "",
  name: "",
  phone: "",
  pinCode: "",
  city: "",
  district: "",
  state: [],
  role: [],
  zone: [],
  activeRole: "" as Role,
  createdAt: "",
  password: "",
  status: "",
  team: "",
  updatedAt: "",
  userId: "",
  userType: "" as "Internal" | "External",
  claimAmountThreshold: "" as TClaimAmountThreshold,
  updates: { userIsInformed: true, details: {} },
};

export const changeTaskInitialValues: AcceptedValues = {
  singleTasksAndDocs: null,
  insuredTasksAndDocs: null,
  hospitalTasksAndDocs: null,
  allocationType: "Single",
  caseType: [],
  caseTypeDependencies: {
    "PED/NDC": [],
    Genuineness: [],
    "Alcohol Intoxication/Addiction": [],
  },
  caseStatus: "Accepted",
  dashboardDataId: "",
  preQcObservation: "",
  insuredAddress: "",
  insuredCity: "",
  insuredState: "",
  insuredPinCode: 0,
  allocatorComment: "",
};
