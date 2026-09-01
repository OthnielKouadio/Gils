"use client";

import { useMemo, useState } from "react";
import { bulletins as initialBulletins, computeAverage, type Bulletin } from "@/lib/mock-data/bulletins";
import { students } from "@/lib/mock-data/students";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Mode = "liste" | "voir" | "modifier";

function studentName(studentId: string) {
  const s = students.find((s) => s.id === studentId);
  return s ? `${s.firstName} ${s.lastName}` : "Élève inconnu";
}

function exportCsv(bulletin: Bulletin) {
  const rows = [
    ["Matière", "Note/20", "Commentaire"],
    ...bulletin.subjects.map((s) => [s.subject, String(s.score), s.comment]),
  ];
  const csv = rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bulletin-${studentName(bulletin.studentId).replace(/\s+/g, "-").toLowerCase()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BulletinPage() {
  const [bulletins, setBulletins] = useState<Bulletin[]>(initialBulletins);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("liste");
  const [draft, setDraft] = useState<Bulletin | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const selected = useMemo(
    () => bulletins.find((b) => b.id === selectedId) ?? null,
    [bulletins, selectedId]
  );

  function selectBulletin(id: string) {
    setSelectedId(id);
    setMode("voir");
    setSavedMessage(null);
  }

  function startEdit() {
    if (!selected) return;
    setDraft(structuredClone(selected));
    setMode("modifier");
    setSavedMessage(null);
  }

  function saveEdit() {
    if (!draft) return;
    setBulletins((prev) => prev.map((b) => (b.id === draft.id ? draft : b)));
    setMode("voir");
    setSavedMessage("Bulletin enregistré.");
  }

  function backToList() {
    setSelectedId(null);
    setMode("liste");
    setSavedMessage(null);
  }

  const active = mode === "modifier" ? draft : selected;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Module Bulletin</h1>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 print:hidden">
        <Button variant={mode === "liste" ? "secondary" : "ghost"} onClick={backToList}>
          Liste
        </Button>
        <Button variant="ghost" disabled={!selected || mode === "modifier"} onClick={startEdit}>
          Modifier
        </Button>
        <Button variant="ghost" disabled={mode !== "modifier"} onClick={saveEdit}>
          Enregistrer
        </Button>
        <Button variant="ghost" disabled={!selected} onClick={() => window.print()}>
          Imprimer
        </Button>
        <Button variant="ghost" disabled={!selected} onClick={() => selected && exportCsv(selected)}>
          Exporter
        </Button>
      </div>

      {savedMessage && (
        <p className="mt-3 text-sm text-emerald-600 print:hidden">{savedMessage}</p>
      )}

      {mode === "liste" && (
        <Card className="mt-6 overflow-x-auto print:hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3">Élève</th>
                <th className="px-4 py-3">Trimestre</th>
                <th className="px-4 py-3">Moyenne</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {bulletins.map((b) => (
                <tr key={b.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{studentName(b.studentId)}</td>
                  <td className="px-4 py-3 text-slate-600">{b.term}</td>
                  <td className="px-4 py-3">
                    <Badge tone="orange">{computeAverage(b.subjects)}/20</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => selectBulletin(b.id)}
                      className="text-sm text-orange-600 hover:underline"
                    >
                      Voir / Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {active && mode !== "liste" && (
        <Card className="mt-6 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{studentName(active.studentId)}</h2>
              <p className="text-sm text-slate-500">{active.term}</p>
            </div>
            <Badge tone="orange">Moyenne : {computeAverage(active.subjects)}/20</Badge>
          </div>

          <table className="mt-4 w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2">Matière</th>
                <th className="py-2">Note / 20</th>
                <th className="py-2">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {active.subjects.map((subject, index) => (
                <tr key={subject.subject} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-2 font-medium text-slate-700">{subject.subject}</td>
                  <td className="py-2 pr-2">
                    {mode === "modifier" ? (
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={subject.score}
                        onChange={(e) => {
                          if (!draft) return;
                          const value = Number(e.target.value);
                          const nextSubjects = draft.subjects.map((s, i) =>
                            i === index ? { ...s, score: value } : s
                          );
                          setDraft({ ...draft, subjects: nextSubjects });
                        }}
                        className="w-20 rounded border border-slate-300 px-2 py-1 text-sm"
                      />
                    ) : (
                      subject.score
                    )}
                  </td>
                  <td className="py-2 text-slate-600">
                    {mode === "modifier" ? (
                      <input
                        type="text"
                        value={subject.comment}
                        onChange={(e) => {
                          if (!draft) return;
                          const nextSubjects = draft.subjects.map((s, i) =>
                            i === index ? { ...s, comment: e.target.value } : s
                          );
                          setDraft({ ...draft, subjects: nextSubjects });
                        }}
                        className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                      />
                    ) : (
                      subject.comment
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Appréciation générale
            </p>
            {mode === "modifier" ? (
              <textarea
                value={draft?.teacherComment}
                onChange={(e) => draft && setDraft({ ...draft, teacherComment: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                rows={2}
              />
            ) : (
              <p className="mt-1 text-sm text-slate-700">{active.teacherComment}</p>
            )}
          </div>
        </Card>
      )}

      {mode !== "liste" && !active && (
        <p className="mt-6 text-sm text-slate-500">Aucun bulletin sélectionné.</p>
      )}
    </div>
  );
}
