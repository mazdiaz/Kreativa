import type { Metadata } from "next";

import { AppShell, PublicShell } from "@/components/app-shell";
import { currentUser } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kreativa",
  description: "Platform pelatihan vokasional dan inkubasi usaha kreatif berbasis potensi lokal.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  return (
    <html lang="id">
      <body>{user ? <AppShell user={user}>{children}</AppShell> : <PublicShell>{children}</PublicShell>}</body>
    </html>
  );
}
