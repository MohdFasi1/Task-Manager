"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Chatbot from "@/components/Chatbot"; // Adjust the import based on your file structure

type ScheduleItem = {
  time: string;
  title: string;
  label: string;
};

export default function SchedulePage() {
  const { user } = useUser();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check localStorage for cached schedule
    const cached = localStorage.getItem("ai_schedule");
    if (cached) {
      const parsed = JSON.parse(cached);
      const now = new Date();
      const expires = new Date(parsed.expires);
      if (now < expires) {
        setSchedule(parsed.schedule);
        setLoading(false);
        return;
      } else {
        localStorage.removeItem("ai_schedule");
      }
    }
    fetchSchedule();
  }, [user?.id]);

  const fetchSchedule = async () => {
    if (!user?.id) return;
    setLoading(true);
    const res = await fetch(`/api/chatbot?userId=${user.id}`);
    const data = await res.json();
    setSchedule(data.schedule || []);
    // Set expiry to next day at 7am
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(now.getDate() + 1);
    expires.setHours(7, 0, 0, 0);
    localStorage.setItem(
      "ai_schedule",
      JSON.stringify({ schedule: data.schedule || [], expires })
    );
    setLoading(false);
  };

  return (
    <div className="flex max-w-6xl mx-auto p-6 gap-8">
      <div className="w-2/3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">📅 AI-Generated Schedule</h1>
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={fetchSchedule}
          >
            🔄 Refresh Schedule
          </Button>
        </div>
        <Card className="shadow-lg">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">⏳ Generating...</div>
            ) : schedule.length === 0 ? (
              <div className="p-6 text-gray-500">No schedule available</div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Time</th>
                      <th className="border px-4 py-2 text-left">Task</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-4 py-2 font-mono">{item.time}</td>
                        <td className="border px-4 py-2">
                          {item.title}
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                            {item.label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="w-1/3">
        <Chatbot />
      </div>
    </div>
  );
}
