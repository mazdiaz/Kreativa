export const programs = [
  {
    id: "program-kriya-kreativa",
    name: "Pelatihan Kriya Kreatif Berbasis Potensi Lokal",
    type: "Vokasional",
    description: "Program pengembangan keterampilan kriya, pengemasan, dan pemasaran produk.",
    period: "2026-Q3",
    status: "OPEN",
  },
  {
    id: "program-kuliner-inklusif",
    name: "Inkubasi Kuliner Lokal Inklusif",
    type: "Inkubasi Usaha",
    description: "Pendampingan produksi makanan ringan, higienitas, costing, dan validasi pasar.",
    period: "2026-Q3",
    status: "OPEN",
  },
  {
    id: "program-desain-digital",
    name: "Desain Digital dan Branding Produk",
    type: "Vokasional",
    description: "Pelatihan desain konten, foto produk, katalog digital, dan identitas merek.",
    period: "2026-Q4",
    status: "OPEN",
  },
  {
    id: "program-pemasaran-online",
    name: "Pemasaran Online untuk UMKM Difabel",
    type: "Inkubasi Usaha",
    description: "Pendampingan promosi online, copywriting, kanal penjualan, dan layanan pelanggan.",
    period: "2026-Q4",
    status: "OPEN",
  },
];

export const modules = [
  { id: "module-kriya-dasar", programId: "program-kriya-kreativa", title: "Dasar Kriya dan Desain Produk", description: "Teknik dasar, keselamatan kerja, dan desain produk sederhana.", materialUrl: "" },
  { id: "module-kriya-kemasan", programId: "program-kriya-kreativa", title: "Kemasan dan Kurasi Produk Kriya", description: "Standar kualitas, foto produk, dan kemasan siap jual.", materialUrl: "" },
  { id: "module-kuliner-higienitas", programId: "program-kuliner-inklusif", title: "Higienitas Produksi Kuliner", description: "Alur produksi bersih, penyimpanan bahan, dan standar keamanan pangan.", materialUrl: "" },
  { id: "module-kuliner-costing", programId: "program-kuliner-inklusif", title: "Costing dan Harga Jual", description: "Menghitung biaya bahan, tenaga, kemasan, margin, dan harga jual.", materialUrl: "" },
  { id: "module-desain-canva", programId: "program-desain-digital", title: "Desain Konten Produk", description: "Membuat katalog sederhana dan konten promosi dengan template aksesibel.", materialUrl: "" },
  { id: "module-desain-foto", programId: "program-desain-digital", title: "Foto Produk Dasar", description: "Pencahayaan, komposisi, background, dan editing ringan.", materialUrl: "" },
  { id: "module-marketing-copy", programId: "program-pemasaran-online", title: "Copywriting Produk", description: "Menulis deskripsi produk yang jelas, persuasif, dan mudah dipahami.", materialUrl: "" },
  { id: "module-marketing-channel", programId: "program-pemasaran-online", title: "Kanal Promosi Online", description: "Memilih kanal promosi, jadwal posting, dan pencatatan calon pelanggan.", materialUrl: "" },
];

export const schedules = [
  { id: "schedule-kriya-1", programId: "program-kriya-kreativa", title: "Workshop Kriya Pertama", date: "2026-07-10T09:00:00+07:00", location: "Ruang Pelatihan Bandung" },
  { id: "schedule-kriya-2", programId: "program-kriya-kreativa", title: "Review Produk Kriya", date: "2026-07-17T09:00:00+07:00", location: "Ruang Pelatihan Bandung" },
  { id: "schedule-kuliner-1", programId: "program-kuliner-inklusif", title: "Praktik Produksi Kuliner", date: "2026-07-12T10:00:00+07:00", location: "Dapur Komunitas" },
  { id: "schedule-kuliner-2", programId: "program-kuliner-inklusif", title: "Simulasi Harga Jual", date: "2026-07-19T10:00:00+07:00", location: "Dapur Komunitas" },
  { id: "schedule-desain-1", programId: "program-desain-digital", title: "Kelas Desain Konten", date: "2026-08-03T13:00:00+07:00", location: "Lab Komputer Inklusif" },
  { id: "schedule-marketing-1", programId: "program-pemasaran-online", title: "Kelas Promosi Online", date: "2026-08-10T13:00:00+07:00", location: "Lab Komputer Inklusif" },
];

export const registrations = [
  { id: "registration-peserta-kriya", programId: "program-kriya-kreativa", status: "APPROVED" },
  { id: "registration-peserta-kuliner", programId: "program-kuliner-inklusif", status: "APPROVED" },
  { id: "registration-peserta-desain", programId: "program-desain-digital", status: "PENDING" },
  { id: "registration-peserta-marketing", programId: "program-pemasaran-online", status: "PENDING" },
];

export const assessments = [
  { id: "assessment-peserta-kriya", score: 82, recommendation: "Kriya kreatif dan pemasaran digital dasar", notes: "Peserta memiliki minat kuat pada produk berbasis kain lokal." },
  { id: "assessment-peserta-kuliner", score: 76, recommendation: "Produksi kuliner rumahan dan costing dasar", notes: "Peserta membutuhkan pendampingan pada pencatatan biaya dan standar kemasan." },
];

export const attendances = [
  { id: "attendance-kriya-1", scheduleId: "schedule-kriya-1", status: "HADIR" },
  { id: "attendance-kriya-2", scheduleId: "schedule-kriya-2", status: "HADIR" },
  { id: "attendance-kuliner-1", scheduleId: "schedule-kuliner-1", status: "HADIR" },
  { id: "attendance-kuliner-2", scheduleId: "schedule-kuliner-2", status: "IZIN" },
  { id: "attendance-desain-1", scheduleId: "schedule-desain-1", status: "TERJADWAL" },
  { id: "attendance-marketing-1", scheduleId: "schedule-marketing-1", status: "TERJADWAL" },
];

export const progressRecords = [
  { id: "progress-kriya-dasar", moduleId: "module-kriya-dasar", completion: 90, notes: "Mampu membuat pola dan produk sederhana." },
  { id: "progress-kriya-kemasan", moduleId: "module-kriya-kemasan", completion: 65, notes: "Perlu latihan foto produk dan label kemasan." },
  { id: "progress-kuliner-higienitas", moduleId: "module-kuliner-higienitas", completion: 80, notes: "Sudah memahami alur produksi bersih." },
  { id: "progress-kuliner-costing", moduleId: "module-kuliner-costing", completion: 55, notes: "Masih perlu pendampingan menghitung margin." },
  { id: "progress-desain-canva", moduleId: "module-desain-canva", completion: 25, notes: "Mulai mengenal template desain konten." },
  { id: "progress-marketing-copy", moduleId: "module-marketing-copy", completion: 20, notes: "Latihan deskripsi produk sedang berjalan." },
];

export const mentoringSessions = [
  { id: "mentoring-kriya-brand", topic: "Validasi Produk Tas Kain", notes: "Produk sudah layak masuk kurasi dengan revisi minor pada label.", nextAction: "Perbaiki label ukuran dan bahan.", sessionDate: "2026-07-18T10:00:00+07:00" },
  { id: "mentoring-kuliner-cost", topic: "Review Harga Jual Kue Kering", notes: "Harga jual perlu memasukkan biaya kemasan dan transport.", nextAction: "Lengkapi tabel biaya per batch.", sessionDate: "2026-07-20T10:00:00+07:00" },
  { id: "mentoring-digital-content", topic: "Rencana Konten Etalase", notes: "Foto produk perlu dibuat konsisten dengan latar cerah.", nextAction: "Ambil ulang foto untuk tiga produk utama.", sessionDate: "2026-08-05T14:00:00+07:00" },
];

export const businessIdeas = [
  { id: "idea-tas-kain-perca", title: "Tas Kain Perca Inklusif", description: "Produk tas harian dari sisa kain lokal.", localPotential: "Kain perca dari penjahit lokal", status: "IN_REVIEW" },
  { id: "idea-snack-singkong", title: "Snack Singkong Rempah", description: "Makanan ringan berbasis singkong lokal dengan varian rasa rempah.", localPotential: "Singkong petani sekitar Bandung", status: "APPROVED" },
  { id: "idea-katalog-digital", title: "Jasa Katalog Digital Produk UMKM", description: "Layanan desain katalog sederhana untuk pelaku usaha lokal.", localPotential: "UMKM binaan komunitas", status: "SUBMITTED" },
  { id: "idea-sabun-herbal", title: "Sabun Herbal Kemasan Daur Ulang", description: "Produk sabun herbal dengan kemasan ramah lingkungan.", localPotential: "Tanaman herbal lokal dan kertas daur ulang", status: "NEEDS_REVISION" },
];

export const products = [
  { id: "product-tas-perca", name: "Tas Perca Mandiri", category: "Kriya", description: "Tas kain buatan peserta dengan motif lokal.", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop", status: "PUBLISHED" },
  { id: "product-dompet-tenun", name: "Dompet Tenun Aksesibel", category: "Kriya", description: "Dompet kecil dari kain tenun lokal dengan label bahan yang jelas.", imageUrl: "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?q=80&w=1200&auto=format&fit=crop", status: "PUBLISHED" },
  { id: "product-snack-singkong", name: "Snack Singkong Rempah", category: "Kuliner", description: "Camilan singkong renyah dengan bumbu rempah lokal.", imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=1200&auto=format&fit=crop", status: "PUBLISHED" },
  { id: "product-kue-kering", name: "Kue Kering Nusa", category: "Kuliner", description: "Kue kering rumahan dengan kemasan siap hadiah.", imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1200&auto=format&fit=crop", status: "PUBLISHED" },
  { id: "product-katalog-umkm", name: "Paket Katalog Digital", category: "Jasa Digital", description: "Desain katalog produk sederhana untuk promosi UMKM.", imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop", status: "PUBLISHED" },
  { id: "product-sabun-herbal", name: "Sabun Herbal Lokal", category: "Kriya", description: "Sabun herbal dengan kemasan daur ulang yang sedang dikurasi.", imageUrl: "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?q=80&w=1200&auto=format&fit=crop", status: "PENDING" },
];

export const messages = [
  { id: "message-admin-peserta", senderEmail: "admin@kreativa.com", recipientEmail: "peserta@kreativa.com", subject: "Validasi kebutuhan aksesibilitas", body: "Mohon lengkapi catatan kebutuhan aksesibilitas sebelum jadwal pelatihan berikutnya." },
  { id: "message-mentor-peserta", senderEmail: "mentor@kreativa.com", recipientEmail: "peserta@kreativa.com", subject: "Tindak lanjut mentoring", body: "Silakan perbaiki label produk dan unggah foto terbaru sebelum kurasi." },
  { id: "message-mitra-admin", senderEmail: "mitra@kreativa.com", recipientEmail: "admin@kreativa.com", subject: "Minat kerja sama etalase", body: "Kami tertarik melihat katalog produk peserta untuk kurasi mitra bulan ini." },
];

export const notifications = [
  { id: "notification-registration", userEmail: "admin@kreativa.com", title: "Pendaftaran menunggu validasi", body: "Ada pendaftaran program yang perlu ditinjau." },
  { id: "notification-product", userEmail: "admin@kreativa.com", title: "Produk menunggu kurasi", body: "Sabun Herbal Lokal menunggu keputusan kurasi." },
  { id: "notification-progress", userEmail: "peserta@kreativa.com", title: "Progres pelatihan diperbarui", body: "Progres modul kriya sudah dicatat oleh mentor." },
  { id: "notification-mentoring", userEmail: "peserta@kreativa.com", title: "Catatan mentoring baru", body: "Mentor menambahkan tindak lanjut untuk produk tas kain." },
];

export const reports = [
  { id: "report-2026-q3-impact", period: "2026-Q3", type: "Dampak Program", summary: "Program Q3 memiliki empat pendaftaran aktif, enam produk demo, dan progres pelatihan awal yang dapat dipantau.", generatedBy: "admin@kreativa.com" },
  { id: "report-2026-q3-showcase", period: "2026-Q3", type: "Etalase Produk", summary: "Lima produk published siap ditampilkan untuk mitra dan publik, satu produk masih menunggu kurasi.", generatedBy: "admin@kreativa.com" },
];

export const auditLogs = [
  { id: "audit-seed-programs", actorEmail: "admin@kreativa.com", action: "SEED_PROGRAMS", object: "Program:*", metadata: { count: programs.length } },
  { id: "audit-seed-products", actorEmail: "admin@kreativa.com", action: "SEED_PRODUCTS", object: "Product:*", metadata: { count: products.length } },
  { id: "audit-seed-reports", actorEmail: "admin@kreativa.com", action: "SEED_REPORTS", object: "Report:*", metadata: { count: reports.length } },
];
