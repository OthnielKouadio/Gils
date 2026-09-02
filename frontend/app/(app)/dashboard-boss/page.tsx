import { requireRole } from "@/lib/roles";
import { getStudents } from "@/lib/data/students";
import { getBulletins } from "@/lib/data/bulletins";
import { getFinanceSummary } from "@/lib/data/finance";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LayoutDashboard, Lock, Users, FileText, Wallet, TrendingUp, GraduationCap, type LucideIcon } from "lucide-react";

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

  const stats: { label: string; value: string | number; icon: LucideIcon }[] = [
    { label: "Élèves inscrits", value: students.length, icon: Users },
    { label: "Bulletins générés", value: bulletins.length, icon: FileText },
    { label: "Revenu net total", value: formatFcfa(summary.total), icon: Wallet },
    { label: "Part Ylice (50%)", value: formatFcfa(summary.partners[0]?.amount ?? 0), icon: TrendingUp },
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
          <LayoutDashboard size={18} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Boss</h1>
        <Badge tone="red">
          <span className="inline-flex items-center gap-1">
            <Lock size={11} /> Dashboard Boss confidentiel
          </span>
        </Badge>
      </div>
      <p className="mt-1 text-sm text-slate-500">Vue d&apos;ensemble réservée au rôle Boss.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5">
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-slate-400">
                <Icon size={14} /> {stat.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <GraduationCap size={16} className="text-orange-500" /> Élèves récents
        </h2>
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
