import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases, FromEmails } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import {
  AssignToInvestigatorRes,
  IUser,
  IDashboardData as DashboardDataType,
  Role,
  NumericStage,
  CaseDetail,
  EventNames,
  Investigator,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, Types } from "mongoose";
import DashboardData from "@/lib/Models/dashboardData";
import {
  findInvestigators,
  tellMaximusCaseIsAssigned,
  updateInvestigators,
} from "@/lib/helpers/autoPreQCHelpers";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import ClaimCase from "@/lib/Models/claimCase";
import { captureCaseEvent } from "../caseEvent/helpers";
import { compareArrOfObjBasedOnProp } from "@/lib/helpers";
import User from "@/lib/Models/user";
import sendEmail from "@/lib/helpers/sendEmail";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  const { dashboardDataId, isManual, investigator, allocationType } = body;

  const user: IUser = body?.user;
  delete body.user;

  const responseObj: AssignToInvestigatorRes = {
    success: true,
    message: "Update success",
    data: [],
  };
  let statusCode = 200;

  interface IDashboardData extends Omit<DashboardDataType, "caseId"> {
    caseId: string;
  }

  try {
    if (!dashboardDataId) throw new Error("Dashboard Data ID is missing");

    await connectDB(Databases.FNI);

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findById(dashboardDataId);

    if (!dashboardData)
      throw new Error(`No record found with the id ${dashboardDataId}`);

    let investigators: any = null;

    if (isManual) {
      if (!investigator?.length) {
        if (user?.activeRole !== Role.ALLOCATION) {
          dashboardData.stage = NumericStage.PENDING_FOR_ALLOCATION;
          dashboardData.dateOfFallingIntoAllocationBucket = new Date();
          dashboardData.teamLead = dashboardData.teamLead || null;
          await dashboardData?.save();
          return NextResponse.json(
            {
              ...responseObj,
              message: "Case moved to allocation bucket",
            },
            { status: statusCode }
          );
        } else {
          const response = await findInvestigators({
            allocation: { allocationType },
            dashboardData,
          });
          if (response?.success) investigators = response.investigators;
          else throw new Error(response?.message);
        }
      } else {
        investigators = await ClaimInvestigator.find({
          _id: {
            $in: investigator?.map((id: string) => new Types.ObjectId(id)),
          },
        });
      }
    } else {
      // Auto assign
      const response = await findInvestigators({
        allocation: { allocationType },
        dashboardData,
      });
      if (response?.success) investigators = response.investigators;
      else {
        if (dashboardData?.caseId) {
          await ClaimCase.findByIdAndUpdate(
            dashboardData?.caseId,
            {
              ...body,
              documents: new Map(body?.documents || []),
              intimationDate: dashboardData?.intimationDate,
              assignedBy: user?._id,
              outSourcingDate: new Date(),
            },
            { useFindAndModify: false }
          );
        } else {
          const newCase: HydratedDocument<CaseDetail> = await ClaimCase.create({
            ...body,
            documents: new Map(body?.documents || []),
            intimationDate: dashboardData?.intimationDate,
            assignedBy: user?._id,
            outSourcingDate: new Date(),
          });
          dashboardData.caseId = newCase._id as string;
        }
        dashboardData.stage = NumericStage.PENDING_FOR_ALLOCATION;
        dashboardData.dateOfFallingIntoAllocationBucket = new Date();
        dashboardData.teamLead = dashboardData.teamLead || null;
        dashboardData.actionsTaken = dashboardData?.actionsTaken
          ? [
              ...dashboardData?.actionsTaken,
              {
                actionName: EventNames.MOVE_TO_ALLOCATION_BUCKET,
                userId: user?._id,
              },
            ]
          : [
              {
                actionName: EventNames.MOVE_TO_ALLOCATION_BUCKET,
                userId: user?._id,
              },
            ];

        await captureCaseEvent({
          eventName: EventNames.MOVE_TO_ALLOCATION_BUCKET,
          eventRemarks: `${response?.message}`,
          intimationDate:
            dashboardData?.intimationDate ||
            dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
          stage: NumericStage.PENDING_FOR_ALLOCATION,
          claimId: dashboardData?.claimId,
          userName: user?.name,
        });

        await dashboardData?.save();

        return NextResponse.json(
          {
            ...responseObj,
            message: `Case automatically moved to allocation bucket because ${response?.message}`,
          },
          { status: statusCode }
        );
      }
    }

    const isReInvestigated = dashboardData?.claimInvestigators?.length > 0;

    if (dashboardData?.caseId) {
      await ClaimCase.findByIdAndUpdate(
        dashboardData?.caseId,
        {
          ...body,
          documents: new Map(body?.documents || []),
          investigator: investigators?.map((inv: Investigator) => inv?._id),
          intimationDate: dashboardData?.intimationDate,
          assignedBy: user?._id,
          outSourcingDate: new Date(),
        },
        { useFindAndModify: false }
      );
    } else {
      const newCase = await ClaimCase.create({
        ...body,
        documents: new Map(body?.documents || []),
        investigator: investigators?.map((inv: Investigator) => inv?._id),
        intimationDate: dashboardData?.intimationDate,
        assignedBy: user?._id,
        outSourcingDate: new Date(),
      });
      dashboardData.caseId = newCase?._id;
    }
    dashboardData.isReInvestigated = isReInvestigated;
    dashboardData.investigationCount += 1;
    dashboardData.allocationType = allocationType;
    dashboardData.dateOfOS = new Date();
    dashboardData.stage =
      isReInvestigated &&
      compareArrOfObjBasedOnProp(
        dashboardData?.claimInvestigators || [],
        investigators || [],
        "name",
        "investigatorName"
      )
        ? NumericStage.IN_FIELD_REWORK
        : NumericStage.IN_FIELD_FRESH;
    dashboardData.teamLead = dashboardData.teamLead || null;
    dashboardData.claimInvestigators = investigators?.map(
      (inv: Investigator, ind: number) => ({
        _id: inv?._id,
        name: inv.investigatorName,
        assignedFor:
          allocationType === "Dual" ? (ind === 0 ? "Hospital" : "Insured") : "",
        assignedData: new Date(),
      })
    );
    dashboardData.actionsTaken = dashboardData?.actionsTaken
      ? [
          ...dashboardData?.actionsTaken,
          {
            actionName: isManual
              ? EventNames.MANUAL_ALLOCATION
              : EventNames.AUTO_ALLOCATION,
            userId: user?._id,
          },
        ]
      : [
          {
            actionName: isManual
              ? EventNames.MANUAL_ALLOCATION
              : EventNames.AUTO_ALLOCATION,
            userId: user?._id,
          },
        ];

    await captureCaseEvent({
      eventName: isManual
        ? EventNames.MANUAL_ALLOCATION
        : EventNames.AUTO_ALLOCATION,
      eventRemarks:
        allocationType === "Single"
          ? `Assigned to ${investigators[0]?.investigatorName}`
          : `Assigned to ${investigators
              ?.map((el: Investigator) => el.investigatorName)
              ?.join(", ")}`,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      stage:
        isReInvestigated &&
        compareArrOfObjBasedOnProp(
          dashboardData?.claimInvestigators || [],
          investigators || [],
          "name",
          "investigatorName"
        )
          ? NumericStage.IN_FIELD_REWORK
          : NumericStage.IN_FIELD_FRESH,
      claimId: dashboardData?.claimId,
      userId: isManual ? user?._id : undefined,
      userName: isManual ? user?.name : "FNI System",
      investigatorIds: investigators?.map((el: Investigator) => el?._id),
    });

    // Update investigators daily and/or monthly assign
    for (let i = 0; i < investigators?.length; i++) {
      const inv = investigators[i];
      inv?.email?.length > 0 &&
        inv?.email?.map(async (mail: string) => {
          const cc_recipients: string[] = [];
          if (dashboardData?.teamLead) {
            const tl = await User.findById(dashboardData?.teamLead);
            if (tl) cc_recipients?.push(tl?.email);
          }
          if (dashboardData?.clusterManager) {
            const cm = await User.findById(dashboardData?.clusterManager);
            if (cm) cc_recipients?.push(cm?.email);
          }
          await sendEmail({
            from: FromEmails.DO_NOT_REPLY,
            recipients: mail,
            cc_recipients,
            subject: `New Case assigned (${dashboardData?.claimId})`,
            bodyText: `Dear ${inv?.investigatorName} \nA new case has been assigned to you with the id ${dashboardData?.claimId}\n\n\nWish you best of luck\nNabhigator`,
          });
        });
      await updateInvestigators(inv);
    }

    const maximusRes = await tellMaximusCaseIsAssigned(
      dashboardData?.toJSON(),
      investigators[0],
      body?.preQcObservation,
      user?.email
    );

    if (!maximusRes?.success) throw new Error(maximusRes.message);

    responseObj.message = `Case assigned to ${
      allocationType === "Dual"
        ? investigators[0].investigatorName +
          " and " +
          investigators[1].investigatorName
        : investigators[0].investigatorName
    }`;
    responseObj.data = investigators;
    await dashboardData.save();

    return NextResponse.json(responseObj, { status: statusCode });
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
