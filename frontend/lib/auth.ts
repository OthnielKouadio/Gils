import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type UserRole = "boss" | "staff";

interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Utilisateurs mockés en attendant le module Auth (Spring Boot) d'Othniel.
const mockUsers: MockUser[] = [
  { id: "1", name: "Ylice (Boss)", email: "boss@gils.com", password: "boss123", role: "boss" },
  { id: "2", name: "Staff Gil's", email: "staff@gils.com", password: "staff123", role: "staff" },
];

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
      async authorize(credentials) {
        const found = mockUsers.find(
          (u) => u.email === credentials?.email && u.password === credentials?.password
        );
        if (!found) return null;
        return { id: found.id, name: found.name, email: found.email, role: found.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};
