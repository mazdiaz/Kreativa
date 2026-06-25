import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("workflow items group title and detail in one content column", async () => {
  const source = await readFile(new URL("../components/dashboard.tsx", import.meta.url), "utf8");

  assert.match(source, /<div className="workflow-content">\s*<strong>\{item\.title\}<\/strong>\s*<span>\{item\.detail\}<\/span>\s*<\/div>/);
});
