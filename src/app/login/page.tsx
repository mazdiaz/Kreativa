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
    <section className="grid grid-2">
      <div className="hero-copy">
        <p className="eyebrow">Akses demo MVP</p>
        <h1>Masuk ke Platform</h1>
        <p>
          Gunakan akun demo sesuai role untuk mencoba alur Admin, Peserta, Mentor, dan Mitra.
          Password semua akun demo adalah <strong>password123</strong>.
        </p>
        <div className="card demo-account-grid">
          <h2>Akun Demo</h2>
          <div className="demo-account">
            <strong>Admin</strong>
            <span>admin@inklusikarya.test</span>
          </div>
          <div className="demo-account">
            <strong>Peserta</strong>
            <span>peserta@inklusikarya.test</span>
          </div>
          <div className="demo-account">
            <strong>Mentor</strong>
            <span>mentor@inklusikarya.test</span>
          </div>
          <div className="demo-account">
            <strong>Mitra</strong>
            <span>mitra@inklusikarya.test</span>
          </div>
        </div>
      </div>
      <form className="card form-stack login-card" action={loginAction}>
        <h2>Login</h2>
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
      </form>
    </section>
  );
}
