import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";
import { fetchMaxData, IFetchProps } from "./helpers";
import { HydratedDocument } from "mongoose";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";
import DashboardData from "@/lib/Models/dashboardData";
import { ClaimHistory } from "@/lib/utils/types/maximusResponseTypes";
import { RequestContext } from "next/dist/server/base-server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  try {
    const { fieldToUpdate, claimId, claimType } = body;

    const response: any = {
      success: true,
      message: "Success",
      data: null,
    };

    if (!fieldToUpdate) throw new Error("fieldToUpdate is required");
    if (!claimId) throw new Error("claimId is required");
    if (!claimType) throw new Error("claimType is required");

    const claimNumber = `${claimType?.charAt(0)}_${claimId}`;

    const mustFetch: IFetchProps["mustFetch"] = {
      getClaimDetailById: true,
      claimOtherDetail: true,
    };

    if (fieldToUpdate === "claimStatusUpdated") {
      mustFetch.claimHistory = true;
    }

    const { success, message, data } = await fetchMaxData({
      claimId,
      claimType,
      mustFetch: mustFetch,
    });

    if (!success) throw new Error(message);
    if (!data) throw new Error("Something went wrong");

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findOne({ claimId, claimType });

    if (!dashboardData)
      throw new Error(
        `No data found with claimId ${claimId} and claimType ${claimType}`
      );

    if (fieldToUpdate === "dateOfAdmission") {
      let currentClaim: ClaimHistory | null = null;
    } else if (fieldToUpdate === "claimStatusUpdated") {
      const { membershipId } = body;
      if (!membershipId) throw new Error("membershipId is required");
      let currentHistory: ClaimHistory | null = null;
      if (data?.claimHistory?.PolicyClaims?.MemberList) {
        const foundMember = data?.claimHistory?.PolicyClaims?.MemberList?.find(
          (el) => el?.membershipId === membershipId
        );
        if (!foundMember)
          throw new Error(
            `No Member found with the membershipId: ${membershipId}`
          );

        const foundHistory = foundMember?.ClaimHistory?.find(
          (el) => el?.Claim_Number === claimNumber
        );

        if (!foundHistory)
          throw new Error(
            `No claim in history found with claim number: ${claimNumber}`
          );

        dashboardData.claimDetails.claimStatusUpdated =
          foundHistory?.Claims_Status;
        const updated = await dashboardData.save();

        response.message = "Claim status updated successfully";
        response.data = updated;
      }
    }

    return NextResponse.json(response, { status: 200 });
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
