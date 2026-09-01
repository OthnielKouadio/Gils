"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { createStudent } from "@/lib/api";

export default function Inscription() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const student = await createStudent(nom, whatsapp);
      sessionStorage.setItem("gils_student_id", student.id);
      sessionStorage.setItem("gils_nom", nom);
      sessionStorage.setItem("gils_whatsapp", whatsapp);
      router.push("/test-de-niveau");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de créer l'inscription. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50 p-4">
      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
            <GraduationCap size={24} strokeWidth={2.25} />
          </div>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Gil&apos;s English Training</h1>
          <p className="text-sm text-slate-500">Inscription &amp; Test de Niveau</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nom complet</label>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                placeholder="Ex: Koffi Aïcha"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Numéro WhatsApp</label>
            <div className="relative">
              <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                placeholder="Ex: 07 00 00 00 00"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Création..." : "Commencer le test de niveau"}
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
