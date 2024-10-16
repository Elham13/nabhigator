import DashboardData from "@/lib/Models/dashboardData";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { processGetDataFilters } from "@/lib/helpers/getDataHelpers";
import { Databases } from "@/lib/utils/types/enums";
import { Role } from "@/lib/utils/types/fniDataTypes";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { PipelineStage, Types } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

dayjs.extend(utc);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const filter = await req?.json();

  try {
    const sort = filter?.sort || null;
    const updatedFilter: any = await processGetDataFilters(filter);

    const userRole = filter?.user?.activeRole
      ? filter?.user?.activeRole
      : filter?.source === "Investigators"
      ? Role.INTERNAL_INVESTIGATOR
      : undefined;
    await connectDB(Databases.FNI);

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "clusterManager",
          foreignField: "_id",
          as: "clusterManager",
        },
      },
      {
        $unwind: { path: "$clusterManager", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "teamLead",
          foreignField: "_id",
          as: "teamLead",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postQa",
          foreignField: "_id",
          as: "postQa",
        },
      },
      { $unwind: { path: "$postQa", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          claimId: 1,
          claimType: 1,
          claimSubType: 1,
          lossType: 1,
          benefitType: 1,
          contractDetails: 1,
          members: 1,
          insuredDetails: 1,
          claimDetails: 1,
          hospitalDetails: 1,
          hospitalizationDetails: 1,
          historicalClaim: 1,
          fraudIndicators: 1,
          triageSummary: 1,
          allocationType: 1,
          stage: 1,
          intimationDate: 1,
          isReInvestigated: 1,
          investigationCount: 1,
          applicationId: 1,
          "teamLead._id": "$teamLead._id",
          "teamLead.name": "$teamLead.name",
          "postQa._id": "$postQa._id",
          "postQa.name": "$postQa.name",
          "clusterManager._id": "$clusterManager._id",
          "clusterManager.name": "$clusterManager.name",
          caseId: 1,
          dateOfOS: 1,
          dateOfClosure: 1,
          claimInvestigators: 1,
          lossDate: 1,
          sumInsured: 1,
          rejectionReasons: 1,
          cataractOrDayCareProcedure: 1,
          locked: 1,
          actionsTaken: 1,
          expedition: 1,
          dateOfFallingIntoAllocationBucket: 1,
          dateOfFallingIntoPostQaBucket: 1,
          dateOfFallingIntoReInvestigation: 1,
          investigatorRecommendation: 1,
          sourceSystem: 1,
          tlInbox: 1,
          invReportReceivedDate: 1,
        },
      },
      { $sort: sort ? sort : { updatedAt: -1 } },
      {
        $skip: updatedFilter?.claimId
          ? 0
          : (filter?.pagination?.page - 1) * filter?.pagination?.limit,
      },
      { $limit: filter?.pagination?.limit || 10 },
    ];

    const mainPipeLine: PipelineStage[] = [
      {
        $match: updatedFilter,
      },
      ...pipeline,
      {
        $facet: {
          data: [],
          count: [
            {
              $count: "total",
            },
          ],
        },
      },
    ];

    if (!!filter?.colorCode) {
      mainPipeLine.unshift({
        $addFields: {
          differenceInSeconds: {
            $divide: [
              {
                $subtract: [
                  "$$NOW",
                  {
                    $dateFromString: {
                      dateString: "$intimationDate",
                      timezone: "Asia/Kolkata",
                    },
                  },
                ],
              },
              1000, // Convert milliseconds to seconds
            ],
          },
        },
      });
    }

    if (
      !!filter?.intimationDateRange &&
      Array.isArray(filter?.intimationDateRange)
    ) {
      mainPipeLine.unshift({
        $addFields: {
          intimationDateAsDate: { $toDate: "$intimationDate" },
        },
      });
    }

    // console.log("pipeline: ", pipeline[0]["$match"]);

    let result = await DashboardData.aggregate(mainPipeLine, {});

    const data = result.length > 0 ? result[0].data : [];
    const count =
      result.length > 0 && result[0].count.length > 0
        ? result[0].count[0].total
        : 0;

    return NextResponse.json(
      {
        success: true,
        message: "Fetch Successfully",
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
  const claimId = url.searchParams.get("claimId");

  try {
    if (!claimId && !id) throw new Error("id or claimId required");
    await connectDB(Databases.FNI);

    const matchStage: PipelineStage.Match["$match"] = {};

    if (id) {
      matchStage["_id"] = new Types.ObjectId(id as string);
    } else {
      matchStage["claimId"] = parseInt(claimId as string);
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "teamLead",
          foreignField: "_id",
          as: "teamLead",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "clusterManager",
          foreignField: "_id",
          as: "clusterManager",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postQa",
          foreignField: "_id",
          as: "postQa",
        },
      },
    ];

    let data = await DashboardData.aggregate(pipeline);

    if (!data || data?.length < 1)
      throw new Error(`No record found with the id ${id || claimId}`);

    data = data[0];

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
