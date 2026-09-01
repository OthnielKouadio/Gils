export const INSCRIPTION_FEE = 25000;

export function randomToken(): string {
  return `pl_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function levelFromTotal(total: number): string {
  return total >= 13 ? "Intermédiaire" : "Débutant";
}
