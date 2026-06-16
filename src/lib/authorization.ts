import { redirect } from "next/navigation";

import { dashboardPathForRole } from "./rbac";
import { currentUser } from "./session";
import type { SessionRole, SessionUser } from "./session-types";

export async function requireRole(roles: SessionRole[]): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect(dashboardPathForRole(user.role));
  return user;
}
