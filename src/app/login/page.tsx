import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <section className="grid grid-2">
      <div>
        <p className="eyebrow">Akses demo MVP</p>
        <h1>Masuk ke Platform</h1>
        <p>
          Gunakan akun demo sesuai role untuk mencoba alur Admin, Peserta, Mentor, dan Mitra.
          Password semua akun demo adalah <strong>password123</strong>.
        </p>
        <div className="card">
          <h2>Akun Demo</h2>
          <p>Admin: admin@inklusikarya.test</p>
          <p>Peserta: peserta@inklusikarya.test</p>
          <p>Mentor: mentor@inklusikarya.test</p>
          <p>Mitra: mitra@inklusikarya.test</p>
        </div>
      </div>
      <form className="card form-stack" action={loginAction}>
        <h2>Login</h2>
        {params.error ? <div className="alert">Email atau password tidak valid.</div> : null}
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        <button type="submit">Masuk</button>
      </form>
    </section>
  );
}
