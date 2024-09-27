import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases, FromEmails } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import { HydratedDocument } from "mongoose";
import {
  CaseDetail,
  DocumentData,
  EventNames,
  IDashboardData,
  Investigator,
  ITasksAndDocuments,
  IUser,
  NumericStage,
  Task,
} from "@/lib/utils/types/fniDataTypes";
import DashboardData from "@/lib/Models/dashboardData";
import { captureCaseEvent } from "../caseEvent/helpers";
import sendEmail from "@/lib/helpers/sendEmail";
import User from "@/lib/Models/user";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import ClaimCase from "@/lib/Models/claimCase";
import { rmMainObjectOptionsMap } from "@/lib/utils/constants/options";
import { configureRMTasksAndDocuments } from "@/lib/helpers";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

const changeTasksAndDocs = async (caseId: string | null, subType: string) => {
  if (!caseId) return;

  const caseDetail: HydratedDocument<CaseDetail> | null =
    await ClaimCase.findById(caseId);

  if (!caseDetail)
    throw new Error(`Failed to find case details with the id ${caseId}`);

  const tasksAndDocs: ITasksAndDocuments[] = caseDetail?.tasksAndDocs || [];

  if (caseDetail?.allocationType === "Single") {
    const { newTasks, newDocs } = configureRMTasksAndDocuments({
      claimSubType: subType,
    });

    tasksAndDocs[0].tasks = newTasks;
    tasksAndDocs[0].docs = newDocs;

    caseDetail.tasksAndDocs = tasksAndDocs;

    await caseDetail.save();
  } else if (caseDetail?.allocationType === "Dual") {
    for (let i = 0; i < 2; i++) {
      const { newTasks, newDocs } = configureRMTasksAndDocuments({
        claimSubType: subType,
        part: i === 0 ? "Insured" : "Hospital",
      });
      tasksAndDocs[i].tasks = newTasks;
      tasksAndDocs[i].docs = newDocs;
    }
    await caseDetail.save();
  }
};

router.post(async (req) => {
  const { id, claimSubType, remarks, userName, origin, action, status } =
    await req?.json();

  try {
    if (!id) throw new Error("id is required");
    if (!action) throw new Error("action is required");
    await connectDB(Databases.FNI);

    const data: HydratedDocument<IDashboardData> | null =
      await DashboardData.findById(id);

    if (!data) throw new Error(`No record found with the id ${id}`);

    const tlInbox = data?.tlInbox || {};
    let response: any = null;
    let statusMessage: string = "Nothing happened";

    const webUrl =
      process.env.NEXT_PUBLIC_CONFIG === "PROD"
        ? "https://www.nivabupa.com/Claims/login"
        : "https://appform.nivabupa.com/Claims/login";

    if (action === "amend" && origin === "web") {
      if (data?.claimSubType === claimSubType)
        throw new Error(`The claim sub-type is already ${claimSubType}`);

      await captureCaseEvent({
        eventName: EventNames.CLAIM_SUB_TYPE_CHANGE,
        intimationDate:
          data?.intimationDate ||
          dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
        stage: data?.stage,
        claimId: data?.claimId,
        eventRemarks: `Claim sub-type changed from ${
          data?.claimSubType || "-"
        } to ${claimSubType || "-"}`,
        userName,
      });

      await changeTasksAndDocs(data?.caseId as string, claimSubType);

      response = await data.save();
      statusMessage = "You have successfully changed the claim sub type";
    } else {
      const tl: HydratedDocument<IUser> | null = await User.findById(
        data?.teamLead
      );

      if (!tl)
        throw new Error(`Failed to find a TL with the id ${data?.teamLead}`);

      if (action === "amend") {
        if (data?.claimSubType === claimSubType)
          throw new Error(`The claim sub-type is already ${claimSubType}`);
        if (!data?.teamLead)
          throw new Error("No team lead found for this case");

        tlInbox.claimSubTypeChange = { value: claimSubType, origin, remarks };

        data.tlInbox = tlInbox;

        await captureCaseEvent({
          eventName: EventNames.INV_REQUESTED_TO_CHANGE_CLAIM_SUBTYPE,
          intimationDate:
            data?.intimationDate ||
            dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
          stage: data?.stage,
          claimId: data?.claimId,
          eventRemarks: `Investigator request to change the claim sub-type from ${
            data?.claimSubType || "-"
          } to ${claimSubType || "-"}`,
          userName,
        });

        const bodyText = `Dear ${
          tl?.name
        } \nThe investigator ${userName} has requested to change claim sub-type from ${
          data?.claimSubType || "-"
        } to ${claimSubType || "-"} with the remarks "${
          remarks || "-"
        }"\n\nPlease take an action (Approve or Reject) by following bellow steps.\n\n1- Login to <a href="${webUrl}">Nbhigator</a> with your credentials.\n2- If you have multiple roles please select TL as your active role.\n3- Go to Action Inbox and click on the ${
          data?.claimId
        } ${
          data?.claimType === "PreAuth" ? "PreAuth ID" : "Claim ID"
        }\n4- Open the Claim Type Detail, review the change and approve or reject.\n\n\nThanks & Regards`;

        await sendEmail({
          from: FromEmails.DO_NOT_REPLY,
          recipients: tl?.email,
          subject: `${userName} request to change claim sub-type`,
          bodyText,
        });

        response = await data.save();
        statusMessage =
          "Your change request is now pending for the TL approval";
      } else if (action === "tlApprove") {
        if (!status) throw new Error("status is required");
        if (!tlInbox?.claimSubTypeChange?.value)
          throw new Error("Changing claim sub-type value not captured");
        let benefitType =
          tlInbox?.claimSubTypeChange?.value === "Critical Illness"
            ? "Benefit"
            : "Indemnity";
        let eventRemarks = "";

        if (status === "approved") {
          if (
            tlInbox?.claimSubTypeChange?.value === "PA/CI" &&
            tlInbox?.claimSubTypeChange?.origin === "investigator"
          ) {
            data.stage = NumericStage.PENDING_FOR_PRE_QC;

            eventRemarks = `TL approved the change request from ${
              data?.claimSubType || "-"
            } to ${
              tlInbox?.claimSubTypeChange?.value || "-"
            }, and benefit type from ${data.benefitType || "-"} to ${
              benefitType || "-"
            } and sent the case back to Pending for Pre-QC due to PA/CI`;
          } else {
            eventRemarks = `TL approved the change request from ${
              data?.claimSubType || "-"
            } to ${
              tlInbox?.claimSubTypeChange?.value || "-"
            }, and benefit type from ${data.benefitType || "-"} to ${
              benefitType || "-"
            }`;

            await changeTasksAndDocs(
              data?.caseId as string,
              tlInbox?.claimSubTypeChange?.value
            );
          }
          data.benefitType = benefitType;
          data.claimSubType = tlInbox?.claimSubTypeChange?.value;
          data.tlInbox = { claimSubTypeChange: undefined };

          statusMessage = "Approved successfully";
        } else if (status === "disapproved") {
          // TL disapproved the change request and changes the claim subType himself
          eventRemarks = `TL disapproved the change request from ${
            data?.claimSubType || "-"
          } to ${
            tlInbox?.claimSubTypeChange?.value || "-"
          }, and benefit type from ${data.benefitType || "-"} to ${
            benefitType || "-"
          }`;
          data.tlInbox = { claimSubTypeChange: undefined };

          statusMessage = "Rejected successfully";
        } else throw new Error(`Invalid status ${status}`);

        const eventName =
          status === "approved"
            ? EventNames.CLAIM_SUB_TYPE_CHANGE_APPROVED
            : EventNames.CLAIM_SUB_TYPE_CHANGE_REJECTED;

        const invId = data?.claimInvestigators[0]?._id;

        const inv: HydratedDocument<Investigator> | null =
          await ClaimInvestigator.findById(invId);

        if (!inv)
          throw new Error(
            `Failed to find any investigators with the id ${invId}`
          );

        await captureCaseEvent({
          eventName,
          intimationDate:
            data?.intimationDate ||
            dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
          stage: data?.stage,
          claimId: data?.claimId,
          eventRemarks,
          userName,
        });

        const bodyText = `Dear ${
          inv?.investigatorName
        },\n\nYour request to change the claim sub-type of ${
          data?.claimType === "PreAuth" ? "PreAuth ID" : "Claim ID"
        } ${data?.claimId} is ${
          status === "approved" ? "Approved" : "Rejected"
        } by Team Lead ${tl?.name}.\n\n\nThanks & Regards`;

        await sendEmail({
          from: FromEmails.DO_NOT_REPLY,
          recipients: inv?.email,
          subject: `Claim sub-type change request status update`,
          bodyText,
        });

        response = await data.save();
      } else throw new Error(`Invalid value for action ${action}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: statusMessage,
        data: response,
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
