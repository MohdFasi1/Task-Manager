import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { chatWithAssistant } from "@/lib/ai/chatbot";
import { generateSchedule } from "@/lib/ai/schedule";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();
  if (!message) return NextResponse.json({ error: "No message provided" }, { status: 400 });

  const reply = await chatWithAssistant(user.id, message);
  return NextResponse.json({ reply });
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  try {
    const schedule = await generateSchedule(userId);
    return NextResponse.json({ schedule });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate schedule" }, { status: 500 });
  }
}
