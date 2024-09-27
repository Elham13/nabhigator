import { captureCaseEvent } from "@/app/api/Claims/caseEvent/helpers";
import ClaimCase from "../Models/claimCase";
import {
  CaseDetail,
  EventNames,
  NumericStage,
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
    let newCase: HydratedDocument<CaseDetail> | null = null;
    const tasksAndDocs = body?.tasksAndDocs?.map((el: any) => ({
      ...el,
      docs: new Map(el?.docs || []),
    }));

    if (dashboardData?.caseId) {
      await ClaimCase.findByIdAndUpdate(
        dashboardData?.caseId,
        {
          ...body,
          tasksAndDocs,
          intimationDate: dashboardData?.intimationDate,
          assignedBy: user?._id,
          outSourcingDate: new Date(),
        },
        { useFindAndModify: false }
      );
    } else {
      newCase = await ClaimCase.create({
        ...body,
        tasksAndDocs,
        intimationDate: dashboardData?.intimationDate,
        assignedBy: user?._id,
        outSourcingDate: new Date(),
      });
      dashboardData.caseId = newCase?._id! as string;
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

    if (newCase) await newCase.save();
    await dashboardData?.save();

    return { success: true, message: "Success" };
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

export const defineInvestigator = async (
  args: IDefineInvestigator
): Promise<IDefineInvestigatorReturnType> => {
  const { body, user, dashboardData, excludedIds } = args;
  const { tasksAndDocs, allocationType } = body;

  const payload: IDefineInvestigatorReturnType = {
    success: true,
    shouldSendRes: false,
    message: "",
    investigators: null,
    excludedInvestigators: excludedIds,
  };

  try {
    if (true) {
      if (allocationType === "Single") {
        if (!tasksAndDocs || tasksAndDocs?.length !== 1) {
          payload.success = false;
          payload.message =
            "Something went wrong in Tasks and Documents selection";
          return payload;
        } else {
          const { investigator } = tasksAndDocs[0];
          if (!investigator) {
            if (dashboardData.stage !== NumericStage.PENDING_FOR_ALLOCATION) {
              const response = await findInvestigators({
                allocation: { allocationType },
                dashboardData,
              });

              if (response?.success) {
                payload.investigators = response.investigators;
                return payload;
              }

              const { success, message } = await sendCaseToAllocationBucket({
                dashboardData,
                user,
                body,
                eventRemarks: response?.message,
              });

              if (!success) {
                payload.message = message;
                payload.success = false;
                return payload;
              }

              payload.message = `Case automatically moved to allocation bucket because ${response?.message}`;
              payload.shouldSendRes = true;
              return payload;
            } else {
              const response = await findInvestigators({
                allocation: { allocationType },
                dashboardData,
              });
              if (response?.success) {
                payload.investigators = response.investigators[0];
                return payload;
              } else {
                payload.message = response.message;
                payload.success = false;
                return payload;
              }
            }
          } else {
            payload.investigators = await ClaimInvestigator.findById(
              investigator
            );
            return payload;
          }
        }
      } else if (allocationType === "Dual") {
        if (!tasksAndDocs || tasksAndDocs?.length !== 2) {
          payload.success = false;
          payload.message =
            "Something went wrong in Tasks and Documents selection of Dual allocation";
          return payload;
        } else {
          if (tasksAndDocs?.some((el: any) => !el?.investigator)) {
            if (dashboardData?.stage !== NumericStage.PENDING_FOR_ALLOCATION) {
              const response = await findInvestigators({
                allocation: { allocationType },
                dashboardData,
              });

              if (response?.success || response?.investigators?.length === 2) {
                payload.investigators = response.investigators;
                return payload;
              }

              const { success, message } = await sendCaseToAllocationBucket({
                dashboardData,
                user,
                body,
                eventRemarks:
                  "Case moved to allocation bucket because no matching investigator found to assign",
              });

              if (!success) {
                payload.message = message;
                payload.success = false;
                return payload;
              }

              payload.message = "Case moved to allocation bucket";
              payload.shouldSendRes = true;
              return payload;
            } else {
              const response = await findInvestigators({
                allocation: { allocationType },
                dashboardData,
              });
              if (response?.success && response?.investigators?.length === 2) {
                payload.investigators = response.investigators;
                return payload;
              } else {
                payload.message = response.message;
                payload.success = false;
                return payload;
              }
            }
          } else {
            const invIds = tasksAndDocs?.map((el: any) => el?.investigator);
            payload.investigators = await ClaimInvestigator.find({
              _id: invIds?.map((id: string) => new Types.ObjectId(id)),
            });
            if (payload?.investigators?.length !== 2) {
              payload.success = false;
              payload.message = `Failed to find investigators with the ids ${invIds?.join(
                ", "
              )}`;
            }
            return payload;
          }
        }
      } else {
        payload.success = false;
        payload.message = "Wrong value for allocation type";
        return payload;
      }
    }
  } catch (error: any) {
    payload.success = false;
    payload.message = error?.message;
    return payload;
  }
};
