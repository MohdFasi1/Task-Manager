import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Task from "@/models/Task"
import Appointment from "@/models/Appointment"

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }
  try {
    // Use local time for 'now' to avoid timezone conflict
    const nowDate = new Date()
    const now =
      nowDate.getFullYear() +
      "-" +
      String(nowDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(nowDate.getDate()).padStart(2, "0")

    const completed = await Task.countDocuments({ userId, completed: true })
    const pending = await Task.countDocuments({
      userId,
      completed: false,
      $or: [{ deadline: { $gte: now } }, { deadline: "" }, { deadline: null }],
    })
    const overdue = await Task.countDocuments({
      userId,
      completed: false,
      deadline: { $lt: now, $ne: "" },
    })
    const appointmentsToday = await Appointment.find({ userId, date: now }).lean()
    const deadlinesToday = await Task.find({
      userId,
      completed: false,
      deadline: { $eq: now, $ne: "" },
    }).lean()

    // Upcoming events: nearest deadlines and appointments (max 5), exclude today's deadlines/appointments
    const upcomingTasks = await Task.find({
      userId,
      completed: false,
      deadline: { $gt: now, $ne: "" },
    })
      .sort({ deadline: 1 })
      .limit(5)
      .lean()

    const upcomingAppointments = await Appointment.find({
      userId,
      date: { $gt: now },
    })
      .sort({ date: 1, time: 1 })
      .limit(5)
      .lean()

    // Merge and sort by date, then time, then deadline
    const events = [
      ...upcomingTasks.map((t) => ({
        type: "task",
        title: t.title,
        date: t.deadline,
      })),
      ...upcomingAppointments.map((a) => ({
        type: "appointment",
        title: a.title,
        date: a.date,
      })),
    ]
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return 0
      })
      .slice(0, 5)

    return NextResponse.json({
      completed,
      pending,
      overdue,
      important: {
        appointmentsToday,
        deadlinesToday,
      },
      upcomingEvents: events,
    })
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 })
  }
}
