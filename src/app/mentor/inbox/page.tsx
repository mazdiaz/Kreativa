import { DataTable, PageHeader } from "@/components/dashboard";
import { markMessageReadAction, sendMessageAction } from "@/app/messages/actions";
import { requireRole } from "@/lib/authorization";
import { getInboxData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MentorInboxPage() {
  const user = await requireRole(["MENTOR"]);
  const { messages, recipients } = await getInboxData(user.id);

  return (
    <>
      <PageHeader eyebrow="Mentor" title="Inbox" description="Kelola komunikasi dan tindak lanjut dengan peserta maupun admin program." />
      <h2>Kirim Pesan</h2>
      <form className="card form-stack" action={sendMessageAction}>
        <label>
          Penerima
          <select name="recipientId" required>
            {recipients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.role}
              </option>
            ))}
          </select>
        </label>
        <label>
          Subjek
          <input name="subject" required maxLength={255} />
        </label>
        <label>
          Isi pesan
          <textarea name="body" required maxLength={2000} />
        </label>
        <button type="submit">Kirim Pesan</button>
      </form>
      <h2>Riwayat Pesan</h2>
      <DataTable
        headers={["Dari", "Kepada", "Subjek", "Isi", "Tanggal", "Status", "Aksi"]}
        rows={messages.map((item) => [
          item.sender,
          item.recipient,
          item.subject,
          item.body,
          item.createdAt,
          item.status,
          item.status === "Belum dibaca" ? (
            <form action={markMessageReadAction} key={item.id}>
              <input type="hidden" name="messageId" value={item.id} />
              <button type="submit">Tandai Dibaca</button>
            </form>
          ) : (
            "-"
          ),
        ])}
      />
    </>
  );
}
