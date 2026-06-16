import { DataTable, PageHeader, StatGrid } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getAdminReportsData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  await requireRole(["ADMIN"]);
  const { businessIdeas, products, stats } = await getAdminReportsData();

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Laporan Program"
        description="Ringkasan dampak awal untuk kebutuhan monitoring internal dan laporan sponsor."
      />
      <p>
        <a className="button secondary" href="/admin/reports/export">Unduh CSV Laporan</a>
      </p>
      <StatGrid items={stats} />
      <h2>Ide Usaha</h2>
      <DataTable headers={["Judul", "Peserta", "Potensi Lokal", "Status"]} rows={businessIdeas.map((item) => [item.title, item.participant, item.localPotential, item.status])} />
      <h2>Produk Etalase</h2>
      <DataTable headers={["Produk", "Peserta", "Kategori"]} rows={products.map((item) => [item.name, item.participant, item.category])} />
    </>
  );
}
