import Link from "next/link";

import { StatGrid, WorkflowList } from "@/components/dashboard";
import { getActivePrograms, getDashboardStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [programs, reports] = await Promise.all([getActivePrograms(), getDashboardStats()]);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Platform pelatihan inklusif</p>
          <h1>Model Pelatihan Vokasional dan Inkubasi Usaha Kreatif</h1>
          <p>
            Sistem berbasis potensi lokal untuk mengelola pendaftaran, asesmen, pelatihan, mentoring,
            inkubasi usaha, etalase produk, dan pelaporan bagi kelompok penyandang disabilitas.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/login">
              Masuk ke Sistem
            </Link>
            <Link className="button secondary" href="/showcase">
              Lihat Etalase
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <h2>Program Aktif</h2>
          <div className="grid">
            {programs.map((program) => (
              <article className="card" key={program.id}>
                <span className="badge">{program.type}</span>
                <h3>{program.name}</h3>
                <p>{program.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <StatGrid items={reports} />
      <div style={{ height: "1rem" }} />
      <WorkflowList
        items={[
          { title: "Kelola program", detail: "Admin menyiapkan peserta, program, modul, jadwal, dan laporan." },
          { title: "Ikuti pelatihan", detail: "Peserta daftar program, mengisi asesmen, dan memantau progres." },
          { title: "Dampingi inkubasi", detail: "Mentor mencatat mentoring, absensi, progres, dan tindak lanjut." },
          { title: "Tampilkan karya", detail: "Produk yang dikurasi tampil di etalase untuk mitra dan publik." },
        ]}
      />
    </>
  );
}
