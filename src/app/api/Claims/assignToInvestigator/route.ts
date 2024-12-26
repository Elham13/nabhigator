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
  CaseDetail,
  DocumentMap,
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
import {
  defineInvestigator,
  removeDuplicatesFrom2DArray,
  removeDuplicatesFromArrayOfObjects,
} from "@/lib/helpers/assignToInvHelpers";
import { IUpdateInvReturnType } from "@/lib/utils/types/apiTypes";
import { LiaEthernetSolid } from "react-icons/lia";

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

    let claimCase: HydratedDocument<CaseDetail> | null = null;
    if (dashboardData?.caseId)
      claimCase = await ClaimCase.findById(dashboardData.caseId);

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

    const isReInvestigated =
      !dashboardData?.isReInvestigated &&
      dashboardData?.stage === NumericStage.IN_FIELD_REINVESTIGATION;

    let existingClaimCase: any = null;
    if (allocationType === "Single") {
      let docsArr = body?.singleTasksAndDocs?.docs || [];
      let tempTasks: any[] = body?.singleTasksAndDocs?.tasks;
      if (isReInvestigated) {
        if (!claimCase)
          throw new Error(
            `Failed to find case detail with the id ${dashboardData?.caseId}`
          );
        existingClaimCase = claimCase.toJSON();

        if (
          existingClaimCase?.singleTasksAndDocs?.docs &&
          existingClaimCase?.singleTasksAndDocs?.tasks?.length > 0
        ) {
          const savedDocs = Object.entries(
            existingClaimCase?.singleTasksAndDocs?.docs
          );

          docsArr = [...savedDocs, ...docsArr];
          tempTasks = [
            ...(existingClaimCase?.singleTasksAndDocs?.tasks || []),
            ...(body?.singleTasksAndDocs?.tasks || []),
          ];
          tempTasks = removeDuplicatesFromArrayOfObjects(tempTasks, "name");
        }

        docsArr.push([
          "Re-Investigation Uploads",
          [
            {
              docUrl: [],
              hiddenDocUrls: [],
              location: null,
              name: "Re-Investigation Uploads",
              replacedDocUrls: [],
            },
          ],
        ]);

        docsArr = removeDuplicatesFrom2DArray(docsArr);
        body.singleTasksAndDocs = {
          ...existingClaimCase?.singleTasksAndDocs,
          tasks: tempTasks,
          docs: docsArr?.length > 0 ? new Map(docsArr) : new Map([]),
        };
      } else {
        body.singleTasksAndDocs.docs =
          docsArr?.length > 0 ? new Map(docsArr) : new Map([]);
      }
    } else {
      let insuredDocsArr = body?.insuredTasksAndDocs?.docs || [];
      let insuredTempTasks: any[] = body?.insuredTasksAndDocs?.tasks;
      let hospitalDocsArr = body?.hospitalTasksAndDocs?.docs || [];
      let hospitalTempTasks: any[] = body?.hospitalTasksAndDocs?.tasks;

      if (isReInvestigated) {
        if (!claimCase)
          throw new Error(
            `Failed to find case detail with the id ${dashboardData?.caseId}`
          );
        existingClaimCase = claimCase.toJSON();

        if (
          existingClaimCase?.insuredTasksAndDocs?.docs &&
          existingClaimCase?.insuredTasksAndDocs?.tasks?.length > 0
        ) {
          const savedDocsInsured = Object.entries(
            existingClaimCase?.insuredTasksAndDocs?.docs
          );

          insuredDocsArr = [...savedDocsInsured, ...insuredDocsArr];
          insuredTempTasks = [
            ...(existingClaimCase?.insuredTasksAndDocs?.tasks || []),
            ...(body?.insuredTasksAndDocs?.tasks || []),
          ];
          insuredTempTasks = removeDuplicatesFromArrayOfObjects(
            insuredTempTasks,
            "name"
          );
        }
        if (
          existingClaimCase?.hospitalTasksAndDocs?.docs &&
          existingClaimCase?.hospitalTasksAndDocs?.tasks?.length > 0
        ) {
          const savedDocsHospital = Object.entries(
            existingClaimCase?.hospitalTasksAndDocs?.docs
          );

          hospitalDocsArr = [...savedDocsHospital, ...hospitalDocsArr];
          hospitalTempTasks = [
            ...(existingClaimCase?.hospitalTasksAndDocs?.tasks || []),
            ...(body?.hospitalTasksAndDocs?.tasks || []),
          ];
          hospitalTempTasks = removeDuplicatesFromArrayOfObjects(
            hospitalTempTasks,
            "name"
          );
        }

        hospitalDocsArr.push([
          "Re-Investigation Uploads",
          [
            {
              docUrl: [],
              hiddenDocUrls: [],
              location: null,
              name: "Re-Investigation Uploads",
              replacedDocUrls: [],
            },
          ],
        ]);
        insuredDocsArr = removeDuplicatesFrom2DArray(insuredDocsArr);
        hospitalDocsArr = removeDuplicatesFrom2DArray(hospitalDocsArr);

        body.insuredTasksAndDocs = {
          ...existingClaimCase?.insuredTasksAndDocs,
          tasks: insuredTempTasks,
          docs:
            insuredDocsArr?.length > 0 ? new Map(insuredDocsArr) : new Map([]),
        };
        body.hospitalTasksAndDocs = {
          ...existingClaimCase?.hospitalTasksAndDocs,
          tasks: hospitalTempTasks,
          docs:
            hospitalDocsArr?.length > 0
              ? new Map(hospitalDocsArr)
              : new Map([]),
        };
      } else {
        body.insuredTasksAndDocs.docs =
          insuredDocsArr?.length > 0 ? new Map(insuredDocsArr) : new Map([]);
        body.hospitalTasksAndDocs.docs =
          hospitalDocsArr?.length > 0 ? new Map(hospitalDocsArr) : new Map([]);
      }
    }

    // return NextResponse.json(responseObj, { status: 400 });

    if (claimCase) {
      claimCase.set({
        ...body,
        assignedBy: user?._id,
        outSourcingDate: new Date(),
      });
    } else {
      claimCase = new ClaimCase({
        ...body,
        intimationDate: dashboardData?.intimationDate,
        assignedBy: user?._id,
        outSourcingDate: new Date(),
      });
      dashboardData.caseId = claimCase?._id as string;
    }

    if (!claimCase)
      throw new Error(
        `Failed to find a claimCase with the id: ${dashboardData?.caseId}`
      );
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
        (inv: Investigator) => ({
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

    if (process.env.NEXT_PUBLIC_CONFIG !== "LOCAL") {
      const maximusRes = await tellMaximusCaseIsAssigned(
        dashboardData?.toJSON(),
        investigators[0],
        body?.preQcObservation,
        user?.email
      );

      if (!maximusRes?.success)
        throw new Error(`Maximus Error: ${maximusRes.message}`);
    }

    responseObj.message = `Case assigned to ${
      allocationType === "Dual"
        ? investigators[0].investigatorName +
          " and " +
          investigators[1].investigatorName
        : investigators[0].investigatorName
    }`;
    responseObj.data = investigators;

    await claimCase.save();
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
      const updateRes = await updateInvestigators(
        inv,
        dashboardData?.claimId,
        dashboardData?.claimType
      );
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

      if (process.env.NEXT_PUBLIC_CONFIG !== "LOCAL") {
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
