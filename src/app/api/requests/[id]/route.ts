import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { requests, students, requestTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { proveraAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const korisnik = await proveraAuth();

    if (!korisnik) {
      return NextResponse.json(
        { error: "Niste prijavljeni" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const zahtevId = parseInt(id);

    const [zahtev] = await db
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
          firstName: students.firstName,
          lastName: students.lastName,
          indexNumber: students.indexNumber,
        },
      })
      .from(requests)
      .leftJoin(requestTypes, eq(requests.requestTypeId, requestTypes.id))
      .leftJoin(students, eq(requests.studentId, students.id))
      .where(eq(requests.id, zahtevId));

    if (!zahtev) {
      return NextResponse.json(
        { error: "Zahtev nije pronadjen" },
        { status: 404 }
      );
    }

    return NextResponse.json({ request: zahtev });
  } catch (error) {
    console.error("Greska:", error);
    return NextResponse.json(
      { error: "Greska na serveru" },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const korisnik = await proveraAuth();

    if (!korisnik) {
      return NextResponse.json(
        { error: "Niste prijavljeni" },
        { status: 401 }
      );
    }

    if (korisnik.role === "STUDENT") {
      return NextResponse.json(
        { error: "Nemate dozvolu" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const zahtevId = parseInt(id);
    const body = await request.json();

    await db
      .update(requests)
      .set({
        status: body.status,
        note: body.note,
        processedBy: korisnik.userId,
      })
      .where(eq(requests.id, zahtevId));

    return NextResponse.json({ message: "Zahtev azuriran" });
  } catch (error) {
    console.error("Greska:", error);
    return NextResponse.json(
      { error: "Greska na serveru" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const korisnik = await proveraAuth();

    if (!korisnik) {
      return NextResponse.json(
        { error: "Niste prijavljeni" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const zahtevId = parseInt(id);


    const [postojeci] = await db
      .select()
      .from(requests)
      .where(eq(requests.id, zahtevId));

    if (!postojeci) {
      return NextResponse.json(
        { error: "Zahtev nije pronadjen" },
        { status: 404 }
      );
    }


    if (korisnik.role === "STUDENT") {
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.userId, korisnik.userId));

      if (postojeci.studentId !== student?.id) {
        return NextResponse.json(
          { error: "Ne mozete obrisati tudji zahtev" },
          { status: 403 }
        );
      }

      if (postojeci.status !== "PENDING") {
        return NextResponse.json(
          { error: "Mozete obrisati samo zahteve na cekanju" },
          { status: 400 }
        );
      }
    }

    await db.delete(requests).where(eq(requests.id, zahtevId));

    return NextResponse.json({ message: "Zahtev obrisan" });
  } catch (error) {
    console.error("Greska:", error);
    return NextResponse.json(
      { error: "Greska na serveru" },
      { status: 500 }
    );
  }
}
