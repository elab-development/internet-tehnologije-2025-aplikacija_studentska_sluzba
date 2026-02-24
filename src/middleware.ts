import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const origin = request.headers.get("origin") || "";


  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }


  response.headers.set("X-Content-Type-Options", "nosniff");

  response.headers.set("X-Frame-Options", "DENY");

  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");



  if (request.nextUrl.pathname.startsWith("/api")) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed, remaining } = rateLimit(ip);

    response.headers.set("X-RateLimit-Remaining", String(remaining));

    if (!allowed) {
      return NextResponse.json(
        { error: "Previše zahteva. Pokušajte ponovo za 15 minuta." },
        { status: 429 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};