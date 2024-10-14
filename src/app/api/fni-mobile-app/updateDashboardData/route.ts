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
  ILocked,
  IUser,
  Investigator,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import ClaimCase from "@/lib/Models/claimCase";
import User from "@/lib/Models/user";
import sendEmail from "@/lib/helpers/sendEmail";
import { captureCaseEvent } from "../../Claims/caseEvent/helpers";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import { getEncryptClaimId } from "@/lib/helpers";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const {
    id,
    action,
    stage,
    userId,
    postQaComment,
    postQARecommendation,
    userName,
    claimSubType,
  } = await req?.json();

  try {
    if (!id) throw new Error("id is required");
    if (!action) throw new Error("action is required");

    await connectDB(Databases.FNI);

    let message: string = "";
    let data: any = null;

    const dashboardData = await DashboardData.findById(id);

    if (!dashboardData) throw new Error(`No data found with the id ${id}`);

    const caseDetail: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(dashboardData?.caseId);

    if (!caseDetail)
      throw new Error(
        `No case detail found with the id ${dashboardData?.caseId}`
      );

    if (action === "changeStage") {
      if (!stage) throw new Error("stage is required!");

      let eventName: string = "";
      let eventRemarks: string = "";

      if (stage === NumericStage.INVESTIGATION_ACCEPTED) {
        eventName = EventNames.CASE_ACCEPTED;
        eventRemarks = "Investigation Accepted";
        message = eventRemarks;
      } else if (stage === NumericStage.IN_FIELD_REWORK) {
        dashboardData.expedition =
          dashboardData?.expedition && dashboardData?.expedition?.length > 0
            ? dashboardData?.expedition?.map((el: any) => ({
                ...el,
                noted: true,
              }))
            : dashboardData?.expedition;
        eventName = EventNames.RETURN_TO_FIELD;
        eventRemarks = `Returned back to field investigator from POST QA with comment: ${postQaComment}`;

        message = "Case returned back to field investigator";
      } else if (stage === NumericStage.CLOSED) {
        let recipients: string[] = [];
        let ccRecipients: string[] = [];
        dashboardData.expedition =
          dashboardData?.expedition && dashboardData?.expedition?.length > 0
            ? dashboardData?.expedition?.map((el: any) => ({
                ...el,
                noted: true,
              }))
            : dashboardData?.expedition;

        const postQaUser: HydratedDocument<IUser> | null = await User.findById(
          userId
        );
        const postQaUserEmail = postQaUser?.email || "";

        if (dashboardData?.claimType === "PreAuth") {
          recipients = [
            // "Pre.Auth@nivabupa.com",
            "Preauth.Team@nivabupa.com",
            "Rohit.Choudhary@nivabupa.com",
            "Sudeshna.Mallick@nivabupa.com",
            // "Aditya.Srivastava@nivabupa.com",
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
          ccRecipients = ["team.claims@nivabupa.com", postQaUserEmail];
        }

        const invId = dashboardData?.claimInvestigators[0]?._id;
        const inv: HydratedDocument<Investigator> | null =
          await ClaimInvestigator.findById(invId);

        const webUrl =
          process.env.NEXT_PUBLIC_CONFIG === "PROD"
            ? "https://www.nivabupa.com/"
            : "https://appform.nivabupa.com/";

        const encryptedClaimId = await getEncryptClaimId(
          dashboardData?.claimId
        );

        const emailContent = `<div><p style="font-weight:700">Dear Team,</p><p><span style="font-weight:700">Pre-Auth ID ${dashboardData?.claimId} </span>is closed from FRCU by ${userName}</p><p><span style="font-weight:700">FRCU recommendation: </span>${postQARecommendation?.frcuRecommendationOnClaims?.value}</p><p>Kindly refer to FRCU Final Investigation Report and documents collected, <a href="${webUrl}/pdf-view-and-download?claimId=${encryptedClaimId}&docType=final-investigation-report&invType=${inv?.Type}">here.</a></p><p>The FRCU recommendation and summary can be referred in Maximus/Phoenix. The URL to access the Final Report and documents are available there as well.</p><p>Regards,</p><p>FRCU</p></div>`;

        const {
          success,
          message: mailerMsg,
          mailResponse,
        } = await sendEmail({
          from: FromEmails.DO_NOT_REPLY,
          recipients: recipients,
          cc_recipients: ccRecipients,
          subject: `Pre-Auth ID ${dashboardData?.claimId}, FRCU Closed- Recommendation: ${postQARecommendation?.frcuRecommendationOnClaims?.value}`,
          html: emailContent,
        });

        if (!success) throw new Error(`Failed to send Email: ${mailerMsg}`);

        caseDetail.reportSubmissionDateQa = new Date();
        caseDetail.qaBy = userName;
        dashboardData.dateOfClosure = new Date();

        await caseDetail.save();
        eventName = EventNames.QA_COMPLETED;
        eventRemarks = `Investigation approved and QA completed with summary of investigation: ${postQARecommendation?.summaryOfInvestigation}`;

        message = `Case closed successfully and Email sent to ${mailResponse?.accepted?.join(
          ", "
        )}`;
      }

      dashboardData.stage = stage;
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

      await captureCaseEvent({
        claimId: dashboardData?.claimId,
        intimationDate:
          dashboardData?.intimationDate ||
          dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
        eventName: eventName,
        stage: stage,
        userId: userId as string,
        eventRemarks: eventRemarks,
        userName: userName,
      });

      if (!!postQaComment) {
        caseDetail.postQaComment = postQaComment;
        await caseDetail?.save();
      }
      if (!!postQARecommendation) {
        caseDetail.postQARecommendation = postQARecommendation;
        await caseDetail?.save();
      }

      data = await dashboardData.save();
    } else if (action === "lock") {
      const msg = dashboardData?.locked?.status ? "Unlocked" : "Locked";
      const user: HydratedDocument<IUser> | null = await User.findById(userId);
      if (!user) throw new Error(`No user found with the id ${userId}`);

      const newLocked: ILocked = {
        status: !dashboardData?.locked?.status,
        role: user?.activeRole,
        name: user?.name,
      };
      dashboardData.locked = newLocked;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: msg,
              userId,
            },
          ]
        : [
            {
              actionName: msg,
              userId,
            },
          ];
      data = await dashboardData.save();

      await captureCaseEvent({
        claimId: dashboardData?.claimId,
        intimationDate:
          dashboardData?.intimationDate ||
          dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
        eventName: data?.locked?.status
          ? EventNames.CASE_LOCKED
          : EventNames.CASE_UNLOCKED,
        stage: dashboardData.stage,
        userId: userId as string,
        eventRemarks: data?.locked?.status
          ? EventNames.CASE_LOCKED
          : EventNames.CASE_UNLOCKED,
      });

      message = `Cases successfully ${msg}`;
    } else if (action === "skipInvestigationAndComplete") {
      dashboardData.expedition =
        dashboardData?.expedition && dashboardData?.expedition?.length > 0
          ? dashboardData?.expedition?.map((el: any) => ({
              ...el,
              noted: true,
            }))
          : dashboardData?.expedition;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_AND_COMPLETING,
              userId,
            },
          ]
        : [
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_AND_COMPLETING,
              userId,
            },
          ];
      dashboardData.stage = NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING;

      await captureCaseEvent({
        claimId: dashboardData?.claimId,
        intimationDate:
          dashboardData?.intimationDate ||
          dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
        eventName: EventNames.INVESTIGATION_SKIPPED_AND_COMPLETING,
        stage: dashboardData.stage,
        userId: userId as string,
        eventRemarks: EventNames.INVESTIGATION_SKIPPED_AND_COMPLETING,
      });

      data = await dashboardData.save();
      message =
        "Investigation successfully skipped, please start completing investigation.";
    } else if (action === "skipInvestigationAndReAssign") {
      dashboardData.expedition =
        dashboardData?.expedition && dashboardData?.expedition?.length > 0
          ? dashboardData?.expedition?.map((el: any) => ({
              ...el,
              noted: true,
            }))
          : dashboardData?.expedition;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING,
              userId,
            },
          ]
        : [
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING,
              userId,
            },
          ];
      dashboardData.stage = NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING;
      await captureCaseEvent({
        claimId: dashboardData?.claimId,
        intimationDate:
          dashboardData?.intimationDate ||
          dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
        eventName: EventNames.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING,
        stage: dashboardData.stage,
        userId: userId as string,
        eventRemarks: EventNames.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING,
      });
      data = await dashboardData.save();
      message =
        "Investigation successfully skipped, please Re-Assign to an investigator.";
    } else if (action === "cancelSkipInvestigation") {
      dashboardData.expedition =
        dashboardData?.expedition && dashboardData?.expedition?.length > 0
          ? dashboardData?.expedition?.map((el: any) => ({
              ...el,
              noted: true,
            }))
          : dashboardData?.expedition;
      dashboardData.stage = NumericStage.IN_FIELD_FRESH;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_CANCELEd,
              userId,
            },
          ]
        : [
            {
              actionName: EventNames.INVESTIGATION_SKIPPED_CANCELEd,
              userId,
            },
          ];

      await captureCaseEvent({
        claimId: dashboardData?.claimId,
        intimationDate:
          dashboardData?.intimationDate ||
          dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
        eventName: EventNames.INVESTIGATION_SKIPPED_CANCELEd,
        stage: dashboardData.stage,
        userId: userId as string,
        eventRemarks: EventNames.INVESTIGATION_SKIPPED_CANCELEd,
      });

      data = await dashboardData.save();
      message = "The case sent back to the investigator";
    } else if (action === "changeClaimSubType") {
      if (!claimSubType) throw new Error(`claimSubType is required`);
      dashboardData.claimSubType = claimSubType;
      dashboardData.actionsTaken = dashboardData?.actionsTaken
        ? [
            ...dashboardData?.actionsTaken,
            {
              actionName: "Claim Sub Type changed",
              userId,
            },
          ]
        : [
            {
              actionName: "Claim Sub Type changed",
              userId,
            },
          ];

      data = await dashboardData.save();
    }

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
