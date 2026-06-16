import { ActionList, DataTable, PageHeader } from "@/components/dashboard";
import { mentoringSessions, messages, participants } from "@/lib/demo-data";

export default function MentorDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Portal Mentor"
        title="Pendampingan Peserta"
        description="Pantau peserta bimbingan, catat sesi mentoring, dan gunakan inbox sederhana untuk tindak lanjut."
      />
      <ActionList
        items={[
          { href: "/mentor/participants", label: "Peserta Bimbingan", description: "Lihat progres dan kebutuhan pendampingan." },
          { href: "/mentor/sessions", label: "Catatan Mentoring", description: "Dokumentasikan sesi, catatan, dan tindak lanjut." },
          { href: "/mentor/inbox", label: "Inbox", description: "Kelola pesan peserta tanpa chat realtime." },
        ]}
      />
      <h2>Peserta Bimbingan</h2>
      <DataTable headers={["Nama", "Program", "Progres", "Kebutuhan"]} rows={participants.map((item) => [item.name, item.program, `${item.progress}%`, item.disabilityNeed])} />
      <h2>Sesi Terbaru</h2>
      <DataTable headers={["Peserta", "Topik", "Tindak Lanjut", "Tanggal"]} rows={mentoringSessions.map((item) => [item.participant, item.topic, item.nextAction, item.date])} />
      <h2>Inbox</h2>
      <DataTable headers={["Dari", "Subjek", "Status"]} rows={messages.map((item) => [item.sender, item.subject, item.read ? "Sudah dibaca" : "Belum dibaca"])} />
    </>
  );
}
