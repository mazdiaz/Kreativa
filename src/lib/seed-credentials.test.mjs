import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("seed credentials use the Kreativa account domain", async () => {
  const seed = await readFile(new URL("../../prisma/seed.mjs", import.meta.url), "utf8");

  for (const email of ["admin@kreativa.com", "peserta@kreativa.com", "mentor@kreativa.com", "mitra@kreativa.com"]) {
    assert.match(seed, new RegExp(`"${email}"`));
  }

  assert.doesNotMatch(seed, /email: "[^"]+@kreativa"/);
});

test("seed migrates existing legacy Kreativa test accounts", async () => {
  const seed = await readFile(new URL("../../prisma/seed.mjs", import.meta.url), "utf8");

  for (const email of ["admin@kreativa.test", "peserta@kreativa.test", "mentor@kreativa.test", "mitra@kreativa.test"]) {
    assert.match(seed, new RegExp(`legacyEmail: "${email}"`));
  }
});
