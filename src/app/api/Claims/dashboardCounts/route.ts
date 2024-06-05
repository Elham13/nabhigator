import User from "@/lib/Models/user";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { getColorCodes } from "@/lib/helpers/colorCodingLogic";
import { getClaimAmountFilter } from "@/lib/helpers/getDataHelpers";
import { Databases } from "@/lib/utils/types/enums";
import {
  IDashboardCount,
  IUser,
  NumericStage,
  Role,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument, Types } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.get(async (req) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  try {
    if (!userId) throw new Error("User id is required!");
    await connectDB(Databases.FNI);

    const counts: IDashboardCount = {
      preAuth: { green: 0, amber: 0, red: 0 },
      reimbursement: { green: 0, amber: 0, red: 0 },
      PAOrCI: { green: 0, amber: 0, red: 0 },
      total: { green: 0, amber: 0, red: 0 },
    };

    const user: HydratedDocument<IUser> | null = await User.findById(userId);

    if (!user)
      throw new Error(`Failed to find a user with this userId ${userId}`);

    const commonFilters: Record<string, any> = {
      "claimDetails.claimAmount": getClaimAmountFilter(user),
    };

    if (user?.activeRole === Role.ALLOCATION) {
      commonFilters["stage"] = {
        $in: [
          NumericStage.PENDING_FOR_ALLOCATION,
          NumericStage.PENDING_FOR_RE_ALLOCATION,
          NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING,
        ],
      };
    }

    if (user?.activeRole === Role.PRE_QC)
      commonFilters["stage"] = NumericStage.PENDING_FOR_PRE_QC;

    if (user?.activeRole === Role.POST_QA)
      commonFilters["stage"] = NumericStage.POST_QC;

    const geography = user?.state;

    if (![Role.ADMIN, Role.VIEWER].includes(user?.activeRole)) {
      if (geography && geography?.length > 0 && !geography?.includes("All")) {
        commonFilters["hospitalDetails.providerState"] = { $in: geography };
      }

      if (user?.activeRole === Role.TL)
        commonFilters["teamLead"] = new Types.ObjectId(user?._id);

      if (user?.activeRole === Role.CLUSTER_MANAGER)
        commonFilters["clusterManager"] = new Types.ObjectId(user?._id);
    }

    counts.preAuth = await getColorCodes({
      commonFilters,
      userRole: user?.activeRole,
      claimType: "PreAuth",
    });

    counts.reimbursement = await getColorCodes({
      commonFilters,
      userRole: user?.activeRole,
      claimType: "RM",
    });

    counts.PAOrCI = await getColorCodes({
      commonFilters,
      userRole: user?.activeRole,
      claimType: "PA/CA",
    });

    // The total
    counts.total.green =
      counts.preAuth.green + counts.reimbursement.green + counts.PAOrCI.green;
    counts.total.amber =
      counts.preAuth.amber + counts.reimbursement.amber + counts.PAOrCI.amber;
    counts.total.red =
      counts.preAuth.red + counts.reimbursement.red + counts.PAOrCI.red;

    return NextResponse.json(
      {
        success: true,
        message: "Fetched success",
        data: counts,
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
