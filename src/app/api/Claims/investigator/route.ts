import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import DashboardData from "@/lib/Models/dashboardData";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { findInvestigators } from "@/lib/helpers/autoPreQCHelpers";
import { Databases } from "@/lib/utils/types/enums";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, PipelineStage } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

const filterInvestigators = async (
  filters: any,
  pagination: any,
  sort: any
) => {
  const name = filters?.investigatorName || null;
  delete filters?.investigatorName;

  let skip = 0;
  if (pagination?.limit) {
    if (pagination?.page && !name) {
      skip = (parseInt(pagination.page) - 1) * parseInt(pagination.limit);
    }
  }

  if (filters?.cities) {
    filters.cities = Array.isArray(filters?.cities)
      ? { $in: filters?.cities }
      : { $regex: new RegExp(filters.cities, "i") };
  }

  if (filters?.states) {
    filters.states = Array.isArray(filters?.states)
      ? { $in: filters?.states }
      : { $regex: new RegExp(filters.states, "i") };
  }

  if (filters?.source && filters?.source === "inbox") {
    filters.role = { $ne: "TeamMate" };
    filters.userStatus = "active";
    // filters["$expr"] = {
    //   $and: [
    //     {
    //       $lt: ["$dailyAssign", "$dailyThreshold"],
    //     },
    //     {
    //       $lt: ["$monthlyAssigned", "$monthlyThreshold"],
    //     },
    //   ],
    // };
    delete filters?.source;
  }

  const countsFilter = name
    ? { investigatorName: { $regex: new RegExp(name, "i") }, ...filters }
    : { ...filters };

  const pipeline: PipelineStage[] = [
    {
      $match: countsFilter,
    },
    ...(sort ? [{ $sort: sort }] : [{ $sort: { updatedAt: -1 } }]),
    { $skip: skip },
    ...(pagination?.limit ? [{ $limit: parseInt(pagination?.limit) }] : []),
  ];

  const data = await ClaimInvestigator.aggregate(pipeline);

  const count = await ClaimInvestigator.countDocuments(countsFilter);
  return { data, count };
};

router.post(async (req) => {
  const { filters, pagination, sort } = await req?.json();

  try {
    await connectDB(Databases.FNI);

    // When pre qc is allocating manually
    if (filters?.dashboardDataId) {
      const dashboardData: HydratedDocument<IDashboardData> | null =
        await DashboardData.findById(filters.dashboardDataId);
      if (!dashboardData)
        throw new Error(`No data found with the id ${filters.dashboardDataId}`);

      if (filters?.isAllocation) {
        filters["rejectedCases"] = { $ne: dashboardData?.claimId };
        delete filters.isAllocation;
        delete filters.dashboardDataId;
        const { count, data } = await filterInvestigators(
          filters,
          pagination,
          sort
        );

        return NextResponse.json(
          {
            success: true,
            message: "Fetched",
            count,
            data,
          },
          { status: 200 }
        );
      } else {
        if (!filters.allocationType)
          throw new Error("allocationType is required");

        const investigatorsRes = await findInvestigators({
          allocation: { allocationType: filters.allocationType },
          dashboardData,
        });

        if (investigatorsRes?.success) {
          return NextResponse.json(
            {
              success: true,
              message: "Fetched",
              data: investigatorsRes?.investigators,
              count: investigatorsRes?.investigators?.length || 0,
            },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            {
              success: true,
              message: "Fetched",
              data: [],
              count: 0,
            },
            { status: 200 }
          );
        }
      }
    }

    const { count, data } = await filterInvestigators(
      filters,
      pagination,
      sort
    );

    return NextResponse.json(
      {
        success: true,
        message: "Fetched",
        count,
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

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}

router.put(async (req) => {
  const { action, payload } = await req?.json();

  try {
    if (!action) throw new Error("action is required");

    await connectDB(Databases.FNI);

    if (action === "create") {
      const newRecord = await ClaimInvestigator.create(payload);

      return NextResponse.json(
        {
          success: true,
          message: "Created",
          created: newRecord,
        },
        { status: 201 }
      );
    } else if (action === "edit") {
      const updatedRecord = await ClaimInvestigator.findByIdAndUpdate(
        payload?._id,
        payload
      );
      return NextResponse.json(
        {
          success: true,
          message: "Updated",
          updated: updatedRecord,
        },
        { status: 200 }
      );
    } else {
      throw new Error("Action type not correct");
    }
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

export async function PUT(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}

router.get(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    if (!id) throw new Error("id required");

    await connectDB(Databases.FNI);

    const data = await ClaimInvestigator.findById(id).select("-password");

    if (!data) throw new Error(`No user found with the id ${id}`);

    return NextResponse.json(
      {
        success: true,
        message: "Fetched successfully",
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
