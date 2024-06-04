import CaseEvent from "@/lib/Models/caseEvent";
import User from "@/lib/Models/user";
import { ICaseEvent, NumericStage } from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument } from "mongoose";

type CaptureCaseEventPayload = {
  claimId?: number;
  intimationDate: string;
  eventName: string;
  userName?: string;
  stage: NumericStage;
  qaBy?: string;
  userId?: string;
  eventRemarks?: string;
  investigatorIds?: string[];
};

export const captureCaseEvent = async (payload: CaptureCaseEventPayload) => {
  if (payload?.claimId) {
    let user: any = null;
    if (payload?.userId && !payload?.userName) {
      user = await User.findById(payload.userId);
    }

    // Get the last document in the collection
    const caseEvent: HydratedDocument<ICaseEvent> | null =
      await CaseEvent.findOne({ claimId: payload.claimId }).sort({ _id: -1 });

    if (caseEvent) {
      const tempEvent = {
        ...caseEvent.toJSON(),
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        __v: undefined,
      };

      await CaseEvent.create({
        ...tempEvent,
        eventName: payload.eventName,
        eventDate: new Date(),
        userName: payload?.userName || user?.name || "",
        status: payload.stage,
        qaBy: payload?.qaBy || "",
        eventRemarks: payload?.eventRemarks || "NA",
        intimationDate: payload?.intimationDate,
        investigator:
          payload?.investigatorIds && payload?.investigatorIds?.length > 0
            ? payload.investigatorIds
            : null,
      });
    } else {
      await CaseEvent.create({
        claimId: payload?.claimId,
        eventName: payload.eventName,
        eventDate: new Date(),
        userName: payload?.userName || user?.name || "",
        status: payload.stage,
        qaBy: payload?.qaBy || "",
        eventRemarks: payload?.eventRemarks || "NA",
        intimationDate: payload?.intimationDate,
        investigator:
          payload?.investigatorIds && payload?.investigatorIds?.length > 0
            ? payload.investigatorIds
            : null,
      });
    }
  }
};

