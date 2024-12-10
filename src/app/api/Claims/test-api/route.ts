import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import {
  IDashboardData,
  Investigator,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import DashboardData from "@/lib/Models/dashboardData";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  try {
    await connectDB(Databases.FNI);

    const investigators = (await ClaimInvestigator.find(
      {}
    ).lean()) as Investigator[];

    const updated: any[] = [];

    for (const inv of investigators) {
      let alreadyAssignedClaimIdsRM: number[] = [];
      let alreadyAssignedClaimIdsPreAuth: number[] = [];

      if (!!inv?.pendency) {
        if (!!inv?.pendency?.rm && inv?.pendency?.rm?.length > 0) {
          alreadyAssignedClaimIdsRM = inv?.pendency?.rm;
        }
        if (!!inv?.pendency?.preAuth && inv?.pendency?.preAuth?.length > 0) {
          alreadyAssignedClaimIdsPreAuth = inv?.pendency?.preAuth;
        }
      }

      const unwantedClaimIds = [
        ...alreadyAssignedClaimIdsPreAuth,
        ...alreadyAssignedClaimIdsRM,
      ];

      const data = (await DashboardData.find({
        "claimInvestigators._id": inv?._id,
        stage: {
          $in: [
            NumericStage.IN_FIELD_FRESH,
            NumericStage.IN_FIELD_REINVESTIGATION,
            NumericStage.IN_FIELD_REWORK,
            NumericStage.INVESTIGATION_ACCEPTED,
          ],
        },
        claimId: {
          $nin: unwantedClaimIds,
        },
      }).lean()) as IDashboardData[];

      if (!!data && data?.length > 0) {
        const preAuthIds = data
          ?.filter((el) => el?.claimType === "PreAuth")
          ?.map((el) => el?.claimId);
        const rmIds = data
          ?.filter((el) => el?.claimType === "Reimbursement")
          ?.map((el) => el?.claimId);

        if (preAuthIds?.length > 0 || rmIds?.length > 0) {
          const newInv: HydratedDocument<Investigator> | null =
            await ClaimInvestigator.findById(inv?._id);

          if (!newInv) throw new Error(`No inv found with the Id ${inv?._id}`);

          if (!!newInv?.pendency) {
            if (newInv?.pendency?.preAuth?.length > 0) {
              newInv.pendency.preAuth = [
                ...newInv.pendency.preAuth,
                ...preAuthIds,
              ];
            } else {
              newInv.pendency.preAuth = preAuthIds;
            }
            if (newInv?.pendency?.rm?.length > 0) {
              newInv.pendency.rm = [...newInv.pendency.rm, ...rmIds];
            } else {
              newInv.pendency.rm = rmIds;
            }
          } else {
            newInv.pendency = { preAuth: preAuthIds, rm: rmIds };
          }

          updated.push({
            invName: newInv?.investigatorName,
            preAuthIds,
            rmIds,
          });

          await newInv.save();
        }
      }
    }

    for (const inv of investigators) {
      const data = (await DashboardData.find({
        "claimInvestigators._id": inv?._id,
        stage: {
          $in: [
            NumericStage.IN_FIELD_FRESH,
            NumericStage.IN_FIELD_REINVESTIGATION,
            NumericStage.IN_FIELD_REWORK,
            NumericStage.INVESTIGATION_ACCEPTED,
          ],
        },
      }).lean()) as IDashboardData[];

      if (data && data?.length > 0) {
        const preAuthIds = data
          ?.filter((el) => el?.claimType === "PreAuth")
          ?.map((el) => el?.claimId);
        const rmIds = data
          ?.filter((el) => el?.claimType === "Reimbursement")
          ?.map((el) => el?.claimId);

        const newInv: HydratedDocument<Investigator> | null =
          await ClaimInvestigator.findById(inv?._id);

        if (newInv) {
          if (newInv?.pendency) {
            if (newInv?.pendency?.preAuth?.length > 0) {
              newInv.pendency.preAuth = newInv?.pendency?.preAuth?.filter(
                (id) => preAuthIds?.includes(id)
              );
            } else {
              newInv.pendency.preAuth = preAuthIds;
            }

            if (newInv?.pendency?.rm?.length > 0) {
              newInv.pendency.rm = newInv?.pendency?.rm?.filter((id) =>
                rmIds?.includes(id)
              );
            } else {
              newInv.pendency.rm = rmIds;
            }
          } else {
            newInv.pendency = { preAuth: rmIds, rm: preAuthIds };
          }

          await newInv.save();
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Success",
        data: updated,
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
