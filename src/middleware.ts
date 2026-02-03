import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth")?.value;
  const { pathname } = request.nextUrl;


  const zasticeneRute = ["/student", "/staff", "/admin"];


  const authRute = ["/login", "/register"];


  const jeZasticena = zasticeneRute.some((ruta) =>
    pathname.startsWith(ruta)
  );


  const jeAuthRuta = authRute.some((ruta) =>
    pathname.startsWith(ruta)
  );


  if (!token && jeZasticena) {
    return NextResponse.redirect(new URL("/login", request.url));
  }


  if (token && jeAuthRuta) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/staff/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};