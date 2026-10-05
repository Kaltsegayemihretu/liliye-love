import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Lock, Mail, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your name.');
    setError('');
    setLoading(true);

    try {
      const res = await api.nameLogin(name.trim());
      localStorage.setItem('her_name', name.trim());
      localStorage.setItem('token', res.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Subtle Background Blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#ffd0e0]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ffe4ec]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/80 relative z-10 text-center">
        
        {/* Heart Icon Header */}
        <Link to="/" className="inline-flex w-16 h-16 rounded-full bg-gradient-to-tr from-[#ff2a75] to-[#e60067] text-white items-center justify-center shadow-lg border-4 border-white mb-6 hover:scale-105 transition-transform">
          <Heart className="w-8 h-8 fill-white animate-bounce" />
        </Link>

        {!isAdminMode ? (
          /* HER SIMPLE NAME LOGIN */
          <>
            <h1 className="font-display text-3xl font-extrabold text-slate-900">
              Welcome, My Love 💖
            </h1>

            <p className="text-sm text-slate-600 font-semibold mt-2">
              Please enter your name to open our world.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleNameSubmit} className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#80003c] mb-1.5 ml-1">
                  Your Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-[#ffd0e0] focus:outline-none focus:ring-2 focus:ring-[#ff2a75] text-sm text-slate-800 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#ff2a75] to-[#e60067] text-white font-display font-extrabold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {loading ? 'Opening...' : 'Enter Our Experience'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#ffd0e0]">
              <button
                onClick={() => setIsAdminMode(true)}
                className="text-xs font-semibold text-slate-500 hover:text-[#ff2a75] transition-colors flex items-center gap-1.5 mx-auto"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Secret Login
              </button>
            </div>
          </>
        ) : (
          /* ADMIN LOGIN FORM */
          <>
            <h1 className="font-display text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-[#ff2a75]" />
              Admin Portal
            </h1>

            {error && (
              <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#80003c] mb-1 ml-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@liliye.love"
                  className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#80003c] mb-1 ml-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-xs font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#ff2a75] text-white font-bold text-xs shadow-md"
              >
                {loading ? 'Logging in...' : 'Enter Admin Dashboard'}
              </button>
            </form>

            <div className="mt-6">
              <button
                onClick={() => setIsAdminMode(false)}
                className="text-xs text-slate-500 hover:underline"
              >
                ← Back to Name Login
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
