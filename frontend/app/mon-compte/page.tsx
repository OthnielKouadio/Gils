"use client";

import { useEffect, useState } from "react";
import { GraduationCap, BookOpen, Video, CalendarDays, FileText, CheckCircle2, Clock, Lock, PlayCircle } from "lucide-react";
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
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
              <GraduationCap size={22} strokeWidth={2.25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Bienvenue, {nom}</h1>
              <p className="text-sm text-slate-500">Ton espace élève Gil&apos;s English Training</p>
            </div>
          </div>
          <Badge tone={statut === "ACTIVE" ? "green" : "orange"}>
            <span className="inline-flex items-center gap-1">
              {statut === "ACTIVE" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
              {statut === "ACTIVE" ? "Compte ACTIF" : "En attente de paiement"}
            </span>
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-slate-400">
              <GraduationCap size={14} /> Mon niveau
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{niveau}</p>
          </Card>
          <Card className="p-5">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-slate-400">
              <BookOpen size={14} /> Cours disponibles
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{cours.filter((c) => c.statut === "Disponible").length}</p>
          </Card>
          <Card className="p-5">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-slate-400">
              <CalendarDays size={14} /> Prochain cours
            </p>
            <p className="mt-2 text-lg font-bold text-slate-900">{emploiDuTemps[0]?.jour}</p>
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <BookOpen size={16} className="text-orange-500" /> Mes cours
          </h2>
          <ul className="mt-3 divide-y divide-slate-100 text-sm">
            {cours.map((c) => (
              <li key={c.titre} className="flex items-center justify-between py-2.5">
                <span className="flex items-center gap-2 text-slate-700">
                  {c.statut === "Disponible" ? (
                    <PlayCircle size={16} className="text-emerald-500" />
                  ) : (
                    <Lock size={16} className="text-slate-300" />
                  )}
                  {c.titre}
                </span>
                <Badge tone={c.statut === "Disponible" ? "green" : "slate"}>{c.statut}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Video size={16} className="text-orange-500" /> Mes vidéos
          </h2>
          <ul className="mt-3 divide-y divide-slate-100 text-sm">
            {videos.map((v) => (
              <li key={v.titre} className="flex items-center justify-between py-2.5">
                <span className="flex items-center gap-2 text-slate-700">
                  <PlayCircle size={16} className="text-slate-300" /> {v.titre}
                </span>
                <span className="text-slate-400">{v.duree}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <CalendarDays size={16} className="text-orange-500" /> Mon emploi du temps
          </h2>
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
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <FileText size={16} className="text-orange-500" /> Mon bulletin
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Ton bulletin sera disponible ici à la fin de ton premier trimestre.
          </p>
        </Card>
      </div>
    </div>
  );
}
