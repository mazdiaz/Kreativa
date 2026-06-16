import Link from "next/link";
import Image from "next/image";

import { PageHeader } from "@/components/dashboard";
import { products } from "@/lib/demo-data";

export default function ShowcasePage() {
  return (
    <>
      <PageHeader
        eyebrow="Etalase Publik"
        title="Produk dan Jasa Kreatif Peserta"
        description="Katalog awal untuk memperkenalkan karya peserta kepada mitra, sponsor, dan calon pembeli."
      />
      <section className="grid grid-3">
        {products.map((product) => (
          <article className="card" key={product.id}>
            <Image className="product-image" src={product.imageUrl} alt="" width={640} height={400} />
            <span className="badge">{product.category}</span>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <Link className="button secondary" href={`/showcase/${product.id}`}>
              Buka Detail
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
