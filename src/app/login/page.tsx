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
      {/* Left Column: Brand Intro Panel */}
      <div className="login-intro-panel">
        <div>
          <p className="eyebrow" style={{ color: "#3b82f6" }}>Akses Portal</p>
          <h1>Masuk ke Kreativa</h1>
          <p>
            Gunakan akun yang telah diberikan oleh administrator untuk mengakses ruang kerja sesuai peran Anda.
            Setiap workspace didesain ramah pengguna dan mendukung aksesibilitas penuh.
          </p>
        </div>

        <div className="access-role-grid">
          <h2>Hak Akses Peran</h2>
          <div className="access-role-card">
            <strong>Admin Program</strong>
            <span>Kelola peserta, validasi pendaftaran, kurasi produk, ekspor laporan, dan backup data.</span>
          </div>
          <div className="access-role-card">
            <strong>Peserta Pelatihan</strong>
            <span>Isi asesmen minat bakat, pelajari modul vokasional, dan ajukan produk hasil karya.</span>
          </div>
          <div className="access-role-card">
            <strong>Mentor Pendamping</strong>
            <span>Catat aktivitas bimbingan mentoring, update progres belajar, dan isi presensi absensi.</span>
          </div>
          <div className="access-role-card">
            <strong>Mitra Kerja</strong>
            <span>Pantau etalase produk peserta yang siap dipasarkan secara komersial.</span>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <form className="login-card form-stack" action={loginAction}>
        <div>
          <p className="eyebrow">Autentikasi Pengguna</p>
          <h2>Log In</h2>
          <p>Masukkan email dan kata sandi akun Anda di bawah ini.</p>
        </div>

        {params.error ? (
          <div className="alert" role="alert">
            Email atau password yang Anda masukkan tidak valid. Silakan coba lagi.
          </div>
        ) : null}

        {params.next ? <input type="hidden" name="next" value={params.next} /> : null}

        <div className="form-stack" style={{ gap: "0.75rem" }}>
          <div>
            <label htmlFor="email">Alamat Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              autoComplete="email" 
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label htmlFor="password">Kata Sandi</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              autoComplete="current-password" 
              placeholder="••••••••"
            />
          </div>
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Masuk ke Dashboard
        </button>

        <p className="login-help">
          Belum memiliki akses? Hubungi administrator program vokasional Kreativa.
        </p>
      </form>
    </section>
  );
}
