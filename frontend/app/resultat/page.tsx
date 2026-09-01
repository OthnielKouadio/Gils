"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Wallet, Loader2, BookOpen, MessageCircle, Headphones } from "lucide-react";

const INSCRIPTION_FEE = 25000;

export default function Resultat() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [paying, setPaying] = useState(false);

  const grammaire = 2;
  const topic = 2.5;
  const audio = 6.5;
  const total = grammaire + topic + audio; // 11
  const niveau = total >= 13 ? "Intermédiaire" : "Débutant";

  useEffect(() => {
    setNom(sessionStorage.getItem("gils_nom") ?? "");
  }, []);

  function handlePayment() {
    setPaying(true);
    // Paiement simulé : l'intégration réelle Wave / CinetPay sera branchée dès que
    // les accès marchands + le webhook de confirmation côté backend seront prêts.
    setTimeout(() => {
      sessionStorage.setItem("gils_niveau", niveau);
      sessionStorage.setItem("gils_statut", "ACTIVE");
      router.push("/mon-compte");
    }, 1500);
  }

  const scores = [
    { label: "Grammaire", value: grammaire, max: 6, icon: BookOpen },
    { label: "Topic", value: topic, max: 4, icon: MessageCircle },
    { label: "Audio", value: audio, max: 10, icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-xl mx-auto mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-lg shadow-amber-400/30">
            <Trophy size={22} strokeWidth={2.25} />
          </div>
          <h1 className="mt-3 font-bold text-slate-900">GIL&apos;S ENGLISH TRAINING</h1>
          <h2 className="text-lg font-bold text-slate-900">RESULTAT DU TEST DE NIVEAU</h2>
          {nom && <p className="text-sm text-slate-500 mt-1">Candidat(e) : {nom}</p>}
        </div>

        <div className="mt-6 space-y-2">
          {scores.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <Icon size={16} className="text-orange-500" /> {s.label}
                </span>
                <span className="font-semibold text-slate-900">{s.value}/{s.max}</span>
              </div>
            );
          })}
          <div className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-sm mt-3">
            <span className="font-medium text-white">Total</span>
            <span className="font-bold text-white">{total}/20 = Niveau {niveau}</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-center">
          <p className="mb-3 text-emerald-800">Félicitations ! Vous êtes : <span className="font-bold">{niveau}</span></p>
          <button
            onClick={handlePayment}
            disabled={paying}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {paying ? <Loader2 size={18} className="animate-spin" /> : <Wallet size={18} />}
            {paying ? "Paiement en cours..." : `Payer ${INSCRIPTION_FEE.toLocaleString("fr-FR")}F avec Wave`}
          </button>
          <p className="mt-3 text-xs text-emerald-700/70">
            Paiement simulé pour la démo — branchement CinetPay réel à venir côté backend (OTK).
          </p>
        </div>
      </div>
    </div>
  );
}
