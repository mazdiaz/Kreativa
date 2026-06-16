import test from "node:test";
import assert from "node:assert/strict";

import { decodeSessionPayload, encodeSession, safeSessionFromCookie } from "./auth-core.js";

test("signed session cookies round-trip with the correct secret", async () => {
  const expiresAt = new Date(Date.now() + 60_000).toISOString();
  const cookie = await encodeSession(
    { id: "u-admin", name: "Admin", email: "a@test", role: "ADMIN", expiresAt },
    "test-secret",
  );

  const session = await safeSessionFromCookie(cookie, "test-secret");

  assert.equal(session?.role, "ADMIN");
  assert.equal(session?.email, "a@test");
  assert.equal(session?.expiresAt, expiresAt);
});

test("signed session cookies reject malformed, tampered, wrong-secret, and expired values", async () => {
  const expiresAt = new Date(Date.now() + 60_000).toISOString();
  const cookie = await encodeSession(
    { id: "u-admin", name: "Admin", email: "a@test", role: "ADMIN", expiresAt },
    "test-secret",
  );
  const [payload, signature] = cookie.split(".");
  const tamperedPayload = Buffer.from(
    JSON.stringify({ id: "u-admin", name: "Admin", email: "a@test", role: "PARTICIPANT", expiresAt }),
  ).toString("base64url");
  const expired = await encodeSession(
    { id: "u-admin", name: "Admin", email: "a@test", role: "ADMIN", expiresAt: new Date(Date.now() - 1).toISOString() },
    "test-secret",
  );

  assert.equal(await safeSessionFromCookie("not-json", "test-secret"), null);
  assert.equal(await safeSessionFromCookie(`${tamperedPayload}.${signature}`, "test-secret"), null);
  assert.equal(await safeSessionFromCookie(cookie, "wrong-secret"), null);
  assert.equal(await safeSessionFromCookie(`${payload}.not-a-signature`, "test-secret"), null);
  assert.equal(await safeSessionFromCookie(expired, "test-secret"), null);
});

test("session payload can be decoded before signature verification to look up the user secret", async () => {
  const expiresAt = new Date(Date.now() + 60_000).toISOString();
  const cookie = await encodeSession(
    { id: "u-admin", name: "Admin", email: "a@test", role: "ADMIN", expiresAt },
    "stored-user-password-hash",
  );

  const payload = decodeSessionPayload(cookie);

  assert.equal(payload?.id, "u-admin");
  assert.equal(payload?.role, "ADMIN");
  assert.equal(decodeSessionPayload("not-a-cookie"), null);
});
