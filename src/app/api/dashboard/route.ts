import { NextResponse } from "next/server";
import { getDashboardData } from "@/features/market-data/service";

export async function GET() {
  const data = await getDashboardData();
  return NextResponse.json(data);
}
