import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, FileText, Image, Clock, MapPin, 
  Bell, LogOut, Heart, Shield 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center p-4">
        <div className="glass-card p-8 rounded-3xl text-center max-w-md space-y-4">
          <Shield className="w-12 h-12 text-[#ff2a75] mx-auto" />
          <h2 className="font-display text-2xl font-bold text-slate-900">Admin Access Required</h2>
          <p className="text-xs text-slate-600 font-medium">
            You must be logged in as an authorized admin to view this dashboard.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 rounded-full bg-[#ff2a75] text-white font-bold text-sm shadow-md"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: BarChart3 },
    { label: 'Site Content', path: '/admin/content', icon: FileText },
    { label: 'Photos', path: '/admin/media', icon: Image },
    { label: 'Timeline', path: '/admin/timeline', icon: Clock },
    { label: 'Locations', path: '/admin/locations', icon: MapPin },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 glass-card border-b md:border-b-0 md:border-r border-white/80 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-[#ff2a75] px-2">
            <span className="w-8 h-8 rounded-full bg-[#ff2a75] text-white flex items-center justify-center text-sm shadow-md">
              💖
            </span>
            <span>ADMIN CONTROL</span>
          </Link>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ff2a75] to-[#e60067] text-white shadow-md'
                      : 'text-slate-700 hover:bg-[#ffe4ec] hover:text-[#ff2a75]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#ffd0e0] space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-600 hover:text-[#ff2a75]"
          >
            <Heart className="w-4 h-4 text-[#ff2a75]" />
            View Live Website
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
