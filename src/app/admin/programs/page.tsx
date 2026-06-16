import { DataTable, PageHeader } from "@/components/dashboard";
import { modules, programs, schedules } from "@/lib/demo-data";

export default function AdminProgramsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Program, Modul, dan Jadwal"
        description="MVP menampilkan katalog program, modul pelatihan, dan jadwal operasional sebagai dasar CRUD admin."
      />
      <h2>Program</h2>
      <DataTable
        headers={["Nama", "Tipe", "Periode", "Status", "Deskripsi"]}
        rows={programs.map((program) => [program.name, program.type, program.period, program.status, program.description])}
      />
      <h2>Modul</h2>
      <DataTable headers={["Modul", "Progres Contoh"]} rows={modules.map((item) => [item.title, `${item.completion}%`])} />
      <h2>Jadwal</h2>
      <DataTable headers={["Judul", "Program", "Tanggal", "Lokasi"]} rows={schedules.map((item) => [item.title, item.program, item.date, item.location])} />
    </>
  );
}
