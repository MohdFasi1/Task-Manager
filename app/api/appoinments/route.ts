import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";

export async function POST(req: NextRequest) {
  await connectDB();
  const { date, time, title, userId } = await req.json();
  if (!date || !time || !title || !userId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    const appointment = await Appointment.create({ date, time, title, userId });
    console.log(appointment);
    return NextResponse.json({ success: true, appointment });
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  try {
    const appointments = await Appointment.find({ userId }).lean();
    return NextResponse.json({ appointments });
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const { id, date, time, title } = await req.json();
  if (!id || !date || !time || !title) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    const updated = await Appointment.findByIdAndUpdate(id, { date, time, title }, { new: true });
    return NextResponse.json({ success: true, appointment: updated });
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    await Appointment.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}