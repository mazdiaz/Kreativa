"use client";

/* eslint-disable @next/next/no-html-link-for-pages */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import {
  Archive,
  Bell,
  BookOpen,
  Boxes,
  CalendarCheck,
  ClipboardCheck,
  GraduationCap,
  Home,
  Inbox,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { SessionUser } from "@/lib/session-types";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const roleLabels: Record<SessionUser["role"], string> = {
  ADMIN: "Admin Program",
  PARTICIPANT: "Peserta",
  MENTOR: "Mentor",
  PARTNER: "Mitra",
};

const roleNavigation: Record<SessionUser["role"], NavItem[]> = {
  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/participants", label: "Peserta", icon: Users },
    { href: "/admin/programs", label: "Program", icon: BookOpen },
    { href: "/admin/users", label: "User & Role", icon: ShieldCheck },
    { href: "/admin/products", label: "Kurasi Produk", icon: PackageCheck },
    { href: "/admin/inbox", label: "Inbox", icon: Inbox },
    { href: "/admin/reports", label: "Laporan", icon: ClipboardCheck },
    { href: "/admin/backup", label: "Backup", icon: Archive },
  ],
  PARTICIPANT: [
    { href: "/participant", label: "Dashboard", icon: LayoutDashboard },
    { href: "/participant/programs", label: "Daftar Program", icon: GraduationCap },
    { href: "/participant/assessment", label: "Asesmen", icon: ClipboardCheck },
    { href: "/participant/progress", label: "Progres", icon: CalendarCheck },
    { href: "/participant/business-ideas", label: "Ide Usaha", icon: Lightbulb },
    { href: "/participant/products", label: "Produk Saya", icon: ShoppingBag },
    { href: "/participant/inbox", label: "Inbox", icon: Inbox },
  ],
  MENTOR: [
    { href: "/mentor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/mentor/participants", label: "Peserta", icon: Users },
    { href: "/mentor/sessions", label: "Mentoring", icon: BookOpen },
    { href: "/mentor/attendance", label: "Absensi & Progres", icon: CalendarCheck },
    { href: "/mentor/inbox", label: "Inbox", icon: Inbox },
  ],
  PARTNER: [
    { href: "/partner", label: "Portal Mitra", icon: LayoutDashboard },
    { href: "/showcase", label: "Etalase", icon: Store },
  ],
};

function isActive(pathname: string, href: string) {
  // If comparing the root dashboard route, enforce exact match to prevent sibling tabs from highlighting Dashboard
  if (href === "/admin" || href === "/participant" || href === "/mentor" || href === "/partner") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function currentPageLabel(items: NavItem[], pathname: string) {
  return [...items].sort((a, b) => b.href.length - a.href.length).find((item) => isActive(pathname, item.href))?.label ?? "Dashboard";
}

/* Custom Hook for Client-side Theme Toggle with Transition Suppression on Mount */
function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
    // Set mounted to true after a tiny delay to suppress initial layout-slide animations
    const t = setTimeout(() => {
      setMounted(true);
    }, 40);
    return () => clearTimeout(t);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return { theme, toggleTheme, mounted };
}

export function PublicShell({ children }: { children: ReactNode }) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <>
      <a className="skip-link" href="#main">
        Lewati ke konten utama
      </a>
      <header className="public-topbar">
        <div className="public-topbar-inner">
          <Link className="brand-mark" href="/">
            <span className="brand-icon">K</span>
            <span>
              <strong>Kreativa</strong>
              <small>Platform Inklusif</small>
            </span>
          </Link>
          <nav aria-label="Navigasi utama" className="nav-links">
            <Link href="/showcase">Etalase</Link>
            <button
              className="theme-toggle-switch"
              onClick={toggleTheme}
              aria-label={`Ubah ke mode ${theme === "light" ? "gelap" : "terang"}`}
              type="button"
            >
              <span className={`theme-toggle-slider ${theme} ${mounted ? "" : "no-transition"}`} />
              <Sun className="theme-toggle-icon sun" size={14} />
              <Moon className="theme-toggle-icon moon" size={14} />
            </button>
            <Link className="button secondary compact" href="/login">
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main id="main" className="public-page">
        {children}
      </main>
    </>
  );
}

export function AppShell({ children, user }: { children: ReactNode; user: SessionUser }) {
  const pathname = usePathname();
  const items = roleNavigation[user.role];
  const pageLabel = currentPageLabel(items, pathname);
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Lewati ke konten utama
      </a>
      <aside className="sidebar" aria-label="Navigasi aplikasi">
        <Link className="brand-mark sidebar-brand" href="/">
          <span className="brand-icon">K</span>
          <span>
            <strong>Kreativa</strong>
            <small>Platform Inklusif</small>
          </span>
        </Link>
        <div className="sidebar-section">
          <span className="sidebar-label">Workspace</span>
          <nav className="sidebar-nav">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <a className={active ? "sidebar-link active" : "sidebar-link"} href={item.href} key={item.href}>
                  <Icon aria-hidden="true" size={18} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
        <div className="sidebar-section sidebar-secondary">
          <a className={isActive(pathname, "/notifications") ? "sidebar-link active" : "sidebar-link"} href="/notifications">
            <Bell aria-hidden="true" size={18} />
            <span>Notifikasi</span>
          </a>
          <a className={isActive(pathname, "/showcase") ? "sidebar-link active" : "sidebar-link"} href="/showcase">
            <Boxes aria-hidden="true" size={18} />
            <span>Etalase Publik</span>
          </a>
          <a className="sidebar-link" href="/">
            <Home aria-hidden="true" size={18} />
            <span>Beranda</span>
          </a>
        </div>
      </aside>
      <div className="app-main-wrap">
        <header className="app-topbar">
          <div className="topbar-title-wrap">
            <p className="topbar-kicker">{roleLabels[user.role]}</p>
            <h2>{pageLabel}</h2>
            <span className="sync-status">Data tersinkron</span>
          </div>
          <div className="topbar-actions">
            <button className="button secondary compact ghost-action" type="button" onClick={() => window.location.reload()} aria-label="Muat ulang halaman">
              <RefreshCw aria-hidden="true" size={15} />
              Muat ulang
            </button>
            <button
              className="theme-toggle-switch"
              onClick={toggleTheme}
              aria-label={`Ubah ke mode ${theme === "light" ? "gelap" : "terang"}`}
              type="button"
            >
              <span className={`theme-toggle-slider ${theme} ${mounted ? "" : "no-transition"}`} />
              <Sun className="theme-toggle-icon sun" size={14} />
              <Moon className="theme-toggle-icon moon" size={14} />
            </button>
            <a className="icon-button" href="/notifications" aria-label="Buka notifikasi">
              <Bell aria-hidden="true" size={18} />
            </a>
            <div className="user-chip" aria-label={`Login sebagai ${user.name}`}>
              <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
              <span>
                <strong>{user.name}</strong>
                <small>{roleLabels[user.role]}</small>
              </span>
            </div>
            <a className="button secondary compact" href="/logout">
              <LogOut aria-hidden="true" size={16} />
              Keluar
            </a>
          </div>
        </header>
        <main id="main" className="app-page">
          {children}
        </main>
      </div>
    </div>
  );
}
