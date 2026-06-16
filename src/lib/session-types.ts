import {
  SESSION_COOKIE as CORE_SESSION_COOKIE,
  encodeSession as coreEncodeSession,
  safeSessionFromCookie as coreSafeSessionFromCookie,
} from "./auth-core";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PARTICIPANT" | "MENTOR" | "PARTNER";
};

export const SESSION_COOKIE = CORE_SESSION_COOKIE;

export function encodeSession(session: SessionUser) {
  return coreEncodeSession(session);
}

export function safeSessionFromCookie(value?: string) {
  return coreSafeSessionFromCookie(value) as SessionUser | null;
}
