import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname, searchParams } = req.nextUrl;

    // Handle auth callback with token - Hides token from URL instantly
    if (pathname === "/auth/callback" && searchParams.has("token")) {
      const token = searchParams.get("token");
      const returnUrl = searchParams.get("returnUrl") || "/";

      // Redirect to the same path but without query parameters
      const response = NextResponse.redirect(
        new URL("/auth/callback", req.url),
      );

      // Store token and returnUrl in temporary cookies
      // httpOnly: false allows the client-side SilentLogin component to read them
      const cookieOptions = {
        maxAge: 300, // 5 minutes
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      };

      response.cookies.set("auth_callback_token", token, cookieOptions);
      response.cookies.set(
        "auth_callback_return_url",
        returnUrl,
        cookieOptions,
      );

      return response;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow access to the callback page so we can process the login
        if (req.nextUrl.pathname === "/auth/callback") return true;
        // Other routes require a token
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/auth/callback"],
};
