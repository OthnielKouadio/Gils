import { financeEntries, partners, getTotalRevenue, type FinanceEntry } from "@/lib/mock-data/finance";

// TODO: remplacer par un appel à l'API Spring Boot d'Othniel quand elle sera prête.
export async function getFinanceEntries(): Promise<FinanceEntry[]> {
  return financeEntries;
}

export async function getFinanceSummary() {
  const total = getTotalRevenue();
  return {
    total,
    partners: partners.map((p) => ({ ...p, amount: Math.round((total * p.share) / 100) })),
  };
}
