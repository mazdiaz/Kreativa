import bcrypt from "bcryptjs";

import { publicSession } from "./auth-core.js";

export function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

export async function verifyCredentialUser(user, password) {
  if (!user || user.status !== "ACTIVE") return null;
  if (!password || !(await bcrypt.compare(String(password), user.passwordHash))) return null;
  return publicSession(user);
}
