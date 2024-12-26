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
  try {
    let newCase: HydratedDocument<CaseDetail> | null = null;
    if (body?.allocationType === "Single") {
      body.singleTasksAndDocs.docs = body?.singleTasksAndDocs?.docs
        ? new Map(body?.singleTasksAndDocs?.docs)
        : [];
    } else {
      body.insuredTasksAndDocs.docs = body?.insuredTasksAndDocs?.docs
        ? new Map(body?.insuredTasksAndDocs?.docs)
        : [];
      body.hospitalTasksAndDocs.docs = body?.hospitalTasksAndDocs?.docs
        ? new Map(body?.hospitalTasksAndDocs?.docs)
        : [];
    }

    if (dashboardData?.caseId) {
      await ClaimCase.findByIdAndUpdate(
        dashboardData?.caseId,
        {
          ...body,
          intimationDate: dashboardData?.intimationDate,
          assignedBy: user?._id,
          outSourcingDate: new Date(),
        },
        { useFindAndModify: false }
      );
    } else {
      newCase = await ClaimCase.create({
        ...body,
        intimationDate: dashboardData?.intimationDate,
        assignedBy: user?._id,
        outSourcingDate: new Date(),
      });
      dashboardData.caseId = newCase?._id! as string;
    }

    dashboardData.stage = NumericStage.PENDING_FOR_ALLOCATION;
    dashboardData.dateOfFallingIntoAllocationBucket = new Date();
    dashboardData.teamLead = dashboardData.teamLead || null;

    if (newCase) await newCase.save();
    await dashboardData?.save();

    dayjs.extend(utc);
    dayjs.extend(timezone);
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

    return { success: true, message: "Success" };
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

export const defineInvestigator = async (
  args: IDefineInvestigator
): Promise<IDefineInvestigatorReturnType> => {
  const { body, user, dashboardData, excludedIds } = args;
  const {
    allocationType,
    singleTasksAndDocs,
    insuredTasksAndDocs,
    hospitalTasksAndDocs,
  } = body;

  const payload: IDefineInvestigatorReturnType = {
    success: true,
    shouldSendRes: false,
    message: "",
    investigators: null,
    excludedInvestigators: excludedIds,
  };

  try {
    if (allocationType === "Single") {
      if (!singleTasksAndDocs?.tasks || !singleTasksAndDocs?.tasks?.length) {
        payload.success = false;
        payload.message = "Please select some tasks";
        return payload;
      } else {
        const { investigator } = singleTasksAndDocs;
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
      if (
        !hospitalTasksAndDocs?.tasks ||
        !hospitalTasksAndDocs?.tasks?.length ||
        !insuredTasksAndDocs?.tasks ||
        !insuredTasksAndDocs?.tasks?.length
      ) {
        payload.success = false;
        payload.message =
          "Please select some tasks for for hospital or insured";
        return payload;
      } else {
        if (
          !hospitalTasksAndDocs?.investigator ||
          !insuredTasksAndDocs?.investigator
        ) {
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
          const invIds = [
            insuredTasksAndDocs?.investigator,
            hospitalTasksAndDocs?.investigator,
          ];
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
  } catch (error: any) {
    payload.success = false;
    payload.message = error?.message;
    return payload;
  }
};

export const removeDuplicatesFromArrayOfObjects = (
  array: any[],
  key: string
) => {
  return array.reduce((acc, obj) => {
    if (!acc.some((el: any) => el[key] === obj[key])) acc.push(obj);
    return acc;
  }, []);
};

export const removeDuplicatesFrom2DArray = (data: any[]) => {
  const uniqueNames = new Map<string, any>();

  const filteredData = data.filter((item) => {
    const name = item[0];
    if (uniqueNames.has(name)) {
      return false;
    } else {
      uniqueNames.set(name, true);
      return true;
    }
  });

  return filteredData;
};
