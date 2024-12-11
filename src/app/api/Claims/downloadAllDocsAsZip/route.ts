import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { IS3Url } from "@/lib/utils/types/fniDataTypes";
import axios from "axios";

dayjs.extend(utc);
dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

router.post(async (req) => {
  const body = await req?.json();
  const { documents } = body;
  try {
    if (!documents || documents?.length < 1)
      throw new Error("documents are required");
    const s3Urls: IS3Url[] = documents;
    const zipName = "files.zip";

    const zip = archiver("zip", {
      zlib: { level: 9 }, // Compression level
    });

    // Create a response stream
    // @ts-expect-error
    const response = new Response(zip, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${zipName}`,
      },
    });

    for (let i = 0; i < s3Urls.length; i++) {
      const url = s3Urls[i]?.url;
      const response = await axios.get(url, { responseType: "arraybuffer" });

      const filename = s3Urls[i]?.name;
      zip.append(response.data, { name: filename });
    }
    zip.finalize();

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
