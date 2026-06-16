export type AppRole = "ADMIN" | "PARTICIPANT" | "MENTOR" | "PARTNER";

export const demoUsers = [
  { id: "u-admin", name: "Admin Program", email: "admin@inklusikarya.test", password: "password123", role: "ADMIN" as AppRole },
  { id: "u-participant", name: "Siti Rahma", email: "peserta@inklusikarya.test", password: "password123", role: "PARTICIPANT" as AppRole },
  { id: "u-mentor", name: "Budi Mentor", email: "mentor@inklusikarya.test", password: "password123", role: "MENTOR" as AppRole },
  { id: "u-partner", name: "Mitra Nusantara", email: "mitra@inklusikarya.test", password: "password123", role: "PARTNER" as AppRole },
];

export const programs = [
  {
    id: "program-kriya",
    name: "Pelatihan Kriya Kreatif Berbasis Potensi Lokal",
    type: "Vokasional",
    status: "OPEN",
    period: "2026-Q3",
    description: "Pengembangan keterampilan kriya, pengemasan, dan pemasaran produk peserta.",
  },
  {
    id: "program-kuliner",
    name: "Inkubasi Kuliner Lokal Inklusif",
    type: "Inkubasi",
    status: "OPEN",
    period: "2026-Q3",
    description: "Pendampingan ide usaha kuliner, validasi produk, dan etalase digital.",
  },
];

export const participants = [
  {
    id: "participant-1",
    userId: "u-participant",
    name: "Siti Rahma",
    disabilityNeed: "Dukungan navigasi visual dan instruksi ringkas",
    localPotential: "Kain perca dan kriya lokal",
    address: "Bandung",
    program: programs[0].name,
    progress: 68,
    status: "Aktif",
  },
  {
    id: "participant-2",
    userId: "u-demo-2",
    name: "Raka Pratama",
    disabilityNeed: "Navigasi keyboard dan teks besar",
    localPotential: "Olahan singkong lokal",
    address: "Cimahi",
    program: programs[1].name,
    progress: 42,
    status: "Asesmen",
  },
];

export const modules = [
  { id: "module-1", programId: "program-kriya", title: "Dasar Kriya dan Desain Produk", completion: 80 },
  { id: "module-2", programId: "program-kriya", title: "Pengemasan dan Foto Produk", completion: 55 },
  { id: "module-3", programId: "program-kuliner", title: "Validasi Ide Usaha Kuliner", completion: 35 },
];

export const schedules = [
  { id: "schedule-1", title: "Workshop Kriya Pertama", program: programs[0].name, date: "10 Juli 2026", location: "Ruang Pelatihan Bandung" },
  { id: "schedule-2", title: "Mentoring Ide Usaha", program: programs[1].name, date: "12 Juli 2026", location: "Online" },
];

export const mentoringSessions = [
  {
    id: "session-1",
    participant: "Siti Rahma",
    mentor: "Budi Mentor",
    topic: "Validasi produk tas kain perca",
    notes: "Perlu memperjelas target pembeli dan ukuran produk.",
    nextAction: "Membuat 2 variasi desain dan estimasi harga.",
    date: "8 Juli 2026",
  },
];

export const messages = [
  { id: "msg-1", sender: "Siti Rahma", recipient: "Budi Mentor", subject: "Review desain produk", body: "Mohon review foto produk terbaru.", read: false },
  { id: "msg-2", sender: "Budi Mentor", recipient: "Siti Rahma", subject: "Catatan mentoring", body: "Tambahkan informasi ukuran dan bahan.", read: true },
];

export const businessIdeas = [
  { id: "idea-1", participant: "Siti Rahma", title: "Tas Kain Perca Inklusif", localPotential: "Kain perca dari penjahit lokal", status: "IN_REVIEW" },
  { id: "idea-2", participant: "Raka Pratama", title: "Keripik Singkong Rempah", localPotential: "Singkong lokal dan rempah daerah", status: "SUBMITTED" },
];

export const products = [
  {
    id: "product-1",
    participant: "Siti Rahma",
    name: "Tas Perca Mandiri",
    category: "Kriya",
    description: "Tas kain buatan peserta dengan motif lokal dan proses produksi berkelanjutan.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "product-2",
    participant: "Raka Pratama",
    name: "Keripik Singkong Rempah",
    category: "Kuliner",
    description: "Camilan berbasis singkong lokal dengan kemasan siap jual.",
    imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=1200&auto=format&fit=crop",
  },
];

export const reports = [
  { label: "Peserta aktif", value: "24", detail: "18 mengikuti pelatihan, 6 inkubasi usaha" },
  { label: "Rata-rata progres", value: "62%", detail: "Berdasarkan modul yang sudah dibuka" },
  { label: "Produk etalase", value: "12", detail: "Produk telah dikurasi admin" },
  { label: "Sesi mentoring", value: "31", detail: "Dalam periode berjalan" },
];
