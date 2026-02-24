import { NextResponse } from "next/server";
import { db } from "@/db";
import { requests } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(requests);

    const completedResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(requests)
      .where(eq(requests.status, "COMPLETED"));

    const approvedResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(requests)
      .where(eq(requests.status, "APPROVED"));

    return NextResponse.json({
      totalRequests: Number(totalResult[0].count),
      completedRequests: Number(completedResult[0].count) + Number(approvedResult[0].count),
      avgProcessingDays: 3,
    });
  } catch (error) {
    return NextResponse.json({
      totalRequests: 0,
      completedRequests: 0,
      avgProcessingDays: 0,
    });
  }
}