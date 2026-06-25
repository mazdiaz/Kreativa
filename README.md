# Kreativa

Website berbasis Pelatihan Vokasional dan Inkubasi Usaha Kreatif Berbasis Potensi Lokal bagi Kelompok Penyandang Disabilitas.

Aplikasi ini menggunakan Next.js untuk target deploy Vercel, dengan Prisma sebagai ORM dan Neon Postgres sebagai target database production.

## Stack

- Next.js App Router + TypeScript
- Prisma ORM
- Target database production: Neon Postgres
- Target deployment: Vercel
- Upload production: Vercel Blob atau URL gambar terkurasi

## Jalankan Lokal

Pastikan Node.js dan npm tersedia. Jika `node` belum masuk PATH pada PowerShell, pakai:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
```

Install dependency:

```powershell
npm install
```

Untuk build tanpa database cloud, gunakan env dummy agar Prisma generate bisa berjalan:

```powershell
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/kreativa?schema=public"
$env:DIRECT_URL = $env:DATABASE_URL
$env:AUTH_SECRET = "local-development-secret"
npm run build
```

Dev server:

```powershell
$env:DATABASE_URL = "<Neon pooled connection string>"
$env:DIRECT_URL = "<Neon direct/unpooled connection string>"
$env:AUTH_SECRET = "local-development-secret"
npm run dev
```

## Akun Awal

Seed database membuat akun awal berikut. Semua akun memakai password:

```text
password123
```

| Role | Email |
|---|---|
| Admin | admin@kreativa.com |
| Peserta | peserta@kreativa.com |
| Mentor | mentor@kreativa.com |
| Mitra | mitra@kreativa.com |

## Environment Vercel

Tambahkan environment variables berikut di Vercel:

```text
DATABASE_URL=<Neon pooled connection string>
DIRECT_URL=<Neon direct connection string>
AUTH_SECRET=<long random secret, minimal 32 karakter>
NEXT_PUBLIC_APP_URL=<production URL>
BLOB_READ_WRITE_TOKEN=<optional, for Vercel Blob>
```

## Database

Schema ada di `prisma/schema.prisma`. Setelah Neon siap:

```powershell
npx prisma migrate dev --name init
npx prisma db seed
```

Untuk perubahan schema yang sudah dicommit, jalankan migration ke Neon production sebelum atau sesudah deploy kode:

```powershell
$env:DATABASE_URL = "<Neon pooled connection string>"
$env:DIRECT_URL = "<Neon direct/unpooled connection string>"
npx prisma migrate deploy
```

Jika database baru dibuat dari kosong, jalankan seed setelah migration:

```powershell
npx prisma db seed
```

## Status Aplikasi

Yang sudah ada:

- Public landing page dan etalase produk.
- Login berbasis database `User` dengan bcrypt.
- Signed session cookie berbasis `AUTH_SECRET`.
- RBAC route protection untuk Admin, Peserta, Mentor, Mitra.
- Dashboard dan halaman role utama membaca data Neon.
- Admin: kelola peserta, validasi pendaftaran, kelola user/role, program, modul, jadwal, kurasi produk, inbox, laporan CSV, dan backup JSON.
- Peserta: daftar program, isi asesmen, lihat jadwal/progres, ajukan ide usaha, ajukan produk, dan inbox.
- Mentor: lihat peserta, catat mentoring, catat absensi, update progres modul, dan inbox.
- Mitra/public: melihat etalase produk published dan detail produk.
- Notifikasi: status pendaftaran, produk, pesan, absensi, dan progres masuk ke pusat notifikasi user.
- Prisma schema untuk model data TOGAF/RPL.
- Seed akun awal untuk database saat Neon tersedia.
- Unit test untuk auth, credential, validasi form, dan RBAC.

Catatan scope:

- Upload gambar memakai URL gambar terkurasi; Vercel Blob disiapkan sebagai dependency tetapi belum dipakai di form upload.
- Export laporan tersedia sebagai CSV. Export PDF dapat ditambahkan setelah format laporan final ditentukan.
