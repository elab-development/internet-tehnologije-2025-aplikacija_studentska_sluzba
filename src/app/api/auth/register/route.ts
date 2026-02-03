import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, students } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";

type Body = {
  name: string;
  email: string;
  password: string;
  indexNumber?: string;
};

export async function POST(req: Request) {
  try {
    const { name, email, password, indexNumber } = (await req.json()) as Body;

    // 1️⃣ Validacija inputa
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Sva polja su obavezna" },
        { status: 400 }
      );
    }

    // 2️⃣ Provera da li korisnik već postoji
    const [postojeci] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    if (postojeci) {
      return NextResponse.json(
        { error: "Korisnik sa ovim emailom već postoji" },
        { status: 400 }
      );
    }

    // 3️⃣ Hash lozinke
    const passHash = await bcrypt.hash(password, 10);

    // Razdvajanje imena i prezimena
    const [firstName, ...lastNameParts] = name.trim().split(" ");
    const lastName = lastNameParts.join(" ") || firstName;

    // Siguran fallback za indexNumber (unique)
    const safeIndexNumber =
      indexNumber ?? `${new Date().getFullYear()}/${Date.now()}`;

    let noviKorisnikId: number | null = null;

    // 4️⃣ TRANSAKCIJA (user + student)
    await db.transaction(async (tx) => {
      // Insert user
      await tx.insert(users).values({
        email,
        password: passHash,
        role: "STUDENT",
      });

      // Dohvati user ID (MySQL-safe)
      const [noviKorisnik] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email));

      if (!noviKorisnik) {
        throw new Error("Korisnik nije uspešno kreiran");
      }

      noviKorisnikId = noviKorisnik.id;

      // Insert student
      await tx.insert(students).values({
        firstName,
        lastName,
        indexNumber: safeIndexNumber,
        yearOfStudy: 1,
        userId: noviKorisnik.id,
      });
    });

    if (!noviKorisnikId) {
      return NextResponse.json(
        { error: "Greška pri registraciji" },
        { status: 500 }
      );
    }

    // 5️⃣ Kreiranje JWT tokena
    const token = signAuthToken({
      sub: noviKorisnikId,
      email,
      role: "STUDENT",
      name,
    });

    // 6️⃣ Odgovor + cookie
    const res = NextResponse.json({
      user: {
        id: noviKorisnikId,
        name,
        email,
        role: "STUDENT",
      },
    });

    res.cookies.set(AUTH_COOKIE, token, cookieOpts());
    return res;
  } catch (error) {
    console.error("Greška pri registraciji:", error);
    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}
