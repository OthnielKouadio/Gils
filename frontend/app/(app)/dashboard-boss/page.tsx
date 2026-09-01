import { requireRole } from "@/lib/roles";
import { getStudents } from "@/lib/data/students";
import { getBulletins } from "@/lib/data/bulletins";
import { getFinanceSummary } from "@/lib/data/finance";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function formatFcfa(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export default async function DashboardBossPage() {
  await requireRole("boss");
  const [students, bulletins, summary] = await Promise.all([
    getStudents(),
    getBulletins(),
    getFinanceSummary(),
  ]);

  const stats = [
    { label: "Élèves inscrits", value: students.length },
    { label: "Bulletins générés", value: bulletins.length },
    { label: "Revenu net total", value: formatFcfa(summary.total) },
    { label: "Part Ylice (50%)", value: formatFcfa(summary.partners[0]?.amount ?? 0) },
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Boss</h1>
        <Badge tone="red">Dashboard Boss confidentiel</Badge>
      </div>
      <p className="mt-1 text-sm text-slate-500">Vue d&apos;ensemble réservée au rôle Boss.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-sm font-semibold text-slate-800">Élèves récents</h2>
        <ul className="mt-3 divide-y divide-slate-100 text-sm">
          {students.map((s) => (
            <li key={s.id} className="flex items-center justify-between py-2">
              <span className="text-slate-700">
                {s.firstName} {s.lastName}
              </span>
              <Badge tone="slate">{s.level}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
