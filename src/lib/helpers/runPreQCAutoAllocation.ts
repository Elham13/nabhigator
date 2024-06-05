import { HydratedDocument } from "mongoose";
import { Document } from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  CaseDetail,
  EventNames,
  IDashboardData,
  Investigator,
  NumericStage,
} from "../utils/types/fniDataTypes";
import {
  claimCasePayload,
  findInvestigators,
  getAllocationType,
  updateInvestigators,
} from "./autoPreQCHelpers";
import ClaimCase from "../Models/claimCase";
import { captureCaseEvent } from "@/app/api/Claims/caseEvent/helpers";
import sendEmail from "./sendEmail";
import { FromEmails } from "../utils/types/enums";

dayjs.extend(utc);
dayjs.extend(timezone);

export const runPreQCAutoAllocation = async (
  data: Document & IDashboardData
) => {
  try {
    const allocation = getAllocationType(data);

    claimCasePayload["dashboardDataId"] = data?._id as string;
    claimCasePayload["allocationType"] = allocation.allocationType;
    claimCasePayload["caseStatus"] = "Accepted";
    claimCasePayload["insuredAddress"] = data?.insuredDetails?.address;
    claimCasePayload["insuredCity"] = data?.insuredDetails?.city;
    claimCasePayload["insuredState"] = data?.insuredDetails?.state;

    let investigators: Investigator[] = [];
    const investigatorsResponse = await findInvestigators({
      allocation,
      dashboardData: data,
    });

    if (investigatorsResponse?.success)
      investigators = investigatorsResponse?.investigators;
    else {
      const newCase: HydratedDocument<CaseDetail> = await ClaimCase.create({
        ...claimCasePayload,
        intimationDate: data?.intimationDate,
      });

      data.stage = NumericStage.PENDING_FOR_ALLOCATION;
      data.caseId = newCase?._id as string;
      data.teamLead = data.teamLead || null;
      data.dateOfFallingIntoAllocationBucket = new Date();

      await captureCaseEvent({
        eventName: EventNames.MOVE_TO_ALLOCATION_BUCKET,
        eventRemarks: `${investigatorsResponse?.message}`,
        intimationDate:
          data?.intimationDate ||
          dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
        stage: NumericStage.PENDING_FOR_ALLOCATION,
        claimId: data?.claimId,
        userName: "FNI System",
      });

      await data.save();
      return;
    }

    const newCase = await ClaimCase.create({
      ...claimCasePayload,
      investigator: investigators?.map((inv) => inv?._id),
      intimationDate: data?.intimationDate,
    });

    data.caseId = newCase?._id;
    data.teamLead = data?.teamLead || null;
    data.allocationType = allocation?.allocationType;
    data.dateOfOS = new Date();
    data.stage = NumericStage.IN_FIELD_FRESH;
    data.claimInvestigators = investigators?.map((inv, ind) => ({
      _id: inv?._id,
      name: inv.investigatorName,
      assignedData: new Date(),
      assignedFor:
        allocation?.allocationType === "Dual"
          ? ind === 0
            ? "Hospital"
            : "Insured"
          : "",
    }));

    await captureCaseEvent({
      eventName: EventNames.AUTO_ALLOCATION,
      eventRemarks:
        allocation.allocationType === "Single"
          ? `Assigned to ${investigators[0]?.investigatorName}`
          : `Assigned to ${investigators
              ?.map((el) => el.investigatorName)
              ?.join(", ")}`,
      intimationDate:
        data?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      stage: NumericStage.IN_FIELD_FRESH,
      claimId: data?.claimId,
      userName: "FNI System",
      investigatorIds: investigators?.map((el) => el?._id),
    });

    // Update investigators daily and/or monthly assign
    for (let i = 0; i < investigators?.length; i++) {
      const inv = investigators[i];

      inv?.email?.length > 0 &&
        inv?.email?.map(async (mail) => {
          await sendEmail({
            from: FromEmails.DO_NOT_REPLY,
            recipients: mail,
            subject: `New Case assigned (${data?.claimId})`,
            bodyText: `Dear ${inv?.investigatorName} \nA new case has been assigned to you with the id ${data?.claimId}\n\n\nWish you best of luck\nNabhigator`,
          });
        });
      await updateInvestigators(inv);
    }
    await data.save();
  } catch (error: any) {
    throw new Error(error);
  }
};
