export interface FinanceEntry {
  id: string;
  label: string;
  amount: number;
  date: string;
  category: "Frais de scolarité" | "Test de niveau" | "Autre";
}

export const financeEntries: FinanceEntry[] = [
  { id: "fin-1", label: "Frais de scolarité - Aïcha Koffi", amount: 75000, date: "2026-01-12", category: "Frais de scolarité" },
  { id: "fin-2", label: "Test de niveau - Jean N'Guessan", amount: 5000, date: "2026-02-03", category: "Test de niveau" },
  { id: "fin-3", label: "Frais de scolarité - Fatou Diabaté", amount: 75000, date: "2025-11-20", category: "Frais de scolarité" },
  { id: "fin-4", label: "Test de niveau - Kouadio Yao", amount: 5000, date: "2026-03-15", category: "Test de niveau" },
  { id: "fin-5", label: "Frais de scolarité - Awa Traoré", amount: 75000, date: "2026-04-02", category: "Frais de scolarité" },
  { id: "fin-6", label: "Achat manuels", amount: -20000, date: "2026-04-10", category: "Autre" },
];

export const partners = [
  { name: "Ylice Asseke", role: "Frontend", share: 50 },
  { name: "Othniel Kouadio", role: "Backend", share: 50 },
];

export function getTotalRevenue(): number {
  return financeEntries.reduce((sum, e) => sum + e.amount, 0);
}
