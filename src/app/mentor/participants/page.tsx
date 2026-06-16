import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getAdminParticipants } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MentorParticipantsPage() {
  await requireRole(["MENTOR"]);
  const participants = await getAdminParticipants();

  return (
    <>
      <PageHeader eyebrow="Mentor" title="Peserta Bimbingan" description="Data ringkas peserta yang membutuhkan pemantauan progres dan mentoring." />
      <DataTable headers={["Nama", "Program", "Potensi Lokal", "Progres", "Status"]} rows={participants.map((item) => [item.name, item.program, item.localPotential, `${item.progress}%`, item.status])} />
    </>
  );
}
