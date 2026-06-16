import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { products } from "@/lib/demo-data";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  return (
    <article className="grid grid-2">
      <Image className="product-image" src={product.imageUrl} alt="" width={760} height={475} />
      <div>
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div className="card">
          <h2>Informasi Peserta</h2>
          <p>Produk dibuat oleh {product.participant}. Detail kontak peserta disembunyikan sampai admin menyetujui proses kerja sama.</p>
        </div>
        <Link className="button secondary" href="/showcase">
          Kembali ke Etalase
        </Link>
      </div>
    </article>
  );
}
