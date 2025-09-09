import { GoogleGenAI } from "@google/genai";
import Task from "@/models/Task";
import Appointment from "@/models/Appointment";
import { connectDB } from "@/lib/db";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function generateSchedule(userId: string) {
  await connectDB();

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD

  const tasks = await Task.find({ userId }).lean();
  const appointments = await Appointment.find({ userId, date: dateStr }).lean();

  const context = `
You are a scheduling assistant.

Today's date: ${dateStr}
Current time: ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}

Tasks:
${JSON.stringify(tasks, null, 2)}

Appointments:
${JSON.stringify(appointments, null, 2)}

Rules:
1. Start scheduling from the CURRENT TIME onward.
2. Appointments must appear at their scheduled time.
3. Prioritize tasks with deadlines today, then high → medium → low priority.
4. Fill free slots around appointments with tasks.
5. Respond ONLY in valid JSON array format, like this:
[
  { "time": "09:00 AM", "title": "Meeting with Client", "label": "Appointment" },
  { "time": "10:30 AM", "title": "Finish DSA Assignment", "label": "Deadline + High Priority" }
]
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: context,
  });
  const raw = response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

  const cleaned = raw.replace(/```json|```/g, "").trim();

try {
  const parsed = JSON.parse(cleaned);
  console.log("✅ Parsed schedule:", parsed);
  return parsed;
} catch (err) {
  console.error("❌ Failed to parse AI response:", raw);
  return [];
}
}
