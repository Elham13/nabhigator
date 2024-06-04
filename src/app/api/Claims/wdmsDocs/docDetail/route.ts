import MaximusResponseLog from "@/lib/Models/maximusResponseLog";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { buildWDMSUrl } from "@/lib/helpers/wdmsHelpers";
import { Databases, EndPoints } from "@/lib/utils/types/enums";
import { IMaximusResponseLog } from "@/lib/utils/types/fniDataTypes";
import {
  IGenerateDocTokenRes,
  IGetDocumentDetailRes,
} from "@/lib/utils/types/maximusResponseTypes";
import axios from "axios";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

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
  const { claimType, claimId } = await req?.json();

  const {
    docDetail: { baseUrl, clientId, clientSecret, userName, password },
  } = buildWDMSUrl();

  try {
    if (!claimType) throw new Error("claimType is required");
    if (!claimId) throw new Error("claimId is required");

    await connectDB(Databases.FNI);

    logsPayload.claimId = claimId;

    // Getting Token
    const getTokenFormData = new FormData();
    getTokenFormData.append("client_id", clientId);
    getTokenFormData.append("client_secret", clientSecret);

    const { data: getToken } = await axios.post<IGenerateDocTokenRes>(
      `${baseUrl}${EndPoints.GET_DOCS_TOKEN}`,
      getTokenFormData
    );

    logsPayload.api = `${baseUrl}${EndPoints.GET_DOCS_TOKEN}`;
    logsPayload.requestBody = getTokenFormData;
    logsPayload.requestHeaders = "No Headers";
    logsPayload.responseBody = getToken;

    await MaximusResponseLog.create(logsPayload);

    let CaseType = "PolicyNumber";

    if (claimType === "PreAuth") {
      CaseType = "PreAuthID";
    } else if (claimType === "Reimbursement") {
      CaseType = "ClaimID";
    } else {
      CaseType = claimType;
    }

    // Getting Document Details
    const getDocDetailPayload = {
      UniqueIdentifier: v4(),
      Source: "WebSite",
      CaseType,
      CaseTypeID: claimId,
      Username: userName,
      Password: password,
    };

    const { data: getDocDetails } = await axios.post<IGetDocumentDetailRes>(
      `${baseUrl}${EndPoints.GET_DOCS_DETAIL}`,
      getDocDetailPayload,
      { headers: { Authorization: getToken?.token } }
    );

    logsPayload.api = `${baseUrl}${EndPoints.GET_DOCS_DETAIL}`;
    logsPayload.requestBody = getDocDetailPayload;
    logsPayload.requestHeaders = {
      headers: { Authorization: getToken?.token },
    };
    logsPayload.responseBody = getDocDetails;

    await MaximusResponseLog.create(logsPayload);

    if (getDocDetails?.Status === "Failure")
      throw new Error(
        `WDMS getDocumentDetails api failure: ${getDocDetails?.Message}`
      );

    return NextResponse.json(
      {
        success: true,
        message: "Fetched",
        data: getDocDetails,
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
        message: error?.message,
        data: null,
      },
      { status: error?.statusCode || 500 }
    );
  }
});

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}
