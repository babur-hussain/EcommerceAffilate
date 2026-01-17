import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "auth_token";

const decodeBase64Url = (input: string) => {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return typeof atob === "function"
    ? atob(padded)
    : Buffer.from(padded, "base64").toString("utf8");
};

const getRoleFromToken = (token: string): string | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const decoded = decodeBase64Url(payload);
    const json = JSON.parse(decoded);
    return json?.role ?? null;
  } catch {
    return null;
  }
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const adminRoutes = pathname.startsWith("/admin");
  const businessRoutes = pathname.startsWith("/business");
  const influencerRoutes = pathname.startsWith("/influencer");
  // Cart and checkout only require authentication, not specific role
  const authOnlyRoutes = ["/cart", "/checkout"].some((p) =>
    pathname.startsWith(p)
  );
  // Account routes - let client-side handle auth to avoid redirect loops with cookie sync timing
  const accountRoutes = pathname.startsWith("/account");

  // Protected routes that need middleware-level auth check
  // Exclude account routes - they'll handle auth client-side
  const protectedRoutes = adminRoutes || influencerRoutes || authOnlyRoutes;

  if (!protectedRoutes) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For cart/checkout, just having a valid token is enough
  if (authOnlyRoutes) {
    return NextResponse.next();
  }

  const role = getRoleFromToken(token);
  if (!role) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (adminRoutes && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Business routes are guarded client-side; no edge redirect here

  if (influencerRoutes && role !== "INFLUENCER") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/influencer/:path*",
    "/cart",
    "/cart/:path*",
    "/checkout",
    "/checkout/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
  ],
};
