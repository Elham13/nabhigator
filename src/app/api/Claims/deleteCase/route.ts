import connectDB from "@/lib/db/dbConnectWithMongoose";
import CaseEvent from "@/lib/Models/caseEvent";
import ClaimCase from "@/lib/Models/claimCase";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import DashboardData from "@/lib/Models/dashboardData";
import User from "@/lib/Models/user";
import { Databases } from "@/lib/utils/types/enums";
import {
  IDashboardData,
  Investigator,
  IUser,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  try {
    await connectDB(Databases.FNI);

    const { claimId } = body;

    if (!claimId) throw new Error("claimId is required");

    const data: HydratedDocument<IDashboardData> | null =
      await DashboardData.findOne({ claimId: claimId });

    if (!data) throw new Error(`No date found with claim id ${claimId}`);

    if (data?.caseId) {
      await ClaimCase.findByIdAndDelete(data?.caseId);
    }

    await CaseEvent.deleteMany({ claimId: data?.claimId });

    if (data?.postQa) {
      const postQaUser: HydratedDocument<IUser> | null = await User.findById(
        data?.postQa
      );

      if (!postQaUser)
        throw new Error(`No post qa user found with the id ${data?.postQa}`);

      postQaUser!.config!.dailyAssign! -= 1;
      if (data?.claimType === "PreAuth")
        postQaUser!.config!.preAuthPendency! -= 1;
      else postQaUser!.config!.rmPendency! -= 1;
      await postQaUser.save();
    }

    if (data?.claimInvestigators?.length > 0) {
      for (let inv of data?.claimInvestigators) {
        const foundInv: HydratedDocument<Investigator> | null =
          await ClaimInvestigator.findById(inv?._id);

        if (!foundInv)
          throw new Error(`No investigator found with the id ${inv?._id}`);

        if (data?.claimType === "PreAuth") {
          if (
            !!foundInv?.pendency?.preAuth &&
            foundInv?.pendency?.preAuth?.length > 0
          ) {
            foundInv.pendency.preAuth = foundInv?.pendency?.preAuth?.filter(
              (claimId) => claimId !== data?.claimId
            );
          }
        } else {
          if (!!foundInv?.pendency?.rm && foundInv?.pendency?.rm?.length > 0) {
            foundInv.pendency.rm = foundInv?.pendency?.rm?.filter(
              (claimId) => claimId !== data?.claimId
            );
          }
        }

        await foundInv.save();
      }
    }

    await DashboardData?.findByIdAndDelete(data?._id);

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

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}
