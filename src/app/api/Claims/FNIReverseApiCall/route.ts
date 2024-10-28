import MaximusResponseLog from "@/lib/Models/maximusResponseLog";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { buildMaximusUrl } from "@/lib/helpers/wdmsHelpers";
import { Databases, EndPoints } from "@/lib/utils/types/enums";
import { IMaximusResponseLog } from "@/lib/utils/types/fniDataTypes";
import {
  GetAuthRes,
  IUpdateFNIDetailsRes,
} from "@/lib/utils/types/maximusResponseTypes";
import axios from "axios";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

const logsPayload: IMaximusResponseLog = {
  api: "",
  originFileName: __filename,
  claimId: 0,
  requestBody: null,
  requestHeaders: null,
  responseBody: null,
  errorPayloadFromCatchBlock: null,
};

router.post(async (req) => {
  const { payload, recommendation, claimId } = await req?.json();

  try {
    if (!payload) throw new Error("Maximus Payload is missing");
    if (!claimId) throw new Error("claimId is required");
    logsPayload.claimId = claimId;

    const { baseUrl, authPayload, apiId } = buildMaximusUrl();

    await connectDB(Databases.FNI);

    let url = "http://localhost:3000";
    if (process.env.NEXT_PUBLIC_CONFIG === "UAT")
      url = "https://appform.nivabupa.com";
    if (process.env.NEXT_PUBLIC_CONFIG === "PROD")
      url = "https://www.nivabupa.com";

    const EXECUTIVE_SUMMARY = `${url}${recommendation?.link}${recommendation?.text}`;

    const preparedPayload = {
      ...payload,
      Report_Sharing: {
        ...payload?.Report_Sharing,
        EXECUTIVE_SUMMARY,
        RECOMMENDATION: EXECUTIVE_SUMMARY,
      },
    };

    const getAuthHeaders = {
      headers: {
        "x-apigw-api-id": apiId,
      },
    };

    const { data: getAuth } = await axios.post<GetAuthRes>(
      `${baseUrl}${EndPoints.GET_AUTH}`,
      authPayload,
      getAuthHeaders
    );
    if (!getAuth.Token) throw new Error("Failed to get auth token");

    logsPayload.api = `${baseUrl}${EndPoints.GET_AUTH}`;
    logsPayload.requestBody = authPayload;
    logsPayload.requestHeaders = getAuthHeaders;
    logsPayload.responseBody = getAuth;

    await MaximusResponseLog.create(logsPayload);

    const updateDetailHeaders = {
      headers: {
        Authorization: `Bearer ${getAuth?.Token}`,
        "x-apigw-api-id": apiId,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post<IUpdateFNIDetailsRes>(
      `${baseUrl}${EndPoints.UPDATE_FNI_DETAILS}`,
      preparedPayload,
      updateDetailHeaders
    );

    logsPayload.api = `${baseUrl}${EndPoints.UPDATE_FNI_DETAILS}`;
    logsPayload.requestBody = preparedPayload;
    logsPayload.requestHeaders = updateDetailHeaders;
    logsPayload.responseBody = data;

    await MaximusResponseLog.create(logsPayload);

    if (
      data?.FNIStatus?.Case_Code === "null" ||
      data?.FNIStatus?.Message !== "Success" ||
      data?.Status === "False" ||
      !data?.FNIStatus
    ) {
      let msg = "";
      if (data?.FNIStatus?.Message) msg = data?.FNIStatus?.Message;
      else if (data?.ErrorList && data?.ErrorList?.length > 0)
        msg = data?.ErrorList?.map((el) => el.ErrorMsg)?.join(", ");
      else if (data?.StatusMessage) msg = data?.StatusMessage;
      else msg = "Something went wrong in UPDATE_FNI_DETAILS api";
      throw new Error(msg);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Case successfully sent back to maximus",
        maximusResponse: data,
      },
      { status: 200 }
    );
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

    return NextResponse.json(
      {
        success: false,
        message: `Maximus Error: ${error?.message}`,
        data: null,
      },
      { status: error?.statusCode || 500 }
    );
  }
});

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}
