import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, BookOpen, Clock, MapPin, Shield, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const herName = localStorage.getItem('her_name') || user?.name || '';

  const navLinks = [
    { label: 'Our Story', href: '#hero', icon: Heart },
    { label: 'Memories', href: '#memories', icon: BookOpen },
    { label: 'Letter', href: '#letter', icon: BookOpen },
    { label: 'Us', href: '#timeline', icon: Clock },
    { label: 'Distance', href: '#locations', icon: MapPin },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto glass-nav rounded-full px-5 py-2.5 flex items-center justify-between gap-6 max-w-3xl w-full shadow-lg transition-all duration-300">
        
        {/* Logo / Brand */}
        <a href="#hero" className="flex items-center gap-2 font-display text-lg font-bold text-[#e60067] hover:scale-105 transition-transform">
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff2a75] to-[#ffa8bc] flex items-center justify-center text-white shadow-md text-sm">
            💖
          </span>
          <span className="tracking-wide hidden sm:inline">TILL THE END OF TIME</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-[#ff2a75] hover:bg-white/60 transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-[#ff2a75]" />
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Her Name Status Badge */}
          {herName && !isAdmin && (
            <div className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#ffe4ec] text-[#ff2a75] border border-[#ffd0e0] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{herName}</span>
            </div>
          )}

          {/* Admin / Login link */}
          {user && isAdmin ? (
            <Link
              to="/admin"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#ff2a75] text-white shadow-md hover:bg-[#e60067] transition-all flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          ) : !herName && (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#ff2a75]/40 text-[#ff2a75] hover:bg-[#ff2a75] hover:text-white transition-all"
            >
              Enter Name
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-700 hover:bg-white/60 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-16 left-4 right-4 glass-card rounded-3xl p-5 shadow-2xl md:hidden border border-white/60 flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-2xl text-sm font-semibold text-slate-800 hover:bg-[#ffe4ec] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#ffe4ec] flex items-center justify-center text-[#ff2a75]">
                  <Icon className="w-4 h-4" />
                </div>
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
