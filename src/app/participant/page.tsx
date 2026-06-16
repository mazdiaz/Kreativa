import { ActionList, DataTable, PageHeader } from "@/components/dashboard";
import { modules, schedules } from "@/lib/demo-data";

export default function ParticipantDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Portal Peserta"
        title="Ruang Belajar dan Inkubasi"
        description="Pantau program, isi asesmen, lihat modul, dan ajukan ide usaha kreatif berbasis potensi lokal."
      />
      <ActionList
        items={[
          { href: "/participant/assessment", label: "Isi Asesmen", description: "Lengkapi asesmen awal untuk rekomendasi jalur pelatihan." },
          { href: "/participant/progress", label: "Lihat Progres", description: "Pantau modul, jadwal, dan perkembangan pelatihan." },
          { href: "/participant/business-ideas", label: "Ajukan Ide Usaha", description: "Dokumentasikan ide usaha dan status review inkubasi." },
        ]}
      />
      <h2>Modul Saya</h2>
      <DataTable headers={["Modul", "Progres"]} rows={modules.map((item) => [item.title, `${item.completion}%`])} />
      <h2>Jadwal Terdekat</h2>
      <DataTable headers={["Kegiatan", "Tanggal", "Lokasi"]} rows={schedules.map((item) => [item.title, item.date, item.location])} />
    </>
  );
}
