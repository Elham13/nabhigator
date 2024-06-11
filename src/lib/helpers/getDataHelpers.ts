import dayjs from "dayjs";
import {
  AdmissionType,
  EColorCode,
  IDashboardData,
  IUser,
  IZoneStateMaster,
  NumericStage,
  Role,
  TDashboardOrigin,
} from "../utils/types/fniDataTypes";
import ZoneStateMaster from "../Models/zoneStateMaster";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { encryptPlainText } from "./authHelpers";
import { Types } from "mongoose";

dayjs.extend(customParseFormat);

export const getClaimAmountFilter = (user: IUser) => {
  if (user?.activeRole === Role.VIEWER) return { $gte: 0 };
  switch (user?.claimAmountThreshold) {
    case "1 Lac to 5 Lacs":
      return {
        $gte: 100000,
        $lt: 500000,
      };
    case "5 Lacs to 10 Lacs":
      return {
        $gte: 500000,
        $lt: 1000000,
      };
    case "10 Lacs to 20 Lacs":
      return {
        $gte: 1000000,
        $lt: 2000000,
      };
    case "20 Lacs to 50 Lacs":
      return {
        $gte: 2000000,
        $lt: 5000000,
      };
    case "Above 50 Lacs":
      return {
        $gte: 5000000,
      };
    case "Bellow 1 Lac":
      return {
        $lt: 100000,
      };
    case "Any Amount":
      return { $gte: 0 };
    default:
      return { $gte: 0 };
  }
};

export const processGetDataFilters = async (obj: any) => {
  if (typeof obj === "undefined" || Object.keys(obj)?.length < 1) {
    return {};
  }

  const processedObj = { ...obj };
  const user: IUser | undefined = processedObj["user"];

  if (!user) throw new Error("user is required");

  Object.keys(processedObj).forEach((key) => {
    if (!processedObj[key] && processedObj[key] !== 0) {
      delete processedObj[key];
    }
  });

  if (
    processedObj["claimSubType"] &&
    processedObj["claimSubType"]?.length > 0
  ) {
    processedObj["$or"] = processedObj["claimSubType"]?.map((el: string) => ({
      claimSubType: {
        $regex: new RegExp(el, "i"),
      },
    }));
    delete processedObj["claimSubType"];
  }

  if (processedObj["dateOfOS"]) {
    const actualDate = dayjs(processedObj["dateOfOS"]).toDate();
    const plusOneDay = dayjs(processedObj["dateOfOS"]).add(1, "day").toDate();

    processedObj["dateOfOS"] = {
      $gte: actualDate,
      $lte: plusOneDay,
    };
  }

  if (processedObj["dateOfClosure"]) {
    const actualDate = dayjs(processedObj["dateOfClosure"]).toDate();
    const plusOneDay = dayjs(processedObj["dateOfClosure"])
      .add(1, "day")
      .toDate();
    processedObj["dateOfClosure"] = {
      $gte: actualDate,
      $lt: plusOneDay,
    };
  }

  if (
    processedObj["intimationDateRange"] &&
    Array.isArray(processedObj["intimationDateRange"]) &&
    processedObj["intimationDateRange"]?.length > 1
  ) {
    const startDate = new Date(processedObj["intimationDateRange"][0]);
    const endDate = new Date(processedObj["intimationDateRange"][1]);
    processedObj["intimationDateAsDate"] = { $gte: startDate, $lte: endDate };
  }

  if (processedObj["intimationDate"]) {
    const date = processedObj["intimationDate"]?.split(" ")[0];
    processedObj["intimationDate"] = { $regex: new RegExp(date, "i") };
  }

  if (
    processedObj["claimInvestigators"] &&
    processedObj["claimInvestigators"]?.length > 0
  ) {
    processedObj["claimInvestigators._id"] = {
      $in: processedObj["claimInvestigators"].map(
        (inv: string) => new Types.ObjectId(inv)
      ),
    };
    delete processedObj["claimInvestigators"];
  }

  if (processedObj["claimDetails.claimAmount"]) {
    processedObj["claimDetails.claimAmount"] = JSON.parse(
      processedObj["claimDetails.claimAmount"]
    );
  }

  if (processedObj["colorCode"]) {
    const color: EColorCode = processedObj["colorCode"];

    const noOfSecondsFrom2HoursAgo = dayjs().diff(
      dayjs().subtract(2, "hours"),
      "second"
    );
    const noOfSecondsFrom4HoursAgo = dayjs().diff(
      dayjs().subtract(4, "hours"),
      "second"
    );
    const noOfSecondsFromOneDayAgo = dayjs().diff(
      dayjs().subtract(1, "day"),
      "second"
    );
    const noOfSecondsFrom2DaysAgo = dayjs().diff(
      dayjs().subtract(2, "day"),
      "second"
    );

    switch (color) {
      case EColorCode["PreAuth-Green"]: {
        processedObj["claimType"] = "PreAuth";
        processedObj["differenceInSeconds"] = {
          $lte: noOfSecondsFrom2HoursAgo,
        };
        break;
      }
      case EColorCode["PreAuth-Amber"]: {
        processedObj["claimType"] = "PreAuth";
        processedObj["differenceInSeconds"] = {
          $gte: noOfSecondsFrom2HoursAgo,
          $lte: noOfSecondsFrom4HoursAgo,
        };
        break;
      }
      case EColorCode["PreAuth-Red"]: {
        processedObj["claimType"] = "PreAuth";
        processedObj["differenceInSeconds"] = {
          $gte: noOfSecondsFrom4HoursAgo,
        };
        break;
      }
      case EColorCode["RM-Green"]: {
        processedObj["claimType"] = { $ne: "PreAuth" };
        processedObj["$nor"] = [
          {
            claimSubType: {
              $regex: new RegExp("Personal", "i"),
            },
          },
          {
            claimSubType: {
              $regex: new RegExp("Critical", "i"),
            },
          },
        ];
        processedObj["differenceInSeconds"] = {
          $lte: noOfSecondsFromOneDayAgo,
        };
        break;
      }
      case EColorCode["RM-Amber"]: {
        processedObj["claimType"] = { $ne: "PreAuth" };
        processedObj["$nor"] = [
          {
            claimSubType: {
              $regex: new RegExp("Personal", "i"),
            },
          },
          {
            claimSubType: {
              $regex: new RegExp("Critical", "i"),
            },
          },
        ];
        processedObj["differenceInSeconds"] = {
          $gte: noOfSecondsFromOneDayAgo,
          $lte: noOfSecondsFrom2DaysAgo,
        };
        break;
      }
      case EColorCode["RM-Red"]: {
        processedObj["claimType"] = { $ne: "PreAuth" };
        processedObj["$nor"] = [
          {
            claimSubType: {
              $regex: new RegExp("Personal", "i"),
            },
          },
          {
            claimSubType: {
              $regex: new RegExp("Critical", "i"),
            },
          },
        ];
        processedObj["differenceInSeconds"] = {
          $gte: noOfSecondsFrom2DaysAgo,
        };
        break;
      }
      case EColorCode["PAOrCI-Red"]: {
        processedObj["claimType"] = { $ne: "PreAuth" };
        processedObj["$or"] = [
          {
            claimSubType: {
              $regex: new RegExp("Personal", "i"),
            },
          },
          {
            claimSubType: {
              $regex: new RegExp("Critical", "i"),
            },
          },
        ];
        processedObj["differenceInSeconds"] = {
          $gte: noOfSecondsFrom2DaysAgo,
        };
        break;
      }
      case EColorCode["PAOrCI-Amber"]: {
        processedObj["claimType"] = { $ne: "PreAuth" };
        processedObj["$or"] = [
          {
            claimSubType: {
              $regex: new RegExp("Personal", "i"),
            },
          },
          {
            claimSubType: {
              $regex: new RegExp("Critical", "i"),
            },
          },
        ];
        processedObj["differenceInSeconds"] = {
          $gte: noOfSecondsFromOneDayAgo,
          $lte: noOfSecondsFrom2DaysAgo,
        };
        break;
      }
      case EColorCode["PAOrCI-Green"]: {
        processedObj["claimType"] = { $ne: "PreAuth" };
        processedObj["$or"] = [
          {
            claimSubType: {
              $regex: new RegExp("Personal", "i"),
            },
          },
          {
            claimSubType: {
              $regex: new RegExp("Critical", "i"),
            },
          },
        ];
        processedObj["differenceInSeconds"] = {
          $lte: noOfSecondsFromOneDayAgo,
        };
        break;
      }
      default:
        break;
    }
  }

  if (processedObj["investigatorRecommendation"]) {
    processedObj["investigatorRecommendation"] = {
      $regex: new RegExp(processedObj["investigatorRecommendation"], "i"),
    };
  }

  const teamLead = processedObj["teamLead"]
    ? new Types.ObjectId(processedObj["teamLead"])
    : undefined;
  const clusterManager =
    processedObj["clusterManager"]?.map(
      (id: string) => new Types.ObjectId(id)
    ) || [];

  if (teamLead) {
    processedObj["teamLead"] = teamLead;
  }

  if (clusterManager?.length > 0) {
    processedObj["clusterManager"] = {
      $in: clusterManager,
    };
  }

  if (processedObj["hospitalDetails.providerState"])
    processedObj["hospitalDetails.providerState"] = {
      $regex: new RegExp(processedObj["hospitalDetails.providerState"], "i"),
    };

  if (processedObj["hospitalDetails.providerCity"])
    processedObj["hospitalDetails.providerCity"] = {
      $regex: new RegExp(processedObj["hospitalDetails.providerCity"], "i"),
    };

  if (processedObj["insuredDetails.state"])
    processedObj["insuredDetails.state"] = {
      $regex: new RegExp(processedObj["insuredDetails.state"], "i"),
    };

  //------------ Default Filters Start -------------//

  const userRole = user?.activeRole
    ? user?.activeRole
    : processedObj["source"] === "Investigators"
    ? Role.INTERNAL_INVESTIGATOR
    : undefined;

  const origin = obj?.origin ? (obj?.origin as TDashboardOrigin) : null;

  if (!processedObj["stage"] && origin !== "Consolidated") {
    if (userRole === Role.PRE_QC) {
      processedObj["stage"] = NumericStage.PENDING_FOR_PRE_QC;
    } else if (userRole === Role.ALLOCATION) {
      processedObj["stage"] = {
        $in: [
          NumericStage.PENDING_FOR_ALLOCATION,
          NumericStage.PENDING_FOR_RE_ALLOCATION,
          NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING,
        ],
      };
    } else if (userRole === Role.POST_QA) {
      processedObj["stage"] = NumericStage.POST_QC;
      processedObj["postQa"] = new Types.ObjectId(user?._id);
    } else if (userRole === Role.POST_QA_LEAD) {
      processedObj["stage"] = NumericStage.POST_QC;
      processedObj["postQa"] = null;
    }
  }

  if (
    userRole &&
    ![Role.ADMIN, Role.VIEWER, Role.POST_QA_LEAD].includes(userRole)
  ) {
    const leadView: string[] | undefined = user?.config?.leadView;
    let geography: string[] = user?.state;

    if (userRole === Role.TL)
      processedObj["teamLead"] = new Types.ObjectId(user?._id);

    if (userRole === Role.CLUSTER_MANAGER)
      processedObj["clusterManager"] = new Types.ObjectId(user?._id);

    if (leadView && leadView?.length > 0) {
      processedObj["claimType"] = { $in: leadView };
    }

    if (geography?.length > 0 && !geography?.includes("All")) {
      processedObj["hospitalDetails.providerState"] = {
        $in: geography,
      };
    }

    processedObj["claimDetails.claimAmount"] = getClaimAmountFilter(user);
  }

  if (origin && origin !== "Inbox") {
    if (origin === "Outbox") {
      delete processedObj["stage"];
      processedObj["actionsTaken.userId"] = new Types.ObjectId(user?._id);
    } else if (origin === "Consolidated") {
      if (userRole && [Role.ALLOCATION, Role.POST_QA].includes(userRole)) {
        processedObj["actionsTaken.userId"] = new Types.ObjectId(user?._id);
      } else if (
        userRole &&
        [Role.TL, Role.CLUSTER_MANAGER].includes(userRole)
      ) {
        const states: IZoneStateMaster[] = await ZoneStateMaster.find({
          Zone: { $in: user.zone },
        });

        processedObj["hospitalDetails.providerState"] = {
          $in: states?.length > 0 ? states?.map((el) => el?.State) : [],
        };
      }
    }
  }

  //------------ Default Filters End -------------//

  delete processedObj["colorCode"];
  delete processedObj["pagination"];
  delete processedObj["sort"];
  delete processedObj["user"];
  delete processedObj["origin"];
  delete processedObj["filterApplied"];
  delete processedObj["source"];
  delete processedObj["intimationDateRange"];

  return processedObj;
};

export const addOpenAndClosureTAT = async (data: IDashboardData[]) => {
  const updatedData = data.map((obj) => ({
    ...obj,
    openTAT: [NumericStage.CLOSED, NumericStage.REJECTED].includes(obj.stage)
      ? obj.dateOfClosure
        ? dayjs(obj?.dateOfClosure).diff(obj?.intimationDate, "days")
        : 0
      : dayjs().diff(obj?.intimationDate, "days"),
    closureTAT:
      [NumericStage.CLOSED, NumericStage.REJECTED].includes(obj.stage) &&
      obj.dateOfClosure
        ? dayjs().diff(obj?.dateOfClosure, "days")
        : 0,
  }));
  return [...updatedData];
};

export const addColorCodes = async (data: IDashboardData[], role?: Role) => {
  let updatedData = [...data];

  updatedData = await addOpenAndClosureTAT(updatedData);

  const oneDayBeforeNow = dayjs.utc().subtract(1, "day").toDate();
  const twoDayBeforeNow = dayjs.utc().subtract(2, "day").toDate();
  const fiveDaysBeforeNow = dayjs.utc().subtract(5, "day").toDate();
  const sevenDaysBeforeNow = dayjs.utc().subtract(7, "day").toDate();
  const twoHoursBeforeNow = dayjs.utc().subtract(2, "hours").toDate();
  const fourHoursBeforeNow = dayjs.utc().subtract(4, "hours").toDate();
  const twentyFourHoursBeforeNow = dayjs.utc().subtract(24, "hours").toDate();
  const thirtySixHoursBeforeNow = dayjs.utc().subtract(36, "hours").toDate();

  const colors = { Amber: "#FFBF00", Green: "#008000", Red: "#ff0000" };

  updatedData = await Promise.all(
    updatedData?.map(async (el) => {
      let rowColor: string = "#000";
      if (el.claimType === "PreAuth") {
        if (
          role &&
          role === Role.INTERNAL_INVESTIGATOR &&
          el?.hospitalizationDetails?.admissionType
        ) {
          const admissionType = el?.hospitalizationDetails?.admissionType;
          const timeOfAllocation = el?.claimInvestigators?.[0]?.assignedData;
          if (
            [AdmissionType.ADMITTED, AdmissionType.PLANNED].includes(
              admissionType
            )
          ) {
            if (dayjs.utc(timeOfAllocation).isAfter(twentyFourHoursBeforeNow)) {
              rowColor = colors.Green;
            } else if (
              dayjs.utc(timeOfAllocation).isBefore(twentyFourHoursBeforeNow) &&
              dayjs.utc(timeOfAllocation).isAfter(thirtySixHoursBeforeNow)
            ) {
              rowColor = colors.Amber;
            } else if (
              dayjs.utc(timeOfAllocation).isBefore(thirtySixHoursBeforeNow)
            ) {
              rowColor = colors.Red;
            }
          } else {
            if (dayjs.utc(timeOfAllocation).isAfter(fiveDaysBeforeNow)) {
              rowColor = colors.Green;
            } else if (
              dayjs.utc(timeOfAllocation).isBefore(fiveDaysBeforeNow) &&
              dayjs.utc(timeOfAllocation).isAfter(sevenDaysBeforeNow)
            ) {
              rowColor = colors.Amber;
            } else if (
              dayjs.utc(timeOfAllocation).isBefore(sevenDaysBeforeNow)
            ) {
              rowColor = colors.Red;
            }
          }
        } else if (role && role === Role.ALLOCATION) {
          const eventDate = el?.dateOfFallingIntoAllocationBucket || "";
          if (eventDate) {
            const eventTime = dayjs(eventDate).format("hh:mm:ss");
            const currentTime = dayjs().format("hh:mm:ss");
            const thirtyMinsAgo = dayjs()
              .subtract(30, "minutes")
              .format("hh:mm:ss");
            const fortyFiveMinsAgo = dayjs()
              .subtract(45, "minutes")
              .format("hh:mm:ss");

            if (
              dayjs(eventTime, "hh:mm:ss").isBefore(currentTime) &&
              dayjs(eventTime, "hh:mm:ss").isAfter(thirtyMinsAgo)
            ) {
              rowColor = colors.Green;
            } else if (
              dayjs(eventTime, "hh:mm:ss").isBefore(thirtyMinsAgo) &&
              dayjs(eventTime, "hh:mm:ss").isAfter(fortyFiveMinsAgo)
            ) {
              rowColor = colors.Amber;
            } else {
              rowColor = colors.Red;
            }
          }
        } else if (role && [Role.POST_QA, Role.POST_QA_LEAD].includes(role)) {
          const eventDate = el?.dateOfFallingIntoPostQaBucket || "";

          if (eventDate) {
            const eventTime = dayjs(eventDate).format("hh:mm:ss a");
            const currentTime = dayjs().format("hh:mm:ss a");

            const thirtyMinsAgo = dayjs()
              .subtract(30, "minutes")
              .format("hh:mm:ss a");

            const sixtyMinsAgo = dayjs()
              .subtract(60, "minutes")
              .format("hh:mm:ss a");

            if (
              dayjs(eventTime, "hh:mm:ss a").isBefore(
                dayjs(currentTime, "hh:mm:ss a")
              ) &&
              dayjs(eventTime, "hh:mm:ss a").isAfter(
                dayjs(thirtyMinsAgo, "hh:mm:ss a")
              )
            ) {
              rowColor = colors.Green;
            } else if (
              dayjs(eventTime, "hh:mm:ss a").isBefore(
                dayjs(thirtyMinsAgo, "hh:mm:ss a")
              ) &&
              dayjs(eventTime, "hh:mm:ss a").isAfter(
                dayjs(sixtyMinsAgo, "hh:mm:ss a")
              )
            ) {
              rowColor = colors.Amber;
            } else {
              rowColor = colors.Red;
            }
          }
        } else {
          if (dayjs.utc(el.intimationDate).isAfter(twoHoursBeforeNow)) {
            rowColor = colors.Green;
          } else if (
            dayjs.utc(el.intimationDate).isAfter(fourHoursBeforeNow) &&
            dayjs.utc(el.intimationDate).isBefore(twoHoursBeforeNow)
          ) {
            rowColor = colors.Amber;
          } else if (
            dayjs.utc(el.intimationDate).isBefore(fourHoursBeforeNow)
          ) {
            rowColor = colors.Red;
          }
        }
      } else if (el.claimType === "Reimbursement") {
        if (role && role === Role.ALLOCATION) {
          const eventDate = el?.dateOfFallingIntoAllocationBucket || "";
          if (eventDate) {
            const fourHoursAgo = dayjs().subtract(4, "hours");
            const sixHours = dayjs().subtract(6, "hours");

            if (
              dayjs(eventDate).isBefore(dayjs()) &&
              dayjs(eventDate).isAfter(fourHoursAgo)
            ) {
              rowColor = colors.Green;
            } else if (
              dayjs(eventDate).isBefore(fourHoursAgo) &&
              dayjs(eventDate).isAfter(sixHours)
            ) {
              rowColor = colors.Amber;
            } else {
              rowColor = colors.Red;
            }
          }
        } else if (role && role === Role.INTERNAL_INVESTIGATOR) {
          const allocationDate =
            el?.claimInvestigators[0]?.assignedData &&
            el?.stage !== NumericStage.IN_FIELD_REINVESTIGATION
              ? dayjs(el?.claimInvestigators[0]?.assignedData)
              : el?.dateOfFallingIntoReInvestigation &&
                el?.stage === NumericStage.IN_FIELD_REINVESTIGATION
              ? dayjs(el?.dateOfFallingIntoReInvestigation)
              : null;

          if (allocationDate) {
            if (
              [
                NumericStage.IN_FIELD_FRESH,
                NumericStage.IN_FIELD_REINVESTIGATION,
                NumericStage.INVESTIGATION_ACCEPTED,
              ].includes(el?.stage)
            ) {
              const twelveDaysAgo = dayjs().subtract(12, "days");
              const fifteenDaysAgo = dayjs().subtract(15, "days");
              const sixteenDaysAgo = dayjs().subtract(16, "days");
              if (allocationDate.isAfter(twelveDaysAgo)) {
                rowColor = colors.Green;
              } else if (
                allocationDate.isBefore(twelveDaysAgo) &&
                allocationDate.isAfter(fifteenDaysAgo)
              ) {
                rowColor = colors.Amber;
              } else if (allocationDate.isBefore(sixteenDaysAgo)) {
                rowColor = colors.Red;
              }
            } else if (el?.stage === NumericStage.IN_FIELD_REWORK) {
              const threeDaysAgo = dayjs().subtract(3, "days");
              const fiveDaysAgo = dayjs().subtract(5, "days");
              if (allocationDate.isAfter(threeDaysAgo)) {
                rowColor = colors.Green;
              } else if (
                allocationDate.isAfter(fiveDaysAgo) &&
                allocationDate.isBefore(threeDaysAgo)
              ) {
                rowColor = colors.Amber;
              } else {
                rowColor = colors.Red;
              }
            }
          }
        } else if (role && [Role.POST_QA, Role.POST_QA_LEAD].includes(role)) {
          const eventDate = el?.dateOfFallingIntoPostQaBucket;
          if (
            dayjs(eventDate).isBefore(dayjs()) &&
            dayjs(eventDate).isAfter(oneDayBeforeNow)
          ) {
            rowColor = colors.Green;
          } else if (
            dayjs(eventDate).isBefore(oneDayBeforeNow) &&
            dayjs(eventDate).isAfter(twoDayBeforeNow)
          ) {
            rowColor = colors.Amber;
          } else {
            rowColor = colors.Red;
          }
        } else {
          if (dayjs.utc(el.intimationDate).isAfter(oneDayBeforeNow)) {
            rowColor = colors.Green;
          } else if (
            dayjs.utc(el.intimationDate).isAfter(twoDayBeforeNow) &&
            dayjs.utc(el.intimationDate).isBefore(oneDayBeforeNow)
          ) {
            rowColor = colors.Amber;
          } else if (dayjs.utc(el.intimationDate).isBefore(twoDayBeforeNow)) {
            rowColor = colors.Red;
          }
        }
      }

      return { ...el, rowColor };
    })
  );

  return updatedData;
};

export const addEncryptedClaimId = async (data: any[]) => {
  return data?.map((el) => ({
    ...el,
    encryptedClaimId: encryptPlainText(el?.claimId?.toString()),
  }));
};
