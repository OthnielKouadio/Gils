import type { UserRole } from "@/lib/auth";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role: UserRole;
    };
    accessToken?: string;
  }

  interface User {
    role: UserRole;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    accessToken?: string;
  }
}
