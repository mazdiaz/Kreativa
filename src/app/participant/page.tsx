import { ClipboardCheck, GraduationCap, Inbox, Lightbulb, ListChecks, ShoppingBag } from "lucide-react";

import { ActionList, DataTable, InsightBanner, MiniBarChart, PageHeader, SummaryPanel, WorkflowList } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getParticipantLearningData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ParticipantDashboard() {
  const user = await requireRole(["PARTICIPANT"]);
  const { modules, schedules } = await getParticipantLearningData(user.id);
  const moduleProgress = modules.map((item) => Math.max(8, item.completion || 8));

  return (
    <>
      <PageHeader
        eyebrow="Portal Peserta"
        title="Ruang Belajar dan Inkubasi"
        description="Pantau program, isi asesmen, lihat modul, dan ajukan ide usaha kreatif berbasis potensi lokal."
      />
      <InsightBanner title="Mulai dari sini" description="Daftar program aktif, isi asesmen, lalu pantau modul dan jadwal yang sudah dibuka." />
      <div style={{ height: "0.85rem" }} />
      <section className="dashboard-grid">
        <div className="dashboard-main">
          <ActionList
            items={[
              { href: "/participant/programs", label: "Daftar Program", description: "Ajukan pendaftaran program vokasional atau inkubasi.", icon: GraduationCap },
              { href: "/participant/assessment", label: "Isi Asesmen", description: "Lengkapi asesmen awal untuk rekomendasi jalur.", icon: ClipboardCheck },
              { href: "/participant/progress", label: "Lihat Progres", description: "Pantau modul, jadwal, dan perkembangan.", icon: ListChecks },
              { href: "/participant/business-ideas", label: "Ajukan Ide Usaha", description: "Dokumentasikan ide dan status review inkubasi.", icon: Lightbulb },
              { href: "/participant/products", label: "Produk Saya", description: "Ajukan produk untuk kurasi dan etalase.", icon: ShoppingBag },
              { href: "/participant/inbox", label: "Inbox", description: "Kirim pesan tindak lanjut ke mentor atau admin.", icon: Inbox },
            ]}
          />
          <section>
            <div className="dashboard-section-title">
              <h2>Modul Saya</h2>
              <span className="badge">{modules.length} Modul</span>
            </div>
            <DataTable headers={["Modul", "Progres"]} rows={modules.map((item) => [item.title, `${item.completion}%`])} />
          </section>
        </div>
        <div className="dashboard-side">
          <SummaryPanel title="Ringkasan Belajar">
            <MiniBarChart values={moduleProgress.length ? moduleProgress : [12, 28, 44, 36, 58, 72]} />
            <div className="progress-strip">
              {modules.slice(0, 4).map((item) => (
                <div className="progress-strip-row" key={item.id}>
                  <span>{item.title}</span>
                  <div className="progress" aria-label={`Progres ${item.completion} persen`}>
                    <span style={{ width: `${item.completion}%` }} />
                  </div>
                  <span>{item.completion}%</span>
                </div>
              ))}
            </div>
          </SummaryPanel>
          <WorkflowList
            items={[
              { title: "Daftar program", detail: "Pilih program aktif lalu tunggu validasi admin." },
              { title: "Lengkapi asesmen", detail: "Isi asesmen awal untuk rekomendasi jalur belajar." },
              { title: "Ikuti progres", detail: "Pantau jadwal, modul, absensi, dan perkembangan." },
              { title: "Ajukan karya", detail: "Kirim ide usaha dan produk untuk proses inkubasi." },
            ]}
          />
          <SummaryPanel title="Jadwal Terdekat">
            <DataTable headers={["Kegiatan", "Tanggal"]} rows={schedules.slice(0, 4).map((item) => [item.title, item.date])} />
          </SummaryPanel>
        </div>
      </section>
    </>
  );
}
