import { CalendarCheck, ClipboardCheck, Inbox, Users } from "lucide-react";

import { ActionList, DataTable, PageHeader, WorkflowList } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getMentorDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MentorDashboard() {
  const user = await requireRole(["MENTOR"]);
  const { messages, participants, sessions } = await getMentorDashboardData(user.id);

  return (
    <>
      <PageHeader
        eyebrow="Portal Mentor"
        title="Pendampingan Peserta"
        description="Pantau peserta bimbingan, catat sesi mentoring, dan gunakan inbox sederhana untuk tindak lanjut."
      />
      <WorkflowList
        items={[
          { title: "Lihat peserta", detail: "Cek peserta, program, progres, dan kebutuhan dukungan." },
          { title: "Catat mentoring", detail: "Simpan topik, catatan, dan tindak lanjut sesi." },
          { title: "Update absensi", detail: "Catat kehadiran dan persentase penyelesaian modul." },
          { title: "Tindak lanjut", detail: "Gunakan inbox untuk koordinasi peserta dan admin." },
        ]}
      />
      <div style={{ height: "1.5rem" }} />
      <ActionList
        items={[
          { href: "/mentor/participants", label: "Peserta Bimbingan", description: "Lihat progres dan kebutuhan pendampingan.", icon: Users },
          { href: "/mentor/sessions", label: "Catatan Mentoring", description: "Dokumentasikan sesi, catatan, dan tindak lanjut.", icon: ClipboardCheck },
          { href: "/mentor/attendance", label: "Absensi & Progres", description: "Catat kehadiran dan perkembangan modul peserta.", icon: CalendarCheck },
          { href: "/mentor/inbox", label: "Inbox", description: "Kelola pesan peserta tanpa chat realtime.", icon: Inbox },
        ]}
      />
      <h2>Peserta Bimbingan</h2>
      <DataTable headers={["Nama", "Program", "Progres", "Kebutuhan"]} rows={participants.map((item) => [item.name, item.program, `${item.progress}%`, item.disabilityNeed])} />
      <h2>Sesi Terbaru</h2>
      <DataTable headers={["Peserta", "Topik", "Tindak Lanjut", "Tanggal"]} rows={sessions.map((item) => [item.participant, item.topic, item.nextAction, item.date])} />
      <h2>Inbox</h2>
      <DataTable headers={["Dari", "Subjek", "Status"]} rows={messages.map((item) => [item.sender, item.subject, item.read ? "Sudah dibaca" : "Belum dibaca"])} />
    </>
  );
}
