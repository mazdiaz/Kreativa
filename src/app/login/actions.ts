"use server";

import { redirect } from "next/navigation";

import { authenticateDemoUser } from "@/lib/auth-core";
import { dashboardPathForRole } from "@/lib/rbac";
import { setSession } from "@/lib/session";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const user = authenticateDemoUser(email, password);

  if (!user) {
    redirect("/login?error=invalid");
  }

  await setSession(user);
  redirect(dashboardPathForRole(user.role));
}
