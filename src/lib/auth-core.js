export const SESSION_COOKIE = "inklusikarya_session";

const VALID_ROLES = new Set(["ADMIN", "PARTICIPANT", "MENTOR", "PARTNER"]);
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value) {
  const normalized = String(value).replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function encodeJson(value) {
  return bytesToBase64Url(encoder.encode(JSON.stringify(value)));
}

function decodeJson(value) {
  return JSON.parse(decoder.decode(base64UrlToBytes(value)));
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signPayload(payload, secret) {
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

async function verifyPayload(payload, signature, secret) {
  try {
    return crypto.subtle.verify("HMAC", await hmacKey(secret), base64UrlToBytes(signature), encoder.encode(payload));
  } catch {
    return false;
  }
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
  const signature = await signPayload(payload, secret);
  return `${payload}.${signature}`;
}

export async function safeSessionFromCookie(value, secret) {
  if (!value || !secret) return null;
  try {
    const [payload, signature] = String(value).split(".");
    if (!payload || !signature) return null;
    if (!(await verifyPayload(payload, signature, secret))) return null;
    const parsed = decodeJson(payload);
    if (!parsed?.id || !parsed?.email || !parsed?.name || !VALID_ROLES.has(parsed?.role)) return null;
    if (!parsed?.expiresAt || Number.isNaN(Date.parse(parsed.expiresAt))) return null;
    if (Date.parse(parsed.expiresAt) <= Date.now()) return null;
    return publicSession(parsed);
  } catch {
    return null;
  }
}
