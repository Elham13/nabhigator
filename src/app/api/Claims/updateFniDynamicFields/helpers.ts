import { buildMaximusUrl } from "@/lib/helpers/wdmsHelpers";
import { EndPoints } from "@/lib/utils/types/enums";
import {
  ClaimHistoryRes,
  ClaimOtherDetailRes,
  ClaimsGetByIdRes,
  CustomerPolicyDetailRes,
  GetAuthRes,
} from "@/lib/utils/types/maximusResponseTypes";
import axios from "axios";

const { baseUrl, authPayload, apiId } = buildMaximusUrl();

const commonHeaders: any = {
  "x-apigw-api-id": apiId,
};

const getToken = async () => {
  try {
    const { data } = await axios.post<GetAuthRes>(
      `${baseUrl}${EndPoints.GET_AUTH}`,
      authPayload,
      { headers: commonHeaders }
    );

    if (!data.Token) throw new Error("Failed to get auth token");

    return { success: true, message: "Success", token: data?.Token };
  } catch (error: any) {
    return { success: false, message: error?.message, token: "" };
  }
};

interface IFetchProps {
  claimId?: number;
  claimType?: "PreAuth" | "Reimbursement";
  mustFetch?: {
    getClaimDetailById?: boolean;
    claimOtherDetail?: boolean;
    customerPolicyDetail?: boolean;
    claimHistory?: boolean;
  };
}

interface IResponse {
  claimDetail?: ClaimsGetByIdRes;
  claimOtherDetail?: ClaimOtherDetailRes;
  customerPolicyDetail?: CustomerPolicyDetailRes;
  claimHistory?: ClaimHistoryRes;
}

// FYI Max means Maximus
export const fetchMaxData = async ({
  claimId,
  claimType,
  mustFetch = { getClaimDetailById: true },
}: IFetchProps) => {
  const response = {} as IResponse;
  try {
    const { success, message, token } = await getToken();
    if (!success) throw new Error(message);

    const headers = { ...commonHeaders, Authorization: `Bearer ${token}` };

    if (mustFetch?.getClaimDetailById) {
      if (!claimId) throw new Error("claimId is required");
      if (!claimType) throw new Error("claimType is required");

      const { data: claimDetail } = await axios.post<ClaimsGetByIdRes>(
        `${baseUrl}${EndPoints.GET_CLAIM_DETAIL_BY_ID}`,
        { ClaimID: claimId, ClaimType: claimType },
        { headers }
      );

      if (["False", "false"].includes(claimDetail?.Status)) {
        throw new Error(
          `Get Claim details by id api failure: ${claimDetail?.StatusMessage}`
        );
      }

      response.claimDetail = claimDetail;

      if (mustFetch.claimOtherDetail) {
        const { data: claimOtherDetail } =
          await axios.post<ClaimOtherDetailRes>(
            `${baseUrl}${EndPoints.GET_CLAIM_OTHER_DETAILS}`,
            { ClaimID: claimId, ClaimType: claimType },
            { headers }
          );

        if (["False", "false"].includes(claimOtherDetail?.Status))
          throw new Error(
            `Claim other details api error: ${claimOtherDetail?.StatusMessage}`
          );

        response.claimOtherDetail;

        const policyNo = claimDetail?.PolicyNo || claimOtherDetail?.PolicyNo;

        if (mustFetch.customerPolicyDetail) {
          const { data: customerPolicyDetail } =
            await axios.post<CustomerPolicyDetailRes>(
              `${baseUrl}${EndPoints.GET_CUSTOMER_POLICY_DETAIL}`,
              { PolicyNumber: policyNo },
              { headers }
            );

          if (["False", "false"].includes(customerPolicyDetail?.Status))
            throw new Error(
              `Customer policy api failure: ${customerPolicyDetail?.StatusMessage}`
            );

          response.customerPolicyDetail = customerPolicyDetail;
        }

        if (mustFetch.claimHistory) {
          const { data: claimHistory } = await axios.post<ClaimHistoryRes>(
            `${baseUrl}${EndPoints.GET_CLAIM_HISTORY}`,
            { PolicyNo_COI: policyNo, Membership_No_ID: "" },
            { headers }
          );

          if (["False", "false"].includes(claimHistory?.Status))
            throw new Error(
              `Claim History api failure: ${claimHistory?.StatusMessage}`
            );

          response.claimHistory = claimHistory;
        }
      }
    }

    return { success: false, message: "Success", data: response };
  } catch (error: any) {
    return { success: false, message: error?.message, data: {} };
  }
};
