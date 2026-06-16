import { ActionList, DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getParticipantLearningData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ParticipantDashboard() {
  const user = await requireRole(["PARTICIPANT"]);
  const { modules, schedules } = await getParticipantLearningData(user.id);

  return (
    <>
      <PageHeader
        eyebrow="Portal Peserta"
        title="Ruang Belajar dan Inkubasi"
        description="Pantau program, isi asesmen, lihat modul, dan ajukan ide usaha kreatif berbasis potensi lokal."
      />
      <ActionList
        items={[
          { href: "/participant/programs", label: "Daftar Program", description: "Ajukan pendaftaran program vokasional atau inkubasi yang tersedia." },
          { href: "/participant/assessment", label: "Isi Asesmen", description: "Lengkapi asesmen awal untuk rekomendasi jalur pelatihan." },
          { href: "/participant/progress", label: "Lihat Progres", description: "Pantau modul, jadwal, dan perkembangan pelatihan." },
          { href: "/participant/business-ideas", label: "Ajukan Ide Usaha", description: "Dokumentasikan ide usaha dan status review inkubasi." },
          { href: "/participant/products", label: "Produk Saya", description: "Ajukan produk untuk kurasi admin dan etalase mitra." },
          { href: "/participant/inbox", label: "Inbox", description: "Kirim pesan tindak lanjut ke mentor atau admin." },
        ]}
      />
      <h2>Modul Saya</h2>
      <DataTable headers={["Modul", "Progres"]} rows={modules.map((item) => [item.title, `${item.completion}%`])} />
      <h2>Jadwal Terdekat</h2>
      <DataTable headers={["Kegiatan", "Tanggal", "Lokasi"]} rows={schedules.map((item) => [item.title, item.date, item.location])} />
    </>
  );
}
