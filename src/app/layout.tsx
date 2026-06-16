import type { Metadata } from "next";
import Link from "next/link";

import { currentUser } from "@/lib/session";
import { roleHome } from "@/lib/rbac";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inklusi Karya Nusantara",
  description: "Platform pelatihan vokasional dan inkubasi usaha kreatif berbasis potensi lokal.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const home = user ? roleHome(user.role) : null;

  return (
    <html lang="id">
      <body>
        <a className="skip-link button" href="#main">
          Lewati ke konten utama
        </a>
        <header className="topbar">
          <div className="topbar-inner">
            <Link className="brand" href="/">
              Inklusi Karya Nusantara
            </Link>
            <nav aria-label="Navigasi utama" className="nav-links">
              <Link href="/showcase">Etalase</Link>
              {home ? <Link href={home.href} prefetch={false}>{home.label}</Link> : <Link href="/login">Login</Link>}
              {user ? <Link href="/logout">Keluar</Link> : null}
            </nav>
          </div>
        </header>
        <main id="main" className="page">
          {children}
        </main>
      </body>
    </html>
  );
}
