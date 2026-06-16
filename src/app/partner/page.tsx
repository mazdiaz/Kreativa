import { PageHeader, ProductGrid } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getShowcaseProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PartnerDashboard() {
  await requireRole(["PARTNER"]);
  const products = await getShowcaseProducts();

  return (
    <>
      <PageHeader
        eyebrow="Portal Mitra"
        title="Etalase Produk Peserta"
        description="Mitra dapat melihat produk peserta yang sudah dikurasi tanpa membuka data pribadi sensitif."
      />
      <ProductGrid products={products} actionLabel="Detail Produk" />
    </>
  );
}
