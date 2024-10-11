import { HydratedDocument, ObjectId, PipelineStage, Types } from "mongoose";
import dayjs from "dayjs";
import axios from "axios";
import {
  AdmissionType,
  IDashboardData,
  IMaximusResponseLog,
  Investigator,
} from "../utils/types/fniDataTypes";
import ClaimInvestigator from "../Models/claimInvestigator";
import { buildMaximusUrl } from "./wdmsHelpers";
import { EndPoints } from "../utils/types/enums";
import {
  GetAuthRes,
  IUpdateFNIDetailsRes,
} from "../utils/types/maximusResponseTypes";
import MaximusResponseLog from "../Models/maximusResponseLog";
import {
  IAllocationType,
  IFindInvestigatorReturnType,
  IFindInvestigatorsProps,
  IUpdateInvReturnType,
} from "../utils/types/apiTypes";

export const getAllocationType = (data: IDashboardData) => {
  const payload: IAllocationType = {
    allocationType: "Single",
    investigatorType: "Internal",
    fallbackAllocationType: {
      allocationType: "Single",
      investigatorType: "Internal",
    },
  };

  if (data?.claimType === "PreAuth") {
    if (
      [AdmissionType.PLANNED, AdmissionType.POST_FACTO].includes(
        data?.hospitalizationDetails?.admissionType
      )
    ) {
      if (
        data?.insuredDetails?.state?.toLowerCase() ===
        data?.hospitalDetails?.providerState?.toLowerCase()
      ) {
        payload.allocationType = "Single";
      } else {
        payload.allocationType = "Single";
        payload.investigatorType = "External";
        payload.fallbackAllocationType = {
          allocationType: "Dual",
          investigatorType: "Internal",
        };
      }
    }
  }

  return payload;
};

export const claimCasePayload = {
  allocationType: "Single",
  caseType: ["PED/NDC", "Genuineness"],
  caseTypeDependencies: {},
  caseStatus: "Accepted",
  dashboardDataId: "ID_TO_REPLACE",
  preQcObservation: "This is system pre qc",
  singleTasksAndDocs: {
    docs: {
      "Pre-Auth Investigation": [
        {
          name: "Insured/Attendant Part Documents",
          docUrl: [],
        hiddenDocUrls: [],
        replacedDocUrls: [],
          location: null,
        },
        {
          name: "Hospital Part Documents",
          docUrl: [],
        hiddenDocUrls: [],
        replacedDocUrls: [],
          location: null,
        },
        {
          name: "GPS Location",
          docUrl: [],
        hiddenDocUrls: [],
        replacedDocUrls: [],
          location: null,
        },
      ],
    },
    tasks: [{ name: "Pre-Auth Investigation", completed: false, comment: "" }],
  },
  insuredAddress: "",
  insuredCity: "",
  insuredState: "",
  insuredPinCode: 0,
  allocatorComment: "",
  user: {
    config: { leadView: [] },
    leave: { fromDate: null, toDate: null, status: "" },
    updates: { userIsInformed: true },
    name: "Manish Baweja",
    email: "ManishBaweja@gmail.com",
    phone: "9346240722",
    userId: "P000000",
    password: "abc123",
    role: ["Admin"],
    status: "Active",
    userType: "Internal",
    team: null,
    location: "Noida- NOC",
    state: ["Uttar Pradesh"],
    createdAt: "2023-12-07T08:21:04.330Z",
    updatedAt: "2023-12-21T10:51:10.722Z",
    __v: 1,
    activeRole: "Admin",
  },
};

const getDualInvestigators = async (
  data: IDashboardData,
  excludedIds?: ObjectId[]
) => {
  let investigators: Investigator[] = [];
  const claimId = data?.claimId;
  const claimSubType = data?.claimSubType;
  const claimType = data?.claimType;
  const provider = data?.hospitalDetails;

  const matchStage: PipelineStage.Match["$match"] = {
    rejectedCases: { $ne: claimId },
    userStatus: "active",
    role: { $ne: "TeamMate" },
    $or: [
      {
        assignmentPreferred: { $regex: new RegExp(claimSubType, "i") },
      },
      { assignmentPreferred: { $regex: new RegExp(claimType, "i") } },
    ],
    $expr: {
      $and: [
        { $lte: ["$dailyAssign", "$dailyThreshold"] },
        { $lte: ["$monthlyAssigned", "$monthlyThreshold"] },
      ],
    },
  };

  if (excludedIds && excludedIds?.length > 0) {
    matchStage["_id"] = { $nin: excludedIds };
  }

  const pipeline: PipelineStage[] = [
    {
      $match: matchStage,
    },
    { $sort: { dailyAssign: 1, performance: -1 } },
    { $limit: 2 },
  ];

  for (let i = 0; i < 2; i++) {
    if (provider?.providerName) {
      // @ts-ignore
      pipeline[0]["$match"].providers = {
        $regex: new RegExp(provider?.providerName, "i"),
      };
    }

    investigators = await ClaimInvestigator.aggregate(pipeline);

    if (investigators && investigators?.length > 1) return investigators;

    // @ts-ignore
    delete pipeline[0]["$match"].providers;

    // @ts-ignore
    pipeline[0]["$match"].pinCodes = {
      $exists: true,
      $not: { $size: 0 },
      $in: ["All", provider?.pinCode],
    };
    investigators = await ClaimInvestigator.aggregate(pipeline);

    if (investigators && investigators?.length > 1) return investigators;

    // @ts-ignore
    delete pipeline[0]["$match"].pinCodes;

    // @ts-ignore
    pipeline[0]["$match"].cities = {
      $exists: true,
      $not: { $size: 0 },
      $in: ["All", provider?.providerCity],
    };

    investigators = await ClaimInvestigator.aggregate(pipeline);

    if (investigators && investigators?.length > 1) return investigators;

    // @ts-ignore
    delete pipeline[0]["$match"].cities;
    // @ts-ignore
    pipeline[0]["$match"].states = {
      $exists: true,
      $not: { $size: 0 },
      $in: ["All", provider?.providerState],
    };
    investigators = await ClaimInvestigator.aggregate(pipeline);

    if (investigators && investigators?.length > 1) return investigators;

    // @ts-ignore
    delete pipeline[0]["$match"].states;
    // @ts-ignore
    pipeline[0]["$match"].Type = { $in: ["Internal", "External"] };
  }

  return investigators;
};

export const findInvestigators = async (
  props: IFindInvestigatorsProps
): Promise<IFindInvestigatorReturnType> => {
  const { allocation, dashboardData, excludedIds } = props;
  const { claimId, claimType, claimSubType } = dashboardData;
  const provider = dashboardData.hospitalDetails;

  const response: IFindInvestigatorReturnType = {
    success: true,
    investigators: [],
    message: "Found successfully",
  };

  try {
    if (
      !provider?.providerState ||
      !provider?.providerCity ||
      !allocation.allocationType
    )
      throw new Error(
        "Provider State and Provider City and Allocation type is required"
      );

    if (allocation.allocationType === "Single") {
      const matchStage: PipelineStage.Match["$match"] = {
        rejectedCases: { $ne: claimId },
        userStatus: "active",
        role: { $ne: "TeamMate" },
        $or: [
          {
            assignmentPreferred: { $regex: new RegExp(claimSubType, "i") },
          },
          { assignmentPreferred: { $regex: new RegExp(claimType, "i") } },
        ],
        $expr: {
          $and: [
            { $lte: ["$dailyAssign", "$dailyThreshold"] },
            { $lte: ["$monthlyAssigned", "$monthlyThreshold"] },
          ],
        },
      };

      if (excludedIds && excludedIds?.length > 0) {
        matchStage["_id"] = { $nin: excludedIds };
      }

      const pipeline: PipelineStage[] = [
        {
          $match: matchStage,
        },
        { $sort: { dailyAssign: 1, performance: -1 } },
        { $limit: 1 },
      ];

      for (let i = 0; i < 2; i++) {
        if (provider?.providerName) {
          // @ts-ignore
          pipeline[0]["$match"].providers = {
            $regex: new RegExp(provider?.providerName, "i"),
          };
        }

        response.investigators = await ClaimInvestigator.aggregate(pipeline);

        if (response.investigators && response.investigators?.length > 0)
          return response;

        // @ts-ignore
        delete pipeline[0]["$match"].providers;
        // @ts-ignore
        pipeline[0]["$match"].pinCodes = {
          $exists: true,
          $not: { $size: 0 },
          $in: ["All", provider?.pinCode],
        };

        response.investigators = await ClaimInvestigator.aggregate(pipeline);

        if (response.investigators && response.investigators?.length > 0)
          return response;
        // @ts-ignore
        delete pipeline[0]["$match"].pinCodes;
        // @ts-ignore
        pipeline[0]["$match"].cities = {
          $exists: true,
          $not: { $size: 0 },
          $in: ["All", provider?.providerCity],
        };
        response.investigators = await ClaimInvestigator.aggregate(pipeline);

        if (response.investigators && response.investigators?.length > 0)
          return response;

        // @ts-ignore
        delete pipeline[0]["$match"].cities;
        // @ts-ignore
        pipeline[0]["$match"].states = {
          $exists: true,
          $not: { $size: 0 },
          $in: ["All", provider?.providerState],
        };
        response.investigators = await ClaimInvestigator.aggregate(pipeline);

        if (response.investigators && response.investigators?.length > 0)
          return response;

        if (allocation?.fallbackAllocationType?.allocationType !== "Dual") {
          // @ts-ignore
          delete pipeline[0]["$match"].states;
          // @ts-ignore
          pipeline[0]["$match"].Type = { $in: ["Internal", "External"] };
        } else {
          response.investigators = await getDualInvestigators(
            dashboardData,
            excludedIds
          );
          break;
        }
      }
    } else {
      response.investigators = await getDualInvestigators(
        dashboardData,
        excludedIds
      );
    }

    if (
      !response?.investigators ||
      response?.investigators.length === 0 ||
      (response?.investigators.length < 2 &&
        allocation.allocationType === "Dual") ||
      (allocation?.fallbackAllocationType?.allocationType === "Dual" &&
        response?.investigators.length < 2)
    ) {
      throw new Error("No investigators found");
    }

    return response;
  } catch (error: any) {
    return { success: false, message: error?.message, investigators: [] };
  }
};

export const updateInvestigators = async (
  investigator: Investigator
): Promise<IUpdateInvReturnType> => {
  const payload: IUpdateInvReturnType = {
    success: true,
    message: "Update Success",
    recycle: false,
  };

  try {
    const inv: HydratedDocument<Investigator> | null =
      await ClaimInvestigator.findById(investigator?._id);

    if (!inv)
      throw new Error(
        `Failed to find an investigator with the id ${investigator?._id}`
      );

    const monthlyLimitReached =
      inv?.monthlyThreshold - inv?.monthlyAssigned <= 1;
    const dailyLimitReached = inv?.dailyThreshold - inv?.dailyAssign <= 1;

    if (monthlyLimitReached) {
      if (inv?.updatedDate) {
        const noOfMonthsSinceUpdated = dayjs()
          .startOf("month")
          .diff(dayjs(inv?.updatedDate).startOf("month"), "month");

        if (noOfMonthsSinceUpdated > 0) {
          // It is updated last month, therefore restart the monthly and daily assign
          inv.dailyAssign = 1;
          inv.monthlyAssigned = 1;
          inv.updatedDate = new Date();
          await inv.save();
        } else {
          // Means monthly assign limit reached for this month, don't let to assign, instead find another investigator
          payload.recycle = true;
          payload.excludedInv = inv?._id as unknown as ObjectId;
          payload.invName = inv?.investigatorName;
          payload.type = "monthly";
          return payload;
        }
      } else {
        // updatedDate is undefined, therefor we know it's the first time this investigator is getting assigned
        inv.dailyAssign = 1;
        inv.monthlyAssigned = 1;
        inv.updatedDate = new Date();
        await inv.save();
      }
    } else if (dailyLimitReached) {
      if (inv?.updatedDate) {
        const noOfDaysSinceUpdated = dayjs()
          .startOf("day")
          .diff(dayjs(inv?.updatedDate).startOf("day"), "day");
        if (noOfDaysSinceUpdated > 0) {
          // It is not updated today, therefor restart the daily assign and increase the monthly assign
          inv.dailyAssign = 1;
          inv.monthlyAssigned += 1;
          inv.updatedDate = new Date();
        } else {
          // daily assign limit reached, don't let to assign, instead find another investigator
          payload.recycle = true;
          payload.excludedInv = inv?._id as unknown as ObjectId;
          payload.invName = inv?.investigatorName;
          payload.type = "daily";
          return payload;
        }
      } else {
        // updatedDate is undefined/null, means it is the first time this investigator is getting assigned
        inv.dailyAssign = 1;
        inv.monthlyAssigned = 1;
        inv.updatedDate = new Date();
        await inv.save();
      }
    } else {
      // Neither monthly nor daily assign limit is reached
      inv.dailyAssign += 1;
      inv.monthlyAssigned += 1;
      inv.updatedDate = new Date();
      await inv.save();
    }

    return payload;
  } catch (error: any) {
    return { ...payload, message: error?.message };
  }
};

export const tellMaximusCaseIsAssigned = async (
  dData: IDashboardData,
  investigator: Investigator,
  remark: string,
  userEmail: string
) => {
  const logsPayload: IMaximusResponseLog = {
    api: "",
    originFileName: __filename,
    claimId: dData?.claimId,
    dashboardDataId: new Types.ObjectId(dData?._id?.toString()),
    requestBody: null,
    requestHeaders: null,
    responseBody: null,
    errorPayloadFromCatchBlock: null,
  };

  try {
    const payload = {
      Claimdetail: {
        CLAIM_NO: dData?.claimId?.toString(),
        CLAIM_TYPE: dData?.claimType === "PreAuth" ? "P" : "R",
        POLICY_NUMBER: "",
        SourceSystem: "M",
      },
      Case_Assignment: {
        CASE_ASSIGNMENT_FLAG: "1",
        ASSIGN_TO: investigator?.investigatorCode,
        TO_EMAIL: investigator?.email?.join(";"),
        CC_EMAIL: "FIallocation@maxbupa.com",
        REMARKS: remark,
        FRAUD_STATUS: "I",
        STATUS_Updates: "IV",
        Line_Of_Investigation: {
          CA_Hospital_Visit: "1",
          CA_Treating_Doctor_Visit: "1",
          CA_Insured_Visit: "1",
          CA_Meeting_Family_Physician: "1",
          CA_Pathology: "1",
          CA_Chemist: "1",
          CA_Relative: "1",
          CA_Neighbor: "1",
          CA_Vicinity: "1",
          CA_Employer_School_University: "1",
          CA_Other: "0",
          CA_OTHER_TEXT: "",
        },
      },
      Report_Sharing: {
        REPORT_SHARING_FLAG: "0",
        FINAL_OUTCOME: "",
        FRAUD_STATUS: "",
        RPT_SEND_TO_EMAIL: `FIallocation@nivabupa.com;PreAuth.Team@nivabupa.com;${userEmail}`,
        EXECUTIVE_SUMMARY: "",
        RECOMMENDATION: "",
        quality_Check: {
          RS_Hospital_Visit: "0",
          RS_Treating_Doctor_Visit: "0",
          RS_Insured_Visit: "0",
          RS_Meeting_Family_Physician: "0",
          RS_Pathology: "0",
          RS_Chemist: "0",
          RS_Relative: "0",
          RS_Neighbor: "0",
          RS_Vicinity: "0",
          RS_Employer_School_University: "0",
          RS_Other: "0",
          RS_OTHER_TEXT: "",
        },
      },
      REPORT_Attachment: {
        file_name: "",
        fileURL: "",
        file_base64: "",
      },
    };

    const { baseUrl, authPayload, apiId } = buildMaximusUrl();

    const authUrl = `${baseUrl}${EndPoints.GET_AUTH}`;

    const authHeaders = {
      headers: {
        "x-apigw-api-id": apiId,
        "Content-Type": "application/json",
      },
    };

    const { data: getAuth } = await axios.post<GetAuthRes>(
      authUrl,
      authPayload,
      authHeaders
    );

    logsPayload.api = authUrl;
    logsPayload.requestBody = authPayload;
    logsPayload.requestHeaders = authHeaders;
    logsPayload.responseBody = getAuth;

    await MaximusResponseLog.create(logsPayload);

    if (!getAuth.Token) throw new Error("Failed to get auth token");

    const updateFniDetailUrl = `${baseUrl}${EndPoints.UPDATE_FNI_DETAILS}`;
    const updateFniDetailHeaders = {
      headers: {
        Authorization: `Bearer ${getAuth?.Token}`,
        "x-apigw-api-id": apiId,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post<IUpdateFNIDetailsRes>(
      updateFniDetailUrl,
      payload,
      updateFniDetailHeaders
    );

    logsPayload.api = updateFniDetailUrl;
    logsPayload.requestBody = payload;
    logsPayload.requestHeaders = updateFniDetailHeaders;
    logsPayload.responseBody = data;

    await MaximusResponseLog.create(logsPayload);

    if (
      data?.FNIStatus?.Case_Code === "null" ||
      data?.FNIStatus?.Message !== "Success" ||
      data?.Status === "False" ||
      !data?.FNIStatus
    ) {
      let msg = "";
      if (data?.FNIStatus?.Message) msg = data?.FNIStatus?.Message;
      else if (data?.ErrorList && data?.ErrorList?.length > 0)
        msg = data?.ErrorList?.map((el: any) => el.ErrorMsg)?.join(", ");
      else if (data?.StatusMessage) msg = data?.StatusMessage;
      else msg = "Something went wrong in UPDATE_FNI_DETAILS api";
      throw new Error(msg);
    }

    return {
      success: true,
      message: data?.StatusMessage || "Successfully assigned",
    };
  } catch (error: any) {
    logsPayload.api =
      error?.config?.url || "Find it from errorPayloadFromCatchBlock";
    if (error?.name === "AxiosError") {
      logsPayload.errorPayloadFromCatchBlock = {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        headers: error?.config?.headers,
        method: error?.config?.method,
        data: error?.config?.data,
      };
    } else {
      logsPayload.errorPayloadFromCatchBlock = JSON.stringify(error);
    }
    await MaximusResponseLog.create(logsPayload);
    return { success: false, message: error?.message as string };
  }
};
