// components/Sidebar.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Home, ListTodo, Settings, Menu, Calendar, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Tasks", href: "/tasks", icon: ListTodo },
    { name: "Appointments", href: "/appointments", icon: CalendarDays },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-gray-900 text-white flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header / Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <span className="font-bold text-lg">My App</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-800"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition-colors",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
