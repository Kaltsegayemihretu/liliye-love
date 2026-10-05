import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminContent from './pages/admin/AdminContent';
import AdminMedia from './pages/admin/AdminMedia';
import AdminTimeline from './pages/admin/AdminTimeline';
import AdminLocations from './pages/admin/AdminLocations';
import AdminNotifications from './pages/admin/AdminNotifications';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Interactive Romantic Experience */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="timeline" element={<AdminTimeline />} />
              <Route path="locations" element={<AdminLocations />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
