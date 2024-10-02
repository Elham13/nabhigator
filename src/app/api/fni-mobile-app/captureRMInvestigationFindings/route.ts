import ClaimCase from "@/lib/Models/claimCase";
import DashboardData from "@/lib/Models/dashboardData";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { CaseDetail, Task } from "@/lib/utils/types/fniDataTypes";
import { IRMFindings } from "@/lib/utils/types/rmDataTypes";
import { HydratedDocument, Types } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { hasValue } from "./helpers";
import { Document } from "mongoose";

const router = createEdgeRouter<NextRequest, {}>();

const commonFormKeys = [
  "investigationSummary",
  "discrepanciesOrIrregularitiesObserved",
  "recommendation",
  "otherRecommendation",
] as const;

router.post(async (req) => {
  const { id, name, payload, isQa, userId } = await req?.json();

  try {
    if (!id) throw new Error("id is required");
    if (!name) throw new Error("name is required");

    await connectDB(Databases.FNI);

    const taskName: keyof IRMFindings | "TheCommonForm" = name;

    const claimCase: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(id);

    if (!claimCase) throw new Error(`No Date found with the id ${id}`);

    let tempFindings: IRMFindings = {};
    let tempFindingsQa: IRMFindings = {};

    if (claimCase?.allocationType === "Dual" && !userId)
      throw new Error("userId is required");

    const tasksAndDocsIndex =
      claimCase?.allocationType === "Single"
        ? 0
        : claimCase?.tasksAndDocs?.findIndex(
            (el) => el?.investigator?.toString() === userId
          );

    if (tasksAndDocsIndex < 0)
      throw new Error(`No tasks found with the userId ${userId}`);

    tempFindings = claimCase?.tasksAndDocs[tasksAndDocsIndex]?.rmFindings || {};
    tempFindingsQa =
      claimCase?.tasksAndDocs[tasksAndDocsIndex]?.rmFindingsPostQA || {};

    if (hasValue(payload?.key) && hasValue(payload?.value)) {
      const key = payload.key as keyof IRMFindings;

      if (taskName === "TheCommonForm") {
        const findings = isQa ? tempFindingsQa : tempFindings;

        findings[key] = payload.value;

        if (!isQa && key === "recommendation" && !!payload?.value) {
          const dashboardData = await DashboardData.findOne({
            caseId: new Types.ObjectId(id),
          });

          if (!dashboardData) {
            throw new Error(
              `Failed to find dashboardData with the caseId ${id}`
            );
          }

          dashboardData.investigatorRecommendation = payload?.value?.value;
          await dashboardData.save();
        }
      } else {
        let taskObj: any = isQa
          ? tempFindingsQa[taskName] || {}
          : tempFindings[taskName] || {};

        taskObj[key] = payload?.value;

        if (isQa) {
          tempFindingsQa[taskName] = taskObj;
        } else {
          tempFindings[taskName] = taskObj;
          tempFindingsQa[taskName] = taskObj;
        }
      }
      if (isQa) {
        claimCase.tasksAndDocs[tasksAndDocsIndex].rmFindingsPostQA =
          tempFindingsQa;
      } else {
        claimCase.tasksAndDocs[tasksAndDocsIndex].rmFindings = tempFindings;
        claimCase.tasksAndDocs[tasksAndDocsIndex].rmFindingsPostQA =
          tempFindingsQa;

        let tasksCompleted = false;

        if (taskName === "TheCommonForm") {
          let tempCompleted = true;
          for (let key of commonFormKeys) {
            const tfs =
              tempFindings instanceof Document
                ? tempFindings?.toJSON()
                : tempFindings;
            const value = tfs[key];
            if (!hasValue(value)) {
              tempCompleted = false;
              break;
            }
          }
          tasksCompleted = tempCompleted;
        } else {
          const tfs =
            tempFindings instanceof Document
              ? tempFindings.toJSON()
              : tempFindings;
          const obj = tfs[taskName];
          if (hasValue(obj)) tasksCompleted = true;
        }

        let tasks: Task[] =
          claimCase?.tasksAndDocs[tasksAndDocsIndex]?.tasks || [];

        tasks = tasks?.map((el) =>
          el?.name === taskName && tasksCompleted
            ? { ...el, completed: true }
            : el
        );

        claimCase.tasksAndDocs[tasksAndDocsIndex].tasks = tasks;
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
    }
    return NextResponse.json(
      {
        success: true,
        message: "Nothing changed",
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
