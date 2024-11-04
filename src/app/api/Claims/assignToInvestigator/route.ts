import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases, FromEmails } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import {
  AssignToInvestigatorRes,
  IUser,
  IDashboardData as DashboardDataType,
  NumericStage,
  EventNames,
  Investigator,
  ClaimInvestigator,
} from "@/lib/utils/types/fniDataTypes";
import { HydratedDocument } from "mongoose";
import DashboardData from "@/lib/Models/dashboardData";
import {
  tellMaximusCaseIsAssigned,
  updateInvestigators,
} from "@/lib/helpers/autoPreQCHelpers";
import ClaimCase from "@/lib/Models/claimCase";
import { captureCaseEvent } from "../caseEvent/helpers";
import { compareArrOfObjBasedOnProp } from "@/lib/helpers";
import User from "@/lib/Models/user";
import sendEmail from "@/lib/helpers/sendEmail";
import { defineInvestigator } from "@/lib/helpers/assignToInvHelpers";
import { IUpdateInvReturnType } from "@/lib/utils/types/apiTypes";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();

  const { dashboardDataId, allocationType } = body;

  const isManual =
    allocationType === "Single"
      ? !!body?.singleTasksAndDocs?.investigator
      : allocationType === "Dual"
      ? !!body?.insuredTasksAndDocs?.investigator &&
        !!body?.hospitalTasksAndDocs?.investigator
      : false;

  const user: IUser = body?.user;
  delete body.user;

  const responseObj: AssignToInvestigatorRes = {
    success: true,
    message: "Update success",
    data: [],
  };
  let statusCode = 200;

  interface IDashboardData extends Omit<DashboardDataType, "caseId"> {
    caseId: string;
  }

  try {
    if (!dashboardDataId) throw new Error("dashboardDataId is missing");

    await connectDB(Databases.FNI);

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findById(dashboardDataId);

    if (!dashboardData)
      throw new Error(
        `No record found with the dashboardDataId ${dashboardDataId}`
      );

    let investigators: Investigator[] = [];

    while (true) {
      const defineInvRes = await defineInvestigator({
        body,
        dashboardData,
        user,
      });

      if (!defineInvRes?.success) throw new Error(defineInvRes?.message);
      if (defineInvRes?.shouldSendRes) {
        return NextResponse.json(
          {
            ...responseObj,
            message: defineInvRes?.message,
            data: defineInvRes?.investigators,
          },
          { status: statusCode }
        );
      }

      investigators = !!defineInvRes?.investigators
        ? Array.isArray(defineInvRes?.investigators)
          ? defineInvRes?.investigators
          : [defineInvRes?.investigators]
        : [];

      const tempRes: IUpdateInvReturnType = {
        success: true,
        message: "Update Success",
        recycle: false,
      };

      // if (!tempRes.recycle) break;
      break;
    }

    const isReInvestigated = dashboardData?.claimInvestigators?.length > 0;

    let newCase: any = null;
    if (allocationType === "Single") {
      body.singleTasksAndDocs.docs = body?.singleTasksAndDocs?.docs
        ? new Map(body?.singleTasksAndDocs?.docs)
        : [];
    } else {
      body.insuredTasksAndDocs.docs = body?.insuredTasksAndDocs?.docs
        ? new Map(body?.insuredTasksAndDocs?.docs)
        : [];
      body.hospitalTasksAndDocs.docs = body?.hospitalTasksAndDocs?.docs
        ? new Map(body?.hospitalTasksAndDocs?.docs)
        : [];
    }
    if (dashboardData?.caseId) {
      await ClaimCase.findByIdAndUpdate(
        dashboardData?.caseId,
        {
          ...body,
          intimationDate: dashboardData?.intimationDate,
          assignedBy: user?._id,
          outSourcingDate: new Date(),
        },
        { useFindAndModify: false }
      );
    } else {
      newCase = new ClaimCase({
        ...body,
        intimationDate: dashboardData?.intimationDate,
        assignedBy: user?._id,
        outSourcingDate: new Date(),
      });
      dashboardData.caseId = newCase?._id;
    }
    dashboardData.isReInvestigated = isReInvestigated;
    dashboardData.investigationCount += 1;
    dashboardData.allocationType = allocationType;
    dashboardData.dateOfOS = new Date();

    if (
      dashboardData.stage === NumericStage.POST_QC &&
      compareArrOfObjBasedOnProp(
        dashboardData?.claimInvestigators || [],
        investigators || [],
        "name",
        "investigatorName"
      )
    ) {
      dashboardData.stage = NumericStage.IN_FIELD_REWORK;
    } else {
      dashboardData.stage = NumericStage.IN_FIELD_FRESH;
    }

    dashboardData.teamLead = dashboardData.teamLead || null;

    if (allocationType === "Single") {
      dashboardData.claimInvestigators = investigators?.map(
        (inv: Investigator, ind: number) => ({
          _id: inv?._id,
          name: inv.investigatorName,
          assignedFor: "",
          assignedData: new Date(),
          investigationStatus: "Assigned",
        })
      );
    } else if (allocationType === "Dual") {
      const invs: ClaimInvestigator[] = [];

      if (!!body?.insuredTasksAndDocs?.investigator) {
        const inv = investigators?.find(
          (inv: Investigator) =>
            inv?._id?.toString() === body?.insuredTasksAndDocs?.investigator
        );
        if (inv) {
          invs?.push({
            _id: inv?._id,
            name: inv?.investigatorName,
            assignedFor: "Insured",
            assignedData: new Date(),
            investigationStatus: "Assigned",
          });
        }
      }

      if (!!body?.hospitalTasksAndDocs?.investigator) {
        const inv = investigators?.find(
          (inv: Investigator) =>
            inv?._id?.toString() === body?.hospitalTasksAndDocs?.investigator
        );

        if (inv) {
          invs?.push({
            _id: inv?._id,
            name: inv?.investigatorName,
            assignedFor: "Hospital",
            assignedData: new Date(),
            investigationStatus: "Assigned",
          });
        }
      }

      dashboardData.claimInvestigators = invs;
    }

    const maximusRes = await tellMaximusCaseIsAssigned(
      dashboardData?.toJSON(),
      investigators[0],
      body?.preQcObservation,
      user?.email
    );

    if (!maximusRes?.success)
      throw new Error(`Maximus Error: ${maximusRes.message}`);

    responseObj.message = `Case assigned to ${
      allocationType === "Dual"
        ? investigators[0].investigatorName +
          " and " +
          investigators[1].investigatorName
        : investigators[0].investigatorName
    }`;
    responseObj.data = investigators;

    if (newCase !== null) await newCase.save();
    await dashboardData.save();

    await captureCaseEvent({
      eventName: isManual
        ? EventNames.MANUAL_ALLOCATION
        : EventNames.AUTO_ALLOCATION,
      eventRemarks:
        allocationType === "Single"
          ? `Assigned to ${investigators[0]?.investigatorName}`
          : `Assigned to ${investigators
              ?.map((el: Investigator) => el.investigatorName)
              ?.join(", ")}`,
      intimationDate:
        dashboardData?.intimationDate ||
        dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      stage:
        isReInvestigated &&
        compareArrOfObjBasedOnProp(
          dashboardData?.claimInvestigators || [],
          investigators || [],
          "name",
          "investigatorName"
        )
          ? NumericStage.IN_FIELD_REWORK
          : NumericStage.IN_FIELD_FRESH,
      claimId: dashboardData?.claimId,
      userId: isManual ? user?._id : undefined,
      userName: isManual ? user?.name : "FNI System",
      investigatorIds: investigators?.map((el: Investigator) => el?._id),
    });

    // Update investigators daily and/or monthly assign and send email
    for (let i = 0; i < investigators?.length; i++) {
      const inv = investigators[i];
      const updateRes = await updateInvestigators(inv);
      if (!updateRes?.success) throw new Error(updateRes?.message);

      // TODO: Fix this
      // if (updateRes?.recycle) {
      //   if (isManual) {
      //     throw new Error(
      //       `The ${updateRes?.type} limit of the investigator (${updateRes?.invName}) is reached please select a different investigator.`
      //     );
      //   }
      //   tempRes.recycle = true;
      //   investigators = [];
      //   break;
      // }

      inv?.email?.length > 0 &&
        inv?.email?.map(async (mail: string) => {
          const cc_recipients: string[] = ["FIAllocation@nivabupa.com"];
          if (dashboardData?.teamLead) {
            const tl = await User.findById(dashboardData?.teamLead);
            if (tl) cc_recipients?.push(tl?.email);
          }
          if (dashboardData?.clusterManager) {
            const cm = await User.findById(dashboardData?.clusterManager);
            if (cm) cc_recipients?.push(cm?.email);
          }
          await sendEmail({
            from: FromEmails.DO_NOT_REPLY,
            recipients: mail,
            cc_recipients,
            subject: `New Case assigned (${dashboardData?.claimId}_${dashboardData?.claimType})`,
            bodyText: `Dear ${inv?.investigatorName} \nA new case has been assigned to you with the id ${dashboardData?.claimId}\n\n\nWish you best of luck\nNabhigator`,
          });
        });
    }

    return NextResponse.json(responseObj, { status: statusCode });
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
