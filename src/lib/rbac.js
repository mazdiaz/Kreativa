export const ROLES = ["ADMIN", "PARTICIPANT", "MENTOR", "PARTNER"];

const ROLE_AREAS = {
  ADMIN: ["/admin"],
  PARTICIPANT: ["/participant"],
  MENTOR: ["/mentor"],
  PARTNER: ["/partner", "/showcase", "/products"],
};

const ROLE_HOME = {
  ADMIN: { label: "Dashboard Admin", href: "/admin" },
  PARTICIPANT: { label: "Portal Peserta", href: "/participant" },
  MENTOR: { label: "Portal Mentor", href: "/mentor" },
  PARTNER: { label: "Portal Mitra", href: "/partner" },
};

export function dashboardPathForRole(role) {
  return ROLE_HOME[role]?.href ?? "/";
}

export function roleHome(role) {
  return ROLE_HOME[role] ?? { label: "Beranda", href: "/" };
}

export function canAccessRoleArea(role, pathname) {
  if (!role || !pathname) return false;
  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return true;
  }
  const allowedPrefixes = ROLE_AREAS[role] ?? [];
  return allowedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
