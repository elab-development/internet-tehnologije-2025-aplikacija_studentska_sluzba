import { NextResponse } from "next/server";
import { db } from "@/db";
import { requestTypes } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const tipovi = await db
      .select()
      .from(requestTypes)
      .orderBy(asc(requestTypes.name));

    return NextResponse.json({ requestTypes: tipovi });
  } catch (error) {
    console.error("Greska pri dohvatanju tipova:", error);
    return NextResponse.json(
      { error: "Greska na serveru" },
      { status: 500 }
    );
  }
}