import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases, FromEmails } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DashboardData from "@/lib/Models/dashboardData";
import { HydratedDocument } from "mongoose";
import {
  CaseDetail,
  EventNames,
  IUser,
  Investigator,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import ClaimCase from "@/lib/Models/claimCase";
import User from "@/lib/Models/user";
import sendEmail from "@/lib/helpers/sendEmail";
import { captureCaseEvent } from "../caseEvent/helpers";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import { getEncryptClaimId } from "@/lib/helpers";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { id, userId, postQARecommendation, userName } = await req?.json();

  try {
    if (!id) throw new Error("id is required");

    await connectDB(Databases.FNI);

    const dashboardData = await DashboardData.findById(id);

    if (!dashboardData) throw new Error(`No data found with the id ${id}`);
    const claimType = dashboardData?.claimType;

    const caseDetail: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(dashboardData?.caseId);

    if (!caseDetail)
      throw new Error(
        `No case detail found with the id ${dashboardData?.caseId}`
      );

    dashboardData.expedition =
      dashboardData?.expedition && dashboardData?.expedition?.length > 0
        ? dashboardData?.expedition?.map((el: any) => ({
            ...el,
            noted: true,
          }))
        : dashboardData?.expedition;

    let recipients: string[] = [];
    let ccRecipients: string[] = [];

    caseDetail.reportSubmissionDateQa = new Date();
    caseDetail.qaBy = userName;
    dashboardData.dateOfClosure = new Date();

    const eventName = EventNames.QA_COMPLETED;
    const eventRemarks = `Investigation approved and QA completed with summary of investigation: ${postQARecommendation?.summaryOfInvestigation}`;

    const postQaUser: HydratedDocument<IUser> | null = await User.findById(
      userId
    );

    if (dashboardData?.claimType === "PreAuth") {
      if (
        !!postQaUser?.config?.preAuthPendency &&
        postQaUser?.config?.preAuthPendency > 0
      ) {
        postQaUser.config.preAuthPendency -= 1;
        postQaUser!.config!.pendency!.preAuth =
          !!postQaUser?.config?.pendency?.preAuth &&
          postQaUser?.config?.pendency?.preAuth?.length > 0
            ? postQaUser?.config?.pendency?.preAuth?.filter(
                (el) => el?.claimId !== dashboardData?.claimId
              )
            : [];

        await postQaUser.save();
      }
    } else {
      if (
        !!postQaUser?.config?.rmPendency &&
        postQaUser?.config?.rmPendency > 0
      ) {
        postQaUser.config.rmPendency = postQaUser?.config?.rmPendency - 1;
        postQaUser!.config!.pendency!.rm =
          !!postQaUser?.config?.pendency?.rm &&
          postQaUser?.config?.pendency?.rm?.length > 0
            ? postQaUser?.config?.pendency?.rm?.filter(
                (el) => el?.claimId !== dashboardData?.claimId
              )
            : [];

        await postQaUser.save();
      }
    }

    const postQaUserEmail = postQaUser?.email || "";

    if (claimType === "PreAuth") {
      recipients = [
        "Preauth.Team@nivabupa.com",
        "Rohit.Choudhary@nivabupa.com",
        "Sudeshna.Mallick@nivabupa.com",
        "Team.Claims@nivabupa.com",
      ];
      ccRecipients = [
        "Sanjay.Kumar16@nivabupa.com",
        "FIallocation@nivabupa.com",
        "Vikram.Singh9@nivabupa.com",
        "Nandan.CA@nivabupa.com",
        "Rakesh.Pandey@nivabupa.com",
        "Nanit.Kumar@nivabupa.com",
        postQaUserEmail,
      ];
    } else {
      recipients = ["FIAllocation@nivabupa.com"];
      ccRecipients = [
        "team.claims@nivabupa.com",
        "Sanjay.Kumar16@nivabupa.com",
        postQaUserEmail,
      ];
    }

    const invId = dashboardData?.claimInvestigators[0]?._id;
    const inv: HydratedDocument<Investigator> | null =
      await ClaimInvestigator.findById(invId);

    const webUrl =
      process.env.NEXT_PUBLIC_CONFIG === "PROD"
        ? "https://www.nivabupa.com/"
        : "https://appform.nivabupa.com/";

    const encryptedClaimId = await getEncryptClaimId(dashboardData?.claimId);

    const emailContent = `<div><p style="font-weight:700">Dear Team,</p><p><span style="font-weight:700">${
      claimType === "PreAuth" ? "Pre-Auth" : "Claim"
    } ID ${
      dashboardData?.claimId
    } </span>is closed from FRCU by ${userName}</p><p><span style="font-weight:700">FRCU recommendation: </span>${
      postQARecommendation?.frcuRecommendationOnClaims?.value
    }</p><p>Kindly refer to FRCU Final Investigation Report and documents collected, <a href="${webUrl}/pdf-view-and-download?claimId=${encryptedClaimId}&docType=final-investigation-report&invType=${
      inv?.Type
    }">here.</a></p><p>The FRCU recommendation and summary can be referred in Maximus/Phoenix. The URL to access the Final Report and documents are available there as well.</p><p>Regards,</p><p>FRCU</p></div>`;

    const {
      success,
      message: mailerMsg,
      mailResponse,
    } = await sendEmail({
      from: FromEmails.DO_NOT_REPLY,
      recipients: recipients,
      cc_recipients: ccRecipients,
      subject: `${claimType === "PreAuth" ? "Pre-Auth" : "Claim"} ID ${
        dashboardData?.claimId
      }, FRCU Closed- Recommendation: ${
        postQARecommendation?.frcuRecommendationOnClaims?.value
      }`,
      html: emailContent,
    });

    if (!success) throw new Error(`Failed to send Email: ${mailerMsg}`);

    const message = `Case closed successfully and Email sent to ${mailResponse?.accepted?.join(
      ", "
    )}`;

    dashboardData.stage = NumericStage.CLOSED;
    dashboardData.actionsTaken = dashboardData?.actionsTaken
      ? [
          ...dashboardData?.actionsTaken,
          {
            actionName: eventName,
            userId,
          },
        ]
      : [
          {
            actionName: eventName,
            userId,
          },
        ];

    if (!!postQARecommendation) {
      caseDetail.postQARecommendation = postQARecommendation;
      dashboardData.finalOutcome =
        postQARecommendation?.frcuRecommendationOnClaims?.value || "-";
    }

    const data = await dashboardData.save();
    await caseDetail.save();

    dayjs.extend(utc);
    dayjs.extend(timezone);
    await captureCaseEvent({
      claimId: dashboardData?.claimId,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      eventName,
      stage: NumericStage.CLOSED,
      userId: userId as string,
      eventRemarks,
      userName: userName,
    });

    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
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
