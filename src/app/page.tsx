import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

import { StatGrid, WorkflowList, ProductGrid } from "@/components/dashboard";
import { getActivePrograms, getDashboardStats, getShowcaseProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [programs, reports, allProducts] = await Promise.all([
    getActivePrograms(),
    getDashboardStats(),
    getShowcaseProducts(),
  ]);

  // Display only the first 3 products for the landing page preview
  const showcasePreview = allProducts.slice(0, 3);

  return (
    <>
      {/* 1. Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles aria-hidden="true" size={12} style={{ display: "inline-block", marginRight: "4px", verticalAlign: "middle" }} />
            Model Pelatihan Inklusif
          </span>
          <h1>Pelatihan Vokasional & Inkubasi Usaha Kreatif Disabilitas</h1>
          <p>
            Mendorong kemandirian ekonomi penyandang disabilitas melalui bimbingan terstruktur, 
            mentoring intensif, dan pemasaran produk kreatif lokal yang berdaya saing tinggi.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/login">
              Masuk ke Sistem
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link className="button secondary" href="/showcase">
              Lihat Etalase Karya
            </Link>
          </div>
        </div>

        {/* 2. Interactive Mockup Dashboard */}
        <div className="hero-panel">
          <div className="mockup-dashboard">
            <div className="mockup-sidebar">
              <span className="active" />
              <span />
              <span />
              <span />
            </div>
            <div className="mockup-main">
              <div className="mockup-top">
                <span className="mockup-logo">Kreativa Dashboard</span>
                <span className="mockup-avatar" />
              </div>
              <div className="mockup-body">
                <div className="mockup-grid">
                  <div className="mockup-card">
                    <div />
                    <div />
                  </div>
                  <div className="mockup-card">
                    <div style={{ width: "80%" }} />
                    <div style={{ background: "var(--green-soft)" }} />
                  </div>
                  <div className="mockup-card">
                    <div style={{ width: "50%" }} />
                    <div style={{ background: "var(--amber-soft)" }} />
                  </div>
                </div>
                <div className="mockup-bottom">
                  <div className="mockup-row">
                    <span />
                    <span />
                  </div>
                  <div className="mockup-row" style={{ marginTop: "8px" }}>
                    <span style={{ width: "45%" }} />
                    <span style={{ width: "30%", background: "var(--primary-soft)" }} />
                  </div>
                  <div className="mockup-row" style={{ marginTop: "8px" }}>
                    <span style={{ width: "60%" }} />
                    <span style={{ width: "15%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Impact & Stats Strip */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="dashboard-section-title">
          <h2>Dampak & Statistik Program</h2>
          <span className="badge">Data Terkini</span>
        </div>
        <StatGrid items={reports} />
      </div>

      {/* 4. Active Programs Section */}
      <section style={{ marginBottom: "3rem" }}>
        <div className="dashboard-section-title">
          <h2>Program Pelatihan & Inkubasi Aktif</h2>
          <Link href="/login" style={{ fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
            Daftar Program
            <ArrowRight aria-hidden="true" size={14} />
          </Link>
        </div>
        <div className="grid grid-3">
          {programs.length > 0 ? (
            programs.map((program) => (
              <article className="card card-interactive" key={program.id} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <span className="badge" style={{ marginBottom: "0.5rem" }}>{program.type}</span>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{program.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineBreak: "anywhere" }}>{program.description}</p>
                </div>
                <div style={{ marginTop: "auto", paddingTop: "0.75rem", fontSize: "0.8rem", color: "var(--text-faint)", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
                  <span>Periode: <strong>{program.period}</strong></span>
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>{program.status}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="card" style={{ gridColumn: "span 3", textAlign: "center", padding: "2rem" }}>
              <BookOpen size={24} style={{ color: "var(--text-faint)", marginBottom: "0.5rem" }} />
              <p>Belum ada program pelatihan yang dibuka saat ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Showcase Preview Section */}
      <section style={{ marginBottom: "3rem" }}>
        <div className="dashboard-section-title">
          <h2>Etalase Produk Karya Peserta</h2>
          <Link href="/showcase" style={{ fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
            Lihat Semua Produk
            <ArrowRight aria-hidden="true" size={14} />
          </Link>
        </div>
        {showcasePreview.length > 0 ? (
          <ProductGrid products={showcasePreview} actionLabel="Detail Produk" />
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
            <p style={{ color: "var(--text-muted)" }}>Belum ada produk hasil inkubasi yang ditampilkan.</p>
          </div>
        )}
      </section>

      {/* 6. Step-by-Step Roles & Workflow */}
      <section style={{ marginBottom: "3.5rem" }}>
        <div className="dashboard-section-title">
          <h2>Bagaimana Platform Kreativa Bekerja</h2>
        </div>
        <WorkflowList
          items={[
            { title: "1. Manajemen Program", detail: "Administrator menyiapkan pendaftaran, modul pelatihan vokasional, jadwal bimbingan, dan evaluasi hasil belajar." },
            { title: "2. Belajar & Uji Kompetensi", detail: "Peserta difabel melakukan asesmen minat bakat, mempelajari modul vokasional, serta melacak progres belajar mandiri." },
            { title: "3. Mentoring & Inkubasi Usaha", detail: "Mentor ahli mendampingi secara berkala, mencatat sesi konsultasi, dan memberikan saran praktis pengembangan ide bisnis lokal." },
            { title: "4. Akses Pasar & Kurasi Karya", detail: "Produk unggulan hasil kerajinan dan karya peserta dikurasi oleh admin untuk dipasarkan kepada mitra industri dan masyarakat umum." },
          ]}
        />
      </section>

      {/* 7. Final Call-to-Action Panel */}
      <section className="card" style={{ background: "linear-gradient(135deg, var(--navy-strong) 0%, var(--navy) 100%)", color: "white", padding: "3rem 2rem", textAlign: "center", borderRadius: "var(--radius-lg)" }}>
        <h2 style={{ color: "white", fontSize: "2rem", marginBottom: "0.5rem" }}>Mari Berkolaborasi Mendukung Kemandirian Difabel</h2>
        <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto 1.5rem" }}>
          Bergabunglah sebagai peserta, mentor pendamping, ataupun mitra industri untuk membangun ekosistem ekonomi lokal yang ramah dan inklusif.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="button" href="/login" style={{ background: "var(--primary)", color: "white" }}>
            Mulai Sekarang
          </Link>
          <Link className="button secondary" href="/showcase" style={{ background: "rgba(255,255,255,0.05)", color: "white", borderColor: "rgba(255,255,255,0.1)" }}>
            Jelajahi Produk
          </Link>
        </div>
      </section>
    </>
  );
}
