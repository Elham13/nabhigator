import { updateSession } from "@/lib/helpers/authHelpers";
import { createEdgeRouter } from "next-connect";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const router = createEdgeRouter<NextRequest, NextFetchEvent>();

router.use(async (request, event, next) => {
  return await updateSession(request, next);
});

router.all(() => {
  // default if none of the above matches
  return NextResponse.next();
});

export function middleware(request: NextRequest, event: NextFetchEvent) {
  return router.run(request, event);
}
