import { DataTable, PageHeader, StatusBadge } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { formatDate, getNotifications } from "@/lib/data";
import { markAllNotificationsReadAction, markNotificationReadAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await requireRole(["ADMIN", "PARTICIPANT", "MENTOR", "PARTNER"]);
  const notifications = await getNotifications(user.id);

  return (
    <>
      <PageHeader
        eyebrow="Notifikasi"
        title="Pusat Notifikasi"
        description="Pantau perubahan status pendaftaran, produk, pesan, dan tindak lanjut operasional."
      />
      <form action={markAllNotificationsReadAction}>
        <button className="button secondary compact" type="submit">Tandai Semua Dibaca</button>
      </form>
      <div style={{ height: "1rem" }} />
      <DataTable
        headers={["Judul", "Isi", "Tanggal", "Status", "Aksi"]}
        rows={notifications.map((item) => [
          item.title,
          item.body,
          formatDate(item.createdAt),
          <StatusBadge key={`${item.id}-status`}>
            {item.readAt ? "Sudah dibaca" : "Belum dibaca"}
          </StatusBadge>,
          item.readAt ? (
            "-"
          ) : (
            <form action={markNotificationReadAction} key={item.id}>
              <input type="hidden" name="notificationId" value={item.id} />
              <button className="button secondary compact" type="submit">Tandai Dibaca</button>
            </form>
          ),
        ])}
      />
    </>
  );
}
