import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases, FromEmails } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { HydratedDocument } from "mongoose";
import {
  CaseDetail,
  EventNames,
  IDashboardData,
  IUser,
  Investigator,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import DashboardData from "@/lib/Models/dashboardData";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import ClaimCase from "@/lib/Models/claimCase";
import User from "@/lib/Models/user";
import sendEmail from "@/lib/helpers/sendEmail";
import { captureCaseEvent } from "../../Claims/caseEvent/helpers";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const {
    id,
    userId,
    rejectionReason,
    remark,
    insuredAddress,
    insuredCity,
    insuredState,
    insuredMobileNumber,
  } = await req?.json();

  try {
    if (!id) throw new Error("id is required");
    if (!userId) throw new Error("userId is required");

    await connectDB(Databases.FNI);

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findById(id);

    const investigator: HydratedDocument<Investigator> | null =
      await ClaimInvestigator.findById(userId);

    if (!dashboardData) throw new Error(`No data found with id ${id}`);
    if (!investigator) throw new Error(`No user found with userId ${userId}`);

    if (
      investigator?.rejectedCases &&
      investigator?.rejectedCases?.length > 0
    ) {
      investigator.rejectedCases = [
        ...investigator?.rejectedCases,
        dashboardData?.claimId,
      ];
    } else {
      investigator.rejectedCases = [dashboardData?.claimId];
    }

    const updatedCase: CaseDetail | null = await ClaimCase.findByIdAndUpdate(
      dashboardData.caseId,
      {
        $set: {
          investigationRejected: {
            remark,
            insuredAddress,
            insuredCity,
            insuredState,
            insuredMobileNumber,
            investigationRejectedReason: rejectionReason,
          },
          caseStatus: "Investigation Rejected",
        },
      },
      { new: true, useFindAndModify: false }
    );

    dashboardData.stage = NumericStage.PENDING_FOR_RE_ALLOCATION;
    dashboardData.allocationType = "";
    dashboardData.claimInvestigators = [];
    dashboardData.actionsTaken = dashboardData?.actionsTaken
      ? [
          ...dashboardData?.actionsTaken,
          {
            actionName: EventNames.INVESTIGATION_REJECTED,
            userId,
          },
        ]
      : [
          {
            actionName: EventNames.INVESTIGATION_REJECTED,
            userId,
          },
        ];

    dashboardData.expedition =
      dashboardData?.expedition && dashboardData?.expedition?.length > 0
        ? dashboardData?.expedition?.map((el) => ({ ...el, noted: true }))
        : dashboardData?.expedition;

    const userIds = [];
    if (dashboardData?.teamLead) userIds.push(dashboardData?.teamLead);
    if (dashboardData?.clusterManager)
      userIds.push(dashboardData?.clusterManager);

    const users: IUser[] = await User.find({
      _id: { $in: userIds },
      status: "Active",
    }).lean();
    const allocatorUser: HydratedDocument<IUser> | null = await User.findById(
      updatedCase?.assignedBy
    );

    const allocationUserEmails: string[] = [];

    const ccRecipients: string[] = [
      "FIAllocation@nivabupa.com",
      "Sanjay.kumar16@nivabupa.com",
      "Nanit.Kumar@nivabupa.com",
    ];

    if (allocatorUser?.email) allocationUserEmails?.push(allocatorUser?.email);

    for (let user of users) {
      ccRecipients?.push(user?.email);
    }

    const emailContent = `<div><p>Dear Team,</p><p><span style="font-weight:700">${
      investigator?.investigatorName
    }</span> has returned the Pre-Auth ID <span style="text-decoration:underline">${
      dashboardData?.claimId
    }</span> due to ${rejectionReason} with Remarks (${remark}).</p><p>The case was assigned to him on <span style="font-weight:700">${dayjs(
      dashboardData?.dateOfOS
    ).format(
      "DD-MMM-YYYY hh:mm:ss a"
    )}</span> and returned on <span style="font-weight:700">${dayjs().format(
      "DD-MMM-YYYY hh:mm:ss a"
    )}</span></p><p>Please take appropriate action by logging in to <a href="${
      process.env.NEXT_PUBLIC_CONFIG === "PROD"
        ? "https://www.nivabupa.com/Claims/action-inbox"
        : "https://appform.nivabupa.com/Claims/action-inbox"
    }">FRCU</a></p><p>Regards,</p><p>FRCU</p></div>`;

    const {
      success,
      message: mailerMsg,
      mailResponse,
    } = await sendEmail({
      from: FromEmails.DO_NOT_REPLY,
      recipients: allocationUserEmails,
      cc_recipients: ccRecipients,
      subject: `Return from Investigator (${investigator?.investigatorName}) Pre-Auth ID = ${dashboardData?.claimId}`,
      html: emailContent,
    });

    if (!success) throw new Error(`Failed to send Email ${mailerMsg}`);

    await captureCaseEvent({
      claimId: dashboardData?.claimId,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      eventName: EventNames.INVESTIGATION_REJECTED,
      stage: NumericStage.PENDING_FOR_RE_ALLOCATION,
      userName: investigator?.investigatorName || "",
      eventRemarks: `Investigation rejected with comment ${remark}`,
    });

    await investigator.save();
    await dashboardData.save();

    return NextResponse.json(
      {
        success: true,
        message: `Case rejected and Email sent to ${mailResponse?.accepted?.join(
          ", "
        )}`,
        updatedCase,
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
