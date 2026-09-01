import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, type UserRole } from "@/lib/auth";

export async function requireRole(role: UserRole) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== role) redirect("/bulletin");
  return session;
}
