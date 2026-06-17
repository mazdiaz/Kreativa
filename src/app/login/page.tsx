import { loginAction } from "./actions";
import { redirect } from "next/navigation";

import { safePostLoginRedirect } from "@/lib/rbac";
import { currentUser } from "@/lib/session";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const user = await currentUser();
  if (user) {
    redirect(safePostLoginRedirect(user.role, params.next));
  }

  return (
    <section className="login-layout">
      <div className="login-intro-panel">
        <p className="eyebrow">Akses platform</p>
        <h1>Masuk ke Kreativa</h1>
        <p>
          Gunakan akun yang telah diberikan oleh administrator untuk mengakses ruang kerja sesuai peran Anda.
          Setiap akun hanya dapat membuka modul yang sesuai dengan hak aksesnya.
        </p>
        <div className="access-role-grid">
          <h2>Area Akses</h2>
          <div className="access-role-card">
            <strong>Admin</strong>
            <span>Kelola peserta, program, user, produk, laporan, dan backup data.</span>
          </div>
          <div className="access-role-card">
            <strong>Peserta</strong>
            <span>Daftar program, isi asesmen, pantau progres, dan ajukan karya.</span>
          </div>
          <div className="access-role-card">
            <strong>Mentor</strong>
            <span>Catat mentoring, absensi, progres modul, dan tindak lanjut peserta.</span>
          </div>
          <div className="access-role-card">
            <strong>Mitra</strong>
            <span>Lihat etalase produk peserta yang sudah dikurasi.</span>
          </div>
        </div>
      </div>
      <form className="login-card form-stack" action={loginAction}>
        <div>
          <p className="eyebrow">Autentikasi</p>
          <h2>Masuk</h2>
          <p>Masukkan email dan kata sandi akun Anda.</p>
        </div>
        {params.error ? <div className="alert">Email atau password tidak valid.</div> : null}
        {params.next ? <input type="hidden" name="next" value={params.next} /> : null}
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        <button type="submit">Masuk ke Dashboard</button>
        <p className="login-help">Belum memiliki akses? Hubungi administrator program.</p>
      </form>
    </section>
  );
}
