import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Shield, RefreshCw, Heart, User } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [responseMessages, setResponseMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  const loadAllMessages = async () => {
    try {
      const [msgData, dashData] = await Promise.all([
        api.getMessages(),
        api.getDashboardAnalytics()
      ]);

      if (Array.isArray(msgData)) {
        setMessages(msgData);
      } else {
        setMessages([]);
      }

      if (dashData && Array.isArray(dashData.responseMessages)) {
        setResponseMessages(dashData.responseMessages);
      } else {
        setResponseMessages([]);
      }
    } catch (err) {
      console.warn('Failed to load messages:', err);
      setMessages([]);
      setResponseMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllMessages();
    const interval = setInterval(loadAllMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, responseMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const content = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const newMsg = await api.sendMessage(content);
      if (newMsg) {
        setMessages(prev => Array.isArray(prev) ? [...prev, newMsg] : [newMsg]);
      }
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const safeChatMessages = Array.isArray(messages) ? messages : [];
  const safeEndMessages = Array.isArray(responseMessages) ? responseMessages : [];

  return (
    <div className="space-[#fff0f5] space-y-6 max-w-4xl">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#ff2a75]" />
            Messages & Her Responses
          </h1>
          <p className="text-sm text-slate-600 font-semibold mt-1">
            Read messages written by Her at the end of the website and chat in real-time.
          </p>
        </div>
        <button
          onClick={loadAllMessages}
          className="p-2.5 rounded-full bg-white text-slate-600 hover:text-[#ff2a75] shadow-sm border border-[#ffd0e0]"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 1. HER END-OF-PAGE MESSAGES SECTION */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#ff2a75] fill-[#ff2a75]" />
          Messages Left at the End of the Website ({safeEndMessages.length})
        </h2>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {safeEndMessages.length > 0 ? (
            safeEndMessages.map((msg, idx) => (
              <div key={msg._id || idx} className="p-4 rounded-2xl bg-white border border-[#ffd0e0] shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-display font-extrabold text-[#80003c] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#ff2a75]" />
                    From: {msg.name || 'Her'}
                  </span>
                  <span className="font-mono text-slate-400">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Just now'}
                  </span>
                </div>
                <p className="text-slate-800 text-sm font-semibold leading-relaxed">
                  "{msg.message}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs font-semibold">
              No end-of-page responses submitted yet. When she writes a message at the bottom of the site, it will show here!
            </div>
          )}
        </div>
      </div>

      {/* 2. REAL-TIME CHAT PANEL */}
      <div className="glass-card rounded-[2.5rem] p-6 shadow-xl border border-white/80 h-[450px] flex flex-col justify-between">
        <div className="border-b border-[#ffd0e0] pb-3 mb-3 flex items-center justify-between">
          <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#ff2a75]" />
            Live Private Chat
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            {safeChatMessages.length} Messages
          </span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading conversation...</div>
          ) : safeChatMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-semibold">No live chat messages yet. Send a message below!</div>
          ) : (
            safeChatMessages.map((msg, idx) => {
              const isAdminMsg = msg.senderRole === 'admin';
              return (
                <div key={msg._id || idx} className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs font-semibold ${
                    isAdminMsg 
                      ? 'bg-gradient-to-r from-[#ff2a75] to-[#e60067] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-[#ffd0e0] rounded-bl-none shadow-sm'
                  }`}>
                    <div>{msg.content}</div>
                    <div className="mt-1 text-[9px] opacity-80 text-right font-mono">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Write a message to Her..."
            className="flex-1 p-3.5 rounded-full bg-white border border-[#ffd0e0] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff2a75]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="px-6 py-3.5 rounded-full bg-[#ff2a75] text-white font-bold text-xs shadow-md hover:bg-[#e60067] flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>

      </div>
    </div>
  );
}
