import { NextResponse } from "next/server";
import { AUTH_COOKIE, cookieOpts } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set(AUTH_COOKIE, "", {
    ...cookieOpts(),
    maxAge: 0,
  });

  return res;
}
