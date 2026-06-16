import test from "node:test";
import assert from "node:assert/strict";

import {
  canAccessRoleArea,
  dashboardPathForRole,
  roleHome,
} from "./rbac.js";

test("maps each role to the correct dashboard path", () => {
  assert.equal(dashboardPathForRole("ADMIN"), "/admin");
  assert.equal(dashboardPathForRole("PARTICIPANT"), "/participant");
  assert.equal(dashboardPathForRole("MENTOR"), "/mentor");
  assert.equal(dashboardPathForRole("PARTNER"), "/partner");
});

test("allows role users to access only their own role area", () => {
  assert.equal(canAccessRoleArea("ADMIN", "/admin/programs"), true);
  assert.equal(canAccessRoleArea("ADMIN", "/participant/progress"), false);
  assert.equal(canAccessRoleArea("PARTICIPANT", "/participant/assessment"), true);
  assert.equal(canAccessRoleArea("MENTOR", "/mentor/sessions"), true);
  assert.equal(canAccessRoleArea("PARTNER", "/showcase"), true);
  assert.equal(canAccessRoleArea("PARTNER", "/admin/reports"), false);
});

test("exposes public role home metadata for navigation", () => {
  assert.deepEqual(roleHome("MENTOR"), {
    label: "Portal Mentor",
    href: "/mentor",
  });
});
