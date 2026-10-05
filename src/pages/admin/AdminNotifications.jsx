import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Heart } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    loadNotifications();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#ff2a75]" />
            Admin Notifications Center
          </h1>
          <p className="text-sm text-slate-600 font-semibold mt-1">
            Real-time alerts for messages, logins, and final button clicks.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-full bg-white text-[#ff2a75] font-bold text-xs shadow-sm border border-[#ffd0e0] flex items-center gap-1.5 hover:bg-[#ffe4ec]"
        >
          <CheckCheck className="w-4 h-4" />
          Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-semibold">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-semibold">No notifications yet.</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                notif.read 
                  ? 'bg-white/60 border-slate-200 text-slate-600' 
                  : 'bg-white border-[#ff2a75]/40 shadow-md text-slate-900 font-bold'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#ffe4ec] text-[#ff2a75] flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-[#ff2a75]" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-display font-extrabold text-slate-900">{notif.title}</div>
                <div className="text-xs text-slate-600 font-medium mt-0.5">{notif.message}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-2">
                  {new Date(notif.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
