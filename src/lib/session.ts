import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  encodeSession,
  SESSION_MAX_AGE_SECONDS,
  type AuthenticatedUser,
  safeSessionFromCookie,
  type SessionUser,
} from "./session-types";

export async function currentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  return safeSessionFromCookie(raw);
}

export async function setSession(user: AuthenticatedUser) {
  const store = await cookies();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();
  store.set(SESSION_COOKIE, await encodeSession({ ...user, expiresAt }), {
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
