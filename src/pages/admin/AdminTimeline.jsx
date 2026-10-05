import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminTimeline() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    subtitle: '',
    date: '',
    description: '',
    imageUrl: ''
  });

  const loadTimeline = async () => {
    const data = await api.getTimeline();
    setEvents(data);
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return alert('Title and Date are required.');

    try {
      await api.addTimelineEvent(newEvent);
      setNewEvent({ title: '', subtitle: '', date: '', description: '', imageUrl: '' });
      loadTimeline();
    } catch (err) {
      alert('Failed to add event: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete timeline event?')) return;
    await api.deleteTimelineEvent(id);
    loadTimeline();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#ff2a75]" />
          Relationship Timeline Management
        </h1>
        <p className="text-sm text-slate-600 font-semibold mt-1">
          Manage story milestones, dates, and memories.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#ff2a75]" />
          Add Milestone Event
        </h2>

        <form onSubmit={handleAddEvent} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Milestone Title (e.g. The Spark)"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-semibold"
            />
            <input
              type="text"
              placeholder="Date (e.g. October 14, 2022)"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-semibold"
            />
          </div>
          <input
            type="text"
            placeholder="Subtitle (e.g. Where it all began)"
            value={newEvent.subtitle}
            onChange={(e) => setNewEvent({ ...newEvent, subtitle: e.target.value })}
            className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm"
          />
          <textarea
            placeholder="Description of the memory"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            rows={3}
            className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-medium"
          />
          <input
            type="text"
            placeholder="Optional Image URL"
            value={newEvent.imageUrl}
            onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
            className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-mono"
          />
          <button type="submit" className="px-6 py-2.5 rounded-full bg-[#ff2a75] text-white font-bold text-xs shadow-md">
            Add Timeline Event
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {events.map((evt) => (
          <div key={evt._id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-md flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-[#ff2a75]">{evt.date}</div>
              <div className="font-display font-bold text-base text-slate-900">{evt.title}</div>
              <div className="text-xs text-slate-600 font-medium">{evt.description}</div>
            </div>
            <button onClick={() => handleDelete(evt._id)} className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
