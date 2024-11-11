import connectDB from "@/lib/db/dbConnectWithMongoose";
import DashboardData from "@/lib/Models/dashboardData";
import { Databases } from "@/lib/utils/types/enums";
import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { Transform } from "stream";
import dayjs from "dayjs";
import { CaseDetail, NumericStage } from "@/lib/utils/types/fniDataTypes";
import { IRMFindings } from "@/lib/utils/types/rmDataTypes";
import ClaimCase from "@/lib/Models/claimCase";
import * as fastCsv from "fast-csv";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

const columns = [
  { key: "claimId", header: "Claim ID" },
  { key: "insuredMobileNo", header: "Insured Mobile No" },
  { key: "insuredVisitDate", header: "Insured Visit Date" },
  {
    key: "updatedAt",
    header: "Updated At",
  },
];

router.post(async (req) => {
  try {
    await connectDB(Databases.FNI);

    const csvStream = fastCsv.format({ headers: true });

    csvStream.write(columns?.map((column) => column?.header));

    type TData = {
      claimId: number;
      findings: IRMFindings | null;
    };

    const transformStream = new Transform({
      objectMode: true,
      async transform(el, encoding, callback) {
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

        const row: string[] = [
          tempObj?.claimId?.toString(),
          tempObj?.findings?.["NPS Confirmation"]?.insuredMobileNo || "-",
          !!tempObj?.findings?.["NPS Confirmation"]?.insuredVisitDate
            ? dayjs(tempObj?.findings?.["NPS Confirmation"]?.insuredVisitDate)
                .tz("Asia/Kolkata")
                .format("DD-MMM-YYYY")
            : "-",
          tempObj?.findings?.["NPS Confirmation"]?.updatedAt
            ? dayjs(tempObj?.findings?.["NPS Confirmation"]?.updatedAt)
                .tz("Asia/Kolkata")
                .format("DD-MMM-YYYY hh:mm:ss a")
            : "-",
        ];
        callback(null, row);
      },
    });

    const cursor = await DashboardData.aggregate([
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
    ]).cursor();

    cursor.pipe(transformStream).pipe(csvStream);

    const zip = archiver("zip");

    // Create a response stream
    // @ts-expect-error
    const response = new Response(zip, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=nps_values.zip",
      },
    });

    zip.append(csvStream, { name: "nps_values.xlsx" });

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
