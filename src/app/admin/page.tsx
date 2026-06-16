import { Archive, ClipboardCheck, Inbox, PackageCheck, ShieldCheck, Users, BookOpen } from "lucide-react";

import { ActionList, DataTable, PageHeader, StatGrid, WorkflowList } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getActivePrograms, getAdminParticipants, getDashboardStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireRole(["ADMIN"]);
  const [participants, programs, reports] = await Promise.all([getAdminParticipants(), getActivePrograms(), getDashboardStats()]);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard Admin"
        title="Kontrol Operasional Program"
        description="Kelola peserta, program, modul, jadwal, laporan, dan kontrol data inti untuk platform inklusif."
      />
      <StatGrid items={reports} />
      <div style={{ height: "1.5rem" }} />
      <WorkflowList
        items={[
          { title: "Siapkan peserta", detail: "Tambah peserta dan validasi kebutuhan aksesibilitas." },
          { title: "Kelola program", detail: "Buat program, modul, jadwal, dan periode pelatihan." },
          { title: "Validasi & kurasi", detail: "Setujui pendaftaran dan produk sebelum tampil publik." },
          { title: "Pantau laporan", detail: "Unduh CSV atau backup JSON untuk arsip sidang/demo." },
        ]}
      />
      <div style={{ height: "1.5rem" }} />
      <ActionList
        items={[
          { href: "/admin/participants", label: "Kelola Peserta", description: "Lihat profil, status program, dan kebutuhan aksesibilitas peserta.", icon: Users },
          { href: "/admin/programs", label: "Kelola Program", description: "Atur program vokasional, inkubasi, modul, dan jadwal.", icon: BookOpen },
          { href: "/admin/users", label: "User & Role", description: "Atur akun admin, peserta, mentor, mitra, dan status akses.", icon: ShieldCheck },
          { href: "/admin/products", label: "Kurasi Produk", description: "Validasi produk peserta sebelum tampil di etalase.", icon: PackageCheck },
          { href: "/admin/inbox", label: "Inbox Admin", description: "Baca pesan dari peserta dan mentor serta kirim tindak lanjut.", icon: Inbox },
          { href: "/admin/reports", label: "Laporan", description: "Pantau progres, produk etalase, dan sesi mentoring.", icon: ClipboardCheck },
          { href: "/admin/backup", label: "Backup Data", description: "Unduh snapshot data operasional untuk pemulihan manual.", icon: Archive },
        ]}
      />
      <div style={{ height: "1.5rem" }} />
      <h2>Peserta Terbaru</h2>
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
      <h2>Program Aktif</h2>
      <DataTable
        headers={["Nama Program", "Tipe", "Periode", "Status"]}
        rows={programs.map((program) => [program.name, program.type, program.period, program.status])}
      />
    </>
  );
}
