import connectDB from "@/lib/db/dbConnectWithMongoose";
import User from "@/lib/Models/user";
import ZoneStateMaster from "@/lib/Models/zoneStateMaster";
import { Databases } from "@/lib/utils/types/enums";
import { IUser, IZoneStateMaster, Role } from "@/lib/utils/types/fniDataTypes";
import dayjs from "dayjs";
import { HydratedDocument, PipelineStage } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

const dbQueries = () => {
  // For report recieved date
  // db.dashboarddatas
  //   .aggregate([
  //     {
  //       $match: {
  //         stage: { $in: [12, 4] },
  //         caseId: { $exists: true, $ne: null },
  //         $or: [
  //           { invReportReceivedDate: { $exists: false } },
  //           { invReportReceivedDate: null },
  //         ],
  //       },
  //     },
  //     { $project: { claimId: 1, invReportReceivedDate: 1, caseId: 1 } },
  //   ])
  //   .forEach(function (doc) {
  //     const claimCase = db.claimcases.findOne({ _id: doc.caseId });
  //     if (claimCase) {
  //       let date = null;
  //       if (
  //         claimCase.singleTasksAndDocs &&
  //         claimCase.singleTasksAndDocs.invReportReceivedDate
  //       ) {
  //         date = claimCase.singleTasksAndDocs.invReportReceivedDate;
  //       } else if (claimCase.reportReceivedDate) {
  //         date = claimCase.reportReceivedDate;
  //       } else if (claimCase.invReportReceivedDate) {
  //         date = claimCase.invReportReceivedDate;
  //       } else {
  //         print("No condition success for caseId: " + claimCase._id);
  //       }
  //       if (date) {
  //         print("Update success: " + claimCase._id);
  //         db.dashboarddatas.findAndModify({
  //           query: { _id: doc._id },
  //           update: { $set: { invReportReceivedDate: date } },
  //         });
  //       }
  //     } else {
  //       print("Document not found for caseId: " + doc.caseId);
  //     }
  //   });
  // For recommendation
  // db.dashboarddatas
  //   .aggregate([
  //     {
  //       $match: {
  //         stage: { $in: [12, 4] },
  //         caseId: { $exists: true, $ne: null },
  //         $or: [
  //           { investigatorRecommendation: { $exists: false } },
  //           { investigatorRecommendation: null },
  //           { investigatorRecommendation: "" },
  //         ],
  //       },
  //     },
  //     { $project: { claimId: 1, investigatorRecommendation: 1, caseId: 1 } },
  //   ])
  //   .forEach(function (doc) {
  //     const claimCase = db.claimcases.findOne({ _id: doc.caseId });
  //     if (claimCase) {
  //       let recommendation = null;
  //       if (
  //         claimCase.singleTasksAndDocs &&
  //         claimCase.singleTasksAndDocs.preAuthFindings &&
  //         claimCase.singleTasksAndDocs.preAuthFindings &&
  //         claimCase.singleTasksAndDocs.preAuthFindings.recommendation &&
  //         claimCase.singleTasksAndDocs.preAuthFindings.recommendation.value
  //       ) {
  //         recommendation =
  //           claimCase.singleTasksAndDocs.preAuthFindings.recommendation.value;
  //       } else if (
  //         claimCase.investigationFindings &&
  //         claimCase.investigationFindings &&
  //         claimCase.investigationFindings &&
  //         claimCase.investigationFindings.recommendation &&
  //         claimCase.investigationFindings.recommendation.value
  //       ) {
  //         recommendation = claimCase.investigationFindings.recommendation.value;
  //       } else {
  //         print("No condition success for caseId: " + claimCase._id);
  //       }
  //       if (recommendation) {
  //         print("Update success: " + claimCase._id);
  //         db.dashboarddatas.findAndModify({
  //           query: { _id: doc._id },
  //           update: { $set: { investigatorRecommendation: recommendation } },
  //         });
  //       }
  //     } else {
  //       print("Document not found for caseId: " + doc.caseId);
  //     }
  //   });
};

router.post(async (req) => {
  const body = await req?.json();

  try {
    await connectDB(Databases.FNI);

    const findPostQaUser = async (props: any) => {
      const { claimType, providerState } = props;

      dayjs.extend(utc);
      dayjs.extend(timezone);

      const now = dayjs().tz("Europe/London"); // Get the current time

      const currentHour = now.hour();
      const currentMinute = now.minute();

      const addField: PipelineStage.AddFields["$addFields"] = {
        fromHour: {
          $hour: "$config.reportReceivedTime.from",
        },
        fromMinute: {
          $minute: "$config.reportReceivedTime.from",
        },
        toHour: {
          $hour: "$config.reportReceivedTime.to",
        },
        toMinute: {
          $minute: "$config.reportReceivedTime.to",
        },
      };

      const match: PipelineStage.Match["$match"] = {
        role: Role.POST_QA,
        $expr: {
          $lte: ["$config.dailyAssign", "$config.dailyThreshold"],
        },
        status: "Active",
        "config.leadView": claimType,
        "config.reportReceivedTime": { $exists: true },
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
          $match: match,
        },
        { $addFields: addField },
        {
          $match: {
            $expr: {
              $and: [
                {
                  $lt: [
                    { $add: ["$fromHour", { $divide: ["$fromMinute", 60] }] },
                    { $add: [currentHour, { $divide: [currentMinute, 60] }] },
                  ],
                },
                {
                  $gt: [
                    { $add: ["$toHour", { $divide: ["$toMinute", 60] }] },
                    { $add: [currentHour, { $divide: [currentMinute, 60] }] },
                  ],
                },
              ],
            },
          },
        },
        { $sort: { "config.thresholdUpdatedAt": 1 } },
      ];

      const users: IUser[] = await User.aggregate(pipeline);

      return users;
    };

    const result = await findPostQaUser({
      claimType: "PreAuth",
      providerState: "Bihar",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Success",
        data: result,
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

// const d = [
//   {
//     $match: {
//       role: "Post QA",
//       $expr: {
//         $lte: ["$config.dailyAssign", "$config.dailyThreshold"],
//       },
//       status: "Active",
//       "config.leadView": "PreAuth",
//       "config.reportReceivedTime": {
//         $exists: true,
//       },
//       zone: "East",
//     },
//   },
//   {
//     $addFields: {
//       fromHour: {
//         $hour: "$config.reportReceivedTime.from",
//       },
//       fromMinute: {
//         $minute: "$config.reportReceivedTime.from",
//       },
//       toHour: {
//         $hour: "$config.reportReceivedTime.to",
//       },
//       toMinute: {
//         $minute: "$config.reportReceivedTime.to",
//       },
//     },
//   },
//   {
//     $match: {
//       $expr: {
//         $and: [
//           {
//             $lt: [
//               {
//                 $add: [
//                   "$fromHour",
//                   {
//                     $divide: ["$fromMinute", 60],
//                   },
//                 ],
//               },
//               {
//                 $add: [
//                   22,
//                   {
//                     $divide: [8, 60],
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             $gt: [
//               {
//                 $add: [
//                   "$toHour",
//                   {
//                     $divide: ["$toMinute", 60],
//                   },
//                 ],
//               },
//               {
//                 $add: [
//                   22,
//                   {
//                     $divide: [8, 60],
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     },
//   },
//   {
//     $sort: {
//       "config.thresholdUpdatedAt": 1,
//     },
//   },
// ];
