import fs from 'fs';
import path from 'path';
import os from 'os';
import mongoose from 'mongoose';

import AnalyticsEvent from '../models/AnalyticsEvent.js';
import Notification from '../models/Notification.js';
import VisitorSession from '../models/VisitorSession.js';

// Determine persistent data file paths (both in project data dir and system temp dir for Vercel/serverless environments)
const DATA_DIR = path.join(process.cwd(), 'api', 'data');
const LOCAL_FILE = path.join(DATA_DIR, 'persistent_data.json');
const TMP_FILE = path.join(os.tmpdir(), 'liliye_persistent_data.json');

function getFilePath() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return LOCAL_FILE;
  } catch (e) {
    return TMP_FILE;
  }
}

// In-memory data store cache
let store = {
  userLogins: [],
  responseMessages: [],
  visitorSessions: [],
  notifications: [
    {
      _id: 'notif_init',
      title: 'Romantic Experience Ready 💖',
      message: 'Website is listening for Her name sign-in and messages.',
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    }
  ]
};

// Load data from disk on initial import
function loadFromDisk() {
  const filePath = getFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        store = {
          userLogins: Array.isArray(parsed.userLogins) ? parsed.userLogins : [],
          responseMessages: Array.isArray(parsed.responseMessages) ? parsed.responseMessages : [],
          visitorSessions: Array.isArray(parsed.visitorSessions) ? parsed.visitorSessions : [],
          notifications: Array.isArray(parsed.notifications) ? parsed.notifications : []
        };
      }
    }
  } catch (err) {
    console.warn('Could not read persistent file store from disk:', err.message);
  }
}

function saveToDisk() {
  const filePath = getFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    // Try temp file fallback if primary location fails
    try {
      fs.writeFileSync(TMP_FILE, JSON.stringify(store, null, 2), 'utf8');
    } catch (e) {}
  }
}

// Initialize on module load
loadFromDisk();

export const persistentStore = {
  getStore: () => store,

  // Add Sign-In Entry
  addLogin: async (name) => {
    const cleanName = name.trim();
    const customId = 'login_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const now = new Date();

    let mongoId = customId;

    // Ensure database connection and save to MongoDB Atlas
    try {
      await connectToDatabase();
      const event = await AnalyticsEvent.create({
        eventType: 'Login',
        metadata: { visitorName: cleanName, name: cleanName, customId },
        timestamp: now
      });
      if (event && event._id) {
        mongoId = event._id.toString();
      }

      await Notification.create({
        title: `Her Signed In: ${cleanName} 💖`,
        message: `${cleanName} signed in on ${now.toLocaleString()}`,
        type: 'login',
        link: '/admin'
      }).catch(() => {});
    } catch (e) {
      console.warn('MongoDB save warning in addLogin:', e.message);
    }

    const entry = {
      _id: mongoId,
      customId,
      name: cleanName,
      timestamp: now.toISOString()
    };

    store.userLogins.unshift(entry);
    store.notifications.unshift({
      _id: 'notif_' + Date.now(),
      title: `Her Signed In: ${cleanName} 💖`,
      message: `${cleanName} signed into website at ${now.toLocaleTimeString()}`,
      type: 'login',
      read: false,
      createdAt: now.toISOString()
    });

    saveToDisk();
    return entry;
  },

  // Add Response Message Entry
  addResponseMessage: async (name, message) => {
    const senderName = name && name.trim() ? name.trim() : 'Her';
    const cleanMsg = message.trim();
    const customId = 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const now = new Date();

    let mongoId = customId;

    // Ensure database connection and save to MongoDB Atlas
    try {
      await connectToDatabase();
      const event = await AnalyticsEvent.create({
        eventType: 'Final button clicked',
        metadata: { name: senderName, visitorName: senderName, responseText: cleanMsg, message: cleanMsg, customId },
        timestamp: now
      });
      if (event && event._id) {
        mongoId = event._id.toString();
      }

      await Notification.create({
        title: `💌 ${senderName} Sent You A Message!`,
        message: `"${cleanMsg}"`,
        type: 'final_button',
        link: '/admin'
      }).catch(() => {});
    } catch (e) {
      console.warn('MongoDB save warning in addResponseMessage:', e.message);
    }

    const entry = {
      _id: mongoId,
      customId,
      name: senderName,
      message: cleanMsg,
      timestamp: now.toISOString()
    };

    store.responseMessages.unshift(entry);
    store.notifications.unshift({
      _id: 'notif_' + Date.now(),
      title: `💌 ${senderName} Sent You A Message!`,
      message: `"${cleanMsg}"`,
      type: 'final_button',
      read: false,
      createdAt: now.toISOString()
    });

    saveToDisk();
    return entry;
  },

  // Record Visitor Session
  addSession: async (sessionData) => {
    const { sessionId, deviceType, browser, region } = sessionData || {};
    if (!sessionId) return;
    const now = new Date();

    const existingIdx = store.visitorSessions.findIndex(s => s.sessionId === sessionId);
    const sessObj = {
      sessionId,
      deviceType: deviceType || 'Desktop',
      browser: browser || 'Browser',
      region: region || 'Unknown',
      lastActive: now.toISOString()
    };

    if (existingIdx >= 0) {
      store.visitorSessions[existingIdx] = sessObj;
    } else {
      store.visitorSessions.push(sessObj);
    }

    try {
      await connectToDatabase();
      await VisitorSession.findOneAndUpdate(
        { sessionId },
        { sessionId, deviceType: deviceType || 'Desktop', browser: browser || 'Browser', region: region || 'Unknown', lastActive: now },
        { upsert: true, new: true }
      ).catch(() => {});

      await AnalyticsEvent.create({
        eventType: 'Website opened',
        sessionId,
        timestamp: now
      }).catch(() => {});
    } catch (e) {}

    saveToDisk();
  },

  // Fetch Dashboard Overview (Combines MongoDB & File/Memory Store safely without duplicates)
  getDashboardAnalytics: async () => {
    loadFromDisk();
    await connectToDatabase().catch(() => {});

    let mongoLogins = [];
    let mongoResponses = [];
    let mongoSessionsCount = 0;

    try {
      // 1. Logins from AnalyticsEvent & Notification
      const loginEvents = await AnalyticsEvent.find({
        $or: [
          { eventType: 'Login' },
          { 'metadata.visitorName': { $exists: true } }
        ]
      }).sort({ timestamp: -1 });

      mongoLogins = loginEvents.map(e => ({
        _id: e._id.toString(),
        customId: e.metadata?.customId || '',
        name: e.metadata?.visitorName || e.metadata?.name || 'Her',
        timestamp: (e.timestamp || e.createdAt || new Date()).toISOString()
      }));

      const loginNotifs = await Notification.find({ type: 'login' }).sort({ createdAt: -1 });
      loginNotifs.forEach(n => {
        let name = 'Her';
        if (n.title && n.title.includes('Her Signed In:')) {
          name = n.title.replace('Her Signed In:', '').replace('💖', '').trim() || 'Her';
        }
        mongoLogins.push({
          _id: n._id.toString(),
          customId: 'notif_log_' + n._id.toString(),
          name,
          timestamp: (n.createdAt || new Date()).toISOString()
        });
      });

      // 2. Response Messages from AnalyticsEvent & Notification
      const responseEvents = await AnalyticsEvent.find({
        $or: [
          { eventType: 'Final button clicked' },
          { eventType: 'Response Message' },
          { 'metadata.responseText': { $exists: true } },
          { 'metadata.message': { $exists: true } }
        ]
      }).sort({ timestamp: -1 });

      mongoResponses = responseEvents.map(e => ({
        _id: e._id.toString(),
        customId: e.metadata?.customId || '',
        name: e.metadata?.name || e.metadata?.visitorName || 'Her',
        message: e.metadata?.responseText || e.metadata?.message || e.metadata?.content || '',
        timestamp: (e.timestamp || e.createdAt || new Date()).toISOString()
      }));

      const notifResponses = await Notification.find({ type: 'final_button' }).sort({ createdAt: -1 });
      notifResponses.forEach(n => {
        let name = 'Her';
        if (n.title && n.title.includes('Sent You A Message')) {
          name = n.title.replace('💌', '').replace('Sent You A Message!', '').trim() || 'Her';
        }
        let message = n.message || '';
        if (message.startsWith('"') && message.endsWith('"')) {
          message = message.substring(1, message.length - 1);
        }
        if (message) {
          mongoResponses.push({
            _id: n._id.toString(),
            customId: 'notif_resp_' + n._id.toString(),
            name,
            message,
            timestamp: (n.createdAt || new Date()).toISOString()
          });
        }
      });

      mongoSessionsCount = await VisitorSession.countDocuments();
    } catch (e) {
      console.warn('MongoDB fetch warning in getDashboardAnalytics:', e.message);
    }

    // Combine MongoDB + Persistent File Store Logins, deduplicating by ID, customId, or name+timestamp
    const loginMap = new Map();
    store.userLogins.forEach(item => {
      const key = item._id || item.customId || (item.name + '_' + item.timestamp);
      if (item.name) loginMap.set(key, item);
    });
    mongoLogins.forEach(item => {
      const key = item._id || item.customId || (item.name + '_' + item.timestamp);
      if (item.name && !loginMap.has(key)) {
        loginMap.set(key, item);
      }
    });

    // Combine MongoDB + Persistent File Store Responses, deduplicating by ID, customId, or message+timestamp
    const responseMap = new Map();
    store.responseMessages.forEach(item => {
      const key = item._id || item.customId || (item.message + '_' + item.timestamp);
      if (item.message) responseMap.set(key, item);
    });
    mongoResponses.forEach(item => {
      const key = item._id || item.customId || (item.message + '_' + item.timestamp);
      if (item.message && !responseMap.has(key)) {
        responseMap.set(key, item);
      }
    });

    const userLogins = Array.from(loginMap.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const responseMessages = Array.from(responseMap.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const totalSessions = Math.max(mongoSessionsCount, store.visitorSessions.length, userLogins.length);

    // Sync persistent memory store with merged results
    store.userLogins = userLogins;
    store.responseMessages = responseMessages;
    saveToDisk();

    return {
      totalSessions,
      userLogins,
      responseMessages
    };
  },

  // Delete Sign-In Entry
  deleteLogin: async (id) => {
    store.userLogins = store.userLogins.filter(item => item._id !== id && item.customId !== id);
    saveToDisk();

    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await AnalyticsEvent.findByIdAndDelete(id).catch(() => {});
        await Notification.findByIdAndDelete(id).catch(() => {});
      }
      await AnalyticsEvent.deleteMany({
        $or: [
          { 'metadata.customId': id },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
        ]
      }).catch(() => {});
    } catch (e) {}
  },

  // Delete Response Message Entry
  deleteMessage: async (id) => {
    store.responseMessages = store.responseMessages.filter(item => item._id !== id && item.customId !== id);
    saveToDisk();

    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await AnalyticsEvent.findByIdAndDelete(id).catch(() => {});
        await Notification.findByIdAndDelete(id).catch(() => {});
      }
      await AnalyticsEvent.deleteMany({
        $or: [
          { 'metadata.customId': id },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }
        ]
      }).catch(() => {});
    } catch (e) {}
  },

  // Clear Everything (Only when admin explicitly clicks "Reset Everything to 0")
  clearAll: async () => {
    store.userLogins = [];
    store.responseMessages = [];
    store.visitorSessions = [];
    store.notifications = [];
    saveToDisk();

    try {
      await AnalyticsEvent.deleteMany({}).catch(() => {});
      await VisitorSession.deleteMany({}).catch(() => {});
      await Notification.deleteMany({}).catch(() => {});
    } catch (e) {}
  }
};
