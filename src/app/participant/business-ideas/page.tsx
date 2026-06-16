import { DataTable, PageHeader } from "@/components/dashboard";
import { businessIdeas } from "@/lib/demo-data";

export default function ParticipantBusinessIdeasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Peserta"
        title="Ide Usaha Kreatif"
        description="Ajukan dan pantau status ide usaha berbasis potensi lokal."
      />
      <form className="card form-stack">
        <div>
          <label htmlFor="title">Judul ide usaha</label>
          <input id="title" name="title" placeholder="Contoh: Tas kain perca inklusif" />
        </div>
        <div>
          <label htmlFor="potential">Potensi lokal yang digunakan</label>
          <input id="potential" name="potential" placeholder="Contoh: kain perca dari penjahit lokal" />
        </div>
        <div>
          <label htmlFor="description">Deskripsi ide</label>
          <textarea id="description" name="description" />
        </div>
        <button type="button">Kirim Ide Demo</button>
      </form>
      <h2>Status Ide</h2>
      <DataTable headers={["Judul", "Potensi Lokal", "Status"]} rows={businessIdeas.map((item) => [item.title, item.localPotential, item.status])} />
    </>
  );
}
