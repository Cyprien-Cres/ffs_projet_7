import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


// Middleware qui protège certaines pages : si pas de token, on redirige vers /login.
export function proxy(request: NextRequest) {
    const token = request.cookies.get("token");

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// On limite ce middleware a certaines routes.
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/project/:path*"],
};