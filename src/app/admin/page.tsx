import { ActionList, DataTable, PageHeader, StatGrid } from "@/components/dashboard";
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
      <ActionList
        items={[
          { href: "/admin/participants", label: "Kelola Peserta", description: "Lihat profil, status program, dan kebutuhan aksesibilitas peserta." },
          { href: "/admin/programs", label: "Kelola Program", description: "Atur program vokasional, inkubasi, modul, dan jadwal." },
          { href: "/admin/reports", label: "Laporan", description: "Pantau progres, produk etalase, dan sesi mentoring." },
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
