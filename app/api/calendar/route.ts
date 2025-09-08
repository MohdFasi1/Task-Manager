import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";
import Task from "@/models/Task";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const year = parseInt(searchParams.get("year") || "");
  const month = parseInt(searchParams.get("month") || "");
  if (!userId || isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: "Missing userId, year, or month" }, { status: 400 });
  }
  // Format month as 2 digits
  const monthStr = String(month + 1).padStart(2, "0");
  const startDate = `${year}-${monthStr}-01`;
  const endDate = `${year}-${monthStr}-31`;
  try {
    const appointments = await Appointment.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).lean();
    const deadlines = await Task.find({
      userId,
      deadline: { $gte: startDate, $lte: endDate }
    }).lean();
    // console.log({ appointments, deadlines });
    return NextResponse.json({ appointments, deadlines });
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}