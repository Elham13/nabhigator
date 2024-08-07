import axios from "axios";
import { IMaximusResponseLog } from "../utils/types/fniDataTypes";
import { buildMaximusUrl } from "./wdmsHelpers";
import MaximusResponseLog from "../Models/maximusResponseLog";
import { IGetFNIData } from "../utils/types/maximusResponseTypes";
import UnwantedFNIData from "../Models/uwantedFNIData";
import {
  accidentalHospitalizationLossCodes,
  benefitCodes,
  benefitCodesPreAuth,
  criticalIllnessLossCodes,
  criticalIllnessSubTypes,
  deathLossCodes,
  indemnityCodes,
  personalAccidentSubTypes,
  PPDLossCodes,
  PTDLossCodes,
  travelCodesPreAuth,
  TTDLossCodes,
} from "./getClaimIdsHelpers";

const logsPayload: IMaximusResponseLog = {
  api: "",
  originFileName: __filename,
  claimId: 0,
  requestBody: null,
  requestHeaders: null,
  responseBody: null,
  errorPayloadFromCatchBlock: null,
};

const { baseUrl, authPayload, apiId } = buildMaximusUrl();

const headers = {
  "x-apigw-api-id": apiId,
};

type ClaimsBenefits = {
  Benefit_Type: string;
  Benefit_Head: string;
};

type DataType = {
  Claims: string;
  ClaimsBenefits: ClaimsBenefits[];
};

const processResponse = (data: DataType[]) => {
  // Sample data
  // const data = [{
  //   Claims: "R_84911",
  //   ClaimsBenefits: [
  //     {
  //       Benefit_Type: "A-In-patient Hospitalization",
  //       Benefit_Head: "A1-Surg ops, incl pre & post operative care",
  //     },
  //   ],
  // }]
  return data?.map((el) => {
    const claimType = el?.Claims?.split("_")?.[0];
    const claimId = el?.Claims?.split("_")?.[1];

    const arrOfObj = el?.ClaimsBenefits?.map((cl) => {
      const tempArr = cl?.Benefit_Type?.split("-");

      if (claimType === "P") {
        // For PreAuth
        const code = tempArr?.shift();

        return {
          subType: tempArr?.join("-"),
          benefitType: benefitCodesPreAuth?.includes(code || "")
            ? "Benefit"
            : travelCodesPreAuth?.includes(code || "")
            ? "Travel"
            : "Indemnity",
          lossType:
            tempArr?.join("-") === "Personal Accident/Accident Care"
              ? cl?.Benefit_Head?.split("-")?.[1] || ""
              : "",
        };
      } else {
        // For Reimbursement
        const benefitHead = cl?.Benefit_Head;
        const code = benefitHead?.split("-")[0];
        return {
          subType: personalAccidentSubTypes.includes(code)
            ? "Personal Accident"
            : criticalIllnessSubTypes.includes(code)
            ? "Critical Illness"
            : tempArr?.join("-"),
          benefitType: benefitCodes?.includes(code)
            ? "Benefit"
            : indemnityCodes?.includes(code)
            ? "Indemnity"
            : "-",
          lossType: accidentalHospitalizationLossCodes.includes(code)
            ? "Accidental Hospitalization/Accidental Medical Reimbursement"
            : criticalIllnessLossCodes.includes(code)
            ? "Critical Illness"
            : deathLossCodes.includes(code)
            ? "Death"
            : PPDLossCodes.includes(code)
            ? "PPD"
            : PTDLossCodes?.includes(code)
            ? "PTD"
            : TTDLossCodes.includes(code)
            ? "TTD"
            : "-",
        };
      }
    });

    return {
      claimId,
      claimType,
      benefitType: arrOfObj?.map((el) => el?.benefitType)?.join(", "),
      claimSubType: arrOfObj?.map((el) => el?.subType)?.join(", "),
      lossType: arrOfObj?.map((el) => el?.lossType)?.join(", "),
      Claims: el?.Claims,
      cataractOrDayCareProcedure: el?.ClaimsBenefits,
    };
  });
};

export default async function getClaimIds(SourceSystem: "M" | "P") {
  try {
    const { data: token } = await axios.post(
      `${baseUrl}auth/getauthtoken`,
      authPayload,
      {
        headers,
      }
    );

    logsPayload.api = `${baseUrl}auth/getauthtoken`;
    logsPayload.requestBody = authPayload;
    logsPayload.requestHeaders = headers;
    logsPayload.responseBody = token;

    await MaximusResponseLog.create(logsPayload);

    const getFniDataUrl = `${baseUrl}claim/getfnidata`;
    const payload = {
      ClaimType: "FnI",
      SourceSystem,
    };
    const getFniDataHeaders = {
      headers: { ...headers, Authorization: `Bearer ${token?.Token}` },
    };

    const { data } = await axios.post<IGetFNIData>(
      getFniDataUrl,
      payload,
      getFniDataHeaders
    );

    logsPayload.api = getFniDataUrl;
    logsPayload.requestBody = payload;
    logsPayload.requestHeaders = getFniDataHeaders;
    logsPayload.responseBody = data;

    await MaximusResponseLog.create(logsPayload);

    let claimsData =
      data?.ClaimsData && data?.ClaimsData?.length > 0 ? data?.ClaimsData : [];

    const claimIds = await UnwantedFNIData.aggregate([
      { $project: { Claims: 1 } },
    ]);

    if (claimIds && claimIds?.length > 0) {
      const claimIdsSet = new Set(claimIds.map((id) => id?.Claims));
      claimsData = claimsData?.filter(
        (el) => el?.Claims?.startsWith("P_") && !claimIdsSet.has(el?.Claims)
      );
    }

    return { success: true, data: processResponse(claimsData) };
  } catch (error: any) {
    logsPayload.api =
      error?.config?.url || "Find it from errorPayloadFromCatchBlock";
    if (error?.name === "AxiosError") {
      logsPayload.errorPayloadFromCatchBlock = {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        headers: error?.config?.headers,
        method: error?.config?.method,
        data: error?.config?.data,
      };
    } else {
      logsPayload.errorPayloadFromCatchBlock = JSON.stringify(error);
    }
    await MaximusResponseLog.create(logsPayload);
    return { success: false, message: error?.message };
  }
}
