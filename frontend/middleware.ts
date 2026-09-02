import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const isBossRoute =
      req.nextUrl.pathname.startsWith("/finance-cachee") ||
      req.nextUrl.pathname.startsWith("/dashboard-boss");

    if (isBossRoute && role !== "boss") {
      return NextResponse.redirect(new URL("/bulletin", req.url));
    }
  },
  {
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: ["/test-niveau/:path*", "/bulletin/:path*", "/finance-cachee/:path*", "/dashboard-boss/:path*"],
};
