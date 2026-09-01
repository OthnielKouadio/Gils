"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, FileText, Wallet, LayoutDashboard, type LucideIcon } from "lucide-react";
import type { UserRole } from "@/lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { href: "/bulletin", label: "Bulletin", icon: FileText, roles: ["boss", "staff"] },
  { href: "/finance-cachee", label: "Finance Cachée", icon: Wallet, roles: ["boss"] },
  { href: "/dashboard-boss", label: "Dashboard Boss", icon: LayoutDashboard, roles: ["boss"] },
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-100 flex flex-col print:hidden">
      <div className="flex items-center gap-2.5 p-5 border-b border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
          <GraduationCap size={20} strokeWidth={2.25} />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">Gil&apos;s English School</p>
          <p className="text-xs text-slate-400">Espace {role === "boss" ? "Boss" : "Staff"}</p>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
                active ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              <span>{item.label}</span>
              {item.roles.length === 1 && (
                <span className="ml-auto rounded bg-slate-950 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-orange-400">
                  Boss
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
