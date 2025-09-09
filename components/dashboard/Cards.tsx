"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Calendar, ListTodo, Star } from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface Important {
  appointmentsToday: { _id?: string; title: string; time?: string }[];
  deadlinesToday: { _id?: string; title: string }[];
}
interface UpcomingEvent {
  type: 'appointment' | 'task';
  title: string;
  date: string;
  time?: string;
}
interface DashboardData {
  pending: number;
  completed: number;
  important: Important;
  upcomingEvents: UpcomingEvent[];
  overdue: number;
}

const Cards = () => {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData>({
    pending: 0,
    completed: 0,
    important: { appointmentsToday: [], deadlinesToday: [] },
    upcomingEvents: [],
    overdue: 0,
  })

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    fetch(`/api/data?userId=${user.id}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user?.id])

  const pendingTasks = data.pending
  const completedTasks = data.completed


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tasks Card */}
      <div className="bg-white rounded shadow p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <ListTodo className="text-gray-700" />
          <h3 className="text-lg font-semibold">Tasks</h3>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-600">Pending: <span className="font-bold">{loading ? "-" : pendingTasks}</span></div>
          <div className="text-sm text-gray-600">Completed: <span className="font-bold">{loading ? "-" : completedTasks}</span></div>
          <div className="text-sm text-gray-600">Overdue: <span className="font-bold">{loading ? "-" : data.overdue}</span></div>
        </div>
        <Button variant="outline" onClick={() => router.push("/tasks")}>View All</Button>
      </div>
      {/* Today Card */}
      <div className="bg-white rounded shadow p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <Star className="text-yellow-500" />
          <h3 className="text-lg font-semibold">Today</h3>
        </div>
        <div className="mb-4">
          {loading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : (
            <>
              {data.important?.appointmentsToday?.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-1">Appointments:</div>
                  <ul className="mb-2">
                    {data.important.appointmentsToday.map((a, idx) => (
                      <li key={a._id || idx} className="text-sm text-gray-700">
                        {a.title} {a.time ? `(${a.time})` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.important.deadlinesToday?.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-1">Deadlines:</div>
                  <ul>
                    {data.important.deadlinesToday.map((d, idx) => (
                      <li key={d._id || idx} className="text-sm text-gray-700">
                        {d.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(!data.important?.appointmentsToday?.length && !data.important?.deadlinesToday?.length) && (
                <div className="text-sm text-gray-500">No appointments or deadlines today.</div>
              )}
            </>
          )}
        </div>
        <Button variant="outline" onClick={() => router.push("/calendar")}>View Details</Button>
      </div>
      {/* Appointments Card */}
      <div className="bg-white rounded shadow p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="text-green-600" />
          <h3 className="text-lg font-semibold">Appointments</h3>
        </div>
        <div className="mb-4">
          {data.upcomingEvents.filter((e) => e.type === "appointment").length > 0 ? (
            <ul className="mb-2">
              {data.upcomingEvents.filter((e) => e.type === "appointment").map((event, idx) => (
                <li key={idx} className="text-xs text-gray-700">
                  {event.title} ({event.date}{event.time ? ` ${event.time}` : ""})
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No upcoming appointments.</div>
          )}
        </div>
        <Button variant="outline" onClick={() => router.push("/appointments")}>View All</Button>
      </div>
      {/* Deadlines Card */}
      <div className="bg-white rounded shadow p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <ListTodo className="text-red-500" />
          <h3 className="text-lg font-semibold">Deadlines</h3>
        </div>
        <div className="mb-4">
          {data.upcomingEvents.filter((e) => e.type === "task").length > 0 ? (
            <ul className="mb-2">
              {data.upcomingEvents.filter((e) => e.type === "task").map((event, idx) => (
                <li key={idx} className="text-xs text-gray-700">
                  {event.title} ({event.date}{event.time ? ` ${event.time}` : ""})
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No upcoming deadlines.</div>
          )}
        </div>
        <Button variant="outline" onClick={() => router.push("/tasks")}>View All</Button>
      </div>
    </div>
  )
}

export default Cards