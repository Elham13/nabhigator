import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  EventNames,
  IDashboardData,
  IUser,
  Investigator,
  InvestigatorUpdate,
  NumericStage,
  Role,
  UserExpedition,
  UserUpdates,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, Types } from "mongoose";
import DashboardData from "@/lib/Models/dashboardData";
import { captureCaseEvent } from "../caseEvent/helpers";
import dayjs from "dayjs";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import User from "@/lib/Models/user";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const {
    claimId,
    currentStage,
    investigatorId,
    subject,
    role,
    message,
    action,
  } = await req?.json();

  try {
    let resMsg = "";
    if (!currentStage) throw new Error("currentStage is required");
    if (!claimId) throw new Error("claimId is required");

    let userRole: Role | null = null;
    await connectDB(Databases.FNI);

    switch (currentStage) {
      case NumericStage.PENDING_FOR_PRE_QC: {
        userRole = Role.PRE_QC;
        break;
      }
      case NumericStage.PENDING_FOR_ALLOCATION:
      case NumericStage.PENDING_FOR_RE_ALLOCATION:
      case NumericStage.IN_FIELD_REWORK: {
        userRole = Role.ALLOCATION;
        break;
      }
      case NumericStage.POST_QC: {
        userRole = Role.POST_QA;
        break;
      }
      case NumericStage.INVESTIGATION_ACCEPTED:
      case NumericStage.INVESTIGATION_ACCEPTED:
      case NumericStage.IN_FIELD_FRESH:
      case NumericStage.IN_FIELD_REINVESTIGATION: {
        userRole = Role.INTERNAL_INVESTIGATOR;
        break;
      }
    }

    if (!userRole)
      throw new Error("No user found to send the expedition message");

    const newExpedition: UserExpedition = {
      claimId,
      noted: false,
      message,
      subject,
      role,
    };

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findOne({ claimId });

    if (!dashboardData)
      throw new Error(`No Data found with claimId ${claimId}`);

    if (action === "noted") {
      if (dashboardData?.expedition && dashboardData?.expedition?.length > 0) {
        dashboardData.expedition = dashboardData?.expedition?.map((el) =>
          el?.claimId === claimId ? { ...el, noted: true } : el
        );
      }
    } else {
      if (dashboardData?.expedition && dashboardData?.expedition?.length > 0) {
        dashboardData.expedition = [
          ...dashboardData?.expedition,
          newExpedition,
        ];
      } else {
        dashboardData.expedition = [newExpedition];
      }
      await dashboardData.save();

      captureCaseEvent({
        eventName: EventNames.EXPEDITION_MESSAGE_SENT,
        intimationDate:
          dashboardData?.intimationDate ||
          dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
        stage: currentStage,
        userName: subject,
        claimId,
        eventRemarks: `The following Expedition message sent: ${message}`,
      });
    }

    if (userRole === Role.INTERNAL_INVESTIGATOR) {
      if (
        !investigatorId ||
        !Array.isArray(investigatorId) ||
        investigatorId?.length < 1
      )
        throw new Error("investigatorId is required");

      const investigators: Investigator[] = await ClaimInvestigator.find({
        _id: {
          $in: investigatorId?.map((el: string) => new Types.ObjectId(el)),
        },
      }).lean();

      if (!investigators || investigators?.length < 1)
        throw new Error(
          `No investigators found with the id ${investigatorId?.join(", ")}`
        );

      if (action === "noted") {
        for (const inv of investigators) {
          const newUpdates: InvestigatorUpdate = inv?.updates;
          if (newUpdates?.expedition && newUpdates?.expedition?.length > 0) {
            newUpdates.expedition = newUpdates.expedition?.map((el) =>
              el?.claimId === claimId ? { ...el, noted: true } : el
            );

            await ClaimInvestigator.findByIdAndUpdate(
              inv?._id,
              {
                $set: { updates: newUpdates },
              },
              { useFindAndModify: false }
            );
          }
        }
        resMsg = "Thank you for the attention";
      } else {
        for (const inv of investigators) {
          const newUpdates: InvestigatorUpdate = { ...inv?.updates };

          if (newUpdates?.expedition && newUpdates?.expedition?.length > 0) {
            newUpdates.expedition.push(newExpedition);
          } else {
            newUpdates.expedition = [newExpedition];
          }

          await ClaimInvestigator.findByIdAndUpdate(
            inv?._id,
            {
              $set: {
                updates: newUpdates,
              },
            },
            { useFindAndModify: false }
          );
          resMsg = "Expedition message sent successfully";
        }
      }
    } else {
      const users: IUser[] = await User.find({ role: userRole }).lean();

      if (!users || users?.length === 0) throw new Error(`No user found`);

      if (action === "noted") {
        for (const user of users) {
          const newUpdates: UserUpdates = user?.updates;
          if (newUpdates?.expedition && newUpdates?.expedition?.length > 0) {
            newUpdates.expedition = newUpdates.expedition?.map((el) =>
              el?.claimId === claimId ? { ...el, noted: true } : el
            );

            await User.findByIdAndUpdate(
              user?._id,
              {
                $set: { updates: newUpdates },
              },
              { useFindAndModify: false }
            );
          }
        }
        resMsg = "Thank you for the attention";
      } else {
        for (const user of users) {
          const newUpdates: UserUpdates = { ...user?.updates };

          if (newUpdates?.expedition && newUpdates?.expedition?.length > 0) {
            newUpdates.expedition.push(newExpedition);
          } else {
            newUpdates.expedition = [newExpedition];
          }

          await User.findByIdAndUpdate(
            user?._id,
            {
              $set: {
                updates: newUpdates,
              },
            },
            { useFindAndModify: false }
          );
        }
        resMsg = "Expedition message sent successfully";
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: resMsg,
        data: {},
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
