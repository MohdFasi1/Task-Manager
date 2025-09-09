"use client";
import React, { useState, useEffect } from 'react'
import AddTaskForm from "@/components/tasks/AddTaskForm"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { MoreVertical, Pencil, Trash2, X } from "lucide-react"
import { useRef, useState as useMenuState } from "react"

type Task = {
  _id: string
  title: string
  priority: "low" | "medium" | "high"
  deadline: string
  completed: boolean // ensure always defined
}

const priorityColors: Record<Task["priority"], string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800"
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);
  const { user } = useUser();
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/tasks?userId=${user.id}`)
      .then(res => res.json())
      .then (data => {
        if (Array.isArray(data.tasks)) setTasks(data.tasks);
      });
  }, [user?.id]);

  const handleAddTask = (_id: string, title: string, priority: "low" | "medium" | "high", deadline: string) => {
    setTasks([...tasks, { _id, title, priority, deadline, completed: false }]);
  };

  const handleToggleComplete = async (task: Task, idx: number) => {
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task._id, completed: !task.completed })
    });
    if (res.ok) {
      setTasks(tasks =>
        tasks.map((t, i) =>
          i === idx ? { ...t, completed: !t.completed } : t
        )
      );
    }
  };

  const handleDeleteTask = async (task: Task) => {
    const res = await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task._id })
    });
    if (res.ok) {
      setTasks(tasks => tasks.filter(t => t._id !== task._id));
      setMenuOpenIdx(null);
      setConfirmDeleteIdx(null);
    }
  };

  const handleEditClick = (idx: number) => {
    setEditIdx(idx);
    setMenuOpenIdx(null);
    setEditTask(tasks[idx]);
  };

  const handleEditSave = async (_id: string, title: string, priority: "low" | "medium" | "high", deadline: string) => {
    if (!editTask) return;
    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: _id,
        title,
        priority,
        deadline
      })
    });
    if (res.ok) {
      setTasks(tasks =>
        tasks.map((t, i) =>
          i === editIdx
            ? { ...t, title, priority, deadline }
            : t
        )
      );
      setEditIdx(null);
      setEditTask(null);
    }
  };

  const handleEditCancel = () => {
    setEditIdx(null);
    setEditTask(null);
  };

  function sortTasks(tasks: Task[]) {
    const priorityOrder: Record<Task["priority"], number> = { high: 0, medium: 1, low: 2 }
    return [...tasks]
      .sort((a, b) => {
        // Completed tasks always last
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        // Sort by priority
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        }
        // Sort by deadline (earlier first, empty last)
        if (a.deadline && b.deadline) {
          return a.deadline.localeCompare(b.deadline)
        }
        if (!a.deadline && b.deadline) return 1
        if (a.deadline && !b.deadline) return -1
        return 0
      })
  }

  return (
    <div className="max-w-xl mx-auto h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button className="bg-gray-900 text-white hover:bg-gray-800" onClick={() => setShowForm(true)}>
          Insert Task
        </Button>
      </div>
      {showForm && (
        <AddTaskForm
          addTask={(_id, title, priority, deadline) => {
            handleAddTask(_id, title, priority, deadline);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
      <div className="max-h-[500px] overflow-y-auto">
        <ul className="space-y-3">
          {sortTasks(tasks).map((task, idx) => (
            <li
              key={task._id}
              className={`bg-white rounded shadow flex items-center justify-between px-4 py-3 border relative`}
              style={{ maxWidth: "700px", margin: "0 auto" }} // <-- restrict width of each list item
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task, tasks.findIndex(t => t._id === task._id))}
                  className="accent-gray-900"
                />
                <div className={task.completed ? "opacity-60" : ""}>
                  {editIdx === idx ? (
                    <AddTaskForm
                      addTask={(_id, title, priority, deadline) => handleEditSave(_id, title, priority, deadline)}
                      onClose={handleEditCancel}
                      initialTitle={editTask?.title}
                      initialPriority={editTask?.priority}
                      initialDeadline={editTask?.deadline}
                      editMode={true}
                      editId={editTask?._id}
                    />
                  ) : (
                    <>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-gray-400">
                        {task.deadline && (
                          <span>Deadline: {task.deadline}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 relative">
                <p className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[task.priority]}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </p>
                {menuOpenIdx === idx && editIdx !== idx ? (
                  <>
                    <button
                      className="p-2 rounded hover:bg-gray-100"
                      title="Edit"
                      onClick={() => handleEditClick(idx)}
                      disabled={task.completed}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="p-2 rounded hover:bg-gray-100"
                      title="Delete"
                      onClick={() => setConfirmDeleteIdx(idx)}
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 rounded hover:bg-gray-100" title="Close" onClick={() => setMenuOpenIdx(null)}>
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  editIdx !== idx && (
                    <button
                      className="p-2 rounded hover:bg-gray-100"
                      onClick={() => setMenuOpenIdx(idx)}
                      aria-label="Task menu"
                    >
                      <MoreVertical size={18} />
                    </button>
                  )
                )}
                {/* Confirmation Dialog */}
                {confirmDeleteIdx === idx && (
                  <div
                    className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10"
                    onClick={() => setConfirmDeleteIdx(null)}
                  >
                    <div
                      className="bg-white p-8 rounded shadow-lg min-w-[320px] max-w-sm w-full flex flex-col items-center relative"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setConfirmDeleteIdx(null)}
                        aria-label="Close"
                        type="button"
                      >
                        <X size={22} />
                      </button>
                      <span className="mb-4 text-lg font-semibold text-gray-800">Delete this task?</span>
                      <div className="flex gap-4 mt-2">
                        <button
                          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-base"
                          onClick={() => handleDeleteTask(task)}
                        >
                          Yes, Delete
                        </button>
                        <button
                          className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 text-base"
                          onClick={() => setConfirmDeleteIdx(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TasksPage;