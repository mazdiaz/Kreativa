import { PageHeader, ProductGrid } from "@/components/dashboard";
import { getShowcaseProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ShowcasePage() {
  const products = await getShowcaseProducts();

  return (
    <>
      <PageHeader
        eyebrow="Etalase Publik"
        title="Produk dan Jasa Kreatif Peserta"
        description="Katalog awal untuk memperkenalkan karya peserta kepada mitra, sponsor, dan calon pembeli."
      />
      <ProductGrid products={products} actionLabel="Buka Detail" />
    </>
  );
}
