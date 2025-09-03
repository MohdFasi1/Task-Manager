"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Calendar, Mail, ListTodo, Star } from "lucide-react"

const Cards = () => {
  const router = useRouter()

  // Dummy data, replace with real data as needed
  const pendingTasks = 5
  const completedTasks = 12
  const importantAppointments = 2
  const importantDeadlines = 3
  const importantEmails = 4
  const draftEmails = 2
  const upcomingEvents = 3

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tasks Card */}
      <div className="bg-white rounded shadow p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <ListTodo className="text-gray-700" />
          <h3 className="text-lg font-semibold">Tasks</h3>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-600">Pending: <span className="font-bold">{pendingTasks}</span></div>
          <div className="text-sm text-gray-600">Completed: <span className="font-bold">{completedTasks}</span></div>
        </div>
        <Button variant="outline" onClick={() => router.push("/tasks")}>View All</Button>
      </div>
      {/* Importants Card */}
      <div className="bg-white rounded shadow p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <Star className="text-yellow-500" />
          <h3 className="text-lg font-semibold">Importants</h3>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-600">Appointments: <span className="font-bold">{importantAppointments}</span></div>
          <div className="text-sm text-gray-600">Deadlines: <span className="font-bold">{importantDeadlines}</span></div>
        </div>
        <Button variant="outline">View Details</Button>
      </div>
      {/* Emails Card */}
      <div className="bg-white rounded shadow p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="text-blue-500" />
          <h3 className="text-lg font-semibold">Emails</h3>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-600">Important: <span className="font-bold">{importantEmails}</span></div>
          <div className="text-sm text-gray-600">Draft: <span className="font-bold">{draftEmails}</span></div>
        </div>
        <Button variant="outline" onClick={() => router.push("/inbox")}>Open Inbox</Button>
      </div>
      {/* Upcoming Events Card */}
      <div className="bg-white rounded shadow p-6 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="text-green-600" />
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-600">Events: <span className="font-bold">{upcomingEvents}</span></div>
        </div>
        <Button variant="outline">View Events</Button>
      </div>
    </div>
  )
}

export default Cards