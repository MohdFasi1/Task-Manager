import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Task from "@/models/Task"

export async function POST(req: NextRequest) {
  await connectDB()
  const { title, priority, deadline, userId } = await req.json()
  if (!title || !priority || !userId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  try {
    const task = await Task.create({ title, priority, deadline, userId, completed: false })
    return NextResponse.json({ success: true, _id: task._id })
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }
  try {
    const tasks = await Task.find({ userId }).lean()
    return NextResponse.json({ tasks })
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  await connectDB()
  const { id, completed } = await req.json()
  if (!id || typeof completed !== "boolean") {
    return NextResponse.json({ error: "Missing id or completed" }, { status: 400 })
  }
  try {
    await Task.findByIdAndUpdate(id, { completed })
    return NextResponse.json({ success: true, completed })
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB()
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }
  try {
    await Task.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  await connectDB()
  const { id, title, priority, deadline } = await req.json()
  if (!id || !title || !priority) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  try {
    await Task.findByIdAndUpdate(id, { title, priority, deadline })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 })
  }
}