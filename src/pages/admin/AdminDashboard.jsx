import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Heart, Clock, Sparkles, User, RefreshCw, Send } from 'lucide-react';
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
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-semibold">Loading Admin Dashboard...</div>;
  }

  const userLogins = data?.userLogins || [];
  const responseMessages = data?.responseMessages || [];
  const totalVisits = data?.totalSessions || userLogins.length || 1;

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
            See who logged in and read the personal messages she wrote for you at the end of the website.
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
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Times She Logged In</div>
            <div className="font-display text-3xl font-extrabold text-[#ff2a75]">{userLogins.length}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">End Messages Left</div>
            <div className="font-display text-3xl font-extrabold text-[#80003c]">{responseMessages.length}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md">
            <Heart className="w-6 h-6 fill-white" />
          </div>
        </div>
      </div>

      {/* 1. HER END-OF-PAGE PERSONAL MESSAGES CARD */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <h2 className="font-display text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#ff2a75] fill-[#ff2a75]" />
          Messages Written By Her at the End of the Website 💌
        </h2>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {responseMessages.length > 0 ? (
            responseMessages.map((msg) => (
              <div key={msg._id} className="p-5 rounded-2xl bg-white border border-[#ffd0e0] shadow-md space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#ffe4ec] text-[#ff2a75] flex items-center justify-center text-xs font-bold">
                      💖
                    </span>
                    <span className="font-display font-bold text-slate-900 text-base">{msg.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-800 text-base font-medium leading-relaxed pt-1">
                  "{msg.message}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm font-semibold">
              No personal message left yet. When she fills out the form at the end of the site, her response will appear right here!
            </div>
          )}
        </div>
      </div>

      {/* 2. WHO LOGGED IN CARD */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <h2 className="font-display text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-[#ff2a75]" />
          Who Logged In (Visitor Name Log)
        </h2>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {userLogins.length > 0 ? (
            userLogins.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white/80 border border-[#ffd0e0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ffe4ec] text-[#ff2a75] flex items-center justify-center font-bold">
                    💖
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                    <div className="text-slate-500 text-[11px] font-mono">Logged into romantic experience</div>
                  </div>
                </div>
                <div className="text-slate-400 font-mono">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-sm font-semibold">
              No visitor logins recorded yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
