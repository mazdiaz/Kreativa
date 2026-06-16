import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getMentorDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MentorInboxPage() {
  const user = await requireRole(["MENTOR"]);
  const { messages } = await getMentorDashboardData(user.id);

  return (
    <>
      <PageHeader eyebrow="Mentor" title="Inbox Sederhana" description="Komunikasi peserta-mentor dibuat tanpa realtime server untuk menjaga MVP tetap ringan." />
      <DataTable headers={["Dari", "Kepada", "Subjek", "Isi", "Status"]} rows={messages.map((item) => [item.sender, item.recipient, item.subject, item.body, item.read ? "Sudah dibaca" : "Belum dibaca"])} />
    </>
  );
}
