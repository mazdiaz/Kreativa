import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getParticipantLearningData } from "@/lib/data";
import { createAssessmentAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ParticipantAssessmentPage() {
  const user = await requireRole(["PARTICIPANT"]);
  const { assessments } = await getParticipantLearningData(user.id);

  return (
    <>
      <PageHeader
        eyebrow="Peserta"
        title="Asesmen Awal"
        description="Form ini menjadi dasar rekomendasi pelatihan dan tersimpan di Neon."
      />
      <form className="card form-stack" action={createAssessmentAction}>
        <div>
          <label htmlFor="score">Skor asesmen</label>
          <input id="score" name="score" type="number" min="0" max="100" required defaultValue="75" />
        </div>
        <div>
          <label htmlFor="recommendation">Rekomendasi pelatihan</label>
          <input id="recommendation" name="recommendation" required maxLength={500} placeholder="Contoh: kriya kreatif dan pemasaran digital dasar" />
        </div>
        <div>
          <label htmlFor="notes">Catatan asesmen</label>
          <textarea id="notes" name="notes" required maxLength={1000} placeholder="Ringkas keterampilan, minat, dan kebutuhan aksesibilitas." />
        </div>
        <button type="submit">Simpan Asesmen</button>
      </form>
      <h2>Riwayat Asesmen</h2>
      <DataTable
        headers={["Skor", "Rekomendasi", "Catatan"]}
        rows={assessments.map((item) => [item.score, item.recommendation, item.notes])}
      />
    </>
  );
}
