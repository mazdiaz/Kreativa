import { normalizeEmail, verifyCredentialUser } from "./credentials";
import { prisma } from "./prisma";
import type { AuthenticatedUser } from "./session-types";

export async function authenticateUser(email: FormDataEntryValue | null, password: FormDataEntryValue | null): Promise<AuthenticatedUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });

  return verifyCredentialUser(user, password) as Promise<AuthenticatedUser | null>;
}
