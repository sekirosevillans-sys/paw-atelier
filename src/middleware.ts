import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Protección de rutas de administración
    if (pathname.startsWith("/admin")) {
      const role = (token as any)?.role;
      if (role !== "ADMIN" && role !== "STAFF") {
        return NextResponse.redirect(new URL("/login?unauthorized=true", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // Solo requerir token en /admin o /account
        if (pathname.startsWith("/admin") || pathname.startsWith("/account")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
