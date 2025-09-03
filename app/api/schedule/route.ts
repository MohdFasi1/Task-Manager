// app/api/schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateSchedule } from "@/lib/ai/scheduleGenerator";

export async function POST(req: NextRequest) {
  const { plans } = await req.json();

  const schedule = await generateSchedule(plans);
  return NextResponse.json({ schedule });
}
