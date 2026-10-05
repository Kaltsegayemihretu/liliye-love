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

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `API Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => fetchApi('/auth/me'),
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),

  // Content
  getContent: () => fetchApi('/content'),
  updateContent: (sectionKey, data) => fetchApi(`/content/${sectionKey}`, { method: 'PUT', body: JSON.stringify({ data }) }),

  // Media & Photos
  getPhotos: () => fetchApi('/photos'),
  addPhoto: (photo) => fetchApi('/photos', { method: 'POST', body: JSON.stringify(photo) }),
  updatePhoto: (id, photo) => fetchApi(`/photos/${id}`, { method: 'PUT', body: JSON.stringify(photo) }),
  deletePhoto: (id) => fetchApi(`/photos/${id}`, { method: 'DELETE' }),

  // Videos
  getVideos: () => fetchApi('/videos'),
  addVideo: (video) => fetchApi('/videos', { method: 'POST', body: JSON.stringify(video) }),
  updateVideo: (id, video) => fetchApi(`/videos/${id}`, { method: 'PUT', body: JSON.stringify(video) }),
  deleteVideo: (id) => fetchApi(`/videos/${id}`, { method: 'DELETE' }),

  // Timeline
  getTimeline: () => fetchApi('/timeline'),
  addTimelineEvent: (event) => fetchApi('/timeline', { method: 'POST', body: JSON.stringify(event) }),
  updateTimelineEvent: (id, event) => fetchApi(`/timeline/${id}`, { method: 'PUT', body: JSON.stringify(event) }),
  deleteTimelineEvent: (id) => fetchApi(`/timeline/${id}`, { method: 'DELETE' }),

  // Music
  getMusic: () => fetchApi('/music'),
  addSong: (song) => fetchApi('/music', { method: 'POST', body: JSON.stringify(song) }),
  updateSong: (id, song) => fetchApi(`/music/${id}`, { method: 'PUT', body: JSON.stringify(song) }),
  deleteSong: (id) => fetchApi(`/music/${id}`, { method: 'DELETE' }),

  // Locations
  getLocations: () => fetchApi('/locations'),
  updateLocations: (loc) => fetchApi('/locations', { method: 'PUT', body: JSON.stringify(loc) }),

  // Messages
  getMessages: () => fetchApi('/messages'),
  sendMessage: (content) => fetchApi('/messages', { method: 'POST', body: JSON.stringify({ content }) }),

  // Analytics & Events
  registerSession: (sessionData) => fetchApi('/analytics/session', { method: 'POST', body: JSON.stringify(sessionData) }),
  trackEvent: (eventType, metadata = {}) => {
    const sessionId = localStorage.getItem('session_id') || 'sess_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('session_id', sessionId);
    return fetchApi('/analytics/event', { method: 'POST', body: JSON.stringify({ eventType, sessionId, metadata }) }).catch(() => {});
  },
  getDashboardAnalytics: () => fetchApi('/analytics/dashboard'),

  // Notifications
  getNotifications: () => fetchApi('/notifications'),
  markNotificationRead: (id) => fetchApi(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => fetchApi('/notifications/read-all', { method: 'PUT' }),

  // Final Red Button
  clickFinalButton: () => {
    const sessionId = localStorage.getItem('session_id');
    return fetchApi('/events/final-button', { method: 'POST', body: JSON.stringify({ sessionId }) });
  }
};
