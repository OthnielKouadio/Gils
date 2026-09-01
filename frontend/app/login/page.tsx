"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  function fillDemo(role: "boss" | "staff") {
    if (role === "boss") {
      setEmail("boss@gils.com");
      setPassword("boss123");
    } else {
      setEmail("staff@gils.com");
      setPassword("staff123");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <Card className="w-full max-w-sm p-8">
        <h1 className="text-xl font-bold text-slate-900">Gil&apos;s English School</h1>
        <p className="mb-6 text-sm text-slate-500">Connexion à l&apos;espace Ylice</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
        <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <p>Comptes de démonstration (mock, en attendant l&apos;API d&apos;Othniel) :</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemo("boss")}
              className="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50"
            >
              Boss
            </button>
            <button
              type="button"
              onClick={() => fillDemo("staff")}
              className="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50"
            >
              Staff
            </button>
          </div>
        </div>
      </Card>
    </main>
  );
}
