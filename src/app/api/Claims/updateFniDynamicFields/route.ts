import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";
import { fetchMaxData } from "./helpers";
import { HydratedDocument } from "mongoose";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";
import DashboardData from "@/lib/Models/dashboardData";
import { ClaimHistory } from "@/lib/utils/types/maximusResponseTypes";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  try {
    const { fieldToUpdate, claimId, claimType } = body;

    if (!fieldToUpdate) throw new Error("fieldToUpdate is required");
    if (!claimId) throw new Error("claimId is required");
    if (!claimType) throw new Error("claimType is required");

    const { success, message, data } = await fetchMaxData({
      claimId,
      claimType,
      mustFetch: {},
    });

    if (!success) throw new Error(message);

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findOne({ claimId, claimType });

    if (!dashboardData)
      throw new Error(
        `No data found with claimId ${claimId} and claimType ${claimType}`
      );

    if (fieldToUpdate === "dateOfAdmission") {
      let currentClaim: ClaimHistory | null = null;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Success",
        data: null,
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
