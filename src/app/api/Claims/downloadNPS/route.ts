import connectDB from "@/lib/db/dbConnectWithMongoose";
import DashboardData from "@/lib/Models/dashboardData";
import { Databases } from "@/lib/utils/types/enums";
import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import archiver from "archiver";
import { Readable } from "stream";
import dayjs from "dayjs";
import { CaseDetail, NumericStage } from "@/lib/utils/types/fniDataTypes";
import { IRMFindings } from "@/lib/utils/types/rmDataTypes";
import ClaimCase from "@/lib/Models/claimCase";

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  try {
    await connectDB(Databases.FNI);

    const dData = await DashboardData.aggregate([
      {
        $match: {
          claimType: "Reimbursement",
          stage: {
            $in: [
              NumericStage.INVESTIGATION_ACCEPTED,
              NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING,
              NumericStage.IN_FIELD_FRESH,
              NumericStage.IN_FIELD_REWORK,
              NumericStage.IN_FIELD_REINVESTIGATION,
            ],
          },
        },
      },
      { $project: { _id: 1, caseId: 1, claimId: 1 } },
    ]);

    type TData = {
      claimId: number;
      findings: IRMFindings | null;
    };

    const data: TData[] = [];

    for (const el of dData) {
      const tempObj: TData = { claimId: el?.claimId, findings: null };
      if (el?.caseId) {
        const caseDetail: HydratedDocument<CaseDetail> | null =
          await ClaimCase.findById(el?.caseId);
        if (caseDetail) {
          if (!!caseDetail?.singleTasksAndDocs?.rmFindings)
            tempObj.findings = caseDetail?.singleTasksAndDocs?.rmFindings;
          else if (!!caseDetail?.insuredTasksAndDocs?.rmFindings)
            tempObj.findings = caseDetail?.insuredTasksAndDocs?.rmFindings;
        }
      }
      data.push(tempObj);
    }

    const columns: Partial<ExcelJS.Column>[] = [
      { key: "claimId", header: "Claim ID" },
      { key: "insuredMobileNo", header: "Insured Mobile No" },
      { key: "insuredVisitDate", header: "Insured Visit Date" },
      {
        key: "updatedAt",
        header: "Updated At",
      },
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Claims");

    worksheet.columns = columns;

    data?.forEach((el) => {
      worksheet.addRow({
        claimId: el?.claimId,
        insuredMobileNo:
          el?.findings?.["NPS Confirmation"]?.insuredMobileNo || "-",
        insuredVisitDate: !!el?.findings?.["NPS Confirmation"]?.insuredVisitDate
          ? dayjs(el?.findings?.["NPS Confirmation"]?.insuredVisitDate).format(
              "DD-MMM-YYYY"
            )
          : "-",
        updatedAt: el?.findings?.["NPS Confirmation"]?.updatedAt
          ? dayjs(el?.findings?.["NPS Confirmation"]?.updatedAt).format(
              "DD-MMM-YYYY hh:mm:ss a"
            )
          : "-",
      });
    });

    const zip = archiver("zip");

    // Create a response stream
    // @ts-expect-error
    const response = new Response(zip, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=nps_values.zip",
      },
    });

    // Append the Excel workbook to the zip
    const excelBuffer = await workbook.xlsx.writeBuffer();
    const readableExcelStream = new Readable();
    readableExcelStream._read = () => {}; // No-op
    readableExcelStream.push(excelBuffer);
    readableExcelStream.push(null); // End the stream

    zip.append(readableExcelStream, { name: "nps_values.xlsx" });

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
