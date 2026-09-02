"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function Topbar({ name, role }: { name: string; role: string }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 print:hidden">
      <div />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700">
          {initials(name) || "?"}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{name}</p>
          <p className="text-xs capitalize text-slate-500">{role}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-orange-600"
        >
          <LogOut size={15} strokeWidth={2} />
          Déconnexion
        </button>
      </div>
    </header>
  );
}
