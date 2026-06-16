import { z } from "zod";

const requiredText = (label, max = 255) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} terlalu panjang.`);

export const programSchema = z.object({
  name: requiredText("Nama program"),
  type: requiredText("Tipe program", 80),
  period: requiredText("Periode", 80),
  status: z.enum(["OPEN", "ACTIVE", "CLOSED"]),
  description: requiredText("Deskripsi", 1000),
});

export const moduleSchema = z.object({
  programId: requiredText("Program"),
  title: requiredText("Judul modul"),
  description: requiredText("Deskripsi modul", 1000),
  materialUrl: z.string().trim().url("URL materi tidak valid.").max(500).optional().or(z.literal("")),
});

export const scheduleSchema = z.object({
  programId: requiredText("Program"),
  title: requiredText("Judul jadwal"),
  date: requiredText("Tanggal", 80),
  location: requiredText("Lokasi", 255),
});

export const assessmentSchema = z.object({
  score: z.coerce.number().int().min(0).max(100),
  recommendation: requiredText("Rekomendasi", 500),
  notes: requiredText("Catatan", 1000),
});

export const businessIdeaSchema = z.object({
  title: requiredText("Judul ide"),
  localPotential: requiredText("Potensi lokal", 500),
  description: requiredText("Deskripsi ide", 1000),
  status: z.enum(["SUBMITTED"]).default("SUBMITTED"),
});

export const mentoringSessionSchema = z.object({
  participantId: requiredText("Peserta"),
  topic: requiredText("Topik"),
  notes: requiredText("Catatan", 1000),
  nextAction: requiredText("Tindak lanjut", 500),
});
