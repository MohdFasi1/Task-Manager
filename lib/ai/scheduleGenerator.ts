import { GoogleGenAI } from "@google/genai";

export async function generateSchedule(plans: string) {
  const date =  new Date();
  const time = date.getHours()+":"+date.getMinutes();
  console.log(time)
  const prompt = `
You are a time management assistant.

The user said: "${plans}"

Based on this, generate a schedule starting from the ${time}. Assume each task is important and needs focus.
note: start time can be odd (ie: 10:12) but try to get closest time like 10:00/10:15/10:30/10:45 etc
Output only JSON like:
[
  { "time": "10:00 AM", "task": "Soft Skills" },
  { "time": "11:00 AM", "task": "DSA" }
]
No explanation, only valid JSON.
`;

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const content = response?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error("No content returned by AI");

  // Extract JSON from code block
  const jsonMatch = content.match(/```json\n([\s\S]+?)\n```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : content; // fallback if no code block
  try {
    const schedule = JSON.parse(jsonStr.trim());
    return schedule;
  } catch (error) {
    console.error("Failed to parse schedule:", error);
    throw new Error("Could not parse schedule JSON");
  }
}
