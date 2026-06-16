const PROTECTED_PREFIXES = ["/admin", "/participant", "/mentor", "/partner", "/notifications"];

export function isProtectedPath(pathname) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function proxyDecision(pathname, hasSessionCookie) {
  if (isProtectedPath(pathname) && !hasSessionCookie) return { type: "login" };
  return { type: "next" };
}
