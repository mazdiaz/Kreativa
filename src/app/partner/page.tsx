import Link from "next/link";
import Image from "next/image";

import { PageHeader } from "@/components/dashboard";
import { products } from "@/lib/demo-data";

export default function PartnerDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Portal Mitra"
        title="Etalase Produk Peserta"
        description="Mitra dapat melihat produk peserta yang sudah dikurasi tanpa membuka data pribadi sensitif."
      />
      <section className="grid grid-3">
        {products.map((product) => (
          <article className="card" key={product.id}>
            <Image className="product-image" src={product.imageUrl} alt="" width={640} height={400} />
            <span className="badge">{product.category}</span>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <Link className="button secondary" href={`/showcase/${product.id}`}>
              Detail Produk
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
