/**
 * @swagger
 * /api/documents/generate:
 *   post:
 *     summary: Generisanje PDF dokumenta
 *     description: Generiše PDF uverenje o studiranju za datog studenta
 *     tags:
 *       - Documents
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentName:
 *                 type: string
 *               indexNumber:
 *                 type: string
 *               purpose:
 *                 type: string
 *               documentType:
 *                 type: string
 *     responses:
 *       200:
 *         description: PDF fajl
 *       400:
 *         description: Nedostaju podaci
 */

import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentName, indexNumber, purpose, documentType } = body;


    if (!studentName || !indexNumber) {
      return NextResponse.json(
        { error: "Ime studenta i broj indeksa su obavezni" },
        { status: 400 }
      );
    }


    const pdfDoc = await PDFDocument.create();


    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);


    const page = pdfDoc.addPage([595, 842]); // A4 dimenzije u tačkama
    const { width, height } = page.getSize();


    const centerText = (text: string, font: typeof helvetica, size: number, y: number) => {
      const textWidth = font.widthOfTextAtSize(text, size);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: y,
        size: size,
        font: font,
        color: rgb(0, 0, 0),
      });
    };

    let currentY = height - 60; 


    centerText("UNIVERZITET U BEOGRADU", helveticaBold, 12, currentY);
    currentY -= 18;
    centerText("FAKULTET ORGANIZACIONIH NAUKA", helveticaBold, 12, currentY);
    currentY -= 18;
    centerText("Studentska sluzba", helvetica, 11, currentY);
    currentY -= 25;


    page.drawLine({
      start: { x: 50, y: currentY },
      end: { x: width - 50, y: currentY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    currentY -= 30;


    const today = new Date().toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const docNumber = `${Math.floor(Math.random() * 9000) + 1000}/${new Date().getFullYear()}`;

    page.drawText(`Broj: ${docNumber}`, {
      x: 50,
      y: currentY,
      size: 10,
      font: helvetica,
    });
    currentY -= 16;
    page.drawText(`Datum: ${today}`, {
      x: 50,
      y: currentY,
      size: 10,
      font: helvetica,
    });
    currentY -= 50;


    const title = documentType || "UVERENJE O STUDIRANJU";
    centerText(title, helveticaBold, 18, currentY);
    currentY -= 50;


    const bodyText = "Studentska sluzba Fakulteta organizacionih nauka";
    const bodyText2 = "Univerziteta u Beogradu izdaje ovo uverenje kojim potvrdjuje da je:";

    centerText(bodyText, helvetica, 12, currentY);
    currentY -= 20;
    centerText(bodyText2, helvetica, 12, currentY);
    currentY -= 45;


    centerText(studentName.toUpperCase(), helveticaBold, 16, currentY);
    currentY -= 25;
    centerText(`Broj indeksa: ${indexNumber}`, helveticaBold, 12, currentY);
    currentY -= 40;


    const statusText = "student/kinja ovog fakulteta, upisan/a na osnovne akademske studije.";
    centerText(statusText, helvetica, 12, currentY);
    currentY -= 35;


    if (purpose) {
      centerText("Uverenje se izdaje na zahtev studenta, u svrhu:", helvetica, 12, currentY);
      currentY -= 25;
      centerText(purpose, helveticaBold, 13, currentY);
      currentY -= 35;
    } else {
      const defaultPurpose = "Uverenje se izdaje na zahtev studenta,";
      const defaultPurpose2 = "radi koriscenja u zakonom predvidjene svrhe.";
      centerText(defaultPurpose, helvetica, 12, currentY);
      currentY -= 20;
      centerText(defaultPurpose2, helvetica, 12, currentY);
      currentY -= 35;
    }


    currentY -= 40;

    page.drawText("M.P.", {
      x: 80,
      y: currentY,
      size: 10,
      font: helvetica,
    });


    page.drawLine({
      start: { x: 370, y: currentY },
      end: { x: 530, y: currentY },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });


    const potpisText = "Sef studentske sluzbe";
    const potpisWidth = helvetica.widthOfTextAtSize(potpisText, 10);
    page.drawText(potpisText, {
      x: 370 + (160 - potpisWidth) / 2,
      y: currentY - 15,
      size: 10,
      font: helvetica,
    });


    const footerText = "Fakultet organizacionih nauka | Jove Ilica 154, Beograd | Tel: +381 11 3950 800";
    const footerWidth = helvetica.widthOfTextAtSize(footerText, 8);
    page.drawText(footerText, {
      x: (width - footerWidth) / 2,
      y: 40,
      size: 8,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5),
    });


    const pdfBytes = await pdfDoc.save();


    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="uverenje_${indexNumber.replace("/", "_")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Greska pri generisanju dokumenta" },
      { status: 500 }
    );
  }
}