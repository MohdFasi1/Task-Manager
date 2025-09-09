'use client'
import React, { useState } from 'react'
import Day from '@/components/calendar/Day';
import { useUser } from '@clerk/nextjs';

interface Appointment {
  date: string;
  title: string;
  time: string;
}
interface Deadline {
  deadline: string;
  title: string;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const CalendarPage = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const { user } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  React.useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/calendar?userId=${user.id}&year=${currentYear}&month=${currentMonth}`)
      .then(res => res.json())
      .then(data => {
        setAppointments(data.appointments || []);
        setDeadlines(data.deadlines || []);
      });
      
  }, [currentYear, currentMonth]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const weeks: number[][] = [];
  let week: number[] = [];
  let dayCounter = 1;

  // Fill first week
  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push(0);
  }
  for (let i = firstDayOfWeek; i < 7; i++) {
    week.push(dayCounter++);
  }
  weeks.push(week);

  // Fill remaining weeks
  while (dayCounter <= daysInMonth) {
    week = [];
    for (let i = 0; i < 7; i++) {
      if (dayCounter <= daysInMonth) {
        week.push(dayCounter++);
      } else {
        week.push(0);
      }
    }
    weeks.push(week);
  }

  return (
    <div className="h-full w-full flex flex-row items-center justify-center overflow-hidden">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            className="px-3 py-1 rounded hover:bg-gray-200"
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            aria-label="Previous Month"
          >
            &lt;
          </button>
          <h2 className="text-2xl font-bold text-center">
            {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            className="px-3 py-1 rounded hover:bg-gray-200"
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            aria-label="Next Month"
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2 text-center font-semibold text-gray-600">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 overflow-y-auto max-h-[420px]">
          {weeks.flat().map((day, idx) => {
            const cellDate = day !== 0 ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const isToday = cellDate === todayStr;
            const isSelected: boolean = day === selectedDay;
            const dayAppointments = appointments.filter(a => a.date === cellDate);
            const dayDeadlines = deadlines.filter(d => d.deadline === cellDate);
            // Check if cellDate is before today
            const isPast = cellDate && cellDate < todayStr;
            // Check if cellDate is overdue (has a deadline and is before today)
            const isOverdue = isPast && dayDeadlines.length > 0;
            const isDisabled = isPast && !isOverdue;
            return (
              <div
                key={idx}
                className={`h-20 flex flex-col items-center justify-start rounded cursor-pointer transition-all
                  ${isToday ? "bg-blue-500 text-white font-bold" : isSelected ? "bg-blue-100 text-blue-900 font-bold" : isOverdue ? "bg-red-100 text-red-700 font-bold" : isDisabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-blue-100"}
                  ${day === 0 ? "opacity-0 cursor-default" : ""}`}
                onClick={() => !isDisabled && day !== 0 && setSelectedDay(day)}
                style={isDisabled ? { pointerEvents: 'none' } : {}}
              >
                <div>{day !== 0 ? day : ''}</div>
                <div className="flex gap-1 mt-1">
                  {dayAppointments.length > 0 && (
                    <span className="bg-blue-200 text-blue-800 rounded-full px-2 text-xs font-semibold">{dayAppointments.length}A</span>
                  )}
                  {dayDeadlines.length > 0 && (
                    <span className="bg-red-200 text-red-800 rounded-full px-2 text-xs font-semibold">{dayDeadlines.length}D</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-80 h-full ml-6 bg-white rounded">
        <Day
          selectedDay={selectedDay}
          currentMonth={currentMonth}
          currentYear={currentYear}
          appointments={appointments}
          deadlines={deadlines}
          userId={user?.id || ''}
          setAppointments={setAppointments}
        />
      </div>
    </div>
  );
};

export default CalendarPage;