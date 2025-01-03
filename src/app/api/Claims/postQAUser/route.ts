import DashboardData from "@/lib/Models/dashboardData";
import User from "@/lib/Models/user";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import {
  EventNames,
  IDashboardData,
  IUser,
  Role,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, PipelineStage } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { captureCaseEvent } from "../caseEvent/helpers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  const { action } = body;

  let data: any = null;
  let count: number = 0;
  let message: string = "Fetched";
  let status: number = 200;
  try {
    if (!action) throw new Error("action is required");
    await connectDB(Databases.FNI);

    if (action === "list") {
      const { sort, skip, limit, name } = body;
      const match: PipelineStage.Match["$match"] = {
        role: Role.POST_QA,
      };

      if (!!name) {
        match["name"] = { $regex: new RegExp(name, "i") };
      }

      const pipeline: PipelineStage[] = [
        { $match: match },
        { $sort: !!sort ? sort : { updatedAt: -1 } },
        { $skip: skip && limit ? skip * limit : 0 },
        { $limit: limit || 10 },
      ];

      data = await User.aggregate(pipeline);
      count = await User.countDocuments(match);
    } else if (
      [
        "updateShiftTime",
        "updateClaimType",
        "updateThreshold",
        "updateLeaveStatus",
        "updateClaimAmount",
      ].includes(action)
    ) {
      const { id, time, claimType, type, threshold, claimAmount } = body;
      if (!id) throw new Error("id is required");

      const user: HydratedDocument<IUser> | null = await User.findById(id);

      if (!user) throw new Error(`No user found with the id ${id}`);

      if (action === "updateShiftTime") {
        if (!time) throw new Error("Shift time values are required");
        user.config.reportReceivedTime = time;
      } else if (action === "updateClaimAmount") {
        user.config.claimAmount = claimAmount;
      } else if (action === "updateClaimType") {
        if (!claimType) throw new Error("Claim type is required");
        user.config.leadView = claimType;
      } else if (action === "updateThreshold") {
        if (!type) throw new Error("type is required");
        if (!threshold && threshold !== 0)
          throw new Error("threshold is required");

        const thresholdType: "dailyThreshold" | "dailyAssign" = type;
        user.config[thresholdType] = threshold;
      } else if (action === "updateLeaveStatus") {
        const { payload } = body;
        if (!payload) throw new Error("payload is required");
        if (payload?.type === "Inactivate") {
          user.leave = {
            ...payload,
            status: "Approved",
          };
        } else {
          if (!!user.leave) user.leave.status = "";
          else
            user.leave = {
              status: "",
              fromDate: null,
              toDate: null,
              remark: "",
            };
        }
      }
      data = await user.save();
    } else if (["assignCases", "reAssignCase"].includes(action)) {
      const { id, caseIds, userId } = body;
      if (!id) throw new Error("id is required");
      if (!userId) throw new Error("userId is required");
      if (!caseIds || caseIds?.length < 1)
        throw new Error("caseIds is required");

      const user: HydratedDocument<IUser> | null = await User.findById(id);
      if (!user) throw new Error(`Failed to find a user with the id ${id}`);

      for (const dId of caseIds) {
        const dData: HydratedDocument<IDashboardData> | null =
          await DashboardData.findById(dId);

        if (dData) {
          if (!!dData?.postQa) {
            // In Case of Re-Assign
            const postQaUser: HydratedDocument<IUser> | null =
              await User.findById(dData?.postQa);

            if (postQaUser) {
              // Deduct Pendency
              if (dData?.claimType === "PreAuth") {
                if (
                  !!postQaUser?.config?.preAuthPendency &&
                  postQaUser?.config?.preAuthPendency > 0
                ) {
                  postQaUser.config.preAuthPendency -= 1;
                }

                if (!!postQaUser?.config?.pendency) {
                  postQaUser!.config!.pendency!.preAuth =
                    !!postQaUser?.config?.pendency?.preAuth &&
                    postQaUser?.config?.pendency?.preAuth?.length > 0
                      ? postQaUser?.config?.pendency?.preAuth?.filter(
                          (el) => el?.claimId !== dData?.claimId
                        )
                      : [];
                } else {
                  postQaUser!.config!.pendency = { preAuth: [], rm: [] };
                }
              } else {
                if (
                  !!postQaUser?.config?.rmPendency &&
                  postQaUser?.config?.rmPendency > 0
                ) {
                  postQaUser.config.rmPendency -= 1;
                }

                if (!!postQaUser?.config?.pendency) {
                  postQaUser!.config!.pendency!.rm =
                    !!postQaUser?.config?.pendency?.rm &&
                    postQaUser?.config?.pendency?.rm?.length > 0
                      ? postQaUser?.config?.pendency?.rm?.filter(
                          (el) => el?.claimId !== dData?.claimId
                        )
                      : [];
                } else {
                  postQaUser!.config!.pendency = { preAuth: [], rm: [] };
                }
              }

              await postQaUser.save();
            }
          }

          if (dData?.claimType === "PreAuth") {
            if (!!user?.config?.preAuthPendency) {
              user.config.preAuthPendency += 1;
            } else {
              user.config.preAuthPendency = 1;
            }

            if (!!user?.config?.pendency) {
              user!.config!.pendency!.preAuth =
                !!user?.config?.pendency?.preAuth &&
                user?.config?.pendency?.preAuth?.length > 0
                  ? [
                      ...user?.config?.pendency?.preAuth,
                      { claimId: dData?.claimId, type: "Manual" },
                    ]
                  : [{ claimId: dData?.claimId, type: "Manual" }];
            } else {
              user!.config!.pendency = {
                preAuth: [{ claimId: dData?.claimId, type: "Manual" }],
                rm: [],
              };
            }
          } else {
            if (!!user?.config?.rmPendency) {
              user.config.rmPendency += 1;
            } else {
              user.config.rmPendency = 1;
            }

            if (!!user?.config?.pendency) {
              user!.config!.pendency!.rm =
                !!user?.config?.pendency?.rm &&
                user?.config?.pendency?.rm?.length > 0
                  ? [
                      ...user?.config?.pendency?.rm,
                      { claimId: dData?.claimId, type: "Manual" },
                    ]
                  : [{ claimId: dData?.claimId, type: "Manual" }];
            } else {
              user!.config!.pendency = {
                rm: [{ claimId: dData?.claimId, type: "Manual" }],
                preAuth: [],
              };
            }
          }

          dData.postQa = user?._id;
          dData.dateOfFallingIntoPostQaBucket = new Date();

          // dailyAssign += 1;

          await captureCaseEvent({
            eventName: EventNames.MANUALLY_ASSIGNED_TO_POST_QA,
            eventRemarks: `Manually ${
              action === "assignCases" ? "Assigned" : "Re-Assigned"
            } to ${user?.name}`,
            intimationDate:
              dData?.intimationDate ||
              dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
            stage: dData?.stage,
            claimId: dData?.claimId,
            userId,
          });

          await dData.save();
        }
      }

      // user.config.dailyAssign = dailyAssign;
      await user?.save();
    } else if (action === "resetAllDailyAssign") {
      await User.updateMany(
        { role: Role.POST_QA },
        { $set: { "config.dailyAssign": 0 } }
      );
    } else throw new Error(`Wrong action ${action}`);

    return NextResponse.json(
      {
        success: true,
        message,
        data,
        count,
      },
      { status }
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
