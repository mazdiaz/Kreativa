import { DataTable, PageHeader, StatGrid } from "@/components/dashboard";
import { businessIdeas, products, reports } from "@/lib/demo-data";

export default function AdminReportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Laporan Program"
        description="Ringkasan dampak awal untuk kebutuhan monitoring internal dan laporan sponsor."
      />
      <StatGrid items={reports} />
      <h2>Ide Usaha</h2>
      <DataTable headers={["Judul", "Peserta", "Potensi Lokal", "Status"]} rows={businessIdeas.map((item) => [item.title, item.participant, item.localPotential, item.status])} />
      <h2>Produk Etalase</h2>
      <DataTable headers={["Produk", "Peserta", "Kategori"]} rows={products.map((item) => [item.name, item.participant, item.category])} />
    </>
  );
}
