import ClaimCase from "@/lib/Models/claimCase";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases, EndPoints, FromEmails } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  IMaximusResponseLog,
  IDashboardData,
  RejectionReason,
  CaseDetail,
  NumericStage,
  IUser,
  Role,
  EventNames,
  Investigator,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, Types } from "mongoose";
import DashboardData from "@/lib/Models/dashboardData";
import { buildMaximusUrl } from "@/lib/helpers/wdmsHelpers";
import axios from "axios";
import {
  GetAuthRes,
  IUpdateFNIDetailsRes,
} from "@/lib/utils/types/maximusResponseTypes";
import MaximusResponseLog from "@/lib/Models/maximusResponseLog";
import User from "@/lib/Models/user";
import sendEmail from "@/lib/helpers/sendEmail";
import { captureCaseEvent } from "../caseEvent/helpers";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import { getEncryptClaimId } from "@/lib/helpers";
import { investigatorRecommendationOptions } from "@/lib/utils/constants/options";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  const { dashboardDataId, rejectionReasons, user } = await req?.json();

  try {
    if (!dashboardDataId) throw new Error("dashboardDataId is missing!");
    await connectDB(Databases.FNI);

    logsPayload.dashboardDataId = new Types.ObjectId(dashboardDataId);

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData?.findById(dashboardDataId);

    if (!dashboardData)
      throw new Error(`Could not find any data with the id ${dashboardDataId}`);

    logsPayload.claimId = dashboardData.claimId;

    const oldStage = dashboardData.stage;

    const reasons: RejectionReason[] = rejectionReasons;

    const summaryOfInvestigation = reasons
      ?.map((el, index) => `${index + 1}: ${el?.reason}. Remark: ${el?.remark}`)
      ?.join(", ");

    let FINAL_OUTCOME = "";

    if (!process.env.NEXT_PUBLIC_CONFIG)
      throw new Error("Failed to get .env variable");

    if (["LOCAL", "UAT"].includes(process.env.NEXT_PUBLIC_CONFIG)) {
      FINAL_OUTCOME = "DT";
    } else {
      FINAL_OUTCOME = "NI";
    }

    const tempInv =
      !!dashboardData?.claimInvestigators &&
      dashboardData?.claimInvestigators?.length > 0
        ? dashboardData?.claimInvestigators[0]
        : null;

    const invId = dashboardData?.claimInvestigators[0]?._id;
    const inv: HydratedDocument<Investigator> | null =
      await ClaimInvestigator.findById(invId);

    const payload = {
      Claimdetail: {
        CLAIM_NO: dashboardData?.claimId?.toString(),
        CLAIM_TYPE: dashboardData?.claimType === "PreAuth" ? "P" : "R",
        POLICY_NUMBER: dashboardData?.contractDetails?.policyNo,
        SourceSystem: dashboardData?.sourceSystem,
      },
      Case_Assignment: {
        CASE_ASSIGNMENT_FLAG: "1",
        ASSIGN_TO: inv?.investigatorCode || "",
        TO_EMAIL: inv?.email?.join(";") || "FIallocation@maxbupa.com",
        CC_EMAIL: "FIallocation@maxbupa.com",
        REMARKS: summaryOfInvestigation,
        FRAUD_STATUS: "C",
        STATUS_Updates: "IV",
        Line_Of_Investigation: {
          CA_Hospital_Visit: "0",
          CA_Treating_Doctor_Visit: "0",
          CA_Insured_Visit: "0",
          CA_Meeting_Family_Physician: "0",
          CA_Pathology: "0",
          CA_Chemist: "",
          CA_Relative: "0",
          CA_Neighbor: "0",
          CA_Vicinity: "0",
          CA_Employer_School_University: "0",
          CA_Other: "1",
          CA_OTHER_TEXT: summaryOfInvestigation,
        },
      },
      Report_Sharing: {
        REPORT_SHARING_FLAG: "1",
        FINAL_OUTCOME,
        FRAUD_STATUS: "C",
        RPT_SEND_TO_EMAIL: "FIAllocation@nivabupa.com;",
        EXECUTIVE_SUMMARY: `${summaryOfInvestigation}.`,
        RECOMMENDATION: `${summaryOfInvestigation}.`,
        quality_Check: {
          RS_Hospital_Visit: "0",
          RS_Treating_Doctor_Visit: "0",
          RS_Insured_Visit: "0",
          RS_Meeting_Family_Physician: "0",
          RS_Pathology: "0",
          RS_Chemist: "0",
          RS_Relative: "0",
          RS_Neighbor: "0",
          RS_Vicinity: "0",
          RS_Employer_School_University: "0",
          RS_Other: "1",
          RS_OTHER_TEXT: "Not investigated",
        },
      },
      REPORT_Attachment: {
        file_name: "",
        fileURL: "",
        file_base64: "",
      },
    };

    const { baseUrl, authPayload, apiId } = buildMaximusUrl();

    const getAuthHeaders = {
      headers: {
        "x-apigw-api-id": apiId,
        "Content-Type": "application/json",
      },
    };

    const { data: getAuth } = await axios.post<GetAuthRes>(
      `${baseUrl}${EndPoints.GET_AUTH}`,
      authPayload,
      getAuthHeaders
    );

    logsPayload.api = `${baseUrl}${EndPoints.GET_AUTH}`;
    logsPayload.requestBody = authPayload;
    logsPayload.requestHeaders = getAuthHeaders;
    logsPayload.responseBody = getAuth;

    await MaximusResponseLog.create(logsPayload);

    if (!getAuth.Token) throw new Error("Failed to get auth token");

    const updateFniDetailHeaders = {
      headers: {
        Authorization: `Bearer ${getAuth?.Token}`,
        "x-apigw-api-id": apiId,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post<IUpdateFNIDetailsRes>(
      `${baseUrl}${EndPoints.UPDATE_FNI_DETAILS}`,
      payload,
      updateFniDetailHeaders
    );

    logsPayload.api = `${baseUrl}${EndPoints.UPDATE_FNI_DETAILS}`;
    logsPayload.requestBody = payload;
    logsPayload.requestHeaders = updateFniDetailHeaders;
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

    if (dashboardData?.caseId) {
      await ClaimCase.findByIdAndUpdate(
        dashboardData.caseId,
        {
          $set: {
            caseStatus: "Rejected",
            rejectionReasons,
            assignedBy: user?._id,
            allocationType: "Single",
            preQcObservation: "-",
          },
        },
        { useFindAndModify: false }
      );
    } else {
      const newCase: HydratedDocument<CaseDetail> = await ClaimCase.create({
        caseStatus: "Rejected",
        allocationType: "Single",
        preQcObservation: "-",
        rejectionReasons,
        dashboardDataId,
        intimationDate: dashboardData?.intimationDate,
        assignedBy: user?._id,
      });
      dashboardData.caseId = newCase._id as string;
    }

    const eventRemarks = `Rejected due to ${rejectionReasons
      ?.map((el: any) => el?.reason)
      ?.join(", ")}`;

    dashboardData.rejectionReasons = rejectionReasons;
    dashboardData.stage = NumericStage.REJECTED;
    dashboardData.dateOfClosure = new Date();
    dashboardData.teamLead = dashboardData.teamLead || null;
    dashboardData.actionsTaken = dashboardData?.actionsTaken
      ? [
          ...dashboardData?.actionsTaken,
          {
            actionName: eventRemarks,
            userId: user?._id,
          },
        ]
      : [
          {
            actionName: eventRemarks,
            userId: user?._id,
          },
        ];

    const claimType = dashboardData?.claimType;

    let recipients: string[] = ["FIAllocation@nivabupa.com"];

    if (claimType === "PreAuth") {
      recipients = [
        "Pre.Auth@nivabupa.com",
        "Preauth.Team@nivabupa.com",
        "Rohit.Choudhary@nivabupa.com",
        "Sudeshna.Mallick@nivabupa.com",
        "Aditya.Srivastava@nivabupa.com",
      ];
    } else {
      recipients = ["team.claims@nivabupa.com"];
    }

    const ccRecipients: string[] = ["Sanjay.Kumar16@nivabupa.com"];

    const users: IUser[] = (await User.find({
      status: "Active",
    }).lean()) as IUser[];

    for (const us of users) {
      if (oldStage === NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING) {
        if (us.role.includes(Role.ALLOCATION)) {
          ccRecipients.push(us.email);
        }
      } else {
        if (us.role.includes(Role.PRE_QC)) {
          ccRecipients.push(us.email);
        }
      }
    }

    const webUrl =
      process.env.NEXT_PUBLIC_CONFIG === "PROD"
        ? "https://www.nivabupa.com/"
        : "https://appform.nivabupa.com/";

    const encryptedClaimId: string = await getEncryptClaimId(
      dashboardData?.claimId
    );

    const emailContent = `<div><p style="font-weight:700">Dear Team,</p><p><span style="font-weight:700">${
      claimType === "PreAuth" ? "Pre-Auth" : "Claim"
    } ID ${dashboardData?.claimId}</span> is returned from Pre-QC by ${
      user?.name
    }</p><p><span style="font-weight:700">Reason and Remarks: </span>${summaryOfInvestigation}</p><p>Kindly refer to FRCU Final Investigation Report and documents collected, <a href="${webUrl}/pdf-view-and-download?claimId=${encryptedClaimId}&docType=final-investigation-report&invType=${
      inv?.Type
    }">here.</a></p><p>The FRCU recommendation and summary can be referred in Maximus/Phoenix. The URL to access the Final Report and documents are available there as well.</p><p>Regards,</p><p>FRCU</p></div>`;

    const { success, message } = await sendEmail({
      from: FromEmails.DO_NOT_REPLY,
      recipients,
      cc_recipients: ccRecipients,
      subject: `${claimType === "PreAuth" ? "Pre-Auth" : "Claim"} ID ${
        dashboardData?.claimId
      }, ${summaryOfInvestigation}`,
      html: emailContent,
    });

    if (!success) throw new Error(`Failed to send email: ${message}`);

    await dashboardData.save();

    await captureCaseEvent({
      eventName: EventNames.PRE_QC_REJECTED,
      eventRemarks,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      stage: NumericStage.REJECTED,
      claimId: dashboardData?.claimId,
      userName: user?.name,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Changes captured successfully",
        data: {},
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
