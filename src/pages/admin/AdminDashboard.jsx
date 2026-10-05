import React, { useState, useEffect } from 'react';
import { Users, Heart, Sparkles, User, RefreshCw, Clock } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 6000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-semibold">Loading Admin Dashboard...</div>;
  }

  const userLogins = data?.userLogins || [];
  const responseMessages = data?.responseMessages || [];
  const totalVisits = data?.totalSessions || userLogins.length || 1;

  const formatDate = (ts) => {
    if (!ts) return 'Just now';
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Overview Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Admin Overview</span>
            <Sparkles className="w-6 h-6 text-[#ff2a75]" />
          </h1>
          <p className="text-sm text-slate-600 font-semibold mt-1">
            Receiving Her Name Sign-Ins and End-of-Page Messages with exact Date & Time.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="p-2.5 rounded-full bg-white text-slate-600 hover:text-[#ff2a75] shadow-sm border border-[#ffd0e0]"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Total Site Visits</div>
            <div className="font-display text-3xl font-extrabold text-slate-900">{totalVisits}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff2a75] to-[#e60067] text-white flex items-center justify-center shadow-md">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Times She Signed In</div>
            <div className="font-display text-3xl font-extrabold text-[#ff2a75]">{userLogins.length}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Messages Received</div>
            <div className="font-display text-3xl font-extrabold text-[#80003c]">{responseMessages.length}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md">
            <Heart className="w-6 h-6 fill-white" />
          </div>
        </div>
      </div>

      {/* 1. HER MESSAGES RECEIVED (NAME, MESSAGE, DATE, TIME) */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <h2 className="font-display text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#ff2a75] fill-[#ff2a75]" />
          Messages Received From Her 💌
        </h2>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {responseMessages.length > 0 ? (
            responseMessages.map((msg, idx) => (
              <div key={msg._id || idx} className="p-5 rounded-2xl bg-white border border-[#ffd0e0] shadow-md space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#ffe4ec] text-[#ff2a75] flex items-center justify-center text-sm font-bold shadow-sm">
                      💖
                    </span>
                    <div>
                      <span className="font-display font-bold text-slate-900 text-base">{msg.name || 'Her'}</span>
                      <div className="text-[10px] text-slate-400 font-mono">Sent Message</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#80003c] font-mono">{formatDate(msg.timestamp || msg.createdAt)}</div>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-[#ff2a75]" />
                      {formatTime(msg.timestamp || msg.createdAt)}
                    </div>
                  </div>
                </div>

                <p className="text-slate-800 text-base font-semibold leading-relaxed pt-1">
                  "{msg.message}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm font-semibold space-y-2">
              <Heart className="w-8 h-8 text-[#ff2a75] mx-auto animate-pulse" />
              <p>No messages received yet.</p>
              <p className="text-xs font-normal">When she submits a message at the end of the site, her Name, Date, Time, and Message text will appear here!</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. WHO SIGNED IN (NAME, DATE, TIME) */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <h2 className="font-display text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-[#ff2a75]" />
          Who Signed In (Name, Date & Time Log)
        </h2>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {userLogins.length > 0 ? (
            userLogins.map((item, idx) => (
              <div key={item._id || idx} className="p-4 rounded-2xl bg-white/80 border border-[#ffd0e0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#ffe4ec] text-[#ff2a75] flex items-center justify-center font-bold text-sm shadow-sm">
                    💖
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                    <div className="text-slate-500 text-[11px] font-mono">Signed into website</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-800">{formatDate(item.timestamp || item.createdAt)}</div>
                  <div className="text-[11px] text-[#ff2a75] font-mono font-bold flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(item.timestamp || item.createdAt)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-sm font-semibold">
              No sign-ins recorded yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
