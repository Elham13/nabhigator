import React from "react";
import { HydratedDocument, PipelineStage } from "mongoose";
import DocumentDetailsContainer from "./components/DocumentDetailsContainer";
import { decryptAppID } from "@/lib/helpers/authHelpers";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import DashboardData from "@/lib/Models/dashboardData";
import { Databases } from "@/lib/utils/types/enums";
import ClaimCase from "@/lib/Models/claimCase";

export type TDocType =
  | "authorization-letter"
  | "investigation"
  | "assignment"
  | "final-investigation-report";

type TSearchParams = {
  claimId: string;
  docType: TDocType;
  invType?: "Internal" | "External";
};

type PropTypes = {
  params: Record<string, any>;
  searchParams: TSearchParams;
};

const PDFViewAndDownload = async ({ searchParams }: PropTypes) => {
  const { claimId, docType, invType } = searchParams;

  if (!claimId) throw new Error("claimId is required");
  const decryptedClaimId = decryptAppID(claimId) as string;

  await connectDB(Databases.FNI);

  const dashboardData: HydratedDocument<IDashboardData> | null =
    await DashboardData.findOne({ claimId: decryptedClaimId });

  if (!dashboardData)
    throw new Error(`No data found with the claimId ${decryptedClaimId}`);

  const pipeline: PipelineStage[] = [
    { $match: { dashboardDataId: dashboardData?._id } },
    {
      $lookup: {
        from: "claiminvestigators",
        localField: "investigator",
        foreignField: "_id",
        as: "investigator",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedBy",
        foreignField: "_id",
        as: "assignedBy",
      },
    },
  ];

  let caseData: HydratedDocument<CaseDetail> | null = null;

  const caseDetails: any[] = await ClaimCase.aggregate(pipeline);
  if (caseDetails && caseDetails?.length > 0) caseData = caseDetails[0];

  if (!caseData)
    throw new Error(`No case data found with the id ${dashboardData?._id}`);

  return (
    <DocumentDetailsContainer
      {...{
        docType,
        caseData: JSON.parse(JSON.stringify(caseData)),
        dashboardData: JSON.parse(JSON.stringify(dashboardData)),
        invType,
      }}
    />
  );
};

export default PDFViewAndDownload;
