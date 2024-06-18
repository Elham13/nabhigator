import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import tz from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import { HydratedDocument } from "mongoose";
import {
  IAutoPreQC,
  IDashboardData,
  NumericStage,
} from "@/lib/utils/types/fniDataTypes";
import FNIManager from "@/lib/Models/fniManager";
import DashboardData from "@/lib/Models/dashboardData";
import getFniData from "@/lib/helpers/getFniData";
import CaseEvent from "@/lib/Models/caseEvent";
import { performSystemPreQc } from "@/lib/helpers/performSystemPreQc";
import getClaimIds from "@/lib/helpers/getClaimIds";
import DashboardFeedingLog from "@/lib/Models/dashboardFeedingLog";
import { TSourceSystem } from "@/lib/utils/types/maximusResponseTypes";

dayjs.extend(tz);

const router = createEdgeRouter<NextRequest, {}>();

const convertClaimType = (claimType: string) =>
  claimType === "R"
    ? "Reimbursement"
    : claimType === "P"
    ? "PreAuth"
    : claimType;

router.post(async (req) => {
  const body = await req?.json();

  try {
    await connectDB(Databases.FNI);

    const fniManager: HydratedDocument<IAutoPreQC> | null =
      await FNIManager.findOne({});

    let inserted = 0;
    let skipped = 0;
    let foundAndUpdated = 0;
    let totalRecords = 0;
    const skippedReasons: string[] = [];
    const skippedClaimIds: string[] = [];

    if (body?.claimId && body?.claimType) {
      const sourceSystem = body?.sourceSystem as TSourceSystem;

      if (!sourceSystem) throw new Error("sourceSystem is required!");

      if (!["M", "P"].includes(sourceSystem))
        throw new Error(`Wrong sourceSystem: ${sourceSystem}`);

      const claimId = body?.claimId.toString();
      const claimType = body?.claimType;

      // It means it is single entry, sending the claimId and claimType from the browser
      const found: HydratedDocument<IDashboardData> | null =
        await DashboardData.findOne({
          claimId,
          claimType: convertClaimType(claimType),
        });

      totalRecords = 1;

      if (found) {
        if (found?.stage === NumericStage.REJECTED) {
          found.stage = NumericStage.IN_FIELD_REINVESTIGATION;
          found.dateOfFallingIntoReInvestigation = new Date();
          const newData = await found.save();
          return NextResponse.json(
            {
              success: true,
              message: `An existing record with this claim Id found as Rejected and sent it to In Field-Re-investigation`,
              data: newData,
            },
            { status: 200 }
          );
        }
        throw new Error(
          `Record with claimId of ${claimType}_${claimId} already exists in DashboardData`
        );
      } else {
        const data = await getFniData(claimId, claimType, sourceSystem);
        if (!data?.success) {
          throw new Error(
            `${data?.message} for claimId ${claimType}_${claimId}`
          );
        } else {
          const newlyInserted = await DashboardData.create({
            claimId,
            claimType: convertClaimType(claimType),
            referralType: "Manual",
            ...data?.data,
          });

          await performSystemPreQc(newlyInserted, fniManager);

          await CaseEvent.create({
            claimId,
            claimType: convertClaimType(claimType),
            contractNumber: data?.data?.contractDetails?.contractNo,
            membershipNumber: data?.data?.claimDetails?.memberNo,
            pivotalCustomerId: data?.data?.claimDetails?.pivotalCustomerId,
            eventName: "Intimation/Referral",
            userName: "Maximus",
            eventRemarks: "Manual",
          });

          await newlyInserted.save();

          return NextResponse.json(
            {
              success: true,
              data: newlyInserted,
              message: "Successfully inserted",
            },
            { status: 201 }
          );
        }
      }
    } else {
      // This is multiple entries, which gets the claim ids from the api
      const sourceSystems = ["M", "P"] as const;

      for (const sourceSystem of sourceSystems) {
        const response = await getClaimIds(sourceSystem);

        if (!response?.success) {
          throw new Error(`Failed to get claim Ids, ${response?.message}`);
        }

        if (!!response.data) {
          for (let obj of response?.data) {
            // Check if the claim was previously rejected
            const foundLog = await DashboardFeedingLog.findOne({
              skippedClaimIds: obj?.claimId,
            });

            if (foundLog) {
              skipped += 1;
              skippedReasons?.push(
                `The case is found in already rejected list for ${obj.Claims}`
              );
              skippedClaimIds?.push(obj?.claimId);
            } else {
              // Check if the claim is already in the db if not, store it otherwise don't
              const foundDashboardData: HydratedDocument<IDashboardData> | null =
                await DashboardData.findOne({
                  claimId: obj?.claimId,
                  claimType: convertClaimType(obj?.claimType),
                });
              if (!foundDashboardData) {
                const data = await getFniData(
                  obj?.claimId,
                  obj?.claimType,
                  sourceSystem
                );
                if (data?.success) {
                  const newData = await DashboardData.create({
                    claimId: obj?.claimId,
                    claimType: convertClaimType(obj?.claimType),
                    claimSubType: obj?.claimSubType,
                    benefitType: obj?.benefitType,
                    lossType: obj?.lossType?.trim(),
                    cataractOrDayCareProcedure: obj?.cataractOrDayCareProcedure,
                    referralType: "API",
                    ...data?.data,
                  });

                  await performSystemPreQc(newData, fniManager);

                  await CaseEvent.create({
                    claimId: obj?.claimId,
                    claimType: convertClaimType(obj?.claimType),
                    contractNumber: data?.data?.contractDetails?.contractNo,
                    membershipNumber: data?.data?.claimDetails?.memberNo,
                    pivotalCustomerId:
                      data?.data?.claimDetails?.pivotalCustomerId,
                    eventName: "Intimation/Referral",
                    userName: "Maximus",
                    eventRemarks: "API",
                  });

                  await newData.save();

                  inserted += 1;
                } else {
                  skipped += 1;
                  skippedReasons?.push(
                    `${data?.message} for claimId ${obj?.claimType}_${obj?.claimId}`
                  );
                  skippedClaimIds?.push(obj?.claimId);
                }
              } else {
                if (foundDashboardData?.stage === NumericStage.REJECTED) {
                  foundDashboardData.stage =
                    NumericStage.IN_FIELD_REINVESTIGATION;
                  foundDashboardData.dateOfFallingIntoReInvestigation =
                    new Date();
                  await foundDashboardData.save();
                } else {
                  skipped += 1;
                  skippedReasons?.push(
                    `Case already exist for claimId: ${obj?.claimType}_${obj?.claimId}`
                  );
                  skippedClaimIds?.push(obj?.claimId);
                }
              }
            }
          }

          totalRecords = response?.data?.length;
        }
      }
    }

    await DashboardFeedingLog.create({
      totalRecords,
      insertedRecords: inserted,
      skippedRecords: skipped,
      foundAndUpdatedRecords: foundAndUpdated,
      skippedReasons,
      skippedClaimIds,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Fetched",
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
