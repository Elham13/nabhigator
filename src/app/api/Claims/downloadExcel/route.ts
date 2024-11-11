import connectDB from "@/lib/db/dbConnectWithMongoose";
import { processGetDataFilters } from "@/lib/helpers/getDataHelpers";
import DashboardData from "@/lib/Models/dashboardData";
import { Databases } from "@/lib/utils/types/enums";
import { PipelineStage } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { Transform } from "stream";
import { getOpenAndClosureTAT, getStageLabel } from "@/lib/helpers";
import dayjs from "dayjs";
import { columns } from "./helpers";
import * as fastCsv from "fast-csv";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const filter = await req?.json();

  try {
    const updatedFilter: any = await processGetDataFilters(filter);

    await connectDB(Databases.FNI);

    const pipeline: PipelineStage[] = [
      {
        $match: updatedFilter,
      },
      {
        $lookup: {
          from: "users",
          localField: "clusterManager",
          foreignField: "_id",
          as: "clusterManager",
        },
      },
      {
        $unwind: { path: "$clusterManager", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "teamLead",
          foreignField: "_id",
          as: "teamLead",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postQa",
          foreignField: "_id",
          as: "postQa",
        },
      },
      { $unwind: { path: "$postQa", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          claimId: 1,
          claimType: 1,
          claimSubType: 1,
          lossType: 1,
          benefitType: 1,
          "insuredDetails.insuredName": "$insuredDetails.insuredName",
          "insuredDetails.insuredType": "$insuredDetails.insuredType",
          "insuredDetails.age": "$insuredDetails.age",
          "insuredDetails.contactNo": "$insuredDetails.contactNo",
          "insuredDetails.emailId": "$insuredDetails.emailId",
          "insuredDetails.gender": "$insuredDetails.gender",
          "claimDetails.claimAmount": "$claimDetails.claimAmount",
          "claimDetails.diagnosis": "$claimDetails.diagnosis",
          "claimDetails.billedAmount": "$claimDetails.billedAmount",
          "claimDetails.claimStatus": "$claimDetails.claimStatus",
          "claimDetails.deductibleAmount": "$claimDetails.deductibleAmount",
          "claimDetails.memberNo": "$claimDetails.memberNo",
          "hospitalDetails.providerName": "$hospitalDetails.providerName",
          "hospitalDetails.providerType": "$hospitalDetails.providerType",
          "hospitalDetails.providerNo": "$hospitalDetails.providerNo",
          "hospitalDetails.providerCity": "$hospitalDetails.providerCity",
          "hospitalDetails.providerState": "$hospitalDetails.providerState",
          "hospitalDetails.providerAddress": "$hospitalDetails.providerAddress",
          "hospitalDetails.pinCode": "$hospitalDetails.pinCode",
          "hospitalizationDetails.dateOfAdmission":
            "$hospitalizationDetails.dateOfAdmission",
          "hospitalizationDetails.dateOfDischarge":
            "$hospitalizationDetails.dateOfDischarge",
          "hospitalizationDetails.admissionType":
            "$hospitalizationDetails.admissionType",
          "contractDetails.contractNo": "$contractDetails.contractNo",
          "contractDetails.policyNo": "$contractDetails.policyNo",
          "contractDetails.policyStartDate": "$contractDetails.policyStartDate",
          "contractDetails.policyEndDate": "$contractDetails.policyEndDate",
          "contractDetails.agentName": "$contractDetails.agentName",
          "contractDetails.agentCode": "$contractDetails.agentCode",
          "contractDetails.currentStatus": "$contractDetails.currentStatus",
          "contractDetails.product": "$contractDetails.product",
          "contractDetails.sourcing": "$contractDetails.sourcing",
          "contractDetails.prevInsuranceCompany":
            "$contractDetails.prevInsuranceCompany",
          allocationType: 1,
          stage: 1,
          intimationDate: 1,
          "teamLead._id": "$teamLead._id",
          "teamLead.name": "$teamLead.name",
          "postQa._id": "$postQa._id",
          "postQa.name": "$postQa.name",
          "clusterManager._id": "$clusterManager._id",
          "clusterManager.name": "$clusterManager.name",
          dateOfOS: 1,
          dateOfClosure: 1,
          claimInvestigators: 1,
          lossDate: 1,
          locked: 1,
          investigatorRecommendation: 1,
          dateOfFallingIntoPostQaBucket: 1,
          invReportReceivedDate: 1,
          finalOutcome: 1,
          isReInvestigated: 1,
          updatedAt: 1,
        },
      },
    ];

    if (!!filter?.colorCode) {
      pipeline.unshift({
        $addFields: {
          differenceInSeconds: {
            $divide: [
              {
                $subtract: [
                  "$$NOW",
                  {
                    $dateFromString: {
                      dateString: "$intimationDate",
                      timezone: "Asia/Kolkata",
                    },
                  },
                ],
              },
              1000, // Convert milliseconds to seconds
            ],
          },
        },
      });
    }

    if (
      !!filter?.intimationDateRange &&
      Array.isArray(filter?.intimationDateRange)
    ) {
      pipeline.unshift({
        $addFields: {
          intimationDateAsDate: { $toDate: "$intimationDate" },
        },
      });
    }

    // console.log("pipeline: ", pipeline);
    // console.log("pipeline: ", pipeline[0]["$match"], filter?.pagination);

    const csvStream = fastCsv.format({ headers: true });

    csvStream.write(columns?.map((column) => column?.header));

    const transformStream = new Transform({
      objectMode: true,
      transform(el, encoding, callback) {
        // Map the MongoDB document to an array that represents a CSV row
        const row = [
          el?.claimId || "-",
          el?.claimType || "-",
          el?.claimSubType || "-",
          el?.lossType || "-",
          el?.benefitType || "-",
          el?.insuredDetails?.insuredName || "-",
          el?.insuredDetails?.insuredType || "-",
          el?.insuredDetails?.age || "-",
          el?.insuredDetails?.contactNo || "-",
          el?.insuredDetails?.emailId || "-",
          el?.insuredDetails?.gender || "-",
          el?.claimDetails?.claimAmount || "-",
          el?.claimDetails?.diagnosis || "-",
          el?.claimDetails?.billedAmount || "-",
          el?.claimDetails?.claimStatus || "-",
          el?.claimDetails?.deductibleAmount || "-",
          el?.claimDetails?.memberNo || "-",
          el?.hospitalDetails?.providerName || "-",
          el?.hospitalDetails?.providerType || "-",
          el?.hospitalDetails?.providerNo || "-",
          el?.hospitalDetails?.providerCity || "-",
          el?.hospitalDetails?.providerState || "-",
          el?.hospitalDetails?.providerAddress || "-",
          el?.hospitalDetails?.pinCode || "-",
          el?.hospitalizationDetails?.dateOfAdmission
            ? dayjs(el?.hospitalizationDetails?.dateOfAdmission).format(
                "DD-MMM-YYYY hh:mm:ss a"
              )
            : "-",
          el?.hospitalizationDetails?.dateOfDischarge || "-",
          el?.hospitalizationDetails?.admissionType || "-",
          el?.contractDetails?.contractNo || "-",
          el?.contractDetails?.policyStartDate
            ? dayjs(el?.contractDetails?.policyStartDate).format(
                "DD-MMM-YYYY hh:mm:ss a"
              )
            : "-",
          el?.contractDetails?.policyEndDate
            ? dayjs(el?.contractDetails?.policyEndDate).format(
                "DD-MMM-YYYY hh:mm:ss a"
              )
            : "-",
          el?.contractDetails?.policyNo || "-",
          el?.contractDetails?.agentName || "-",
          el?.contractDetails?.agentCode || "-",
          el?.contractDetails?.currentStatus || "-",
          el?.contractDetails?.product || "-",
          el?.contractDetails?.sourcing || "-",
          el?.contractDetails?.prevInsuranceCompany || "-",
          el?.allocationType || "Not Allocated",
          el?.stage ? getStageLabel(el?.stage) : "-",
          el?.intimationDate
            ? dayjs(el?.intimationDate).format("DD-MMM-YYYY hh:mm:ss a")
            : "-",
          el?.teamLead &&
          Array.isArray(el?.teamLead) &&
          el?.teamLead?.length > 0
            ? el?.teamLead?.map((tl: any) => tl.name)?.join(", ")
            : "-",
          el?.postQa?.name || "-",
          el?.clusterManager?.name || "-",
          el?.dateOfOS
            ? dayjs(el?.dateOfOS).format("DD-MMM-YYYY hh:mm:ss a")
            : "-",
          el?.dateOfClosure
            ? dayjs(el?.dateOfClosure).format("DD-MMM-YYYY hh:mm:ss a")
            : "-",
          el?.claimInvestigators?.length > 0
            ? el?.claimInvestigators?.map((ci: any) => ci?.name)?.join(", ")
            : "-",
          el?.lossDate
            ? dayjs(el?.lossDate).format("DD-MMM-YYYY hh:mm:ss a")
            : "-",
          el?.locked ? "Yes" : "No",
          el?.investigatorRecommendation || "-",
          el?.dateOfFallingIntoPostQaBucket
            ? dayjs(el?.dateOfFallingIntoPostQaBucket).format(
                "DD-MMM-YYYY hh:mm:ss a"
              )
            : "-",
          el?.invReportReceivedDate
            ? dayjs(el?.invReportReceivedDate).format("DD-MMM-YYYY hh:mm:ss a")
            : "-",
          el?.finalOutcome || "-",
          el?.isReInvestigated ? "Yes" : "No",
          getOpenAndClosureTAT({
            stage: el?.stage,
            dateOfClosure: el?.dateOfClosure,
            intimationDate: el?.intimationDate,
          })?.openTAT || "-",
          getOpenAndClosureTAT({
            stage: el?.stage,
            dateOfClosure: el?.dateOfClosure,
            intimationDate: el?.intimationDate,
          })?.closureTAT || "-",
          el?.updatedAt
            ? dayjs(el?.updatedAt).format("DD-MMM-YYYY hh:mm:ss a")
            : "-",
        ];
        callback(null, row);
      },
    });

    let cursor = await DashboardData.aggregate(pipeline).cursor();

    cursor.pipe(transformStream).pipe(csvStream);

    const zip = archiver("zip", { zlib: { level: 9 } });

    // Create a response stream
    // @ts-expect-error
    const response = new Response(zip, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=data_${dayjs().format(
          "DD-MMM-YYYY hh-mm-ss a"
        )}.zip`,
      },
    });

    zip.append(csvStream, {
      name: `data_${dayjs().format("DD-MMM-YYYY hh-mm-ss a")}.xlsx`,
    });

    // Finalize the zip
    zip.finalize();

    // Handle zip errors
    zip.on("error", (err) => {
      console.error("Zip error:", err);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    });

    return response;
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
