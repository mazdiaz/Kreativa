import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("seed credentials use the Kreativa account domain", async () => {
  const seed = await readFile(new URL("../../prisma/seed.mjs", import.meta.url), "utf8");

  for (const email of ["admin@kreativa.com", "peserta@kreativa.com", "mentor@kreativa.com", "mitra@kreativa.com"]) {
    assert.match(seed, new RegExp(`"${email}"`));
  }

  assert.doesNotMatch(seed, /@kreativa(\.test)?"/);
});
