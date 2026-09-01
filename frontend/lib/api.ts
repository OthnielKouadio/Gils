const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface ApiStudent {
  id: string;
  fullName: string;
  whatsapp: string;
  level: string | null;
  grammarScore: number | null;
  topicScore: number | null;
  audioScore: number | null;
  totalScore: number | null;
  status: string;
}

export interface ApiPaymentLink {
  id: string;
  token: string;
  studentId: string;
  studentName: string;
  amount: number;
  status: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Impossible de joindre le serveur. Vérifie que le backend tourne sur " + API_URL + ".");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Erreur serveur (${res.status})`);
  }
  return res.json();
}

export function createStudent(fullName: string, whatsapp: string) {
  return request<ApiStudent>("/api/students", {
    method: "POST",
    body: JSON.stringify({ fullName, whatsapp }),
  });
}

export function submitTestResult(
  studentId: string,
  scores: { grammarScore: number; topicScore: number; audioScore: number }
) {
  return request<{ student: ApiStudent; paymentLink: ApiPaymentLink }>(
    `/api/students/${studentId}/test-result`,
    { method: "POST", body: JSON.stringify(scores) }
  );
}

export function payPaymentLink(token: string) {
  return request<{ paymentLink: ApiPaymentLink; student: ApiStudent }>(
    `/api/payments/${token}/pay`,
    { method: "POST" }
  );
}
