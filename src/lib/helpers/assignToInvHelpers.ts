import { captureCaseEvent } from "@/app/api/Claims/caseEvent/helpers";
import ClaimCase from "../Models/claimCase";
import {
  CaseDetail,
  EventNames,
  NumericStage,
  Role,
} from "../utils/types/fniDataTypes";
import { HydratedDocument, Types } from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { findInvestigators } from "./autoPreQCHelpers";
import ClaimInvestigator from "../Models/claimInvestigator";
import {
  IDefineInvestigator,
  IDefineInvestigatorReturnType,
  ISendCaseToAllocation,
} from "../utils/types/apiTypes";

export const sendCaseToAllocationBucket = async ({
  dashboardData,
  body,
  user,
  eventRemarks,
}: ISendCaseToAllocation) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  try {
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
      eventRemarks,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      stage: NumericStage.PENDING_FOR_ALLOCATION,
      claimId: dashboardData?.claimId,
      userName: user?.name,
    });

    await dashboardData?.save();

    return { success: true, message: "Success" };
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

export const defineInvestigator = async (
  args: IDefineInvestigator
): Promise<IDefineInvestigatorReturnType> => {
  const { isManual, body, user, dashboardData, excludedIds } = args;
  const { investigator, allocationType } = body;

  const payload: IDefineInvestigatorReturnType = {
    success: true,
    shouldSendRes: false,
    message: "",
    investigators: [],
    excludedInvestigators: excludedIds,
  };

  try {
    if (isManual) {
      if (!investigator?.length) {
        if (user?.activeRole !== Role.ALLOCATION) {
          dashboardData.stage = NumericStage.PENDING_FOR_ALLOCATION;
          dashboardData.dateOfFallingIntoAllocationBucket = new Date();
          await dashboardData?.save();

          payload.message = "Case moved to allocation bucket";
          payload.shouldSendRes = true;
          return payload;
        } else {
          const response = await findInvestigators({
            allocation: { allocationType },
            dashboardData,
          });
          if (response?.success) {
            payload.investigators = response.investigators;
            return payload;
          } else {
            payload.message = response.message;
            payload.success = false;
            return payload;
          }
        }
      } else {
        payload.investigators = await ClaimInvestigator.find({
          _id: {
            $in: investigator?.map((id: string) => new Types.ObjectId(id)),
          },
        });
        return payload;
      }
    } else {
      // Auto assign
      const response = await findInvestigators({
        allocation: { allocationType },
        dashboardData,
      });
      if (response?.success) {
        payload.investigators = response.investigators;
        return payload;
      } else {
        const sendToRes = await sendCaseToAllocationBucket({
          dashboardData,
          user,
          body,
          eventRemarks: response?.message,
        });

        if (!sendToRes?.success) {
          payload.success = false;
          payload.message = sendToRes?.message;
          return payload;
        }

        payload.success = true;
        payload.message = `Case automatically moved to allocation bucket because ${response?.message}`;
        payload.shouldSendRes = true;
        return payload;
      }
    }
  } catch (error: any) {
    payload.success = false;
    payload.message = error?.message;
    return payload;
  }
};
