'use client'
import React, { useState } from 'react'

interface DayProps {
  selectedDay: number | null;
  currentMonth: number;
  currentYear: number;
  appointments: { date: string; title: string; time: string }[];
  deadlines: { deadline: string; title: string }[];
  userId: string;
  setAppointments: React.Dispatch<React.SetStateAction<{ date: string; title: string; time: string }[]>>;
  onAppointmentAdded?: () => void;
}

const Day: React.FC<DayProps> = ({ selectedDay, currentMonth, currentYear, appointments, deadlines, userId, setAppointments, onAppointmentAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const cellDate = selectedDay !== null ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : null;

  const handleAddAppointment = async () => {
    if (!newTitle || !newTime || !cellDate) return;
    const res = await fetch('/api/appoinments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: cellDate, time: newTime, title: newTitle, userId })
    });
    const data = await res.json();
    // Update local state to reflect new appointment
    setAppointments(prev => [...prev, data.appointment]);
    setShowModal(false);
    setNewTitle('');
    setNewTime('');
    if (onAppointmentAdded) onAppointmentAdded();
  };

  // Calculate if selected date is before today
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isPast = cellDate && cellDate < todayStr;

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow p-4 flex flex-col overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Events for {cellDate || '-'}</h3>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-bold">Appointments:</span>
        {!isPast && (
          <button
            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            onClick={() => setShowModal(true)}
          >
            + Add
          </button>
        )}
      </div>
      <ul className="list-disc ml-6 mb-2">
        {appointments.filter(a => a.date === cellDate).length > 0 ? (
          appointments.filter(a => a.date === cellDate).map((a, i) => (
            <li key={i}>{a.title} ({a.time})</li>
          ))
        ) : (
          <li className="text-gray-400">No appointments</li>
        )}
      </ul>
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-lg shadow p-6 min-w-[300px] relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h4 className="text-lg font-semibold mb-4">Add Appointment</h4>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <input
              type="time"
              className="border rounded px-2 py-1 w-full mb-4"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              onClick={handleAddAppointment}
            >
              Add
            </button>
          </div>
        </div>
      )}
      <div>
        <span className="font-bold">Deadlines:</span>
        <ul className="list-disc ml-6">
          {deadlines.filter(d => d.deadline === cellDate).length > 0 ? (
            deadlines.filter(d => d.deadline === cellDate).map((d, i) => (
              <li key={i}>{d.title}</li>
            ))
          ) : (
            <li className="text-gray-400">No deadlines</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Day;