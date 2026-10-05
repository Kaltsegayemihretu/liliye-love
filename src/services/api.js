const API_BASE = '/api';

export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return null;
    }

    return data;
  } catch (err) {
    console.warn(`API Request warning for ${endpoint}:`, err.message);
    return null;
  }
}

export const api = {
  // Simple Name Login
  nameLogin: async (name) => {
    const response = await fetch(`${API_BASE}/auth/name-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed.');
    return data;
  },

  // Admin Login
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed.');
    return data;
  },
  getMe: () => fetchApi('/auth/me'),
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),

  // End of page response message
  sendResponseMessage: async (name, message) => {
    const response = await fetch(`${API_BASE}/events/response-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to submit response.');
    return data;
  },

  // Content
  getContent: () => fetchApi('/content'),
  updateContent: (sectionKey, data) => fetchApi(`/content/${sectionKey}`, { method: 'PUT', body: JSON.stringify({ data }) }),

  // Media & Photos
  getPhotos: () => fetchApi('/photos'),
  addPhoto: (photo) => fetchApi('/photos', { method: 'POST', body: JSON.stringify(photo) }),
  deletePhoto: (id) => fetchApi(`/photos/${id}`, { method: 'DELETE' }),

  // Timeline
  getTimeline: () => fetchApi('/timeline'),
  addTimelineEvent: (event) => fetchApi('/timeline', { method: 'POST', body: JSON.stringify(event) }),
  deleteTimelineEvent: (id) => fetchApi(`/timeline/${id}`, { method: 'DELETE' }),

  // Locations
  getLocations: () => fetchApi('/locations'),
  updateLocations: (loc) => fetchApi('/locations', { method: 'PUT', body: JSON.stringify(loc) }),

  // Messages
  getMessages: () => fetchApi('/messages'),
  sendMessage: (content) => fetchApi('/messages', { method: 'POST', body: JSON.stringify({ content }) }),

  // Analytics & Dashboard
  registerSession: (sessionData) => fetchApi('/analytics/session', { method: 'POST', body: JSON.stringify(sessionData) }),
  trackEvent: (eventType, metadata = {}) => {
    const sessionId = localStorage.getItem('session_id') || 'sess_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('session_id', sessionId);
    return fetchApi('/analytics/event', { method: 'POST', body: JSON.stringify({ eventType, sessionId, metadata }) });
  },
  getDashboardAnalytics: () => fetchApi('/analytics/dashboard'),
  clearDashboardAnalytics: () => fetchApi('/analytics/clear', { method: 'DELETE' }),
  deleteAnalyticsEntry: (id) => fetchApi(`/analytics/entry/${id}`, { method: 'DELETE' }),
  getNotifications: () => fetchApi('/notifications'),
  markAllNotificationsRead: () => fetchApi('/notifications/read-all', { method: 'PUT' })
};
