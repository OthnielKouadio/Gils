"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Inscription() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("gils_nom", nom);
    sessionStorage.setItem("gils_whatsapp", whatsapp);
    router.push("/test-de-niveau");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6 mt-10">
        <h1 className="text-2xl font-bold text-center">GIL&apos;S ENGLISH TRAINING</h1>
        <p className="text-center text-gray-500 mb-6">Inscription &amp; Test de Niveau</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet</label>
            <input
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Ex: Koffi Aïcha"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Numéro WhatsApp</label>
            <input
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Ex: 07 00 00 00 00"
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-3 rounded font-bold">
            Commencer le test de niveau -&gt;
          </button>
        </form>
      </div>
    </div>
  );
}
