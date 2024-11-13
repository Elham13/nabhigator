import { IDashboardData } from "@/lib/utils/types/fniDataTypes";

interface IData
  extends Omit<IDashboardData, "hospitalizationDetails" | "teamLead"> {
  hospitalizationDetails: Omit<
    IDashboardData["hospitalizationDetails"],
    "admissionType"
  > & {
    admissionType: string;
  };
}

const dashboardDataDefaultValues = {
  claimId: 2013772,
  claimType: "Reimbursement",
  claimSubType: "In-patient Hospitalization",
  lossType: "-",
  benefitType: "-",
  contractDetails: {
    contractNo: "34105110",
    product: "AS I G+ 5L PD4",
    prevInsuranceCompany: "",
    policyNo: "34105110202400",
    policyStartDate: "2024-06-29T00:00:00.000Z",
    policyEndDate: "2025-06-28T00:00:00.000Z",
    port: "No",
    insuredSince: "2024-06-29",
    mbrRegDate: "2024-06-29",
    NBHIPolicyStartDate: "2024-06-29",
    membersCovered: 1,
    agentName: "HDFC BANK LTD. - BNK0090001",
    currentStatus: "Active",
    agentCode: "BNK0090001",
    branchLocation: "Uttar Pradesh",
    sourcing: "Maximus",
    bancaDetails: "HDFC BANK LTD. - BNK0090001",
    customerType: "Retail",
  },
  members: [
    {
      membershipNumber: 19081105,
      membershipName: "Mr. ABHIRAJ SHARMA",
      DOB: "1995-10-13T00:00:00.000Z",
      relation: "Applicant",
      benefitsCovered: [
        {
          benefitType: "24 - Modern Treatments",
          benefitTypeIndicator: "Y",
        },
        {
          benefitType: "25 - Air Ambulance",
          benefitTypeIndicator: "Y",
        },
        {
          benefitType: "F  - Maternity",
          benefitTypeIndicator: "Y",
        },
        {
          benefitType: "I  - Health Check up",
          benefitTypeIndicator: "Y",
        },
        {
          benefitType: "K  - Second opinion",
          benefitTypeIndicator: "Y",
        },
        {
          benefitType: "V  - eConsultancy",
          benefitTypeIndicator: "Y",
        },
        {
          benefitType: "51 - Home Care/Domiciliary",
          benefitTypeIndicator: "Y",
        },
        {
          benefitType: "50 - Organ Donor",
          benefitTypeIndicator: "Y",
        },
        {
          benefitType: "A  - In-patient Hospitalization",
          benefitTypeIndicator: "Y",
        },
        {
          benefitType: "B  - Pre and Post Hospitalization Expenses",
          benefitTypeIndicator: "Y",
        },
        {
          benefitType: "26 - Shared accommodation Cash Benefit",
          benefitTypeIndicator: "Y",
        },
      ],
    },
  ],
  insuredDetails: {
    insuredName: "Mr. ABHIRAJ SHARMA",
    gender: "Male",
    dob: "1995-10-13T00:00:00.000Z",
    age: 29,
    address:
      "A452 WORLD BANK BARRA KANPUR KANPUR NAGAR UTTAR PRADESHA452 WORLD BANK BARRA KANPUR KANPUR NAGAR UTTAR PRADESH",
    city: "KANPUR NAGAR",
    state: "Uttar Pradesh",
    contactNo: "8933851714",
    emailId: "newgenpact@gmail.com",
    memberType: "Applicant",
    memberId: "19081105",
    pivotalCustomerId: "2003537773",
    height: "167.6",
    weight: "65",
    occupation: "",
    insuredType: "Applicant",
  },
  claimDetails: {
    claimStatus: "Under Verification",
    claimStatusUpdated: "Under Verification",
    noOfClaimsInHistory: 1,
    claimNo: "R_2013772",
    submittedAt: "27-OCT-2024",
    receivedAt: "27-OCT-2024",
    payTo: "Mr. ABHIRAJ SHARMA",
    memberNo: "19081105",
    pivotalCustomerId: "2003537773",
    claimType: "In-patient",
    mainClaim: "NA",
    hospitalizationType: "Planned",
    deductibleAmount: "Not Found",
    diagnosis: "Acute Gastroenteritis with severe dehydration",
    diagnosisCode1: "A09                 ",
    diagnosisCode2: "",
    diagnosisCode3: "",
    icdCode: "A09                 ",
    lineOfTreatment: "M",
    billedAmount: "67000",
    preAuthNo: "2013772",
    submittedBy: "Mr.ABHIRAJ SHARMA",
    claimAmount: 67000,
    exclusionRemark: "",
    fraudStatus: "None",
    fraudType: "",
    fraudReason: "",
    spotNumber: "",
    spotInvestigationRecommendation: "",
    spotInvestigationFindings: "",
    noOfClaimsCorrespondingToPivotalId: "",
    claimTrigger: "Manual",
    prePostIndicator: "Main",
  },
  hospitalDetails: {
    providerNo: "76018 ",
    providerName: "MAHAADEVA MULTI SPECIALITY HOSPITAL",
    providerType: "Hospital",
    providerAddress: "H.I.G 17/18/19, Vasant Vihar, Naubasta, Kanpur,   ",
    providerState: "Uttar Pradesh",
    providerCity: "KANPUR NAGAR",
    pinCode: "208021",
    preferredPartnerList: "False",
    doubtfulProvider: "",
    fraudList: "None",
    coutionList: null,
  },
  hospitalizationDetails: {
    treatingDoctorName: "Dr S N Pandey",
    treatingDoctorRegNo: "",
    dateOfAdmission: "04-Oct-2024",
    dateOfAdmissionUpdated: "04-Oct-2024",
    dateOfDischarge: "08-Oct-2024",
    dateOfDischargeUpdated: "08-Oct-2024",
    admissionType: "",
    LOS: "4",
  },
  historicalClaim: [
    {
      memberName: "Mr.ABHIRAJ SHARMA",
      claimPreAuthNo: "Not Found",
      memberNo: "0024061018",
      history: [
        {
          hospital: "MAHAADEVA MULTI SPECIALITY HOSPITAL",
          diagnosis: "Acute Gastroenteritis with severe dehydration",
          DOA: "2024-10-04T00:00:00.000Z",
          DOD: "2024-10-08T00:00:00.000Z",
          claimAmount: "",
          claim_number: "R_2013772",
          claims_Status: "Under Verification",
          fcu: "",
          dsClaimId: "",
        },
      ],
    },
  ],
  fraudIndicators: {
    indicatorsList: [
      {
        FRAUD_INDICATOR_DESC: "Fraud Prone Area",
        Values: {
          CL_Selected: "TRUE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Claim submission on weekend (especially in case of Pre Auth)",
        Values: {
          CL_Selected: "TRUE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Member Claim not notified (for reimbursement claims)",
        Values: {
          CL_Selected: "TRUE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Total no of claims >= policy year",
        Values: {
          CL_Selected: "TRUE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Claim post > 90 days of policy issuance",
        Values: {
          CL_Selected: "TRUE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "ICDs which does not fall in chronic ICD list",
        Values: {
          CL_Selected: "TRUE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Claim within first year of coverage, Single person, Single Insured, Minimum Insurance (for Silver SI 2L and Gold SI 5L policies )",
        Values: {
          CL_Selected: "TRUE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Amount above threshold limit (>=30 K <=100000)",
        Values: {
          CL_Selected: "TRUE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Claim in the first year of policy issuance.",
        Values: {
          CL_Selected: "TRUE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Others",
        Values: {
          CL_Selected: "TRUE",
          FI_Selected: "TRUE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Claim from Portability Policy in the 1st year of issuance.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Flagged De-listed / Caution Hospitals.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "late night claims of RTA.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Chronic Disease Category -  List of Chronic ICDS to be used",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Repeated Hospitalization in same hospital within specific policy period. ",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Fraud and Caution Hospital",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Fraud Prone Area.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Claim within first year of coverage, Single person, Single Insured, Minimum Insurance",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Admission date on weekend",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Reimbursement claims from Network Hospitals wherein preauth also received and rejected (DOA-DOD, Disesase to be checked if same than only trigger)",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Visible tampering of documents like overwriting ",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Post operative histopathology reports are not available (surgical cases).",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "High billed amount claim (> 1 lac)",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Reimbursement claims from Network Hospitals wherein no preauth received for that member",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Possible non disclosure/ misrepresentation of material facts",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Patient residence and the hospital, chemist address, are not geographically same. ",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Final enhancenment bill sent on saturday or sunday morning.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Treatment costs are usually on the higher side as compared to the etiology / Inflated treatment cost",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Claims related to Group mediclaim policy for the same hospital (High Utilization of Provider).",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Pressure exerted for early settlement.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Amount below threshold limit (<30 K)",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "PA claim intimated one day prior to discharge of patient.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Claim at the end of the policy period. ",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Claim in the first 90 days of policy issuance",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Total no of claims < policy year",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Late Claim notifications by the customer (beyond 90 days from date of discharge)",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Diagnosis of the ailment and the investigations done are not much related to each other ",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Possible non disclosure/ misrepresentation of material facts.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Claim from Platinum policy",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Renewed policy",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Multiple claims from single family (same member)",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Claim within first year of coverage.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "First claim intimation received after 48hours of admission.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Post Policy enhancement claims.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Submission of Indoor papers at the time of submission of claim with same handwriting from Date of admission to Discharge. (Including claim form)",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Medicine bills in serial order on different dates",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Claim intimation recived on saturdaty afternoon.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Claims related to Group mediclaim policy from same hospital ",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Poor medical history in Chronic ailments (complaints not mentioned, only diagnosis mentioned on claim document) ",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Surgical/anesthetic notes missing in the surgical cases.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Positive claim History of Infectious Diseases, Acute illness.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Repeated Hospitalization in same hospital within specific policy period or end of the policy period.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Claim at the end of the policy period.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "FnI recommendation genuine",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC: "Multiple claims from single family.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
      {
        FRAUD_INDICATOR_DESC:
          "Abnormal knowledge of policy coverage / claims process / terminology.",
        Values: {
          CL_Selected: "FALSE",
          FI_Selected: "FALSE",
        },
      },
    ],
    remarks:
      "SAS:Rule3PY:00|Age:28|Prod:ASIG+5LPD4|Rel:Applicant|tot_clm_count:.|mem_clm_count:.|F&C_prov:.|DeniedPA:0|UW:STPCase|MemCount:1|ICD_Desc:Diarrhoeaandgastro-enteritisofpresumedinfectiousorig|Ported:0",
  },
  allocationType: "Single",
  stage: 7,
  intimationDate: "27-Oct-2024 07:53:07 PM",
  isReInvestigated: false,
  investigationCount: 1,
  applicationId: "4004751077",
  caseId: "67211f4e608593bb7a788fbb",
  dateOfOS: new Date("2024-10-29T17:45:50.250Z"),
  dateOfClosure: null,
  postQa: "",
  lossDate: null,
  sumInsured: "",
  cataractOrDayCareProcedure: [
    {
      Benefit_Type: "A-In-patient Hospitalization",
      Benefit_Head: "A7-Hospital Accommodation",
    },
  ],
  sourceSystem: "M",
};
