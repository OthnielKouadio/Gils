"use client";

import { signOut } from "next-auth/react";

export function Topbar({ name, role }: { name: string; role: string }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 print:hidden">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{name}</p>
          <p className="text-xs capitalize text-slate-500">{role}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-slate-600 transition hover:text-orange-600"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
