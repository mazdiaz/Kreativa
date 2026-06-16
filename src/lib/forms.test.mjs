import test from "node:test";
import assert from "node:assert/strict";

import { businessIdeaSchema, mentoringSessionSchema, programSchema } from "./forms.js";

test("program schema trims required fields and bounds long text", () => {
  const parsed = programSchema.parse({
    name: "  Kriya Lokal  ",
    type: "Vokasional",
    period: "2026-Q3",
    status: "OPEN",
    description: "Pelatihan produk kreatif.",
  });

  assert.equal(parsed.name, "Kriya Lokal");
  assert.throws(() => programSchema.parse({ ...parsed, description: "x".repeat(1001) }));
});

test("business idea schema rejects incomplete participant submissions", () => {
  assert.throws(() => businessIdeaSchema.parse({ title: "", localPotential: "Kain lokal", description: "Ide usaha" }));
  assert.equal(
    businessIdeaSchema.parse({ title: "Tas Perca", localPotential: "Kain lokal", description: "Produk tas" }).status,
    "SUBMITTED",
  );
});

test("mentoring session schema requires participant, topic, notes, and next action", () => {
  const parsed = mentoringSessionSchema.parse({
    participantId: "participant-1",
    topic: "Validasi produk",
    notes: "Produk perlu difoto ulang.",
    nextAction: "Buat foto katalog.",
  });

  assert.equal(parsed.topic, "Validasi produk");
  assert.throws(() => mentoringSessionSchema.parse({ ...parsed, participantId: "" }));
});
