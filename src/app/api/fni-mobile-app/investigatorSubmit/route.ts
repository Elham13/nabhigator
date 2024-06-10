import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  CaseDetail,
  EventNames,
  IDashboardData,
  IUser,
  IZoneStateMaster,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, PipelineStage } from "mongoose";
import DashboardData from "@/lib/Models/dashboardData";
import ClaimCase from "@/lib/Models/claimCase";
import { captureCaseEvent } from "../../Claims/caseEvent/helpers";
import User from "@/lib/Models/user";
import ZoneStateMaster from "@/lib/Models/zoneStateMaster";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

interface IProps {
  claimType: "PreAuth" | "Reimbursement";
  providerState: string;
}

const findPostQaUser = async (props: IProps) => {
  const { claimType, providerState } = props;

  const addField: PipelineStage.AddFields["$addFields"] = {
    fromTimeHour: {
      $dateToString: {
        format: "%H:%M:%S",
        date: "$config.reportReceivedTime.from",
      },
    },
    toTimeHour: {
      $dateToString: {
        format: "%H:%M:%S",
        date: "$config.reportReceivedTime.to",
      },
    },
  };

  const targetTime = dayjs().format("hh:mm:ss");

  const match: PipelineStage.Match["$match"] = {
    "config.leadView": claimType,
    "config.reportReceivedTime": { $exists: true },
    $expr: {
      $and: [
        { $lt: ["$fromTimeHour", targetTime] },
        { $gt: ["$toTimeHour", targetTime] },
      ],
    },
  };

  const zoneState: HydratedDocument<IZoneStateMaster> | null =
    await ZoneStateMaster.findOne({
      State: { $regex: new RegExp(providerState, "i") },
    });

  if (zoneState) {
    match["zone"] = zoneState?.Zone;
  }

  const pipeline: PipelineStage[] = [
    {
      $match: {
        $expr: {
          $lt: ["$config.dailyAssign", "$config.dailyThreshold"],
        },
      },
    },
    { $addFields: addField },
    { $match: match },
  ];

  const users: IUser[] = await User.aggregate(pipeline);

  if (users && users?.length > 0) return users[0];
  return null;
};

router.post(async (req) => {
  const { id, userId, userName } = await req?.json();

  try {
    if (!id) throw new Error("id is required!");
    await connectDB(Databases.FNI);

    const stage = NumericStage.POST_QC;

    let eventRemarks: string = EventNames.INVESTIGATION_REPORT_SUBMITTED;

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findById(id);

    if (!dashboardData) throw new Error(`No record found with the id ${id}`);

    const caseDetail: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(dashboardData?.caseId);

    if (!caseDetail)
      throw new Error(
        `No Claim Case found with the id ${dashboardData?.caseId}`
      );

    dashboardData.dateOfFallingIntoPostQaBucket = new Date();

    dashboardData.expedition =
      dashboardData?.expedition && dashboardData?.expedition?.length > 0
        ? dashboardData?.expedition?.map((el) => ({ ...el, noted: true }))
        : dashboardData?.expedition;

    caseDetail.invReportReceivedDate = new Date();

    const user: IUser | null = await findPostQaUser({
      claimType: dashboardData?.claimType,
      providerState: dashboardData?.hospitalDetails?.providerState,
    });

    if (user) {
      dashboardData.postQa = user?._id;
      eventRemarks = eventRemarks += `, and assigned to post qa ${user?.name}`;
      await User.findByIdAndUpdate(
        user?._id,
        {
          $push: { assignedCases: dashboardData?._id },
        },
        { useFindAndModify: false }
      );
    } else {
      eventRemarks =
        eventRemarks += `, and moved to Post QA Lead bucket because no Post Qa matched`;
    }

    dashboardData.stage = stage;
    dashboardData.actionsTaken = dashboardData?.actionsTaken
      ? [
          ...dashboardData?.actionsTaken,
          {
            actionName: eventRemarks,
            userId,
          },
        ]
      : [
          {
            actionName: eventRemarks,
            userId,
          },
        ];

    await captureCaseEvent({
      claimId: dashboardData?.claimId,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      eventName: EventNames.INVESTIGATION_REPORT_SUBMITTED,
      stage: stage,
      userId: userId as string,
      eventRemarks,
      userName,
    });

    await caseDetail.save();
    const data = await dashboardData.save();

    return NextResponse.json(
      {
        success: true,
        message: "Completed successfully",
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
