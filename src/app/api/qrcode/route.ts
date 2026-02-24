/**
 * @swagger
 * /api/qrcode:
 *   get:
 *     summary: Generisanje QR koda
 *     description: Generiše QR kod koristeći goqr.me eksterni API
 *     tags:
 *       - External APIs
 *     parameters:
 *       - in: query
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *         description: Tekst koji se enkodira u QR kod
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 200
 *         description: Veličina QR koda u pikselima
 *     responses:
 *       200:
 *         description: QR kod slika (PNG)
 *       400:
 *         description: Nedostaje data parametar
 *       500:
 *         description: Greška pri generisanju QR koda
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get("data");
    const size = searchParams.get("size") || "200";

    
    if (!data) {
      return NextResponse.json(
        { error: "Parametar 'data' je obavezan" },
        { status: 400 }
      );
    }

   
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;

    const res = await fetch(qrUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Greška pri generisanju QR koda" },
        { status: 500 }
      );
    }

    
    const imageBuffer = await res.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400", // keš 24h
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Greška pri generisanju QR koda" },
      { status: 500 }
    );
  }
}