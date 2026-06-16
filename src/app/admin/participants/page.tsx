import { DataTable, PageHeader } from "@/components/dashboard";
import { participants } from "@/lib/demo-data";

export default function AdminParticipantsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Manajemen Peserta"
        description="Daftar peserta, kebutuhan aksesibilitas, potensi lokal, dan status pelatihan."
      />
      <DataTable
        headers={["Nama", "Alamat", "Potensi Lokal", "Kebutuhan Aksesibilitas", "Program", "Progres"]}
        rows={participants.map((item) => [
          item.name,
          item.address,
          item.localPotential,
          item.disabilityNeed,
          item.program,
          `${item.progress}%`,
        ])}
      />
    </>
  );
}
