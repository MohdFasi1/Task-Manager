import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { chatWithAssistant } from "@/lib/ai/chatbot";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();
  if (!message) return NextResponse.json({ error: "No message provided" }, { status: 400 });

  const reply = await chatWithAssistant(user.id, message);
  return NextResponse.json({ reply });
}
