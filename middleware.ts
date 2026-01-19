import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Protect all dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if user is trying to access settings or users
    const isSettingsOrUsers =
      request.nextUrl.pathname.startsWith("/dashboard/settings") ||
      request.nextUrl.pathname.startsWith("/dashboard/users");

    // Only admins can access settings and user management
    if (isSettingsOrUsers && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
