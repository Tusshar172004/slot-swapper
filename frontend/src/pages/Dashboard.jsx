import React, { useEffect, useState } from 'react';
import API from '../api/api.js';
import EventItem from '../components/EventItem.jsx';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', startTime: '', endTime: '' });

  const load = async () => {
    const res = await API.get('/events/me');
    setEvents(res.data);
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!form.title || !form.startTime || !form.endTime) {
      alert('Please fill all fields');
      return;
    }
    await API.post('/events', form);
    setForm({ title: '', startTime: '', endTime: '' });
    load();
  };

  const toggle = async (id, status) => {
    await API.patch(`/events/${id}`, { status });
    load();
  };

  const del = async (id) => {
    if (!confirm('Delete this event?')) return;
    await API.delete(`/events/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-10">
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        
        {/* Left section */}
        <div className="space-y-6">
          {/* Create Event Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Event</h3>
            <form onSubmit={create} className="space-y-3">
              <input
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={e => setForm({ ...form, startTime: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={e => setForm({ ...form, endTime: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />
              <button
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Create Event
              </button>
            </form>
          </div>

          {/* Event List */}
          <div className="space-y-4">
            {events.length > 0 ? (
              events.map(evt => (
                <EventItem key={evt._id} event={evt} onToggle={toggle} onDelete={del} />
              ))
            ) : (
              <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500 border border-gray-100">
                No events created yet.
              </div>
            )}
          </div>
        </div>

        {/* Right section - Tips */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Tip</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            Mark an event as <span className="font-semibold text-indigo-600">SWAPPABLE</span> to list it in the marketplace.  
            Other users can request to swap their available slots with yours.  
            Once a swap is accepted, both calendars automatically update.  
          </p>
        </div>
      </div>
    </div>
  );
}
