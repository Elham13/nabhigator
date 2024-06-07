import User from "@/lib/Models/user";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { flattenObject } from "@/lib/helpers";
import { Databases } from "@/lib/utils/types/enums";
import { IUser, IUserLeave, Role } from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, PipelineStage, Types } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

const prepareDetails = async (payload: Record<string, any>) => {
  const tempObj: Record<string, string> = {};

  Object.keys(payload)?.map(async (key) => {
    const elem = payload[key];
    if (key === "team") {
      let teamLead: HydratedDocument<IUser> | null = await User.findById(elem);
      tempObj["team"] = teamLead?.name || "";
    } else if (key === "config") {
      Object.keys(elem)?.map((configKey) => {
        const configElem = elem[configKey];
        if (configKey === "leadView" && configElem?.length > 0)
          tempObj["Lead View"] = elem?.leadView?.join(", ");
        else tempObj[configKey] = configElem;
      });
    } else if (
      (key === "role" && elem?.role?.length > 0) ||
      (key === "state" && elem?.state?.length > 0)
    ) {
      tempObj["role"] = elem?.join(", ");
    } else tempObj[key] = elem;
  });

  return tempObj;
};

router.post(async (req) => {
  const body = await req?.json();
  const { userId, sort, skip, limit, searchTerm, action, role, id } = body;

  try {
    await connectDB(Databases.FNI);

    let data: any[] | any | null = null;
    let message = "Fetched successfully";
    let count: number = 0;
    let statusCode: number = 200;

    // For Getting a user by id or userId
    if (action === "getById") {
      if (id) {
        data = await User.findById(id).populate("team");
        if (!data) throw new Error(`No user found with the id: ${id}`);
        count = 1;
      } else if (userId) {
        data = await User.findOne({ userId }).populate("team");
        if (!data) throw new Error(`No user found with the userId: ${userId}`);
        count = 1;
      } else {
        throw new Error("id or userId is required");
      }
    }

    // For Create a user
    else if (action === "create") {
      const { payload } = body;
      payload.activeRole = payload?.role[0];

      if (payload?.role?.includes(Role.TL)) {
        const tlUser: HydratedDocument<IUser> | null = await User.findOne({
          role: Role.TL,
          zone: { $in: payload?.zone },
        });

        if (tlUser)
          throw new Error(
            `Another TL User with the same zone already exists, named ${tlUser?.name}`
          );
      }

      if (payload?.role?.includes(Role.CLUSTER_MANAGER)) {
        const cmUser: HydratedDocument<IUser> | null = await User.findOne({
          role: Role.CLUSTER_MANAGER,
          zone: { $in: payload?.zone },
        });

        if (cmUser)
          throw new Error(
            `Another Cluster Manager User with the same zone already exists, named ${cmUser?.name}`
          );
      }

      data = await User.create(payload);
      message = "User created successfully";
      statusCode = 201;
    }

    // For Edit a user
    else if (action === "edit") {
      const { payload } = body;
      const id = payload?._id;
      if (!id) throw new Error("_id is missing");
      delete payload._id;
      const details = await prepareDetails(payload);

      if (payload?.role?.includes(Role.TL)) {
        const tlUser: HydratedDocument<IUser> | null = await User.findOne({
          role: Role.TL,
          zone: { $in: payload?.zone },
          _id: { $ne: new Types.ObjectId(id) },
        });

        if (tlUser)
          throw new Error(
            `Another TL User with the same zone already exists, named ${tlUser?.name}`
          );
      }

      if (payload?.role?.includes(Role.CLUSTER_MANAGER)) {
        const cmUser: HydratedDocument<IUser> | null = await User.findOne({
          role: Role.CLUSTER_MANAGER,
          zone: { $in: payload?.zone },
          _id: { $ne: new Types.ObjectId(id) },
        });

        if (cmUser)
          throw new Error(
            `Another Cluster Manager User with the same zone already exists, named ${cmUser?.name}`
          );
      }

      data = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            ...flattenObject(payload),
            updates: {
              userIsInformed: false,
              details,
            },
          },
        },
        { new: true, useFindAndModify: false }
      );
      message = "User updated successfully";
      statusCode = 201;
    }

    // For Delete a user
    else if (action === "delete") {
      if (!id) throw new Error("ID is missing");
      data = await User.findByIdAndDelete(id);
      message = "User deleted successfully";
    }

    // For Resetting the updates
    else if (action === "resetUpdates") {
      if (!id) throw new Error("id is required");
      data = await User.findByIdAndUpdate(
        id,
        { $set: { updates: { userIsInformed: true, details: {} } } },
        { new: true, useFindAndModify: false }
      );
      message = "Thanks for the acknowledgment, Enjoy working!";
    }

    // For taking leave
    else if (action === "leaveRequest") {
      if (!userId) throw new Error("User id required");
      const { fromDate, toDate, remark } = body;
      const user: HydratedDocument<IUser> | null = await User.findOne({
        userId,
      });
      if (!user) throw new Error(`No user find with userId: ${userId}`);

      const userLeave: IUserLeave = {
        fromDate,
        toDate,
        remark,
        status: "Requested",
      };
      user.leave = userLeave;
      data = await user.save();
      message = "Leave requested successfully!";
    }

    // For Change active role
    else if (action === "changeActiveRole") {
      if (!userId) throw new Error("userId is required");
      if (!role) throw new Error("role is required");

      data = await User.findOne({ userId });
      if (!data) throw new Error(`No user found with userId ${userId}`);
      data.activeRole = role;
      data.team = data.team || null;
      data = await data.save({ new: true });
      message = "Active role set successfully";
    }

    // For Admin to automate the pre-qc
    else if (action === "togglePreQCAutomation") {
      if (!userId) throw new Error("userId is required");
      let user: HydratedDocument<IUser> | null = await User.findOne({ userId });
      if (!user) throw new Error(`No user found with the userId ${userId}`);
      if (user?.config?.isPreQcAutomated) {
        user.config.isPreQcAutomated = false;
      } else {
        user.config.isPreQcAutomated = true;
      }
      data = await user.save();
      message = `Pre QC is successfully set to ${
        data?.config?.isPreQcAutomated ? "Manual" : "Automatic"
      }`;
    }

    // For view all users
    else {
      const matchStage: Record<string, any> = {};

      if (searchTerm) {
        matchStage["name"] = { $regex: new RegExp(searchTerm, "i") };
      }

      if (role) {
        if (Array.isArray(role)) {
          matchStage["role"] = { $in: role };
        } else {
          matchStage["role"] = { $regex: new RegExp(role, "i") };
        }
      }

      const pipeline: PipelineStage[] = [
        { $match: matchStage },
        {
          $lookup: {
            from: "users",
            localField: "team",
            foreignField: "_id",
            as: "team",
          },
        },
        { $sort: { updatedAt: -1, ...(!!sort ? sort : {}) } },
        { $skip: skip && limit ? skip * limit : 0 },
        { $limit: limit || 10 },
      ];

      data = await User.aggregate(pipeline);
      count = await User.countDocuments(matchStage);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Changes captured successfully",
        data,
        count,
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

router.get(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const userId = url.searchParams.get("userId");

  try {
    if (!userId && !id) throw new Error("id or userId required");
    await connectDB(Databases.FNI);

    let data: any = null;

    if (id) {
      data = await User.findById(id);
    } else if (userId) {
      data = await User.findOne({ userId });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Fetch Successfully",
        data,
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

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}
