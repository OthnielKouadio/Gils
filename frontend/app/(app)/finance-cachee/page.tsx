import { requireRole } from "@/lib/roles";
import { getFinanceEntries, getFinanceSummary } from "@/lib/data/finance";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Wallet, Lock, ArrowUpRight, ArrowDownRight } from "lucide-react";

function formatFcfa(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export default async function FinanceCacheePage() {
  await requireRole("boss");
  const [entries, summary] = await Promise.all([getFinanceEntries(), getFinanceSummary()]);

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
          <Wallet size={18} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Finance Cachée</h1>
        <Badge tone="red">
          <span className="inline-flex items-center gap-1">
            <Lock size={11} /> Accès Restreint : Boss uniquement
          </span>
        </Badge>
      </div>
      <p className="mt-1 text-sm text-slate-500">Répartition confidentielle des revenus entre partenaires.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Revenu net total</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatFcfa(summary.total)}</p>
        </Card>
        {summary.partners.map((p) => (
          <Card key={p.name} className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {p.name} ({p.share}%)
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{formatFcfa(p.amount)}</p>
            <p className="text-xs text-slate-400">{p.role}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-3">Libellé</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{entry.label}</td>
                <td className="px-4 py-3 text-slate-600">{entry.category}</td>
                <td className="px-4 py-3 text-slate-600">{entry.date}</td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    entry.amount < 0 ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {entry.amount < 0 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                    {formatFcfa(entry.amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
