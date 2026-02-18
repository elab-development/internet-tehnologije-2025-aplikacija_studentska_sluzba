/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Prijava korisnika
 *     description: Autentifikuje korisnika pomoću email-a i lozinke
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Uspešna prijava
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Uspešna prijava"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Pogrešan email ili lozinka
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, students, staff } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import { sanitizeInput } from "@/lib/sanitize";

type Body = {
  email: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as Body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email i lozinka su obavezni" },
        { status: 400 }
      );
    }

    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(password);

    const [korisnik] = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        role: users.role,
      })
      .from(users)
      .where(eq(users.email, cleanEmail));

    if (!korisnik) {
      return NextResponse.json(
        { error: "Pogrešan email ili lozinka" },
        { status: 401 }
      );
    }

    const lozinkaOk = await bcrypt.compare(cleanPassword, korisnik.password);
    if (!lozinkaOk) {
      return NextResponse.json(
        { error: "Pogrešan email ili lozinka" },
        { status: 401 }
      );
    }

    let userName = korisnik.email;

    if (korisnik.role === "STUDENT") {
      const [student] = await db
        .select({
          firstName: students.firstName,
          lastName: students.lastName,
        })
        .from(students)
        .where(eq(students.userId, korisnik.id));

      if (student) {
        userName = `${student.firstName} ${student.lastName}`;
      }
    } else if (korisnik.role === "STAFF" || korisnik.role === "ADMIN") {
      const [sluzbenik] = await db
        .select({
          firstName: staff.firstName,
          lastName: staff.lastName,
        })
        .from(staff)
        .where(eq(staff.userId, korisnik.id));

      if (sluzbenik) {
        userName = `${sluzbenik.firstName} ${sluzbenik.lastName}`;
      }
    }

    const token = signAuthToken({
      sub: korisnik.id,
      email: korisnik.email,
      role: korisnik.role,
      name: userName,
    });

    const res = NextResponse.json({
      user: {
        id: korisnik.id,
        name: userName,
        email: korisnik.email,
        role: korisnik.role,
      },
    });

    res.cookies.set(AUTH_COOKIE, token, cookieOpts());
    return res;
  } catch (error) {
    console.error("Greška pri prijavi:", error);
    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}
