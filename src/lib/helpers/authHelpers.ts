import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ISession } from "../utils/types/authTypes";
import { NextRequest, NextResponse } from "next/server";
import { NextHandler } from "next-connect";
import { Investigator } from "../utils/types/fniDataTypes";

const secretKey =
  process.env.JWT_SECRET || "lkasjdfoi32ujroijlkajf983jfjaslkdfjlkadsjf";

const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: { user: any; expires: Date }) {
  return await new SignJWT(JSON.parse(JSON.stringify(payload)))
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365 days from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return (await decrypt(session)) as ISession;
}

const isFNIProtectedRoute = (pathname: string) => {
  const routeNames = ["/Claims", "/api/Claims", "/api/fni-mobile-app"];

  const unprotectedRoutes = ["/Claims/login"];

  return routeNames?.some(
    (name) =>
      pathname?.startsWith(name) && !unprotectedRoutes.includes(pathname)
  );
};

const allowedOrigins = ["http://localhost:8080"];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function updateSession(request: NextRequest, next: NextHandler) {
  const { pathname } = request.nextUrl;

  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  let isMobileAppRequest: boolean = false;
  let session = request.cookies.get("session")?.value;
  const url = request.nextUrl.clone();

  if (!session) {
    session = request?.headers?.get("Authorization") ?? "";
    if (!!session) isMobileAppRequest = true;
  }

  if (session) {
    if (pathname === "/Claims/login") {
      // Don't let the user to visit login page

      url.pathname = "/Claims/dashboard";
      return NextResponse.redirect(url);
    } else if (isFNIProtectedRoute(pathname) && !isMobileAppRequest) {
      const parsed: ISession = await decrypt(session);

      if (!parsed) {
        url.pathname = "/Claims/login";
        const res = NextResponse.redirect(url);
        res?.cookies?.delete("session");
        return res;
      }

      // if (dayjs().subtract(1, "hour").isAfter(dayjs(parsed.expires))) {
      //   cookies().delete("session");
      //   url.pathname = "/Claims/login";
      //   return NextResponse.redirect(url);
      // } else if (dayjs().isAfter(dayjs(parsed?.expires))) {
      //   // Refresh the session so it doesn't expire
      //   parsed.expires = dayjs().add(1, "hour").toDate();
      //   const res = NextResponse.next();

      //   res.cookies.set({
      //     name: "session",
      //     value: await encrypt(parsed),
      //     httpOnly: true,
      //     // expires: parsed.expires,
      //   });

      //   return res;
      // }
    }
  }

  if (!session && isFNIProtectedRoute(pathname)) {
    if (isMobileAppRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Un-Authorized, Please Login",
        },
        { status: 403 }
      );
    } else {
      // Don't let them see protected routes without session
      url.pathname = "/Claims/login";
      return NextResponse.redirect(url);
    }
  }

  return next();
}
