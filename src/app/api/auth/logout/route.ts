/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Odjava korisnika
 *     description: Uništava sesiju i odjavljuje korisnika
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Uspešna odjava
 */

import { NextResponse } from "next/server";
import { AUTH_COOKIE, cookieOpts } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Brisanje auth cookie-ja
  res.cookies.set(AUTH_COOKIE, "", {
    ...cookieOpts(),
    maxAge: 0,
  });

  return res;
}
