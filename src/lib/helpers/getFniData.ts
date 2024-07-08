import axios from "axios";
import dayjs from "dayjs";
import { HydratedDocument } from "mongoose";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { buildMaximusUrl } from "./wdmsHelpers";
import {
  ApplicationIdDetails,
  ClaimHistory,
  ClaimHistoryRes,
  ClaimOtherDetailRes,
  ClaimsGetByIdRes,
  CustomerPolicyDetailRes,
  GetAuthRes,
  IGetClaimFNIDetails,
  IGetMemberBenefitCover,
  Member,
  ProviderDetailRes,
  TSourceSystem,
} from "../utils/types/maximusResponseTypes";
import { Databases, EndPoints } from "../utils/types/enums";
import connectDB from "../db/dbConnectWithMongoose";
import {
  AdmissionType,
  IUser,
  IZoneStateMaster,
  Role,
  Member as IMember,
  IBenefitsCovered,
} from "../utils/types/fniDataTypes";
import User from "../Models/user";
import ZoneStateMaster from "../Models/zoneStateMaster";

dayjs.extend(utc);
dayjs.extend(timezone);

function chunkArray(array: Array<any>, size: number) {
  const chunkedArr: Array<any> = [];
  for (let i = 0; i < array?.length; i += size) {
    chunkedArr?.push(array?.slice(i, i + size));
  }
  return chunkedArr;
}

function convertDateToDayJsFormat(dateStr: string) {
  // Split the date string into parts [day, month, year]
  const parts = dateStr?.split("-");

  // Convert the month part to the correct case
  const month =
    parts[1]?.charAt(0)?.toUpperCase() + parts[1]?.slice(1)?.toLowerCase();

  // Reassemble the date string in the correct format
  return `${parts[0]}-${month}-${parts[2]}`;
}

const getUser = async (state: string, role: Role.TL | Role.CLUSTER_MANAGER) => {
  const zoneState: HydratedDocument<IZoneStateMaster> | null =
    await ZoneStateMaster.findOne({
      State: state,
    });

  if (!zoneState) return null;

  const user: HydratedDocument<IUser> | null = await User.findOne({
    role,
    zone: zoneState?.Zone,
    status: "Active",
  });
  if (!user) return null;

  return user.toJSON();
};

const { baseUrl, authPayload, apiId } = buildMaximusUrl();

const commonHeaders: any = {
  "x-apigw-api-id": apiId,
  "Content-Type": "application/json",
};

const getToken = async () => {
  try {
    const { data } = await axios.post<GetAuthRes>(
      `${baseUrl}${EndPoints.GET_AUTH}`,
      authPayload,
      { headers: commonHeaders }
    );
    if (!data?.Token) throw new Error("Failed to get auth token");
    return { success: true, token: data?.Token };
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

const getFniData = async (
  claimId: string,
  claimType: "P" | "R",
  sourceSystem: TSourceSystem
) => {
  try {
    if (!claimId || !claimType)
      throw new Error("claimId and claimType is required");
    await connectDB(Databases.FNI);

    const tokenRes = await getToken();
    if (!tokenRes?.success)
      throw new Error(`Get token api failure: ${tokenRes.message}`);
    const token = tokenRes?.token;

    const headers = { ...commonHeaders, Authorization: `Bearer ${token}` };

    const { data: claimDetail } = await axios.post<ClaimsGetByIdRes>(
      `${baseUrl}${EndPoints.GET_CLAIM_DETAIL_BY_ID}`,
      { ClaimID: claimId, ClaimType: claimType },
      { headers }
    );

    //from claim history get membershipId by searching memberNo
    //customer policyDetail do a match on MEMBERSHIP_NO

    if (["False", "false"].includes(claimDetail?.Status)) {
      throw new Error(
        `${EndPoints.GET_CLAIM_DETAIL_BY_ID} api failure: ${claimDetail?.StatusMessage}`
      );
    }

    const currentClaimNumber =
      claimDetail?.PolicyClaims?.ClaimDetail?.Claim_Number || "";

    const { data: claimFNIDetail } = await axios.post<IGetClaimFNIDetails>(
      `${baseUrl}${EndPoints.GET_CLAIM_FNI_DETAILS}`,
      { ClaimID: claimId, ClaimType: claimType },
      { headers }
    );

    if (["False", "false"].includes(claimFNIDetail?.Status))
      throw new Error(
        `${EndPoints.GET_CLAIM_FNI_DETAILS} api error: ${claimFNIDetail?.StatusMessage}`
      );

    const { data: claimOtherDetail } = await axios.post<ClaimOtherDetailRes>(
      `${baseUrl}${EndPoints.GET_CLAIM_OTHER_DETAILS}`,
      { ClaimID: claimId, ClaimType: claimType },
      { headers }
    );

    if (["False", "false"].includes(claimOtherDetail?.Status))
      throw new Error(
        `${EndPoints.GET_CLAIM_OTHER_DETAILS} api error: ${claimOtherDetail?.StatusMessage}`
      );

    const memberNo =
      claimFNIDetail?.PolicyClaimsOther?.ClaimFNIDetails?.membershipId || "";

    let policyNo: string = "";
    let policyNoForUI: string = "";

    if (sourceSystem === "M") {
      if (
        claimDetail?.PolicyClaims?.ClaimDetail?.Product_Type?.startsWith("MHP")
      ) {
        policyNo = claimDetail?.PolicyClaims?.membershipId;
      } else if (claimDetail?.PolicyNo) {
        policyNo = claimDetail?.PolicyNo;
      } else if (claimFNIDetail?.PolicyNo) {
        policyNo = claimFNIDetail?.PolicyNo;
      } else {
        policyNo = claimOtherDetail?.PolicyNo;
      }
      policyNoForUI = policyNo;
    } else {
      if (claimDetail?.PolicyClaims?.COI) {
        policyNo = claimDetail?.PolicyClaims?.COI;
      } else {
        policyNo =
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.COI || "";
      }
      policyNoForUI = claimOtherDetail?.PolicyNo;
    }

    if (!policyNo)
      throw new Error(
        `Failed to find policy no from claimDetails, claimFniDetails or claimOtherDetail`
      );

    const { data: customerPolicyDetail } =
      await axios.post<CustomerPolicyDetailRes>(
        `${baseUrl}${EndPoints.GET_CUSTOMER_POLICY_DETAIL}`,
        { PolicyNumber: policyNo },
        { headers }
      );
    if (["False", "false"].includes(customerPolicyDetail?.Status))
      throw new Error(
        `${EndPoints.GET_CUSTOMER_POLICY_DETAIL} api failure: ${customerPolicyDetail?.StatusMessage}`
      );

    const { data: claimHistory } = await axios.post<ClaimHistoryRes>(
      `${baseUrl}${EndPoints.GET_CLAIM_HISTORY}`,
      {
        PolicyNo_COI: policyNo,
        Membership_No_ID: "",
      },
      { headers }
    );

    if (["False", "false"].includes(claimHistory?.Status))
      throw new Error(
        `${EndPoints.GET_CLAIM_HISTORY} api failure: ${claimHistory?.StatusMessage}`
      );

    let claimingMemberId;
    const memberList = claimHistory?.PolicyClaims?.MemberList;
    for (let member of memberList) {
      if (member?.memberNo === memberNo) {
        claimingMemberId = member?.membershipId;
      }
    }

    let benefitsCovered: IBenefitsCovered[] = [];

    if (claimType === "R") {
      const { data: memberBenefitCoverRes } =
        await axios.post<IGetMemberBenefitCover>(
          `${baseUrl}${EndPoints.GET_MEMBER_BENEFIT_COVER}`,
          { ClaimID: claimId },
          { headers }
        );

      if (["False", "false"].includes(memberBenefitCoverRes?.Status))
        throw new Error(
          `${EndPoints.GET_MEMBER_BENEFIT_COVER} api failure: ${memberBenefitCoverRes?.StatusMessage}`
        );

      benefitsCovered =
        memberBenefitCoverRes?.MemberBenefitCover?.Benefit_Covers &&
        memberBenefitCoverRes?.MemberBenefitCover?.Benefit_Covers?.length > 0
          ? memberBenefitCoverRes?.MemberBenefitCover?.Benefit_Covers?.map(
              (el) => ({
                benefitType: el?.Benefit_Type,
                benefitTypeIndicator: el?.Benefit_Type_Indicator,
              })
            )
          : [];
    }

    let claimingMemberDetails: Member | undefined;
    const customizedMembers: IMember[] = [];

    const customerFromCustomerPolicy = customerPolicyDetail?.CUSTOMERS?.[0];
    const members = customerFromCustomerPolicy?.MEMBERS;
    for (let member of members) {
      const payload: IMember = {
        DOB: member?.MEMBER_DATE_OF_BIRTH,
        membershipName: member?.MEMBER_NAME,
        relation: member?.RELATION,
        membershipNumber: member?.MEMBERSHIP_NO
          ? parseInt(member?.MEMBERSHIP_NO)
          : 0,
        benefitsCovered: [],
      };

      if (member.MEMBERSHIP_NO === claimingMemberId) {
        claimingMemberDetails = member;
        payload.benefitsCovered =
          benefitsCovered && benefitsCovered?.length > 0 ? benefitsCovered : [];
        customizedMembers.push(payload);
      } else {
        customizedMembers.push(payload);
      }
    }

    const claimNumbers: (string | null | undefined)[] = [];
    const claimResults: { [claimId: string]: any } = {};
    const fcuResults: { [claimId: string]: any } = {};
    const dsClaimIdResults: { [claimId: string]: any } = {};

    // Iterate through the MemberList array
    for (const member of claimHistory.PolicyClaims.MemberList) {
      // Iterate through the ClaimHistory array of each member
      for (const claim of member.ClaimHistory) {
        const claimNumber = claim?.Claim_Number;
        claimNumbers?.push(claimNumber);
      }
    }

    type ProcessedResult = {
      claimNumber: string;
      diagnosisDetails: string;
      fcu: string;
      dsClaimId: string;
    };

    const processClaimsChunk = async (claimsChunk: string[]) => {
      const promises = claimsChunk?.map((claimNumber) => {
        const claimId = claimNumber?.replace(/^(P|R)_/, "");
        const claimType = claimNumber?.charAt(0);

        return axios
          .post<ClaimOtherDetailRes>(
            `${baseUrl}${EndPoints.GET_CLAIM_OTHER_DETAILS}`,
            { ClaimID: claimId, ClaimType: claimType },
            { headers }
          )
          .then(({ data: claimOtherDetail }) => {
            const cdo =
              claimOtherDetail?.PolicyClaimsOther?.MemberDetails
                ?.ClaimDetailsOther;
            return {
              claimNumber,
              diagnosisDetails: cdo?.DiasnosisDetails,
              fcu: cdo?.FINAL_OUTCOME,
              dsClaimId: cdo?.DS_Claim_Id,
            };
          })
          .catch((error) => {
            console.error(
              `Error fetching data for claim ${claimNumber}:`,
              error
            );
            return {
              claimNumber,
              diagnosisDetails: "",
              fcu: "",
              dsClaimId: "",
            };
          });
      });

      return Promise.all(promises);
    };
    const claimNumbersChunks = chunkArray(claimNumbers, 100) as string[][];
    const results: ProcessedResult[] = [];

    for (const claimsChunk of claimNumbersChunks) {
      try {
        const chunkResults: Array<ProcessedResult> = await processClaimsChunk(
          claimsChunk
        );
        results.push(...chunkResults);
      } catch (error) {
        console.error("Error processing a chunk of claim details:", error);
      }
    }

    results.forEach(({ claimNumber, diagnosisDetails, fcu, dsClaimId }) => {
      if (claimNumber) {
        claimResults[claimNumber] = diagnosisDetails;
        fcuResults[claimNumber] = fcu;
        dsClaimIdResults[claimNumber] = dsClaimId;
      }
    });

    const contracts = customerFromCustomerPolicy?.CONTRACTS;

    const appNumber = customerFromCustomerPolicy?.CONTRACTS[0]?.APP_NO;

    let applicationId: string | null = null;

    if (sourceSystem === "M") {
      const { data: applicationIdDetails } =
        await axios.post<ApplicationIdDetails>(
          `${baseUrl}${EndPoints.GET_APPLICATION_ID_DETAILS}`,
          { ApplicationNumber: appNumber, MobileNumber: "" },
          { headers }
        );

      if (["False", "false"].includes(applicationIdDetails?.Status))
        throw new Error(
          `${EndPoints.GET_APPLICATION_ID_DETAILS} api failure: ${applicationIdDetails?.StatusMessage}`
        );

      const applications = applicationIdDetails?.preIssuanceStatusData;

      const newApplicationIds = applications
        ?.filter((app: any) => app?.BusinessType === "New Application")
        ?.map((app: any) => app?.ApplicationID);
      applicationId =
        newApplicationIds?.length > 0 ? newApplicationIds[0] : null;
    }

    const memberListFromHistory = claimHistory?.PolicyClaims?.MemberList;
    const claimHistoryObj = memberListFromHistory?.find(
      (obj) => obj?.memberNo == memberNo
    );

    let providerCode = "";

    let currentClaim: ClaimHistory | null = null;

    // Iterate through the MemberList array
    for (const member of claimHistory?.PolicyClaims?.MemberList) {
      // Iterate through the ClaimHistory array of each member
      for (const claim of member?.ClaimHistory) {
        if (claim?.Claim_Number === currentClaimNumber) {
          currentClaim = claim;

          break; // Found the matching claim, no need to continue searching
        }
      }
      if (providerCode) break; // Exit the outer loop once the code is found
    }

    if (!currentClaim)
      throw new Error(
        `Failed to find matching claim from claimHistory.PolicyClaims.MemberList.ClaimHistory`
      );

    const { data: provider } = await axios.post<ProviderDetailRes>(
      `${baseUrl}${EndPoints.GET_PROVIDER_DETAILS}`,
      {
        providerId: currentClaim?.Provider_Code,
        sourceSystem,
      },
      { headers }
    );

    if (!provider?.ProviderData?.providerState)
      throw new Error("Failed to find provider details");

    const teamLead = await getUser(
      provider?.ProviderData?.providerState,
      Role.TL
    );

    const clusterManager = await getUser(
      provider?.ProviderData?.providerState,
      Role.CLUSTER_MANAGER
    );

    let admissionType: AdmissionType = AdmissionType.NA;
    if (claimType === "P") {
      const doa = dayjs(
        convertDateToDayJsFormat(currentClaim?.Hospitilization_Date as string),
        "DD-MMM-YYYY"
      );
      const dod = dayjs(
        convertDateToDayJsFormat(currentClaim?.Discharge_Date as string),
        "DD-MMM-YYYY"
      );
      const today = dayjs();
      if (dod?.isBefore(today, "day")) {
        admissionType = AdmissionType.POST_FACTO;
      } else if (doa?.isAfter(today, "day")) {
        admissionType = AdmissionType.PLANNED;
      } else {
        admissionType = AdmissionType.ADMITTED;
      }
    }

    const mainObject = {
      contractDetails: {
        contractNo: claimDetail?.PolicyClaims?.ClaimDetail?.Contract_Number,
        // product: customerFromCustomerPolicy?.PLANS?.[0]?.PRODUCT_NAME,
        product: customerFromCustomerPolicy?.PLANS?.[0]?.PLAN_DESC,
        policyNo: policyNoForUI,
        policyStartDate:
          customerFromCustomerPolicy?.CONTRACTS?.[0]
            ?.EFFECTIVE_DATE_OF_CONTRACT,
        policyEndDate:
          customerFromCustomerPolicy?.CONTRACTS?.[0]?.CONTRACT_TERMINATION_DATE,
        port: ["N", null].includes(customerFromCustomerPolicy?.PORTABILITY_FLAG)
          ? "No"
          : "Yes",
        prevInsuranceCompany:
          customerFromCustomerPolicy?.PREVIOUS_INSURANCE_COMPANY,
        insuredSince: customerFromCustomerPolicy?.INSURED_SINCE,
        mbrRegDate: claimingMemberDetails?.MEMBER_REGISTRATION_DATE || "-",
        NBHIPolicyStartDate: contracts[0]?.EFFECTIVE_DATE_OF_CONTRACT,
        membersCovered: members?.length || 0,
        agentName: customerFromCustomerPolicy?.CONTRACTS?.[0]?.AGENT_NAME,
        currentStatus: contracts[0]?.CONTRACT_TERMINATION_DATE
          ? dayjs(contracts[0]?.CONTRACT_TERMINATION_DATE).isBefore(dayjs())
            ? "Inactive"
            : "Active"
          : "-",
        agentCode: customerFromCustomerPolicy?.CONTRACTS?.[0]?.AGENT_CODE,
        branchLocation: provider?.ProviderData?.providerState,
        sourcing:
          customerFromCustomerPolicy?.CONTRACTS?.[0]?.SourceSystem === "M"
            ? "Maximus"
            : customerFromCustomerPolicy?.CONTRACTS?.[0]?.SourceSystem === "P"
            ? "Phoenix"
            : customerFromCustomerPolicy?.CONTRACTS?.[0]?.SourceSystem,
        bancaDetails: customerFromCustomerPolicy?.CONTRACTS?.[0]?.AGENT_NAME,
      },
      members: members?.map((item) => ({
        membershipNumber: item?.MEMBERSHIP_NO,
        membershipName: item?.MEMBER_NAME,
        DOB: item?.MEMBER_DATE_OF_BIRTH,
        relation: item?.RELATION,
      })),
      insuredDetails: {
        insuredName: claimingMemberDetails?.MEMBER_NAME,
        gender: claimingMemberDetails?.GENDER,
        age: claimingMemberDetails?.MEMBER_DATE_OF_BIRTH
          ? dayjs().diff(claimingMemberDetails?.MEMBER_DATE_OF_BIRTH, "year")
          : "",
        dob: claimingMemberDetails?.MEMBER_DATE_OF_BIRTH,
        address:
          customerFromCustomerPolicy?.CURRENT_ADDRESS_1 +
          customerFromCustomerPolicy?.CURRENT_ADDRESS_2 +
          customerFromCustomerPolicy?.CURRENT_ADDRESS_3,
        city: customerFromCustomerPolicy?.CURRENT_ADDRESS_CITY,
        state: customerFromCustomerPolicy?.CURRENT_ADDRESS_STATE,
        contactNo: claimingMemberDetails?.MOBILE_NO,
        emailId: claimingMemberDetails?.CUST_EMAIL,
        memberType: "Not Found",
        memberId: claimingMemberDetails?.MEMBER_ID,
        pivotalCustomerId: customerFromCustomerPolicy?.PIVOTAL_CUSTOMER_ID,
        height: claimingMemberDetails?.INSURE_MEMBER_HEIGHT,
        weight: claimingMemberDetails?.INSURE_MEMBER_WEIGHT,
        occupation: claimingMemberDetails?.OCCUPATION,
        insuredType: claimingMemberDetails?.RELATION,
      },
      claimDetails: {
        claimStatus: currentClaim?.Claims_Status,
        claimStatusUpdated: currentClaim?.Claims_Status,
        noOfClaimsInHistory: claimHistoryObj?.ClaimHistory?.length || 0,
        claimNo: currentClaim?.Claim_Number,
        submittedAt: currentClaim?.Claim_Reported_Date,
        receivedAt: currentClaim?.Claim_Decision_Date,
        payTo: customerFromCustomerPolicy?.CUSTOMER_NAME,
        memberNo: claimHistoryObj?.membershipId,
        pivotalCustomerId: customerFromCustomerPolicy?.PIVOTAL_CUSTOMER_ID,
        claimType: currentClaim?.Claim_Type,
        mainClaim:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.Main_Claim,
        hospitalizationType:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.HOSPITALIZAITONTYPE || "",
        deductibleAmount: "Not Found",
        diagnosis:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.DIAG_NOTE,
        diagnosisCode1:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.DIAG_CODE,
        diagnosisCode2:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.DIAG_CODE2,
        diagnosisCode3:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.DIAG_CODE3,
        icdCode: currentClaim?.Illness,
        lineOfTreatment:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.Line_Of_Treatement,
        billedAmount: currentClaim?.Billed_Amount,
        preAuthNo: claimId,
        submittedBy: claimHistoryObj?.Member_Name,
        claimAmount: currentClaim?.Billed_Amount,
        exclusionRemark:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.Exclusionremark,
        fraudStatus:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.FRAUD_STATUS,
        fraudType:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.FRAUDTYPE,
        fraudReason:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.FRAUDREASON,
        spotNumber:
          claimFNIDetail?.PolicyClaimsOther?.ClaimFNIDetails?.FNI?.SR_NUMBER,
        spotInvestigationRecommendation:
          claimFNIDetail?.PolicyClaimsOther?.ClaimFNIDetails?.FNI
            ?.Recommendations,
        spotInvestigationFindings:
          claimFNIDetail?.PolicyClaimsOther?.ClaimFNIDetails?.FNI
            ?.Executive_Summary,
        noOfClaimsCorrespondingToPivotalId: "",
        claimTrigger:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.Claim_Trigger,
        prePostIndicator:
          claimOtherDetail?.PolicyClaimsOther?.MemberDetails?.ClaimDetailsOther
            ?.PrePost_Ind,
      },
      hospitalDetails: {
        providerNo: provider?.ProviderData?.providerNumber,
        providerName: provider?.ProviderData?.providerName,
        providerType: provider?.ProviderData?.providerType,
        providerAddress: provider?.ProviderData?.providerAddress,
        providerCity: provider?.ProviderData?.providerCity,
        providerState: provider?.ProviderData?.providerState,
        pinCode: provider?.ProviderData?.pinCode,
        preferredPartnerList: provider?.ProviderData?.preferPartnerList,
        doubtfulProvider: provider?.ProviderData?.doubtfulProvider,
        coutionList: provider?.ProviderData?.coutionList,
        fraudList: provider?.ProviderData?.fraudList,
      },
      hospitalizationDetails: {
        treatingDoctorName: currentClaim?.TreatingDoctorName,
        treatingDoctorRegNo: currentClaim?.TreatingDoctorID,
        dateOfAdmission: convertDateToDayJsFormat(
          currentClaim?.Hospitilization_Date as string
        ),
        dateOfAdmissionUpdated: convertDateToDayJsFormat(
          currentClaim?.Hospitilization_Date as string
        ),
        dateOfDischarge: convertDateToDayJsFormat(
          currentClaim?.Discharge_Date as string
        ),
        dateOfDischargeUpdated: convertDateToDayJsFormat(
          currentClaim?.Discharge_Date as string
        ),
        admissionType: admissionType,
        LOS: dayjs(currentClaim?.Discharge_Date).diff(
          currentClaim?.Hospitilization_Date,
          "day"
        ), //Length of stay
      },
      historicalClaim: memberListFromHistory?.map((el) => ({
        memberName: el?.Member_Name,
        claimPreAuthNo: "Not Found",
        memberNo: el?.memberNo,
        history: el?.ClaimHistory?.map((clh) => ({
          hospital: clh?.Provider_Name,
          claim_number: clh?.Claim_Number,
          claims_Status: clh?.Final_Status,
          diagnosis: claimResults[clh?.Claim_Number],
          fcu: fcuResults[clh?.Claim_Number] || "",
          dsClaimId: dsClaimIdResults[clh?.Claim_Number] || "",
          DOA: clh?.Hospitilization_Date || null,
          DOD: clh?.Discharge_Date || null,
          claimAmount: clh?.Approved_Amount,
        })),
      })),
      fraudIndicators: {
        indicatorsList:
          claimFNIDetail?.PolicyClaimsOther?.ClaimFNIDetails?.FNI?.FRAUD_INDICATORS?.filter(
            (obj, index, self) =>
              index ===
              self?.findIndex(
                (t) => t?.FRAUD_INDICATOR_DESC === obj?.FRAUD_INDICATOR_DESC
              )
          ) || [],
        remarks:
          claimFNIDetail?.PolicyClaimsOther?.ClaimFNIDetails?.FNI
            ?.Other_Remarks || "",
      },
      applicationId: applicationId,
      teamLead: teamLead?._id || null,
      clusterManager: clusterManager?._id || null,
      intimationDate: dayjs()
        .tz("Asia/Kolkata")
        .format("DD-MMM-YYYY hh:mm:ss A"),
    };
    return {
      success: true,
      data: mainObject,
      claimOtherDetail: claimOtherDetail,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export default getFniData;
