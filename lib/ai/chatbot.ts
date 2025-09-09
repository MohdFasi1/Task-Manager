import { GoogleGenAI } from "@google/genai";
import Task from "@/models/Task";
import Appointment from "@/models/Appointment";
import { connectDB } from "@/lib/db";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function chatWithAssistant(userId: string, message: string) {
  await connectDB();

  // Get user's tasks and appointments
  const tasks = await Task.find({ userId }).lean();
  const appointments = await Appointment.find({ userId }).lean();

  const context = `
You are a personal assistant AI. The user will ask about their tasks and appointments.

Here are their current tasks:
${JSON.stringify(tasks, null, 2)}

Here are their current appointments:
${JSON.stringify(appointments, null, 2)}

Rules:
1. If the user wants to **add a task**, respond strictly in JSON:
   {"action": "add_task", "title": "...", "priority": "...", "deadline": "YYYY-MM-DD"}
2. If the user wants to **update a task**, respond:
   {"action": "update_task", "id": "...", "updates": { "title": "...", "priority": "...", "completed": true/false }}
3. If the user wants to **delete a task**, respond:
   {"action": "delete_task", "id": "..."}

4. If the user wants to **add an appointment**, respond:
   {"action": "add_appointment", "title": "...", "date": "YYYY-MM-DD", "time": "..."}
5. If the user wants to **update an appointment**, respond:
   {"action": "update_appointment", "id": "...", "updates": { "title": "...", "date": "...", "time": "..." }}
6. If the user wants to **delete an appointment**, respond:
   {"action": "delete_appointment", "id": "..."}

7. If the user is just asking (like "What tasks do I have?"), summarize naturally in text.
8. Only use JSON for actions, not for summaries.


If theres mutiple tasks or appointments to mention respond in a numbered list and dont add astriks ("*") to the summeries.
  `;

  // First ask AI to classify + generate response
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${context}\nUser: ${message}\nAssistant:`,
  });

  const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Try to parse JSON response (for actions)
  let action;
  try {
    action = JSON.parse(rawText);
  } catch {
    // Not JSON = just assistant reply
    return rawText;
  }

  // Execute actions
  if (action?.action === "add_task") {
    const newTask = await Task.create({
      userId,
      title: action.title,
      priority: action.priority || "medium",
      deadline: action.deadline || null,
      completed: false,
    });
    return `✅ Task "${newTask.title}" added successfully.`;
  }

  if (action?.action === "update_task") {
    await Task.findByIdAndUpdate(action.id, action.updates);
    return `✅ Task updated successfully.`;
  }

  if (action?.action === "delete_task") {
    await Task.findByIdAndDelete(action.id);
    return `🗑️ Task deleted successfully.`;
  }

  if (action?.action === "add_appointment") {
    const newAppt = await Appointment.create({
      userId,
      title: action.title,
      date: action.date,
      time: action.time,
    });
    return `📅 Appointment "${newAppt.title}" added successfully.`;
  }

  if (action?.action === "update_appointment") {
    await Appointment.findByIdAndUpdate(action.id, action.updates);
    return `📅 Appointment updated successfully.`;
  }

  if (action?.action === "delete_appointment") {
    await Appointment.findByIdAndDelete(action.id);
    return `🗑️ Appointment deleted successfully.`;
  }

  // Default fallback
  return "⚠️ I couldn’t understand the request.";
}
