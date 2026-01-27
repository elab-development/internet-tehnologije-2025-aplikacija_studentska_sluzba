import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { requests, students, requestTypes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { proveraAuth } from "@/lib/auth";

export async function GET() {
  try {
    const korisnik = await proveraAuth();
    
    if (!korisnik) {
      return NextResponse.json(
        { error: "Niste prijavljeni" },
        { status: 401 }
      );
    }

    let rezultat;

    if (korisnik.role === "STUDENT") {
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.userId, korisnik.userId));

      if (!student) {
        return NextResponse.json(
          { error: "Student nije pronadjen" },
          { status: 404 }
        );
      }

      rezultat = await db
        .select({
          id: requests.id,
          status: requests.status,
          purpose: requests.purpose,
          note: requests.note,
          createdAt: requests.createdAt,
          requestType: {
            id: requestTypes.id,
            name: requestTypes.name,
            price: requestTypes.price,
          },
        })
        .from(requests)
        .leftJoin(requestTypes, eq(requests.requestTypeId, requestTypes.id))
        .where(eq(requests.studentId, student.id))
        .orderBy(desc(requests.createdAt));
    } else {
      rezultat = await db
        .select({
          id: requests.id,
          status: requests.status,
          purpose: requests.purpose,
          note: requests.note,
          createdAt: requests.createdAt,
          requestType: {
            id: requestTypes.id,
            name: requestTypes.name,
          },
          student: {
            id: students.id,
            firstName: students.firstName,
            lastName: students.lastName,
            indexNumber: students.indexNumber,
          },
        })
        .from(requests)
        .leftJoin(requestTypes, eq(requests.requestTypeId, requestTypes.id))
        .leftJoin(students, eq(requests.studentId, students.id))
        .orderBy(desc(requests.createdAt));
    }

    return NextResponse.json({ requests: rezultat });
  } catch (error) {
    console.error("Greska:", error);
    return NextResponse.json(
      { error: "Greska na serveru" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const korisnik = await proveraAuth();

    if (!korisnik) {
      return NextResponse.json(
        { error: "Niste prijavljeni" },
        { status: 401 }
      );
    }

    if (korisnik.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Samo studenti mogu podnositi zahteve" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestTypeId, purpose } = body;

    if (!requestTypeId) {
      return NextResponse.json(
        { error: "Morate izabrati tip zahteva" },
        { status: 400 }
      );
    }

    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.userId, korisnik.userId));

    if (!student) {
      return NextResponse.json(
        { error: "Student nije pronadjen" },
        { status: 404 }
      );
    }

    const noviZahtev = await db.insert(requests).values({
      studentId: student.id,
      requestTypeId: parseInt(requestTypeId),
      purpose: purpose || null,
      status: "PENDING",
    });

    const [kreiranZahtev] = await db
      .select({
        id: requests.id,
        status: requests.status,
        purpose: requests.purpose,
        createdAt: requests.createdAt,
        requestType: {
          id: requestTypes.id,
          name: requestTypes.name,
          price: requestTypes.price,
        },
      })
      .from(requests)
      .leftJoin(requestTypes, eq(requests.requestTypeId, requestTypes.id))
      .where(eq(requests.id, noviZahtev[0].insertId));

    return NextResponse.json(
      { message: "Zahtev uspesno kreiran", request: kreiranZahtev },
      { status: 201 }
    );
  } catch (error) {
    console.error("Greska:", error);
    return NextResponse.json(
      { error: "Greska na serveru" },
      { status: 500 }
    );
  }
}