import { DataTable, PageHeader, getBadgeClass } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getAdminProducts } from "@/lib/data";
import { deleteProductAction, updateProductStatusAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireRole(["ADMIN"]);
  const products = await getAdminProducts();

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Kurasi Etalase Produk"
        description="Tinjau produk peserta sebelum ditampilkan di etalase publik dan area mitra."
      />
      <DataTable
        headers={["Produk", "Peserta", "Kategori", "Status", "Kelola"]}
        rows={products.map((item) => [
          item.name,
          item.participant,
          item.category,
          <span className={getBadgeClass(item.status)} key={`${item.id}-status`}>{item.status}</span>,
          <div className="inline-actions" key={item.id}>
            <form action={updateProductStatusAction}>
              <input type="hidden" name="productId" value={item.id} />
              <label>
                Status
                <select name="status" defaultValue={item.status}>
                  <option value="PENDING">PENDING</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </label>
              <button type="submit">Simpan</button>
            </form>
            <form action={deleteProductAction}>
              <input type="hidden" name="productId" value={item.id} />
              <button className="danger" type="submit">Hapus</button>
            </form>
          </div>,
        ])}
      />
    </>
  );
}
