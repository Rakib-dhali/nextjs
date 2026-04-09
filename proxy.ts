import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import path from "path";

export default withAuth(
  function proxy(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/login") ||
          pathname.startsWith("/api/auth") ||
          pathname === "/register"
        )
          return true;
        if (pathname.startsWith("/api/video") || pathname === "/") return true;
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
