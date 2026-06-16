# Kreativa

Website berbasis Pelatihan Vokasional dan Inkubasi Usaha Kreatif Berbasis Potensi Lokal bagi Kelompok Penyandang Disabilitas.

MVP ini menggunakan Next.js untuk target deploy Vercel, dengan Prisma sebagai ORM dan Neon Postgres sebagai target database production.

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
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/inklusikarya?schema=public"
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

## Akun Demo

Seed database membuat akun awal berikut. Semua akun memakai password:

```text
password123
```

| Role | Email |
|---|---|
| Admin | admin@inklusikarya.test |
| Peserta | peserta@inklusikarya.test |
| Mentor | mentor@inklusikarya.test |
| Mitra | mitra@inklusikarya.test |

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

Untuk perubahan schema berikutnya, jalankan migration dari mesin lokal/CI yang punya `DIRECT_URL`, commit folder `prisma/migrations`, lalu deploy Vercel.

## Status MVP

Yang sudah ada:

- Public landing page dan etalase produk.
- Login berbasis database `User` dengan bcrypt.
- Signed session cookie berbasis `AUTH_SECRET`.
- RBAC route protection untuk Admin, Peserta, Mentor, Mitra.
- Dashboard dan halaman role utama membaca data Neon.
- CRUD program dasar, tambah modul, tambah jadwal.
- Submit asesmen, ide usaha, dan catatan mentoring ke Neon.
- Prisma schema untuk model data TOGAF/RPL.
- Seed demo untuk database saat Neon tersedia.
- Unit test untuk auth, credential, validasi form, dan RBAC.

Yang belum disambungkan penuh:

- Upload gambar memakai URL demo; Vercel Blob disiapkan sebagai dependency tetapi belum dipakai di form upload.
- Export laporan PDF belum dibuat.
