"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { useUser } from "@clerk/nextjs"

interface AddTaskFormProps {
  addTask: (_id: string, title: string, priority: "low" | "medium" | "high", deadline: string) => void
  onClose?: () => void
  initialTitle?: string
  initialPriority?: "low" | "medium" | "high"
  initialDeadline?: string
  editMode?: boolean
  editId?: string
}

export default function AddTaskForm({
  addTask,
  onClose,
  initialTitle = "",
  initialPriority = "low",
  initialDeadline = "",
  editMode = false,
  editId
}: AddTaskFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [priority, setPriority] = useState<"low" | "medium" | "high">(initialPriority)
  const [deadline, setDeadline] = useState(initialDeadline)
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    setTitle(initialTitle)
    setPriority(initialPriority)
    setDeadline(initialDeadline)
  }, [initialTitle, initialPriority, initialDeadline])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      if (editMode && editId) {
        // Edit mode: update task
        addTask(editId, title, priority, deadline)
        if (onClose) onClose()
      } else {
        // Add mode: create new task
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            priority,
            deadline,
            userId: user?.id
          })
        })
        if (res.ok) {
          const data = await res.json()
          addTask(data.id || data._id, title, priority, deadline)
          setTitle("")
          setPriority("low")
          setDeadline("")
          if (onClose) onClose()
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg min-w-[320px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-stretch">
          <Input
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
          <Select value={priority} onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Deadline"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? (editMode ? "Saving..." : "Adding...") : (editMode ? "Save" : "Add")}
          </Button>
        </form>
      </div>
    </div>
  )
}
