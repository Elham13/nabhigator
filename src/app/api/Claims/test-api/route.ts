import ClaimCase from "@/lib/Models/claimCase";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import DashboardData from "@/lib/Models/dashboardData";
import { HydratedDocument } from "mongoose";
import {
  CaseDetail,
  EventNames,
  IDashboardData,
  IUser,
  IZoneStateMaster,
  NumericStage,
  Role,
} from "@/lib/utils/types/fniDataTypes";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import User from "@/lib/Models/user";
import NewPinCodeMaster from "@/lib/Models/newPinCodeMaster";
import NewStateDistrictMaster from "@/lib/Models/newStateDistrictMaster";
import ZoneStateMaster from "@/lib/Models/zoneStateMaster";
import ZoneMaster from "@/lib/Models/zoneMaster";
import CaseEvent from "@/lib/Models/caseEvent";
import { buildMaximusUrl } from "@/lib/helpers/wdmsHelpers";
import axios from "axios";
import { IGetFNIData } from "@/lib/utils/types/maximusResponseTypes";
import UnwantedFNIData from "@/lib/Models/uwantedFNIData";

// dayjs.extend(utc);
// dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  try {
    await connectDB(Databases.FNI);

    // const allCases: any = await ClaimCase.find({});

    // const updatedIds = [];

    // for (let obj of allCases) {
    //   obj.preQcObservation = obj?.preQcObservation || "Testing";

    //   if (obj?.allocationType === "Single") {
    //     const investigator =
    //       !!obj?.investigator && obj?.investigator?.length > 0
    //         ? obj?.investigator[0]
    //         : null;

    //     obj.singleTasksAndDocs = {
    //       tasks: obj?.tasksAssigned,
    //       docs: obj?.documents,
    //       investigationRejected: obj?.investigationRejected,
    //       investigator,
    //       investigatorComment: obj?.investigatorComment,
    //       outSourcingDate: obj?.outSourcingDate,
    //       invReportReceivedDate: obj?.invReportReceivedDate,
    //       preAuthFindings: obj?.investigationFindings,
    //       preAuthFindingsPostQa: obj?.postQaFindings,
    //       rmFindings: obj?.rmFindings,
    //       rmFindingsPostQA: obj?.rmFindingsPostQA,
    //     };
    //   } else if (obj?.allocationType === "Dual") {
    //     let investigator =
    //       !!obj?.investigator && obj?.investigator?.length > 0
    //         ? obj?.investigator[0]
    //         : null;
    //     obj.insuredTasksAndDocs = {
    //       tasks: obj?.tasksAssigned,
    //       docs: obj?.documents,
    //       investigationRejected: obj?.investigationRejected,
    //       investigator,
    //       investigatorComment: obj?.investigatorComment,
    //       outSourcingDate: obj?.outSourcingDate,
    //       invReportReceivedDate: obj?.invReportReceivedDate,
    //       preAuthFindings: obj?.investigationFindings,
    //       preAuthFindingsPostQa: obj?.postQaFindings,
    //       rmFindings: obj?.rmFindings,
    //       rmFindingsPostQA: obj?.rmFindingsPostQA,
    //     };

    //     investigator =
    //       !!obj?.investigator && obj?.investigator?.length > 1
    //         ? obj?.investigator[1]
    //         : null;
    //     obj.hospitalTasksAndDocs = {
    //       tasks: obj?.tasksAssigned,
    //       docs: obj?.documents,
    //       investigationRejected: obj?.investigationRejected,
    //       investigator,
    //       investigatorComment: obj?.investigatorComment,
    //       outSourcingDate: obj?.outSourcingDate,
    //       invReportReceivedDate: obj?.invReportReceivedDate,
    //       preAuthFindings: obj?.investigationFindings,
    //       preAuthFindingsPostQa: obj?.postQaFindings,
    //       rmFindings: obj?.rmFindings,
    //       rmFindingsPostQA: obj?.rmFindingsPostQA,
    //     };
    //   }
    //   await obj.save();
    //   updatedIds.push(obj?._id);
    // }

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
