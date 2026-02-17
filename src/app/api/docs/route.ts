import { getApiDocs } from "@/lib/swagger";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Swagger API specifikacija
 *     description: Vraća OpenAPI specifikaciju u JSON formatu
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: OpenAPI JSON specifikacija
 */
export async function GET() {
  const spec = await getApiDocs();
  return NextResponse.json(spec);
}