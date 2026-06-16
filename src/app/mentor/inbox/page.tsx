import { DataTable, PageHeader } from "@/components/dashboard";
import { messages } from "@/lib/demo-data";

export default function MentorInboxPage() {
  return (
    <>
      <PageHeader eyebrow="Mentor" title="Inbox Sederhana" description="Komunikasi peserta-mentor dibuat tanpa realtime server untuk menjaga MVP tetap ringan." />
      <DataTable headers={["Dari", "Kepada", "Subjek", "Isi", "Status"]} rows={messages.map((item) => [item.sender, item.recipient, item.subject, item.body, item.read ? "Sudah dibaca" : "Belum dibaca"])} />
    </>
  );
}
