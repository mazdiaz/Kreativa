import assert from "node:assert/strict";
import test from "node:test";

const seedData = await import("../../prisma/seed-data.mjs");

test("demo seed content fills the main website workflows", () => {
  assert.equal(seedData.programs.length >= 4, true);
  assert.equal(seedData.modules.length >= 8, true);
  assert.equal(seedData.schedules.length >= 6, true);
  assert.equal(seedData.assessments.length >= 2, true);
  assert.equal(seedData.businessIdeas.length >= 4, true);
  assert.equal(seedData.products.length >= 6, true);
  assert.equal(seedData.mentoringSessions.length >= 3, true);
  assert.equal(seedData.messages.length >= 3, true);
  assert.equal(seedData.notifications.length >= 4, true);
  assert.equal(seedData.reports.length >= 2, true);
});

test("demo seed content uses deterministic ids for idempotent upserts", () => {
  const collections = [
    seedData.programs,
    seedData.modules,
    seedData.schedules,
    seedData.assessments,
    seedData.registrations,
    seedData.attendances,
    seedData.progressRecords,
    seedData.businessIdeas,
    seedData.products,
    seedData.mentoringSessions,
    seedData.messages,
    seedData.notifications,
    seedData.reports,
    seedData.auditLogs,
  ];

  for (const collection of collections) {
    assert.equal(collection.every((item) => typeof item.id === "string" && item.id.length > 0), true);
  }
});
