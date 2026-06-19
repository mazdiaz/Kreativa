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
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{user ? <AppShell user={user}>{children}</AppShell> : <PublicShell>{children}</PublicShell>}</body>
    </html>
  );
}
