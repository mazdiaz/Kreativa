import { CalendarCheck, ClipboardCheck, Inbox, Users } from "lucide-react";

import { ActionList, DataTable, InsightBanner, MiniBarChart, PageHeader, SummaryPanel, WorkflowList } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getMentorDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MentorDashboard() {
  const user = await requireRole(["MENTOR"]);
  const { messages, participants, sessions } = await getMentorDashboardData(user.id);
  const participantProgress = participants.slice(0, 8).map((item) => Math.max(8, item.progress || 8));

  return (
    <>
      <PageHeader
        eyebrow="Portal Mentor"
        title="Pendampingan Peserta"
        description="Pantau peserta bimbingan, catat sesi mentoring, dan gunakan inbox sederhana untuk tindak lanjut."
      />
      <InsightBanner title="Prioritas pendampingan" description="Cek peserta dengan progres rendah, catat sesi, lalu update absensi dan tindak lanjut." />
      <div style={{ height: "0.85rem" }} />
      <section className="dashboard-grid">
        <div className="dashboard-main">
          <ActionList
            items={[
              { href: "/mentor/participants", label: "Peserta Bimbingan", description: "Lihat progres dan kebutuhan pendampingan.", icon: Users },
              { href: "/mentor/sessions", label: "Catatan Mentoring", description: "Dokumentasikan sesi, catatan, dan tindak lanjut.", icon: ClipboardCheck },
              { href: "/mentor/attendance", label: "Absensi & Progres", description: "Catat kehadiran dan perkembangan modul.", icon: CalendarCheck },
              { href: "/mentor/inbox", label: "Inbox", description: "Kelola pesan peserta tanpa chat realtime.", icon: Inbox },
            ]}
          />
          <section>
            <div className="dashboard-section-title">
              <h2>Peserta Bimbingan</h2>
              <span className="badge">{participants.length} Peserta</span>
            </div>
            <DataTable headers={["Nama", "Program", "Progres", "Kebutuhan"]} rows={participants.map((item) => [item.name, item.program, `${item.progress}%`, item.disabilityNeed])} />
          </section>
          <section>
            <div className="dashboard-section-title">
              <h2>Sesi Terbaru</h2>
            </div>
            <DataTable headers={["Peserta", "Topik", "Tindak Lanjut", "Tanggal"]} rows={sessions.map((item) => [item.participant, item.topic, item.nextAction, item.date])} />
          </section>
        </div>
        <div className="dashboard-side">
          <SummaryPanel title="Sebaran Progres">
            <MiniBarChart values={participantProgress.length ? participantProgress : [18, 32, 40, 52, 44, 76]} />
            <div className="progress-strip">
              {participants.slice(0, 4).map((item) => (
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
              { title: "Lihat peserta", detail: "Cek peserta, program, progres, dan kebutuhan dukungan." },
              { title: "Catat mentoring", detail: "Simpan topik, catatan, dan tindak lanjut sesi." },
              { title: "Update absensi", detail: "Catat kehadiran dan persentase penyelesaian modul." },
              { title: "Tindak lanjut", detail: "Gunakan inbox untuk koordinasi peserta dan admin." },
            ]}
          />
          <SummaryPanel title="Inbox">
            <DataTable headers={["Dari", "Subjek", "Status"]} rows={messages.slice(0, 4).map((item) => [item.sender, item.subject, item.read ? "Sudah dibaca" : "Belum dibaca"])} />
          </SummaryPanel>
        </div>
      </section>
    </>
  );
}
