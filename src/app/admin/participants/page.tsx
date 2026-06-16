import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getAdminParticipants } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminParticipantsPage() {
  await requireRole(["ADMIN"]);
  const participants = await getAdminParticipants();

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
