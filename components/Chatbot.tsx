// components/DailyPlanner.tsx
"use client";

import { useState } from "react";

export default function Chatbot() {
  const [plans, setPlans] = useState("");
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSchedule = async () => {
    if (!plans.trim()) return;
    setLoading(true);

    const res = await fetch("/api/schedule", {
      method: "POST",
      body: JSON.stringify({ plans }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setSchedule(data.schedule || []);
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">What are your plans for today?</h2>

      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        placeholder="E.g. Today I will work on softskills, project and DSA"
        value={plans}
        onChange={(e) => setPlans(e.target.value)}
      />

      <button
        onClick={generateSchedule}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Schedule"}
      </button>

      {schedule.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Your AI-Generated Schedule:</h3>
          <ul className="list-disc ml-6">
            {schedule.map((item, i) => (
              <li key={i}>
                <strong>{item.time}:</strong> {item.task}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
