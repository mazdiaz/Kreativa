import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getParticipantLearningData } from "@/lib/data";
import { createBusinessIdeaAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ParticipantBusinessIdeasPage() {
  const user = await requireRole(["PARTICIPANT"]);
  const { businessIdeas } = await getParticipantLearningData(user.id);

  return (
    <>
      <PageHeader
        eyebrow="Peserta"
        title="Ide Usaha Kreatif"
        description="Ajukan dan pantau status ide usaha berbasis potensi lokal."
      />
      <form className="card form-stack" action={createBusinessIdeaAction}>
        <div>
          <label htmlFor="title">Judul ide usaha</label>
          <input id="title" name="title" required maxLength={255} placeholder="Contoh: Tas kain perca inklusif" />
        </div>
        <div>
          <label htmlFor="potential">Potensi lokal yang digunakan</label>
          <input id="potential" name="localPotential" required maxLength={500} placeholder="Contoh: kain perca dari penjahit lokal" />
        </div>
        <div>
          <label htmlFor="description">Deskripsi ide</label>
          <textarea id="description" name="description" required maxLength={1000} />
        </div>
        <button type="submit">Kirim Ide</button>
      </form>
      <h2>Status Ide</h2>
      <DataTable headers={["Judul", "Potensi Lokal", "Status"]} rows={businessIdeas.map((item) => [item.title, item.localPotential, item.status])} />
    </>
  );
}
