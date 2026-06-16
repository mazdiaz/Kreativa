import { PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function AdminBackupPage() {
  await requireRole(["ADMIN"]);

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Backup Data"
        description="Unduh snapshot JSON dari data operasional utama untuk arsip dan pemulihan manual."
      />
      <section className="card form-stack">
        <h2>Snapshot Operasional</h2>
        <p>
          File backup berisi user tanpa password hash, peserta, program, pendaftaran, asesmen, modul, jadwal,
          absensi, progres, mentoring, pesan, ide usaha, produk, laporan, notifikasi, dan audit log.
        </p>
        <p>
          <a className="button" href="/admin/backup/export">Unduh Backup JSON</a>
        </p>
      </section>
    </>
  );
}
