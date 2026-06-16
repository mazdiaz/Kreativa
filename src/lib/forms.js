import { z } from "zod";

const requiredText = (label, max = 255) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} terlalu panjang.`);

const optionalUrl = z.string().trim().url("URL tidak valid.").max(500).optional().or(z.literal(""));
const booleanFromCheckbox = z.preprocess((value) => value === "on" || value === true || value === "true", z.boolean());
const emailText = z.string().trim().toLowerCase().email("Email tidak valid.").max(255);

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
  materialUrl: optionalUrl,
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

export const participantSchema = z.object({
  name: requiredText("Nama peserta"),
  email: emailText,
  address: requiredText("Alamat", 500),
  disabilityNeed: requiredText("Kebutuhan aksesibilitas", 500),
  localPotential: requiredText("Potensi lokal", 500),
  consentStatus: booleanFromCheckbox,
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const userSchema = z.object({
  name: requiredText("Nama pengguna"),
  email: emailText,
  role: z.enum(["ADMIN", "PARTICIPANT", "MENTOR", "PARTNER"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const programRegistrationSchema = z.object({
  programId: requiredText("Program"),
});

export const registrationStatusSchema = z.object({
  registrationId: requiredText("Pendaftaran"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const productSchema = z.object({
  name: requiredText("Nama produk"),
  category: requiredText("Kategori", 100),
  description: requiredText("Deskripsi produk", 1000),
  imageUrl: optionalUrl,
  status: z.enum(["PENDING", "PUBLISHED", "REJECTED"]).default("PENDING"),
});

export const productStatusSchema = z.object({
  productId: requiredText("Produk"),
  status: z.enum(["PENDING", "PUBLISHED", "REJECTED"]),
});

export const attendanceSchema = z.object({
  scheduleId: requiredText("Jadwal"),
  participantId: requiredText("Peserta"),
  status: z.enum(["PRESENT", "EXCUSED", "ABSENT"]),
});

export const progressSchema = z.object({
  participantId: requiredText("Peserta"),
  moduleId: requiredText("Modul"),
  completion: z.coerce.number().int().min(0).max(100),
  notes: requiredText("Catatan progres", 1000),
});

export const messageSchema = z.object({
  recipientId: requiredText("Penerima"),
  subject: requiredText("Subjek", 255),
  body: requiredText("Isi pesan", 2000),
});
