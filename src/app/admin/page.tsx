import { Archive, ClipboardCheck, Inbox, PackageCheck, ShieldCheck, Users, BookOpen } from "lucide-react";

import { ActionList, DataTable, InsightBanner, MiniBarChart, PageHeader, StatGrid, SummaryPanel, WorkflowList } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getActivePrograms, getAdminParticipants, getDashboardStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireRole(["ADMIN"]);
  const [participants, programs, reports] = await Promise.all([getAdminParticipants(), getActivePrograms(), getDashboardStats()]);
  const progressValues = participants.slice(0, 8).map((item) => Math.max(8, item.progress || 8));

  return (
    <>
      <PageHeader
        eyebrow="Dashboard Admin"
        title="Kontrol Operasional Program"
        description="Kelola peserta, program, modul, jadwal, laporan, dan kontrol data inti untuk platform inklusif."
      />
      <StatGrid items={reports} />
      <div style={{ height: "0.85rem" }} />
      <InsightBanner
        title="Saran operasional"
        description="Mulai dari validasi peserta dan produk, lalu gunakan laporan untuk melihat dampak program."
      />
      <div style={{ height: "0.85rem" }} />
      <section className="dashboard-grid">
        <div className="dashboard-main">
          <section>
            <div className="dashboard-section-title">
              <h2>Peserta Terbaru</h2>
              <span className="badge">Data Aktif</span>
            </div>
            <DataTable
              headers={["Nama", "Program", "Kebutuhan", "Progres", "Status"]}
              rows={participants.map((item) => [
                item.name,
                item.program,
                item.disabilityNeed,
                `${item.progress}%`,
                <span className="badge" key={item.status}>{item.status}</span>,
              ])}
            />
          </section>
          <section>
            <div className="dashboard-section-title">
              <h2>Aksi Operasional</h2>
            </div>
            <ActionList
              items={[
                { href: "/admin/participants", label: "Kelola Peserta", description: "Profil, status program, dan kebutuhan aksesibilitas.", icon: Users },
                { href: "/admin/programs", label: "Kelola Program", description: "Program, modul, jadwal, dan periode pelatihan.", icon: BookOpen },
                { href: "/admin/products", label: "Kurasi Produk", description: "Validasi produk sebelum tampil di etalase.", icon: PackageCheck },
                { href: "/admin/reports", label: "Laporan", description: "Pantau progres dan keluaran program.", icon: ClipboardCheck },
                { href: "/admin/users", label: "User & Role", description: "Akun dan hak akses role platform.", icon: ShieldCheck },
                { href: "/admin/inbox", label: "Inbox Admin", description: "Koordinasi dengan peserta dan mentor.", icon: Inbox },
              ]}
            />
          </section>
        </div>
        <div className="dashboard-side">
          <SummaryPanel title="Progres Peserta">
            <MiniBarChart values={progressValues.length ? progressValues : [12, 24, 18, 36, 52, 44, 68, 58]} />
            <div className="progress-strip">
              {participants.slice(0, 3).map((item) => (
                <div className="progress-strip-row" key={item.id}>
                  <span>{item.name}</span>
                  <div className="progress" aria-label={`Progres ${item.progress} persen`}>
                    <span style={{ width: `${item.progress}%` }} />
                  </div>
                  <span>{item.progress}%</span>
                </div>
              ))}
            </div>
          </SummaryPanel>
          <WorkflowList
            items={[
              { title: "Siapkan peserta", detail: "Tambah peserta dan validasi kebutuhan aksesibilitas." },
              { title: "Kelola program", detail: "Buat program, modul, jadwal, dan periode pelatihan." },
              { title: "Validasi & kurasi", detail: "Setujui pendaftaran dan produk sebelum tampil publik." },
              { title: "Pantau laporan", detail: "Unduh CSV atau backup JSON untuk arsip operasional." },
            ]}
          />
          <SummaryPanel title="Program Aktif">
            <DataTable
              headers={["Program", "Status"]}
              rows={programs.map((program) => [program.name, program.status])}
            />
          </SummaryPanel>
          <a className="button secondary compact" href="/admin/backup">
            <Archive aria-hidden="true" size={15} />
            Backup Data
          </a>
        </div>
      </section>
    </>
  );
}
