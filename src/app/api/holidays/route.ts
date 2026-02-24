/**
 * @swagger
 * /api/holidays:
 *   get:
 *     summary: Državni praznici / neradni dani
 *     description: Vraća listu državnih praznika za izabranu godinu koristeći Nager.Date API
 *     tags:
 *       - External APIs
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           default: 2026
 *         description: Godina za koju se vraćaju praznici
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           default: RS
 *         description: ISO kod države (npr. RS, DE, IT)
 *     responses:
 *       200:
 *         description: Lista praznika
 *       500:
 *         description: Greška pri dohvatanju podataka
 */

import { NextRequest, NextResponse } from "next/server";

type Holiday = {
  date: string;         
  localName: string;    
  name: string;         
  countryCode: string;
  fixed: boolean;
  global: boolean;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year") || String(new Date().getFullYear());
    const country = searchParams.get("country") || "RS";

    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${encodeURIComponent(
        year
      )}/${encodeURIComponent(country)}`,
      { next: { revalidate: 60 * 60 * 24 } } 
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Nije moguće dohvatiti praznike" },
        { status: 500 }
      );
    }

    const data = (await res.json()) as Holiday[];

    
    const holidays = data.map((h) => ({
      date: h.date,
      localName: h.localName,
      name: h.name,
    }));

    return NextResponse.json({ holidays });
  } catch (error) {
    return NextResponse.json(
      { error: "Greška pri dohvatanju praznika" },
      { status: 500 }
    );
  }
}
