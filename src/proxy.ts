import { NextResponse, type NextRequest } from "next/server";

import { proxyDecision } from "./lib/proxy-policy";
import { SESSION_COOKIE } from "./lib/session-types";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const decision = proxyDecision(pathname, Boolean(request.cookies.get(SESSION_COOKIE)?.value));

  if (decision.type === "login") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/participant/:path*", "/mentor/:path*", "/partner/:path*"],
};
