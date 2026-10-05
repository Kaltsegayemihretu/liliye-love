import React, { useState, useEffect } from 'react';
import { 
  Users, MessageCircle, MailOpen, Music, HeartHandshake, 
  Activity, Eye, Clock, Laptop, Smartphone, Sparkles 
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await api.getDashboardAnalytics();
        setData(res);
      } catch (err) {
        console.warn('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-semibold">Loading Admin Overview...</div>;
  }

  const stats = [
    { title: 'Total Visits', value: data?.totalSessions || 1, icon: Users, color: 'from-[#ff2a75] to-[#e60067]' },
    { title: 'Unread Messages', value: data?.unreadMessagesCount || 0, icon: MessageCircle, color: 'from-purple-500 to-indigo-600' },
    { title: 'Envelope Opens', value: data?.envelopeOpens || 0, icon: MailOpen, color: 'from-amber-500 to-orange-600' },
    { title: 'Boombox Plays', value: data?.boomboxOpens || 0, icon: Music, color: 'from-pink-500 to-rose-600' },
    { title: 'Final Red Button Clicks', value: data?.finalClicks || 0, icon: HeartHandshake, color: 'from-red-600 to-rose-700' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      
      {/* Overview Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <span>Overview Dashboard</span>
          <Sparkles className="w-6 h-6 text-[#ff2a75]" />
        </h1>
        <p className="text-sm text-slate-600 font-semibold mt-1">
          Monitor Her visits, envelope interactions, music plays, and private messages.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  {stat.title}
                </div>
                <div className="font-display text-3xl font-extrabold text-slate-900">
                  {stat.value}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center shadow-md`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Log */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#ff2a75]" />
          Recent Website Event Log
        </h2>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {data?.recentEvents && data.recentEvents.length > 0 ? (
            data.recentEvents.map((evt) => (
              <div key={evt._id} className="p-3.5 rounded-2xl bg-white/80 border border-[#ffd0e0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ffe4ec] text-[#ff2a75] flex items-center justify-center font-bold">
                    💖
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{evt.eventType}</div>
                    <div className="text-slate-500 text-[11px] font-mono">
                      Session: {evt.sessionId || 'Anonymous'}
                    </div>
                  </div>
                </div>
                <div className="text-slate-400 font-mono">
                  {new Date(evt.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-sm">No recorded interaction events yet.</div>
          )}
        </div>
      </div>

      {/* Recent Visitor Sessions */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#ff2a75]" />
          Recent Visitor Sessions
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#ffe4ec] text-[#80003c] font-bold uppercase text-[10px] tracking-wider rounded-xl">
              <tr>
                <th className="p-3 rounded-l-xl">Device</th>
                <th className="p-3">Browser</th>
                <th className="p-3">Region</th>
                <th className="p-3">Started At</th>
                <th className="p-3 rounded-r-xl">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.recentSessions && data.recentSessions.length > 0 ? (
                data.recentSessions.map((sess) => (
                  <tr key={sess._id} className="hover:bg-white/60">
                    <td className="p-3 font-semibold flex items-center gap-2">
                      {sess.deviceType === 'Mobile' ? <Smartphone className="w-4 h-4 text-[#ff2a75]" /> : <Laptop className="w-4 h-4 text-slate-600" />}
                      {sess.deviceType}
                    </td>
                    <td className="p-3">{sess.browser}</td>
                    <td className="p-3 font-mono">{sess.region}</td>
                    <td className="p-3 text-slate-400">{new Date(sess.startedAt).toLocaleString()}</td>
                    <td className="p-3 text-slate-400">{new Date(sess.lastActive).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-slate-400">No session logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
