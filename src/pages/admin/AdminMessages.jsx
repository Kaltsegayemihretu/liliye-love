import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Shield, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  const loadMessages = async () => {
    try {
      const data = await api.getMessages();
      setMessages(data);
    } catch (err) {
      console.warn('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#ff2a75]" />
            Private Chat with Her
          </h1>
          <p className="text-sm text-slate-600 font-semibold mt-1">
            Send messages directly to Her. Email notifications are dispatched automatically.
          </p>
        </div>
        <button
          onClick={loadMessages}
          className="p-2.5 rounded-full bg-white text-slate-600 hover:text-[#ff2a75] shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-card rounded-[2.5rem] p-6 shadow-xl border border-white/80 h-[500px] flex flex-col justify-between">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm font-semibold">Loading conversation...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-semibold">No messages exchanged yet. Send a message to start!</div>
          ) : (
            messages.map((msg) => {
              const isAdminMsg = msg.senderRole === 'admin';
              return (
                <div key={msg._id} className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs font-semibold ${
                    isAdminMsg 
                      ? 'bg-gradient-to-r from-[#ff2a75] to-[#e60067] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-[#ffd0e0] rounded-bl-none shadow-sm'
                  }`}>
                    <div>{msg.content}</div>
                    <div className="mt-1 text-[9px] opacity-80 text-right font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            className="px-6 py-3.5 rounded-full bg-[#ff2a75] text-white font-bold text-xs shadow-md hover:bg-[#e60067] flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>

      </div>
    </div>
  );
}
