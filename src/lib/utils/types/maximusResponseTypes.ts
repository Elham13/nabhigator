export interface GetAuthRes {
  Status: string;
  Token: string;
  StatusMessage: string;
}

export interface ClaimDetail {
  Illness: string;
  Claim_Number: string;
  Claim_Type: string;
  Hospitilization_Date: Date | string;
  Discharge_Date: Date | string;
  Procedure_Code: string | null;
  Billed_Amount: string;
  Approved_Amount: string;
  Claims_Status: string;
  Claim_Reported_Date: Date | string;
  Contract_Number: string;
  Product_Type: string;
  Sum_Insured: string;
  Provider_Name: string;
  Claim_Decision_Date: Date | string;
}

export interface ClaimsGetByIdRes {
  Status: string;
  StatusMessage: string;
  PolicyNo: string;
  PolicyClaims: {
    Member_Name: string;
    membershipId: string;
    COI: any;
    SourceSystem: string;
    Customer_Type: string;
    ClaimDetail: ClaimDetail;
  };
}

export interface ClaimHistory {
  Illness: string;
  Claim_Number: string;
  Claim_Type: string;
  Hospitilization_Date: Date | string;
  Discharge_Date: Date | string;
  Procedure_Code: string;
  Billed_Amount: string;
  Approved_Amount: string;
  Claims_Status: string;
  Claim_Reported_Date: Date | string;
  Contract_Number: string;
  Product_Type: string;
  Sum_Insured: string;
  Provider_Name: string;
  Claim_Decision_Date: Date | string;
  Interim_Status: string;
  Final_Status: string;
  Provider_Code: string;
  TreatingDoctorName: string;
  TreatingDoctorID: string;
  ClaimStatusCode: string;
}

export interface MemberInHistory {
  Member_Name: string;
  memberNo: string;
  membershipId: string;
  COI: string;
  ClaimHistory: ClaimHistory[];
}

export interface ClaimHistoryRes {
  Status: string;
  StatusMessage: string;
  PolicyNo: string;
  PolicyClaims: {
    MemberList: MemberInHistory[];
  };
}

export interface ClaimBenefit {
  Benefit_Type: string;
  Benefit_Head: string;
}

export interface FNIDataClaims {
  Claims: string;
  ClaimsBenefits: ClaimBenefit[];
}

export interface FNIDataRes {
  Status: string;
  StatusMessage: string;
  ClaimsData: FNIDataClaims[];
}

export interface Member {
  MEMBER_ID: string;
  MEMBERSHIP_NO: string;
  MEMBER_NAME: string;
  MEMBER_DATE_OF_BIRTH: string;
  GENDER: string;
  MEMBER_STATUS: string;
  MEMBER_EFFECTIVE_DATE: string;
  MEMBER_REGISTRATION_DATE: string;
  PLAN_ID: string;
  CONT_NO: string;
  RELATION: string;
  PROPMEM: string;
  LOADING_PER_MEMBER: string;
  MEMBER_NCB: string;
  ISHEALTH_COACH: string | null;
  ISPAOPTED: string;
  MOBILE_NO: string;
  CUST_EMAIL: string;
  IsMemberAdult: string;
  GoQiiID: string | null;
  MGID: string;
  PractoID: string;
  COI: string | null;
  INSURE_MEMBER_HEIGHT: string;
  INSURE_MEMBER_WEIGHT: string;
  OCCUPATION: string;
}

export interface Contract {
  POLICY_NO: string;
  EFFECTIVE_DATE_OF_CONTRACT: string;
  CONTRACT_TERMINATION_DATE: string;
  NET_PREMIUM_AMOUNT: string;
  CONT_NO: string;
  PLAN_ID: string;
  APP_NO: string;
  SUM_INSURED: string;
  RENEWAL_CHECK: string;
  CONTRACT_ACCRUED_NCB: string;
  HEALTH_COACH: string | null;
  PAOPTED: string | null;
  PA_SUM_INSURED: string;
  CI_SUM_INSURED: string | null;
  Coverage_Type: string;
  Hosital_cash: string;
  Safeguard: string;
  SourceSystem: string;
  COVER_SUB_TYPE: string;
  AGENT_NAME: string;
  AGENT_CODE: string;
}

export interface KYCDetails {
  KYC_DONE: string;
  KYC_IDENTITY_MASTER: string;
  KYC_ADDRESS_MASTER: string;
  KYC_IDENTITY_RECORD_NUMBER: string;
  KYC_ADDRESS_RECORD_NUMBER: string;
  CKYC_NUMBER: string | null;
}

export interface NomineeDetails {
  Name: string;
  Relationship: string;
  DOB: string;
  Address: string;
  RelationShipID: string;
}

export interface Plan {
  PLAN_ID: string;
  PLAN_DESC: string;
  PLAN_LIMIT: string;
  FLOATER_LIMIT: string;
  TOTAL_INDIVIDUAL_LIMIT: string;
  PROD_TYPE: string;
  VARIANT: string;
  PRODUCT_NAME: string;
  CONT_NO: string;
  CARD_TYPE: string;
  VER_NUM: string;
  ADULT_COVERED: string;
  CHILD_COVERED: string;
}

export interface Customer {
  CUSTOMER_NUMBER: string;
  PIVOTAL_CUSTOMER_ID: string;
  CUSTOMER_NAME: string;
  PERMANENT_ADDRESS_1: string;
  PERMANENT_ADDRESS_2: string;
  PERMANENT_ADDRESS_3: string;
  PERMANENT_ADDRESS_4: string;
  PERMANENT_ADDRESS_CITY: string;
  PERMANENT_ADDRESS_STATE: string;
  PERMANENT_ADDRESS_PIN_CODE: string;
  CURRENT_ADDRESS_1: string;
  CURRENT_ADDRESS_2: string;
  CURRENT_ADDRESS_3: string;
  CURRENT_ADDRESS_4: string;
  CURRENT_ADDRESS_CITY: string;
  CURRENT_ADDRESS_STATE: string;
  CURRENT_ADDRESS_STATE_CODE: string;
  CURRENT_ADDRESS_CITY_CODE: string;
  CURRENT_ADDRESS_PIN_CODE: string;
  COMMUNICATION_ADDRESS: string;
  PHONE_NO1: string;
  PHONE_NO2: string;
  PHONE_NO3: string;
  CUST_EMAIL: string;
  POLICY_NO: string;
  GENDER: string;
  DOB: string;
  PORTABILITY_FLAG: string;
  PREVIOUS_INSURANCE_COMPANY: string | null;
  INSURED_SINCE: string;
  CUST_Nationality: string;
  CUST_EIA: string;
  CUST_EIA_Number: string;
  CUST_EIA_IRName: string;
  BRANCH_NAME: string;
  BRANCH_Code: string;
  SourceSystem: string;
  Customer_Type: string;
  ACH_Flag: string;
  Channel: string;
  APPLICATION_NUMBER: string;
  KYCDetails: KYCDetails;
  NomineeDetails: NomineeDetails;
  CONTRACTS: Contract[];
  PLANS: Plan[];
  MEMBERS: Member[];
}

export interface CustomerPolicyDetailRes {
  Status: string;
  StatusMessage: string;
  CUSTOMERS: Customer[];
}

export interface MemberDetail {
  MBRSHP_NO: string;
  memberId: string;
  PIV_MBR_ID: string;
  Previous_Member_ID: string | null;
  MBR_TYPE: string;
  Insured_Name: string;
  Gender: string;
  STATUS: string;
  STAFF_NO: string;
  IS_MBR_SPLIT: string;
  PROPOSER_RELATION: string;
}

export interface ContractAll {
  CONT_NO: string;
  CONT_YYMM: string;
  RENEW_YEAR_NO: string;
  POLICY_NUMBER: string;
  POLICY_START_DATE: string;
  POLICY_END_DATE: string;
  PRODUCT_TYPE: string;
  PRODUCT_NAME: string;
  PLAN_ID: string;
  PLAN_DESC: string;
  STATUS: string;
  APPLICATION_NO: string;
  APPLICATIONID: string;
}

export interface CustomerDetails {
  Name: string;
  Inception_Date: string;
  Pivotal_Id: string;
  Status: string;
}

export interface ContractAllDetailsRes {
  MEMBERS: any;
  Status: string;
  StatusMessage: string;
  ContractDetails: {
    customerDetails: CustomerDetails;
    Contracts: ContractAll[];
    MemberDetails: MemberDetail[];
  };
}

export interface ApplicationIdDetails {
  preIssuanceStatusData: any;
  Status: string;
  StatusMessage: string;
}

export interface ClaimDetailsOther {
  NOTES: any;
  DIAG_CODE: string;
  DIAG_CODE2: any;
  DIAG_CODE3: any;
  PROC_CODE: any;
  PROC_CODE2: any;
  FIRST_DIAG_DATE: any;
  HOSPITALIZAITONTYPE: string;
  WAIVE_REASON: any;
  DIAG_NOTE: string;
  REJ_QTY: any;
  REJ_AMT: any;
  REJ_DESC: string;
  REJ_REASON: string;
  FILE_REC_DATE: any;
  REPORT_SHARING_DATE: any;
  FINAL_OUTCOME: any;
  EXECUTIVE_SUMMARY: any;
  RECOMMENDATION: any;
  PROV_NAME: string;
  FRAUD_STATUS: string;
  FRAUDTYPE: string;
  FRAUDREASON: string;
  DiasnosisDetails: string;
  TERM_DATE: string;
  UNRECOGNIZED_IND: string;
  DEACTIVE: string;
  NETWORK_EXIST: string;
  NETWORK_TYPE: string;
  Claim_Status: string;
  ClaimStatusCode: string;
  DeductionDetailsKey: string;
  Exclusionremark: string;
  FCU: string;
  DS_Claim_Id: string;
  Claim_Trigger: string;
  Main_Claim: string;
  PrePost_Ind: string;
  Member_Type: string;
  Line_Of_Treatement: string;
}

export interface IFraudIndicator {
  FRAUD_INDICATOR_DESC: string;
  Values: {
    CL_Selected: string;
    FI_Selected: string;
  };
}

export interface MemberDetailsOther {
  Member_Name: string;
  membershipId: string;
  COI: null;
  ClaimDetailsOther: ClaimDetailsOther;
  FNI: {
    Other_Remarks: string;
    FRAUD_INDICATORS: IFraudIndicator[];
    Main_Claim: string;
    Line_Of_Treatement: string;
    SR_NUMBER: string | null;
    Recommendations: string | null;
    Executive_Summary: string | null;
  };
}

export interface PolicyClaimsOther {
  MemberDetails: MemberDetailsOther;
}

export interface ClaimOtherDetailRes {
  Status: string;
  StatusMessage: string;
  PolicyNo: string;
  PolicyClaimsOther: PolicyClaimsOther;
}

export interface ProviderData {
  providerNumber: string;
  providerEntryDate: string;
  providerName: string;
  providerType: string | null;
  providerAddress: string;
  providerCity: string;
  providerState: string;
  pinCode: string;
  fraudList: string;
  coutionList: string | null;
  preferPartnerList: string | null;
  doubtfulProvider: string | null;
}

export interface ProviderDetailRes {
  Status: string;
  StatusMessage: string;
  ProviderData: ProviderData;
}

export interface IUpdateFNIDetailsRes {
  Status: string;
  StatusMessage: string;
  ErrorList?: { ErrorCode: number; ErrorMsg: string }[];
  FNIStatus: {
    Fraud_Intimation_ID: string | "null";
    Case_Code: string | "null";
    Investigation_Type: string | "null";
    Message?: string;
    StatusMessage?: string;
  };
}

export interface IGenerateDocTokenRes {
  token: string;
}

export interface IGetDocumentDetailsDoc {
  Document_Name: string;
  Document_Index: string;
  Document_Class: string;
  Document_Date: string;
}

export interface IPostDocumentStatusRes {
  status: string;
  Message: string;
  DocContent: string;
  UniqueIdentifier: string;
}

export interface IGetDocumentDetailRes {
  Status: string;
  Message?: string;
  UniqueIdentifier: string;
  WorkItemID: string;
  CaseTypeID: string;
  Documents: IGetDocumentDetailsDoc[];
}

export interface IClaimsBenefits {
  Benefit_Type: string;
  Benefit_Head: string;
}

export interface IClaimsData {
  Claims: string;
  SourceSystem: string;
  ClaimsBenefits: IClaimsBenefits[];
  Is_ReInvestigate:string;
}

export interface IGetFNIData {
  Status: string;
  StatusMessage: string;
  ClaimsData: IClaimsData[];
}

export interface IGetClaimFNIDetails {
  Status: string;
  StatusMessage: string;
  PolicyNo: string;
  PolicyClaimsOther: {
    ClaimFNIDetails: {
      Member_Name: string;
      membershipId: string;
      COI: string;
      FNI: {
        SR_NUMBER: string;
        Recommendations: string;
        Executive_Summary: string;
        Other_Remarks: string;
        FRAUD_INDICATORS: IFraudIndicator[];
      };
    };
  };
}

export interface IGetMemberBenefitCover {
  Status: string;
  StatusMessage: string;
  PolicyNo: string;
  MemberBenefitCover: {
    Member_Name: string;
    membershipId: string;
    COI: string;
    Benefit_Covers: {
      Benefit_Type: string;
      Benefit_Type_Indicator: string;
    }[];
  };
}

export type TSourceSystem = "M" | "P";
