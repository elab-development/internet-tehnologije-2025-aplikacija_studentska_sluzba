import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, students, staff } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const claims = verifyAuthToken(token);

    const [korisnik] = await db
      .select()
      .from(users)
      .where(eq(users.id, claims.sub));

    if (!korisnik) {
      return NextResponse.json({ user: null });
    }

    let userName = korisnik.email;
    let dodatniPodaci = {};

    if (korisnik.role === "STUDENT") {
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.userId, korisnik.id));
      if (student) {
        userName = `${student.firstName} ${student.lastName}`;
        dodatniPodaci = {
          indexNumber: student.indexNumber,
          yearOfStudy: student.yearOfStudy,
        };
      }
    } else if (korisnik.role === "STAFF" || korisnik.role === "ADMIN") {
      const [sluzbenik] = await db
        .select()
        .from(staff)
        .where(eq(staff.userId, korisnik.id));
      if (sluzbenik) {
        userName = `${sluzbenik.firstName} ${sluzbenik.lastName}`;
        dodatniPodaci = {
          position: sluzbenik.position,
        };
      }
    }

    return NextResponse.json({
      user: {
        id: korisnik.id,
        name: userName,
        email: korisnik.email,
        role: korisnik.role,
        createdAt: korisnik.createdAt,
        ...dodatniPodaci,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
