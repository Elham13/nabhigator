import dayjs from "dayjs";
import DashboardData from "../Models/dashboardData";
import { ColorCount, EColorCode, Role } from "../utils/types/fniDataTypes";
import { PipelineStage } from "mongoose";

type RMPipelinePropTypes = {
  userRole: Role;
  claimType: "RM" | "PA/CA" | "PreAuth";
  commonFilters: Record<string, any>;
  colorCode: EColorCode;
};

const getPipeline = ({
  commonFilters,
  colorCode,
  userRole,
  claimType,
}: RMPipelinePropTypes) => {
  const noOfMinutesFromOneDayAgo = dayjs().diff(
    dayjs().subtract(1, "day"),
    "minutes"
  );
  const noOfMinutesFrom2DaysAgo = dayjs().diff(
    dayjs().subtract(2, "day"),
    "minutes"
  );
  const noOfSecondsFrom2HoursAgo = dayjs().diff(
    dayjs().subtract(2, "hours"),
    "second"
  );
  const noOfSecondsFrom4HoursAgo = dayjs().diff(
    dayjs().subtract(4, "hours"),
    "second"
  );

  const pipeline: PipelineStage[] = [];
  const query: PipelineStage.Match["$match"] = {
    ...commonFilters,
  };
  const addFields: PipelineStage.AddFields["$addFields"] = {};
  const project: PipelineStage.Project["$project"] = {
    intimationDate: 1,
    claimType: 1,
    claimId: 1,
  };

  if (claimType === "RM") {
    query["claimType"] = { $ne: "PreAuth" };
    query["$nor"] = [
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
  } else if (claimType === "PA/CA") {
    query["claimType"] = { $ne: "PreAuth" };
    query["$or"] = [
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
  } else if (claimType === "PreAuth") {
    query["claimType"] = "PreAuth";
  }

  const divide = {
    $subtract: [
      "$$NOW",
      {
        $dateFromString: {
          dateString: "$intimationDate",
          timezone: "Asia/Kolkata", // Specify the timezone explicitly
        },
      },
    ],
  };

  if (userRole === Role.ALLOCATION)
    divide["$subtract"][1] = "$dateOfFallingIntoAllocationBucket";

  if ([Role.POST_QA, Role.POST_QA_LEAD].includes(userRole))
    divide["$subtract"][1] = "$dateOfFallingIntoPostQaBucket";

  if (claimType === "PreAuth") {
    addFields["differenceInSeconds"] = {
      $divide: [
        divide,
        1000, // Convert milliseconds to seconds
      ],
    };
    project["differenceInSeconds"] = 1;
  } else {
    addFields["differenceInMinutes"] = {
      $divide: [
        divide,
        60000, // Convert milliseconds to minutes
      ],
    };
    project["differenceInMinutes"] = 1;
  }

  if (["RM-Green", "PAOrCI-Green"].includes(colorCode)) {
    let minutes = noOfMinutesFromOneDayAgo;
    if (userRole === Role.ALLOCATION)
      minutes = dayjs().diff(dayjs().subtract(4, "hours"), "minutes");
    if ([Role.POST_QA, Role.POST_QA_LEAD].includes(userRole))
      minutes = dayjs().diff(dayjs().subtract(24, "hours"), "minutes");

    query["$expr"] = {
      $and: [
        {
          $lte: ["$differenceInMinutes", minutes],
        },
        {
          $gt: ["$differenceInMinutes", 0],
        },
      ],
    };
  } else if (["RM-Amber", "PAOrCI-Amber"].includes(colorCode)) {
    let moreMinutes = noOfMinutesFrom2DaysAgo;
    let lessMinutes = noOfMinutesFromOneDayAgo;
    if (userRole === Role.ALLOCATION) {
      moreMinutes = dayjs().diff(dayjs().subtract(6, "hours"), "minutes");
      lessMinutes = dayjs().diff(dayjs().subtract(4, "hours"), "minutes");
    }

    if ([Role.POST_QA, Role.POST_QA_LEAD].includes(userRole)) {
      moreMinutes = dayjs().diff(dayjs().subtract(2, "days"), "minutes");
      lessMinutes = dayjs().diff(dayjs().subtract(24, "hours"), "minutes");
    }
    query["$expr"] = {
      $and: [
        {
          $lte: ["$differenceInMinutes", moreMinutes],
        },
        {
          $gt: ["$differenceInMinutes", lessMinutes],
        },
      ],
    };
  } else if (["RM-Red", "PAOrCI-Red"].includes(colorCode)) {
    let minutes = noOfMinutesFrom2DaysAgo;
    if (userRole === Role.ALLOCATION)
      minutes = dayjs().diff(dayjs().subtract(6, "hours"), "minutes");

    if ([Role.POST_QA, Role.POST_QA_LEAD].includes(userRole))
      minutes = dayjs().diff(dayjs().subtract(2, "days"), "minutes");

    query["$expr"] = {
      $gte: ["$differenceInMinutes", minutes],
    };
  } else if (colorCode === EColorCode["PreAuth-Green"]) {
    let seconds = noOfSecondsFrom2HoursAgo;
    if ([Role.POST_QA, Role.POST_QA_LEAD, Role.ALLOCATION].includes(userRole))
      seconds = dayjs().diff(dayjs().subtract(30, "minutes"), "seconds");
    query["$expr"] = {
      $and: [
        {
          $lte: ["$differenceInSeconds", seconds],
        },
        {
          $gt: ["$differenceInSeconds", 0],
        },
      ],
    };
  } else if (colorCode === EColorCode["PreAuth-Amber"]) {
    let moreSeconds = noOfSecondsFrom4HoursAgo;
    let lessSeconds = noOfSecondsFrom2HoursAgo;
    if ([Role.POST_QA, Role.POST_QA_LEAD, Role.ALLOCATION].includes(userRole)) {
      moreSeconds = dayjs().diff(dayjs().subtract(45, "minutes"), "seconds");
      lessSeconds = dayjs().diff(dayjs().subtract(30, "minutes"), "seconds");
    }
    query["$expr"] = {
      $and: [
        {
          $lte: ["$differenceInSeconds", moreSeconds],
        },
        {
          $gt: ["$differenceInSeconds", lessSeconds],
        },
      ],
    };
  } else if (colorCode === EColorCode["PreAuth-Red"]) {
    let seconds = noOfSecondsFrom4HoursAgo;
    if ([Role.POST_QA, Role.POST_QA_LEAD, Role.ALLOCATION].includes(userRole))
      seconds = dayjs().diff(dayjs().subtract(45, "minutes"), "seconds");
    query["$expr"] = {
      $gte: ["$differenceInSeconds", seconds],
    };
  }

  pipeline.push({ $addFields: addFields });
  pipeline.push({ $match: query });
  pipeline.push({ $project: project });

  return pipeline;
};

type ColorCodeProps = {
  userRole: Role;
  claimType: "RM" | "PA/CA" | "PreAuth";
  commonFilters: Record<string, any>;
};

export const getColorCodes = async ({
  userRole,
  claimType,
  commonFilters,
}: ColorCodeProps) => {
  const colorCount: ColorCount = {
    green: 0,
    amber: 0,
    red: 0,
  };

  let colorCode: EColorCode = EColorCode["RM-Red"];

  if (claimType === "RM") colorCode = EColorCode["RM-Green"];
  else if (claimType === "PA/CA") colorCode = EColorCode["PAOrCI-Green"];
  else if (claimType === "PreAuth") colorCode = EColorCode["PreAuth-Green"];

  const green = await DashboardData.aggregate(
    getPipeline({
      commonFilters,
      userRole,
      claimType,
      colorCode,
    })
  );
  if (green?.length > 0) colorCount.green = green?.length;

  if (claimType === "RM") colorCode = EColorCode["RM-Amber"];
  else if (claimType === "PA/CA") colorCode = EColorCode["PAOrCI-Amber"];
  else if (claimType === "PreAuth") colorCode = EColorCode["PreAuth-Amber"];

  const amber = await DashboardData.aggregate(
    getPipeline({
      commonFilters,
      userRole,
      claimType,
      colorCode,
    })
  );
  if (amber?.length > 0) colorCount.amber = amber?.length;

  if (claimType === "RM") colorCode = EColorCode["RM-Red"];
  else if (claimType === "PA/CA") colorCode = EColorCode["PAOrCI-Red"];
  else if (claimType === "PreAuth") colorCode = EColorCode["PreAuth-Red"];

  const red = await DashboardData.aggregate(
    getPipeline({
      commonFilters,
      userRole,
      claimType,
      colorCode,
    })
  );
  if (red?.length > 0) colorCount.red = red?.length;
  return colorCount;
};
