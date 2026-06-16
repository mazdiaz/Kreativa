import Link from "next/link";

import { programs, reports } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Platform pelatihan inklusif</p>
          <h1>Model Pelatihan Vokasional dan Inkubasi Usaha Kreatif</h1>
          <p>
            Sistem berbasis potensi lokal untuk mengelola pendaftaran, asesmen, pelatihan, mentoring,
            inkubasi usaha, etalase produk, dan pelaporan bagi kelompok penyandang disabilitas.
          </p>
          <div className="nav-links">
            <Link className="button" href="/login">
              Masuk ke Sistem
            </Link>
            <Link className="button secondary" href="/showcase">
              Lihat Etalase
            </Link>
          </div>
        </div>
        <div className="card">
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
      <section className="grid grid-4" aria-label="Ringkasan platform">
        {reports.map((item) => (
          <article className="card" key={item.label}>
            <div className="metric">{item.value}</div>
            <h3>{item.label}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>
    </>
  );
}
