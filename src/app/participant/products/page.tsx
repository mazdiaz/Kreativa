import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getParticipantLearningData } from "@/lib/data";
import { createProductAction, deleteProductAction, updateProductAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ParticipantProductsPage() {
  const user = await requireRole(["PARTICIPANT"]);
  const { products } = await getParticipantLearningData(user.id);

  return (
    <>
      <PageHeader
        eyebrow="Peserta"
        title="Produk Saya"
        description="Ajukan produk berbasis potensi lokal untuk dikurasi admin sebelum tampil di etalase."
      />
      <h2>Tambah Produk</h2>
      <form className="card form-stack" action={createProductAction}>
        <div className="grid grid-2">
          <label>
            Nama produk
            <input name="name" required maxLength={255} />
          </label>
          <label>
            Kategori
            <input name="category" required maxLength={100} />
          </label>
        </div>
        <label>
          Deskripsi
          <textarea name="description" required maxLength={1000} />
        </label>
        <label>
          URL gambar
          <input name="imageUrl" type="url" maxLength={500} />
        </label>
        <button type="submit">Ajukan Produk</button>
      </form>
      <h2>Daftar Produk</h2>
      <DataTable
        headers={["Produk", "Kategori", "Status", "Kelola"]}
        rows={products.map((item) => [
          item.name,
          item.category,
          <span className="badge" key={`${item.id}-status`}>{item.status}</span>,
          <details key={item.id}>
            <summary>Ubah</summary>
            <form className="form-stack" action={updateProductAction}>
              <input type="hidden" name="productId" value={item.id} />
              <label>
                Nama produk
                <input name="name" defaultValue={item.name} required maxLength={255} />
              </label>
              <label>
                Kategori
                <input name="category" defaultValue={item.category} required maxLength={100} />
              </label>
              <label>
                Deskripsi
                <textarea name="description" defaultValue={item.description} required maxLength={1000} />
              </label>
              <label>
                URL gambar
                <input name="imageUrl" type="url" defaultValue={item.imageUrl ?? ""} maxLength={500} />
              </label>
              <button type="submit">Update Produk</button>
            </form>
            <form action={deleteProductAction}>
              <input type="hidden" name="productId" value={item.id} />
              <button className="danger" type="submit">Hapus Produk</button>
            </form>
          </details>,
        ])}
      />
    </>
  );
}
