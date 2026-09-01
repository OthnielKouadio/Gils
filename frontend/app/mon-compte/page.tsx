"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const cours = [
  { titre: "English Basics - Module 1", statut: "Disponible" },
  { titre: "English Basics - Module 2", statut: "Verrouillé" },
];

const videos = [
  { titre: "Introduction à la prononciation", duree: "12 min" },
  { titre: "Les verbes irréguliers courants", duree: "18 min" },
];

const emploiDuTemps = [
  { jour: "Lundi", heure: "18h - 19h30", cours: "English Basics" },
  { jour: "Jeudi", heure: "18h - 19h30", cours: "English Basics" },
  { jour: "Samedi", heure: "10h - 12h", cours: "Conversation Club" },
];

export default function MonCompte() {
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState("Débutant");
  const [statut, setStatut] = useState<"ACTIVE" | "PENDING">("PENDING");

  useEffect(() => {
    setNom(sessionStorage.getItem("gils_nom") ?? "Élève");
    setNiveau(sessionStorage.getItem("gils_niveau") ?? "Débutant");
    setStatut(sessionStorage.getItem("gils_statut") === "ACTIVE" ? "ACTIVE" : "PENDING");
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bienvenue, {nom}</h1>
            <p className="text-sm text-slate-500">Ton espace élève Gil&apos;s English Training</p>
          </div>
          <Badge tone={statut === "ACTIVE" ? "green" : "orange"}>
            {statut === "ACTIVE" ? "Compte ACTIF" : "En attente de paiement"}
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Mon niveau</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{niveau}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Cours disponibles</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{cours.filter((c) => c.statut === "Disponible").length}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Prochain cours</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{emploiDuTemps[0]?.jour}</p>
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <h2 className="text-sm font-semibold text-slate-800">Mes cours</h2>
          <ul className="mt-3 divide-y divide-slate-100 text-sm">
            {cours.map((c) => (
              <li key={c.titre} className="flex items-center justify-between py-2">
                <span className="text-slate-700">{c.titre}</span>
                <Badge tone={c.statut === "Disponible" ? "green" : "slate"}>{c.statut}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-sm font-semibold text-slate-800">Mes vidéos</h2>
          <ul className="mt-3 divide-y divide-slate-100 text-sm">
            {videos.map((v) => (
              <li key={v.titre} className="flex items-center justify-between py-2">
                <span className="text-slate-700">{v.titre}</span>
                <span className="text-slate-400">{v.duree}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-sm font-semibold text-slate-800">Mon emploi du temps</h2>
          <table className="mt-3 w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2">Jour</th>
                <th className="py-2">Horaire</th>
                <th className="py-2">Cours</th>
              </tr>
            </thead>
            <tbody>
              {emploiDuTemps.map((e) => (
                <tr key={e.jour} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 font-medium text-slate-700">{e.jour}</td>
                  <td className="py-2 text-slate-600">{e.heure}</td>
                  <td className="py-2 text-slate-600">{e.cours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-sm font-semibold text-slate-800">Mon bulletin</h2>
          <p className="mt-2 text-sm text-slate-500">
            Ton bulletin sera disponible ici à la fin de ton premier trimestre.
          </p>
        </Card>
      </div>
    </div>
  );
}
