import test from "node:test";
import assert from "node:assert/strict";

import { authenticateDemoUser, safeSessionFromCookie } from "./auth-core.js";

test("authenticates a demo user with email and password", () => {
  const user = authenticateDemoUser("admin@inklusikarya.test", "password123");
  assert.equal(user?.role, "ADMIN");
  assert.equal(user?.email, "admin@inklusikarya.test");
});

test("rejects invalid demo credentials", () => {
  assert.equal(authenticateDemoUser("admin@inklusikarya.test", "wrong"), null);
  assert.equal(authenticateDemoUser("unknown@example.test", "password123"), null);
});

test("parses safe session cookies and rejects malformed values", () => {
  const valid = Buffer.from(JSON.stringify({ id: "u-admin", name: "Admin", email: "a@test", role: "ADMIN" })).toString("base64url");
  assert.equal(safeSessionFromCookie(valid)?.role, "ADMIN");
  assert.equal(safeSessionFromCookie("not-json"), null);
});
