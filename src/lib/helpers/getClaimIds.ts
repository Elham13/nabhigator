import axios from "axios";
import { IMaximusResponseLog } from "../utils/types/fniDataTypes";
import { buildMaximusUrl } from "./wdmsHelpers";
import MaximusResponseLog from "../Models/maximusResponseLog";
import { IGetFNIData } from "../utils/types/maximusResponseTypes";
import UnwantedFNIData from "../Models/uwantedFNIData";

const logsPayload: IMaximusResponseLog = {
  api: "",
  originFileName: __filename,
  claimId: 0,
  requestBody: null,
  requestHeaders: null,
  responseBody: null,
  errorPayloadFromCatchBlock: null,
};

const benefitCodes = [
  "1",
  "2",
  "28",
  "36",
  "37",
  "40",
  "42",
  "43",
  "44",
  "45",
  "P",
  "Q",
  "S",
  "T",
  "Z",
];

const travelCodes = ["20", "21", "47"];

const indemnityCodes = [
  "0",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "29",
  "3",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "38",
  "39",
  "4",
  "41",
  "46",
  "48",
  "49",
  "5",
  "50",
  "51",
  "6",
  "7",
  "8",
  "9",
  "99",
  "A",
  "B",
  "C",
  "CT",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "R",
  "U",
  "V",
  "W",
  "X",
  "Y",
];

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
      return {
        code: tempArr?.shift(),
        subType: tempArr?.join("-"),
        lossType:
          tempArr?.join("-") === "Personal Accident/Accident Care"
            ? cl?.Benefit_Head?.split("-")?.[1] || ""
            : "",
      };
    });

    const claimCode =
      arrOfObj?.find(
        (elem) =>
          benefitCodes?.includes(elem?.code || "") ||
          travelCodes?.includes(elem?.code || "") ||
          indemnityCodes?.includes(elem?.code || "")
      )?.code || arrOfObj?.[0]?.code;

    const benefitType = benefitCodes?.includes(claimCode || "")
      ? "Benefit"
      : travelCodes?.includes(claimCode || "")
      ? "Travel"
      : "Indemnity";

    const claimSubType =
      arrOfObj?.find((cd) => claimCode === cd?.code)?.subType || null;

    const lossType =
      arrOfObj?.find((cd) => claimCode === cd?.code)?.lossType || "";

    return {
      claimId,
      claimType,
      benefitType,
      claimSubType,
      lossType,
      claimCode,
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
