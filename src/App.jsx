import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminContent from './pages/admin/AdminContent';
import AdminMedia from './pages/admin/AdminMedia';
import AdminTimeline from './pages/admin/AdminTimeline';
import AdminMusic from './pages/admin/AdminMusic';
import AdminLocations from './pages/admin/AdminLocations';
import AdminMessages from './pages/admin/AdminMessages';
import AdminNotifications from './pages/admin/AdminNotifications';

export default function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <Router>
          <Routes>
            {/* Public Interactive Love Experience */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/chat" element={<ChatPage />} />

            {/* Separate Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="timeline" element={<AdminTimeline />} />
              <Route path="music" element={<AdminMusic />} />
              <Route path="locations" element={<AdminLocations />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AudioProvider>
    </AuthProvider>
  );
}
