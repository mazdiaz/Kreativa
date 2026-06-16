import test from "node:test";
import assert from "node:assert/strict";

import { proxyDecision } from "./proxy-policy.js";

test("proxy sends protected routes without a session cookie to login", () => {
  assert.deepEqual(proxyDecision("/admin", false), { type: "login" });
  assert.deepEqual(proxyDecision("/participant/progress", false), { type: "login" });
});

test("proxy allows protected routes when a session cookie exists and leaves role validation to server pages", () => {
  assert.deepEqual(proxyDecision("/admin", true), { type: "next" });
  assert.deepEqual(proxyDecision("/mentor/sessions", true), { type: "next" });
});

test("proxy allows public routes regardless of session cookie presence", () => {
  assert.deepEqual(proxyDecision("/", false), { type: "next" });
  assert.deepEqual(proxyDecision("/showcase", true), { type: "next" });
});
