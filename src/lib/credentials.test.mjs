import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";

import { normalizeEmail, verifyCredentialUser } from "./credentials.js";

test("normalizes credential email before lookup", () => {
  assert.equal(normalizeEmail("  Admin@Kreativa.Com "), "admin@kreativa.com");
});

test("verifies active credential users with bcrypt and rejects inactive or invalid users", async () => {
  const passwordHash = await bcrypt.hash("password123", 4);
  const activeUser = {
    id: "u-admin",
    name: "Admin",
    email: "admin@kreativa.com",
    role: "ADMIN",
    status: "ACTIVE",
    passwordHash,
  };

  assert.equal((await verifyCredentialUser(activeUser, "password123"))?.role, "ADMIN");
  assert.equal(await verifyCredentialUser(activeUser, "wrong"), null);
  assert.equal(await verifyCredentialUser({ ...activeUser, status: "SUSPENDED" }, "password123"), null);
  assert.equal(await verifyCredentialUser(null, "password123"), null);
});
