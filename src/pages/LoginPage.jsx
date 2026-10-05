import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      api.trackEvent('Login', { email, role: user.role });
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/chat');
      }
    } catch (err) {
      setError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#ffd0e0]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ffe4ec]/50 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/80 relative z-10 text-center">
        
        {/* Heart Icon Header */}
        <Link to="/" className="inline-flex w-16 h-16 rounded-full bg-gradient-to-tr from-[#ff2a75] to-[#e60067] text-white items-center justify-center shadow-lg border-4 border-white mb-6 hover:scale-105 transition-transform">
          <Heart className="w-8 h-8 fill-white" />
        </Link>

        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          Come Back Whenever You Want 💖
        </h1>

        <p className="text-sm text-slate-600 font-semibold mt-2">
          Enter your credentials to access our private chat & world.
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#80003c] mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="her@liliye.love or admin@liliye.love"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#ffd0e0] focus:outline-none focus:ring-2 focus:ring-[#ff2a75] text-sm text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#80003c] mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#ffd0e0] focus:outline-none focus:ring-2 focus:ring-[#ff2a75] text-sm text-slate-800 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ff2a75] to-[#e60067] text-white font-display font-extrabold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? 'Authenticating...' : 'Enter Experience'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#ffd0e0] text-xs text-slate-500 font-medium">
          <p>Her Login: <span className="font-mono font-bold text-[#ff2a75]">her@liliye.love / LiliyeLove2026!</span></p>
          <p className="mt-1">Admin Login: <span className="font-mono font-bold text-[#80003c]">admin@liliye.love / LiliyeAdmin2026!</span></p>
        </div>

      </div>
    </div>
  );
}
