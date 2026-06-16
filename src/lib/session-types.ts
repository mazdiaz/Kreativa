import {
  SESSION_COOKIE as CORE_SESSION_COOKIE,
  decodeSessionPayload as coreDecodeSessionPayload,
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

export function decodeSessionPayload(value?: string) {
  return coreDecodeSessionPayload(value) as SessionUser | null;
}

export async function encodeSession(session: SessionUser, secret: string) {
  return coreEncodeSession(session, secret);
}

export async function safeSessionFromCookie(value: string | undefined, secret: string) {
  return (await coreSafeSessionFromCookie(value, secret)) as SessionUser | null;
}
