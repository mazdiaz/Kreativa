import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getAdminUsers } from "@/lib/data";
import { createUserAction, deleteUserAction, updateUserAction } from "./actions";

export const dynamic = "force-dynamic";

const roles = ["ADMIN", "PARTICIPANT", "MENTOR", "PARTNER"];

export default async function AdminUsersPage() {
  await requireRole(["ADMIN"]);
  const users = await getAdminUsers();

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="User dan Hak Akses"
        description="Kelola akun internal, status aktif, dan role yang menentukan akses halaman."
      />
      <h2>Tambah User</h2>
      <form className="card form-stack" action={createUserAction}>
        <div className="grid grid-2">
          <label>
            Nama
            <input name="name" required maxLength={255} />
          </label>
          <label>
            Email
            <input name="email" type="email" required maxLength={255} />
          </label>
          <label>
            Role
            <select name="role" defaultValue="MENTOR">
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select name="status" defaultValue="ACTIVE">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
        </div>
        <p>Password awal akun baru adalah <strong>password123</strong>.</p>
        <button type="submit">Simpan User</button>
      </form>
      <h2>Daftar User</h2>
      <DataTable
        headers={["Nama", "Email", "Role", "Status", "Kelola"]}
        rows={users.map((item) => [
          item.name,
          item.email,
          item.role,
          item.status,
          <details key={item.id}>
            <summary>Ubah</summary>
            <form className="form-stack" action={updateUserAction}>
              <input type="hidden" name="userId" value={item.id} />
              <label>
                Nama
                <input name="name" defaultValue={item.name} required maxLength={255} />
              </label>
              <label>
                Email
                <input name="email" type="email" defaultValue={item.email} required maxLength={255} />
              </label>
              <label>
                Role
                <select name="role" defaultValue={item.role}>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select name="status" defaultValue={item.status}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </label>
              <button type="submit">Update User</button>
            </form>
            <form action={deleteUserAction}>
              <input type="hidden" name="userId" value={item.id} />
              <button className="danger" type="submit">Hapus User</button>
            </form>
          </details>,
        ])}
      />
    </>
  );
}
