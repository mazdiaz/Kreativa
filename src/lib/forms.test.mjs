import test from "node:test";
import assert from "node:assert/strict";

import {
  attendanceSchema,
  businessIdeaSchema,
  messageSchema,
  mentoringSessionSchema,
  participantSchema,
  productSchema,
  programRegistrationSchema,
  programSchema,
  progressSchema,
  userSchema,
} from "./forms.js";

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

test("participant and user schemas validate admin managed records", () => {
  const participant = participantSchema.parse({
    name: "  Peserta Baru  ",
    email: "PESERTA.BARU@example.test",
    address: "Bandung",
    disabilityNeed: "Instruksi visual",
    localPotential: "Kriya lokal",
    consentStatus: "on",
  });

  assert.equal(participant.name, "Peserta Baru");
  assert.equal(participant.email, "peserta.baru@example.test");
  assert.equal(participant.consentStatus, true);
  assert.equal(userSchema.parse({ name: "Mentor", email: "mentor2@example.test", role: "MENTOR", status: "ACTIVE" }).role, "MENTOR");
});

test("product, registration, attendance, progress, and message schemas bound input", () => {
  assert.equal(programRegistrationSchema.parse({ programId: "program-1" }).programId, "program-1");
  assert.equal(productSchema.parse({ name: "Produk", category: "Kriya", description: "Deskripsi produk", imageUrl: "" }).status, "PENDING");
  assert.equal(attendanceSchema.parse({ scheduleId: "s1", participantId: "p1", status: "PRESENT" }).status, "PRESENT");
  assert.equal(progressSchema.parse({ participantId: "p1", moduleId: "m1", completion: "75", notes: "Baik" }).completion, 75);
  assert.equal(messageSchema.parse({ recipientId: "u1", subject: "Halo", body: "Catatan" }).subject, "Halo");
  assert.throws(() => progressSchema.parse({ participantId: "p1", moduleId: "m1", completion: "120", notes: "Terlalu tinggi" }));
});
