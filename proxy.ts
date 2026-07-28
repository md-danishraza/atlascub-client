import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes (no authentication required)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/api/webhook(.*)",
  "/about",
  "/contact",
  "/support",
  "/shop(.*)",
  "/collections(.*)",
  "/product(.*)",
  "/search",
  "/cart",
  "/wishlist",
  "/privacy",
  "/terms",
  "/returns",
  "/shipping-policy",
  "/api/rag(.*)",
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/account(.*)",
  "/checkout",
  "/orders(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // 🚀 1. BULLETPROOF SEO BYPASS: Instantly pass system files before any Clerk check runs
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return NextResponse.next();
  }

  const { userId, sessionClaims, redirectToSignIn } = await auth();
  const isApiRoute = pathname.startsWith("/api");

  // Get user role from session claims
  const role = sessionClaims?.public_metadata?.role as string;
  const isAdmin = role === "admin";

  // Handle API routes differently
  if (isApiRoute) {
    if (!isPublicRoute(req) && !userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return NextResponse.next();
  }

  // 🛡️ REDIRECT LOGGED-IN USERS AWAY FROM SIGN-IN / SIGN-UP
  if (userId && isAuthRoute(req)) {
    const destination = isAdmin ? "/admin" : "/";
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // Redirect to sign-in if accessing protected route without authentication
  if (!isPublicRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return redirectToSignIn();
  }

  // Protect admin routes - only admins can access
  if (isAdminRoute(req) && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect user account routes - only authenticated users
  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

// 🚀 2. CLEANED MATCHER: Standardized high-performance matching rules
export const config = {
  matcher: [
    // Skip Next.js internals and all static files asset extensions cleanly
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run middleware for API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};
