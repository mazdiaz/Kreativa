import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getParticipantLearningData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ParticipantProgressPage() {
  const user = await requireRole(["PARTICIPANT"]);
  const { modules, schedules } = await getParticipantLearningData(user.id);

  return (
    <>
      <PageHeader
        eyebrow="Peserta"
        title="Progres Pelatihan"
        description="Pantau penyelesaian modul dan jadwal kegiatan yang terkait program peserta."
      />
      <div className="grid">
        {modules.map((item) => (
          <article className="card" key={item.id}>
            <h2>{item.title}</h2>
            <div className="progress" aria-label={`Progres ${item.completion} persen`}>
              <span style={{ width: `${item.completion}%` }} />
            </div>
            <p>{item.completion}% selesai</p>
          </article>
        ))}
      </div>
      <h2>Jadwal</h2>
      <DataTable headers={["Kegiatan", "Program", "Tanggal", "Lokasi"]} rows={schedules.map((item) => [item.title, item.program, item.date, item.location])} />
    </>
  );
}
