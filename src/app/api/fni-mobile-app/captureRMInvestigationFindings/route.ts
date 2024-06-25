import ClaimCase from "@/lib/Models/claimCase";
import DashboardData from "@/lib/Models/dashboardData";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import {
  CaseDetail,
  IDashboardData,
  Task,
} from "@/lib/utils/types/fniDataTypes";
import { IRMFindings } from "@/lib/utils/types/rmDataTypes";
import { HydratedDocument, Types } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const { id, name, payload, isQa } = await req?.json();

  try {
    if (!id) throw new Error("id is required");
    if (!name) throw new Error("name is required");

    await connectDB(Databases.FNI);

    const taskName: keyof IRMFindings | "TheCommonForm" = name;

    const claimCase: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(id);

    if (!claimCase) throw new Error(`No Date found with the id ${id}`);

    const tempFindings: IRMFindings = claimCase?.rmFindings || {};
    const tempFindingsQa: IRMFindings = claimCase?.rmFindingsPostQA || {};

    if (taskName === "TheCommonForm") {
      const discObserved = payload?.discrepanciesOrIrregularitiesObserved || "";
      const invSummary = payload?.investigationSummary || "";

      if (isQa) {
        tempFindingsQa.discrepanciesOrIrregularitiesObserved = discObserved;
        tempFindingsQa.investigationSummary = invSummary;
        tempFindingsQa.recommendation = payload?.recommendation || null;
        tempFindingsQa.otherRecommendation =
          payload?.otherRecommendation || null;
      } else {
        tempFindings.discrepanciesOrIrregularitiesObserved = discObserved;
        tempFindingsQa.discrepanciesOrIrregularitiesObserved = discObserved;
        tempFindings.investigationSummary = invSummary;
        tempFindingsQa.investigationSummary = invSummary;
        tempFindings.recommendation = payload?.recommendation || null;
        tempFindingsQa.recommendation = payload?.recommendation || null;
        tempFindings.otherRecommendation = payload?.otherRecommendation || null;
        tempFindingsQa.otherRecommendation =
          payload?.otherRecommendation || null;

        if (tempFindings?.recommendation?.value) {
          const dashboardData: HydratedDocument<IDashboardData> | null =
            await DashboardData.findOne({
              caseId: new Types.ObjectId(id),
            });

          if (!dashboardData)
            throw new Error(
              `Failed to find dashboardData with the caseId ${id}`
            );

          dashboardData.investigatorRecommendation =
            tempFindings?.recommendation?.value;
          await dashboardData.save();
        }
      }
    } else {
      if (isQa) {
        tempFindingsQa[taskName] = payload;
      } else {
        tempFindings[taskName] = payload;
        tempFindingsQa[taskName] = payload;
      }
    }

    if (isQa) {
      claimCase.rmFindingsPostQA = tempFindingsQa;
    } else {
      claimCase.rmFindings = tempFindings;
      claimCase.rmFindingsPostQA = tempFindingsQa;

      let tasks: Task[] = claimCase?.tasksAssigned || [];

      tasks = tasks?.map((el) =>
        el?.name === taskName ? { ...el, completed: true } : el
      );

      claimCase.tasksAssigned = tasks;
    }

    const data = await claimCase.save();

    return NextResponse.json(
      {
        success: true,
        message: "Values saved successfully",
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
