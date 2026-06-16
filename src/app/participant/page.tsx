import { ClipboardCheck, GraduationCap, Inbox, Lightbulb, ListChecks, ShoppingBag } from "lucide-react";

import { ActionList, DataTable, PageHeader, WorkflowList } from "@/components/dashboard";
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
      <WorkflowList
        items={[
          { title: "Daftar program", detail: "Pilih program aktif lalu tunggu validasi admin." },
          { title: "Lengkapi asesmen", detail: "Isi asesmen awal untuk rekomendasi jalur belajar." },
          { title: "Ikuti progres", detail: "Pantau jadwal, modul, absensi, dan perkembangan." },
          { title: "Ajukan karya", detail: "Kirim ide usaha dan produk untuk proses inkubasi." },
        ]}
      />
      <div style={{ height: "1.5rem" }} />
      <ActionList
        items={[
          { href: "/participant/programs", label: "Daftar Program", description: "Ajukan pendaftaran program vokasional atau inkubasi yang tersedia.", icon: GraduationCap },
          { href: "/participant/assessment", label: "Isi Asesmen", description: "Lengkapi asesmen awal untuk rekomendasi jalur pelatihan.", icon: ClipboardCheck },
          { href: "/participant/progress", label: "Lihat Progres", description: "Pantau modul, jadwal, dan perkembangan pelatihan.", icon: ListChecks },
          { href: "/participant/business-ideas", label: "Ajukan Ide Usaha", description: "Dokumentasikan ide usaha dan status review inkubasi.", icon: Lightbulb },
          { href: "/participant/products", label: "Produk Saya", description: "Ajukan produk untuk kurasi admin dan etalase mitra.", icon: ShoppingBag },
          { href: "/participant/inbox", label: "Inbox", description: "Kirim pesan tindak lanjut ke mentor atau admin.", icon: Inbox },
        ]}
      />
      <h2>Modul Saya</h2>
      <DataTable headers={["Modul", "Progres"]} rows={modules.map((item) => [item.title, `${item.completion}%`])} />
      <h2>Jadwal Terdekat</h2>
      <DataTable headers={["Kegiatan", "Tanggal", "Lokasi"]} rows={schedules.map((item) => [item.title, item.date, item.location])} />
    </>
  );
}
