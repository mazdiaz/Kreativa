import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "inklusikarya_session";

const VALID_ROLES = new Set(["ADMIN", "PARTICIPANT", "MENTOR", "PARTNER"]);

function encodeJson(value) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decodeJson(value) {
  return JSON.parse(Buffer.from(String(value), "base64url").toString("utf8"));
}

function signPayload(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function verifyPayload(payload, signature, secret) {
  try {
    const expected = Buffer.from(signPayload(payload, secret), "base64url");
    const actual = Buffer.from(String(signature), "base64url");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function validSessionPayload(parsed) {
  if (!parsed?.id || !parsed?.email || !parsed?.name || !VALID_ROLES.has(parsed?.role)) return null;
  if (!parsed?.expiresAt || Number.isNaN(Date.parse(parsed.expiresAt))) return null;
  if (Date.parse(parsed.expiresAt) <= Date.now()) return null;
  return publicSession(parsed);
}

export function publicSession(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    expiresAt: user.expiresAt,
  };
}

export async function encodeSession(session, secret) {
  if (!secret) throw new Error("AUTH_SECRET is required to sign sessions.");
  const payload = encodeJson(session);
  const signature = signPayload(payload, secret);
  return `${payload}.${signature}`;
}

export function decodeSessionPayload(value) {
  try {
    const [payload, signature] = String(value ?? "").split(".");
    if (!payload || !signature) return null;
    return validSessionPayload(decodeJson(payload));
  } catch {
    return null;
  }
}

export async function safeSessionFromCookie(value, secret) {
  if (!value || !secret) return null;
  try {
    const [payload, signature] = String(value).split(".");
    if (!payload || !signature) return null;
    if (!verifyPayload(payload, signature, secret)) return null;
    return validSessionPayload(decodeJson(payload));
  } catch {
    return null;
  }
}
