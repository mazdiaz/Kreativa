import { NextResponse, type NextRequest } from "next/server";

import { canAccessRoleArea, dashboardPathForRole } from "./lib/rbac";
import { SESSION_COOKIE, safeSessionFromCookie } from "./lib/session-types";

const PROTECTED_PREFIXES = ["/admin", "/participant", "/mentor", "/partner"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawSession = request.cookies.get(SESSION_COOKIE)?.value;
  const user = await safeSessionFromCookie(rawSession);

  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL(dashboardPathForRole(user.role), request.url));
  }

  if (!PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next();
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!canAccessRoleArea(user.role, pathname)) {
    return NextResponse.redirect(new URL(dashboardPathForRole(user.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/participant/:path*", "/mentor/:path*", "/partner/:path*"],
};
