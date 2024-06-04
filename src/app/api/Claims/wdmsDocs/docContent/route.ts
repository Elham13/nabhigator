import MaximusResponseLog from "@/lib/Models/maximusResponseLog";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { buildUrl } from "@/lib/helpers";
import { buildWDMSUrl } from "@/lib/helpers/wdmsHelpers";
import { Databases, EndPoints } from "@/lib/utils/types/enums";
import { IMaximusResponseLog } from "@/lib/utils/types/fniDataTypes";
import {
  IGenerateDocTokenRes,
  IPostDocumentStatusRes,
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
  const { Document_Index, claimId } = await req.json();

  const {
    docContent: { baseUrl, clientId, clientSecret, userName, password },
  } = buildWDMSUrl();

  try {
    if (!Document_Index) throw new Error("Document_Index is required");
    if (!claimId) throw new Error("claimId is required");
    await connectDB(Databases.FNI);

    logsPayload.claimId = claimId;

    const tokenUrl = buildUrl(`${baseUrl}${EndPoints.GET_DOCS_TOKEN}`, {
      client_id: clientId,
      client_secret: clientSecret,
    });

    const { data: tokenRes } = await axios.post<IGenerateDocTokenRes>(tokenUrl);

    logsPayload.api = tokenUrl;
    logsPayload.requestBody = "No Body";
    logsPayload.requestHeaders = "No headers";
    logsPayload.responseBody = tokenRes;

    await MaximusResponseLog.create(logsPayload);

    if (tokenRes?.token?.includes("Access Denied")) {
      throw new Error(
        `${EndPoints.GET_DOCS_TOKEN} api failure: ${tokenRes?.token}`
      );
    }

    // Getting Document Status
    const postDocStatusPayload = {
      Request_ID: "MzM2MzY3ODkyMDIzMDA=1",
      Type: "Download",
      Username: userName,
      Password: password,
      Document_Name: "Doc_Index",
      UniqueIdentifier: Document_Index,
    };

    const postDocStatusHeaders = {
      headers: {
        Authorization: tokenRes?.token,
      },
    };

    const { data: postDocStatus } = await axios.post<IPostDocumentStatusRes>(
      `${baseUrl}${EndPoints.POST_DOC_STATUS}`,
      postDocStatusPayload,
      postDocStatusHeaders
    );

    logsPayload.api = `${baseUrl}${EndPoints.POST_DOC_STATUS}`;
    logsPayload.requestBody = postDocStatusPayload;
    logsPayload.requestHeaders = postDocStatusHeaders;
    logsPayload.responseBody = postDocStatus;

    await MaximusResponseLog.create(logsPayload);

    return NextResponse.json(
      {
        success: true,
        message: "Fetched",
        data: postDocStatus,
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
