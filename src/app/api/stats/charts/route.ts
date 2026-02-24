/**
 * @swagger
 * /api/stats/charts:
 *   get:
 *     summary: Statistike za grafike
 *     description: Vraća detaljne statistike po statusu zahteva za vizualizaciju
 *     tags:
 *       - Requests
 *     responses:
 *       200:
 *         description: Statistike po statusu i po mesecu
 */
import { NextResponse } from "next/server";
import { db } from "@/db";
import { requests } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    
    const statusStats = await db
      .select({
        status: requests.status,
        count: sql<number>`count(*)`,
      })
      .from(requests)
      .groupBy(requests.status);

    
    const monthlyStats = await db
      .select({
        month: sql<string>`DATE_FORMAT(${requests.createdAt}, '%Y-%m')`,
        count: sql<number>`count(*)`,
      })
      .from(requests)
      .groupBy(sql`DATE_FORMAT(${requests.createdAt}, '%Y-%m')`)
      .orderBy(sql`DATE_FORMAT(${requests.createdAt}, '%Y-%m')`);

    return NextResponse.json({
      byStatus: statusStats.map((s) => ({
        status: s.status,
        count: Number(s.count),
      })),
      byMonth: monthlyStats.map((m) => ({
        month: m.month,
        count: Number(m.count),
      })),
    });
  } catch (error) {
    return NextResponse.json({ byStatus: [], byMonth: [] });
  }
}
