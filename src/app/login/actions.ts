"use server";

import { redirect } from "next/navigation";

import { authenticateUser } from "@/lib/auth";
import { safePostLoginRedirect } from "@/lib/rbac";
import { setSession } from "@/lib/session";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const user = await authenticateUser(email, password);

  if (!user) {
    redirect("/login?error=invalid");
  }

  await setSession(user);
  redirect(safePostLoginRedirect(user.role, String(formData.get("next") ?? "")));
}
