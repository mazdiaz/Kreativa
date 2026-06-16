import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  decodeSessionPayload,
  encodeSession,
  SESSION_MAX_AGE_SECONDS,
  type AuthenticatedUser,
  safeSessionFromCookie,
  type SessionUser,
} from "./session-types";
import { prisma } from "./prisma";

export async function currentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  const payload = decodeSessionPayload(raw);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, name: true, email: true, role: true, status: true, passwordHash: true },
  });
  if (!user || user.status !== "ACTIVE") return null;

  const session = await safeSessionFromCookie(raw, user.passwordHash);
  if (!session) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    expiresAt: session.expiresAt,
  };
}

export async function setSession(user: AuthenticatedUser) {
  const store = await cookies();
  const storedUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true, status: true },
  });
  if (!storedUser || storedUser.status !== "ACTIVE") {
    throw new Error("Cannot create a session for an inactive user.");
  }

  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();
  store.set(SESSION_COOKIE, await encodeSession({ ...user, expiresAt }, storedUser.passwordHash), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
