import { DataTable, PageHeader } from "@/components/dashboard";
import { participants } from "@/lib/demo-data";

export default function MentorParticipantsPage() {
  return (
    <>
      <PageHeader eyebrow="Mentor" title="Peserta Bimbingan" description="Data ringkas peserta yang membutuhkan pemantauan progres dan mentoring." />
      <DataTable headers={["Nama", "Program", "Potensi Lokal", "Progres", "Status"]} rows={participants.map((item) => [item.name, item.program, item.localPotential, `${item.progress}%`, item.status])} />
    </>
  );
}
