import {
  SESSION_COOKIE as CORE_SESSION_COOKIE,
  encodeSession as coreEncodeSession,
  safeSessionFromCookie as coreSafeSessionFromCookie,
} from "./auth-core";

export type SessionRole = "ADMIN" | "PARTICIPANT" | "MENTOR" | "PARTNER";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: SessionRole;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: SessionRole;
  expiresAt: string;
};

export const SESSION_COOKIE = CORE_SESSION_COOKIE;
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export function sessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "development-only-auth-secret-change-me";
  return "";
}

export async function encodeSession(session: SessionUser) {
  return coreEncodeSession(session, sessionSecret());
}

export async function safeSessionFromCookie(value?: string) {
  return (await coreSafeSessionFromCookie(value, sessionSecret())) as SessionUser | null;
}
