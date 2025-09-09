'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Pencil, Trash } from 'lucide-react';

interface Appointment {
  _id: string;
  title: string;
  date: string;
  time: string;
}

const AppointmentPage: React.FC = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editData, setEditData] = useState<{ title: string; date: string; time: string; id: string }>({ title: '', date: '', time: '', id: '' });
  const [showForm, setShowForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addData, setAddData] = useState<{ title: string; date: string; time: string }>({ title: '', date: '', time: '' });

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/appoinments?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setAppointments(data.appointments || []));

  }, [user?.id,showForm]);

  const handleDelete = async (id: string) => {
    await fetch('/api/appoinments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setAppointments(prev => prev.filter(a => a._id !== id));
  };

  const handleEdit = (idx: number) => {
    setEditData({
      title: appointments[idx].title,
      date: appointments[idx].date,
      time: appointments[idx].time,
      id: appointments[idx]._id
    });
    setShowForm(true);
  };

  const handleEditSave = async () => {
    await fetch('/api/appoinments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editData.id, title: editData.title, date: editData.date, time: editData.time })
    });
    setShowForm(false);
    setEditData({ title: '', date: '', time: '', id: '' });
  };

  const handleAddSave = async () => {
    if (!user?.id || !addData.title || !addData.date || !addData.time) return;
    const res = await fetch('/api/appoinments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addData, userId: user.id })
    });
    const data = await res.json();
    setAppointments(prev => [...prev, data.appointment]);
    setShowAddForm(false);
    setAddData({ title: '', date: '', time: '' });
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setShowAddForm(true)}
        >
          + Add Appointment
        </button>
      </div>
      <ul className="space-y-3">
        {appointments.map((a, idx) => (
          <li key={a._id} className="bg-white rounded shadow flex items-center justify-between px-4 py-3 border">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-gray-400">{a.date} {a.time}</div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded hover:bg-gray-100" onClick={() => handleEdit(idx)}>
                <Pencil size={18} />
              </button>
              <button className="p-2 rounded hover:bg-gray-100" onClick={() => handleDelete(a._id)}>
                <Trash size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-lg shadow p-6 min-w-[300px] relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowForm(false)}>
              &times;
            </button>
            <h4 className="text-lg font-semibold mb-4">Edit Appointment</h4>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Title"
              value={editData.title}
              onChange={e => setEditData({ ...editData, title: e.target.value })}
            />
            <input
              type="date"
              className="border rounded px-2 py-1 w-full mb-2"
              value={editData.date}
              onChange={e => setEditData({ ...editData, date: e.target.value })}
            />
            <input
              type="time"
              className="border rounded px-2 py-1 w-full mb-4"
              value={editData.time}
              onChange={e => setEditData({ ...editData, time: e.target.value })}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              onClick={handleEditSave}
            >
              Save
            </button>
          </div>
        </div>
      )}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-lg shadow p-6 min-w-[300px] relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowAddForm(false)}>
              &times;
            </button>
            <h4 className="text-lg font-semibold mb-4">Add Appointment</h4>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Title"
              value={addData.title}
              onChange={e => setAddData({ ...addData, title: e.target.value })}
            />
            <input
              type="date"
              className="border rounded px-2 py-1 w-full mb-2"
              value={addData.date}
              onChange={e => setAddData({ ...addData, date: e.target.value })}
            />
            <input
              type="time"
              className="border rounded px-2 py-1 w-full mb-4"
              value={addData.time}
              onChange={e => setAddData({ ...addData, time: e.target.value })}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              onClick={handleAddSave}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;