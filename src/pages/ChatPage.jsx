import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Send, Heart, Shield, ArrowLeft, Check, CheckCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ChatPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const loadMessages = async () => {
    try {
      const data = await api.getMessages();
      setMessages(data);
    } catch (err) {
      console.warn('Failed to load chat:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadMessages();
    api.trackEvent('Chat opened');

    // Poll messages every 5 seconds for live feel
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const content = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const newMsg = await api.sendMessage(content);
      setMessages(prev => [...prev, newMsg]);
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fff0f5] flex flex-col justify-between p-4 max-w-4xl mx-auto">
      
      {/* Header */}
      <header className="glass-card rounded-3xl p-4 flex items-center justify-between shadow-lg border border-white/80 mb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-full bg-white text-slate-700 hover:text-[#ff2a75] hover:bg-[#ffe4ec] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff2a75] to-[#e60067] text-white flex items-center justify-center font-bold text-lg shadow-md">
            💖
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-slate-900 flex items-center gap-1.5">
              <span>{isAdmin ? 'Private Chat with Her' : 'Private Conversation'}</span>
              {isAdmin && <Shield className="w-4 h-4 text-[#ff2a75]" />}
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Logged in as: <span className="text-[#ff2a75] font-bold">{user.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={loadMessages}
          title="Refresh Messages"
          className="p-2 rounded-full bg-white/80 text-slate-600 hover:text-[#ff2a75] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 glass-card rounded-[2rem] p-6 shadow-xl border border-white/80 overflow-y-auto mb-4 min-h-[450px] max-h-[65vh] space-y-4 custom-scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400 font-semibold text-sm">
            Loading private messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-500">
            <Heart className="w-12 h-12 text-[#ff2a75] animate-pulse" />
            <p className="font-display font-bold text-lg text-slate-800">No messages yet.</p>
            <p className="text-xs max-w-xs font-medium">
              Start our private conversation below. Notifications will be sent automatically.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === user.role;

            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-gradient-to-r from-[#ff2a75] to-[#e60067] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-[#ffd0e0] rounded-bl-none'
                  }`}
                >
                  <div className="font-semibold">{msg.content}</div>

                  <div className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] font-mono ${isMe ? 'text-white/80' : 'text-slate-400'}`}>
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && (
                      msg.read ? <CheckCheck className="w-3 h-3 text-emerald-200" /> : <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Bar */}
      <form onSubmit={handleSend} className="glass-card rounded-full p-2 pl-5 flex items-center gap-2 shadow-lg border border-white">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your personal message..."
          className="flex-1 bg-transparent focus:outline-none text-sm font-medium text-slate-800 placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff2a75] to-[#e60067] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>

    </div>
  );
}
