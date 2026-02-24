import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { requests, students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { proveraAuth } from "@/lib/auth";

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
    const requestId = parseInt(id);

    if (isNaN(requestId)) {
      return NextResponse.json(
        { error: "Nevažeći ID zahteva" },
        { status: 400 }
      );
    }

    const [zahtev] = await db
      .select()
      .from(requests)
      .where(eq(requests.id, requestId));

    if (!zahtev) {
      return NextResponse.json(
        { error: "Zahtev nije pronađen" },
        { status: 404 }
      );
    }

    if (korisnik.role === "STUDENT") {
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.userId, korisnik.sub));

      if (!student || zahtev.studentId !== student.id) {
        return NextResponse.json(
          { error: "Nemate dozvolu za brisanje ovog zahteva" },
          { status: 403 }
        );
      }

      if (zahtev.status !== "PENDING") {
        return NextResponse.json(
          { error: "Možete obrisati samo zahteve koji čekaju obradu" },
          { status: 403 }
        );
      }
    }

    await db.delete(requests).where(eq(requests.id, requestId));

    return NextResponse.json({ message: "Zahtev uspešno obrisan" });
  } catch (error) {
    console.error("Greška pri brisanju:", error);
    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}

type RequestStatus = "PENDING" | "IN_PROGRESS" | "APPROVED" | "REJECTED" | "COMPLETED";

const isRequestStatus = (s: unknown): s is RequestStatus =>
  s === "PENDING" ||
  s === "IN_PROGRESS" ||
  s === "APPROVED" ||
  s === "REJECTED" ||
  s === "COMPLETED";

export async function PATCH(
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

    if (korisnik.role !== "STAFF" && korisnik.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Nemate dozvolu za ovu akciju" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const requestId = parseInt(id);

    if (isNaN(requestId)) {
      return NextResponse.json(
        { error: "Nevažeći ID zahteva" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, note } = body;

    const [zahtev] = await db
      .select()
      .from(requests)
      .where(eq(requests.id, requestId));

    if (!zahtev) {
      return NextResponse.json(
        { error: "Zahtev nije pronađen" },
        { status: 404 }
      );
    }

    const updateData: { status?: RequestStatus; note?: string } = {};

    if (status !== undefined) {
      if (!isRequestStatus(status)) {
        return NextResponse.json({ error: "Nevalidan status" }, { status: 400 });
      }
      updateData.status = status;
    }

    if (note !== undefined) {
      updateData.note = String(note);
    }

    await db
      .update(requests)
      .set(updateData)
      .where(eq(requests.id, requestId));

    return NextResponse.json({ message: "Zahtev uspešno ažuriran" });
  } catch (error) {
    console.error("Greška pri ažuriranju:", error);
    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}