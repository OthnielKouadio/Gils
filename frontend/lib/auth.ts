import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type UserRole = "boss" | "staff";

// Côté serveur (cette fonction tourne dans le conteneur Next.js), on préfère
// API_URL (ex: http://backend:4000 en Docker) à NEXT_PUBLIC_API_URL, qui lui
// est destiné au navigateur et pointe vers l'adresse publique du backend.
const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function toFrontendRole(backendRole: string): UserRole {
  return backendRole === "BOSS" ? "boss" : "staff";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      // Le module Auth réel vit maintenant côté backend (OTK) : on délègue la
      // vérification des identifiants à l'API au lieu d'une liste en dur ici.
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        let res: Response;
        try {
          res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });
        } catch {
          throw new Error("Backend injoignable. Vérifie qu'il tourne sur " + API_URL + ".");
        }

        if (!res.ok) return null;

        const data = await res.json();
        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: toFrontendRole(data.user.role),
          accessToken: data.token as string,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: UserRole }).role;
        token.accessToken = (user as { accessToken: string }).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};
