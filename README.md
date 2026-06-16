# Inklusi Karya Nusantara Website

MVP Next.js untuk platform pelatihan vokasional dan inkubasi usaha kreatif berbasis potensi lokal bagi kelompok penyandang disabilitas.

## Stack

- Next.js App Router + TypeScript
- Prisma ORM
- Target database production: Neon Postgres
- Target deployment: Vercel
- Upload production: Vercel Blob atau URL gambar terkurasi

## Jalankan Lokal

Pastikan Node.js dan npm tersedia. Pada mesin ini, jika `node` belum masuk PATH, pakai:

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
npm run build
```

Dev server:

```powershell
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/inklusikarya?schema=public"
$env:DIRECT_URL = $env:DATABASE_URL
npm run dev
```

## Akun Demo

Semua akun demo memakai password:

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
AUTH_SECRET=<long random secret>
NEXT_PUBLIC_APP_URL=<production URL>
BLOB_READ_WRITE_TOKEN=<optional, for Vercel Blob>
```

## Database

Schema ada di `prisma/schema.prisma`. Setelah Neon siap:

```powershell
npx prisma migrate dev --name init
npx prisma db seed
```

Untuk production, jalankan migration dari mesin lokal/CI yang punya `DIRECT_URL`, lalu deploy Vercel.

## Status MVP

Yang sudah ada:

- Public landing page dan etalase produk.
- Login demo credentials.
- RBAC route protection untuk Admin, Peserta, Mentor, Mitra.
- Dashboard dan halaman role utama.
- Prisma schema untuk model data TOGAF/RPL.
- Seed demo untuk database saat Neon tersedia.
- Unit test untuk auth/RBAC.

Yang belum disambungkan penuh:

- CRUD database production masih memakai data demo fallback di UI.
- Upload gambar memakai URL demo; Vercel Blob disiapkan sebagai dependency tetapi belum dipakai di form upload.
- Export laporan PDF belum dibuat.
