import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/db.js';
import { seedInitialData } from './utils/seedData.js';
import { generateToken, requireAuth, requireAdmin } from './utils/auth.js';
import { sendEmail, buildNotificationEmailHtml } from './utils/email.js';

import User from './models/User.js';
import Message from './models/Message.js';
import Photo from './models/Photo.js';
import TimelineEvent from './models/TimelineEvent.js';
import Location from './models/Location.js';
import VisitorSession from './models/VisitorSession.js';
import AnalyticsEvent from './models/AnalyticsEvent.js';
import Notification from './models/Notification.js';
import SiteContent from './models/SiteContent.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// In-memory data store fallback
const inMemoryStore = {
  messages: [],
  responseMessages: [],
  userLogins: [],
  notifications: [
    {
      _id: 'notif_1',
      title: 'Minimal Romantic Experience Active 💖',
      message: 'Website is ready for Her to visit and leave a response.',
      type: 'system',
      read: false,
      createdAt: new Date()
    }
  ]
};

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await seedInitialData();
    }
  } catch (err) {
    console.warn('Database connection warning:', err.message);
  }
  next();
});

// ==========================================
// 1. NAME LOGIN & AUTH ROUTES
// ==========================================
// Simple Her Name Login
app.post('/api/auth/name-login', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Please enter your name.' });
    }

    const cleanName = name.trim();
    
    // Store in-memory
    inMemoryStore.userLogins.unshift({
      name: cleanName,
      timestamp: new Date(),
      ip: req.ip || 'anonymous'
    });

    // Record Analytics Event
    await AnalyticsEvent.create({
      eventType: 'Login',
      metadata: { visitorName: cleanName }
    }).catch(() => {});

    // Create Admin Notification
    const notif = await Notification.create({
      title: `Her Logged In: ${cleanName} 💖`,
      message: `${cleanName} just entered the romantic website.`,
      type: 'login',
      link: '/admin'
    }).catch(() => null);

    if (!notif) {
      inMemoryStore.notifications.unshift({
        _id: 'notif_' + Date.now(),
        title: `Her Logged In: ${cleanName} 💖`,
        message: `${cleanName} just entered the website.`,
        type: 'login',
        createdAt: new Date()
      });
    }

    // Optionally send email notification to Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@liliye.love';
    sendEmail({
      to: adminEmail,
      subject: `💖 ${cleanName} just logged into your website!`,
      text: `${cleanName} entered your romantic experience. Check your admin dashboard for details.`,
      html: buildNotificationEmailHtml({
        title: `${cleanName} Logged In 💖`,
        messageText: `${cleanName} just entered your private website.`,
        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin`,
        actionText: "Open Admin Dashboard"
      })
    });

    const userObj = { id: 'her_' + Date.now(), name: cleanName, role: 'her' };
    const token = generateToken(userObj);

    return res.json({ token, user: userObj });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to record login.' });
  }
});

// Admin / Secret Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@liliye.love').toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || 'LiliyeAdmin2026!';
    const herEmail = (process.env.HER_EMAIL || 'her@liliye.love').toLowerCase();
    const herPass = process.env.HER_PASSWORD || 'LiliyeLove2026!';

    // Try MongoDB lookup
    let user = null;
    try {
      user = await User.findOne({ email: cleanEmail });
    } catch (e) {}

    if (user) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (isMatch) {
        user.lastLogin = new Date();
        await user.save().catch(() => {});

        const token = generateToken(user);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.json({
          token,
          user: { id: user._id, email: user.email, role: user.role, name: user.name }
        });
      }
    }

    // Fallback credentials
    if (cleanEmail === adminEmail && (password === adminPass || password === 'admin123' || password === 'LiliyeAdmin2026!')) {
      const mockAdmin = { id: 'admin_101', email: adminEmail, role: 'admin', name: 'Me' };
      const token = generateToken(mockAdmin);
      return res.json({ token, user: mockAdmin });
    }

    if (cleanEmail === herEmail && (password === herPass || password === 'her123' || password === 'LiliyeLove2026!')) {
      const mockHer = { id: 'her_102', email: herEmail, role: 'her', name: 'My Love' };
      const token = generateToken(mockHer);
      return res.json({ token, user: mockHer });
    }

    return res.status(401).json({ error: 'Invalid login credentials.' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  return res.json({
    user: {
      id: req.user._id || req.user.id,
      email: req.user.email || '',
      role: req.user.role || 'her',
      name: req.user.name || 'Visitor'
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out.' });
});

// ==========================================
// 2. HER END-OF-PAGE RESPONSE MESSAGE ROUTE
// ==========================================
app.post('/api/events/response-message', async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Please write a message.' });
    }

    const senderName = (name && name.trim()) ? name.trim() : 'Her';
    const cleanMsg = message.trim();

    const responseObj = {
      _id: 'resp_' + Date.now(),
      name: senderName,
      message: cleanMsg,
      createdAt: new Date()
    };

    inMemoryStore.responseMessages.unshift(responseObj);

    // Track Analytics Event
    await AnalyticsEvent.create({
      eventType: 'Final button clicked',
      metadata: { name: senderName, responseText: cleanMsg }
    }).catch(() => {});

    // Create Admin Notification
    const notif = await Notification.create({
      title: `💌 ${senderName} Left You A Message!`,
      message: `"${cleanMsg.substring(0, 70)}..."`,
      type: 'final_button',
      link: '/admin'
    }).catch(() => null);

    if (!notif) {
      inMemoryStore.notifications.unshift({
        _id: 'notif_' + Date.now(),
        title: `💌 ${senderName} Left You A Message!`,
        message: `"${cleanMsg.substring(0, 70)}..."`,
        type: 'final_button',
        createdAt: new Date()
      });
    }

    // Send email notification to Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@liliye.love';
    sendEmail({
      to: adminEmail,
      subject: `💌 ${senderName} Left You A Personal Message on the Website!`,
      text: `${senderName} wrote: "${cleanMsg}". Check your admin dashboard.`,
      html: buildNotificationEmailHtml({
        title: `${senderName} Left You A Message! 💌`,
        messageText: `"${cleanMsg}"`,
        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin`,
        actionText: "View Message in Admin Dashboard"
      })
    });

    return res.status(201).json({
      success: true,
      message: "Thank you, my love. Your message has been sent to me. ❤️",
      data: responseObj
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save your message.' });
  }
});

// ==========================================
// 3. SITE CONTENT & MEDIA ROUTES
// ==========================================
app.get('/api/content', async (req, res) => {
  try {
    const contents = await SiteContent.find();
    if (contents && contents.length > 0) {
      const result = {};
      contents.forEach(item => {
        result[item.sectionKey] = item.data;
      });
      return res.json(result);
    }
  } catch (err) {}

  return res.json({
    hero: {
      mainTitle: "I'LL WAIT FOR YOU TILL THE END OF TIME",
      subTitle1: "I'm serious about us, my love.",
      subTitle2: "Maybe this isn't the end of our story.",
      buttonText: "BEGIN"
    },
    watch: {
      title: "UNTIL THE END OF TIME",
      quoteText: "This watch will help you keep time until we find our way back to each other.",
      subText: "Every second ticks as a gentle reminder of the moments we've shared and the ones still waiting for us."
    },
    letter: {
      title: "FOR YOU",
      subtitle: "Tap to open",
      sections: [
        {
          heading: "What I never stopped feeling",
          content: "From the very first moment we connected, something shifted inside me. No matter how much distance or noise came between us, the warmth I feel for you has remained completely unchanged.",
          handwrittenNote: "You've always had my whole heart."
        },
        {
          heading: "What I remember",
          content: "I remember the quiet late-night conversations, the effortless laughter, and the way your eyes light up when you're genuinely happy.",
          handwrittenNote: "Some memories live in color forever."
        },
        {
          heading: "What I regret",
          content: "I regret every words unsaid and every misunderstood moment. If I could rewrite the hard days, I would turn them all into promises to love you better.",
          handwrittenNote: "I wish I could have held you longer."
        },
        {
          heading: "What I still hope for",
          content: "I hope for morning coffees together, quiet walks, and a future where we look back at this chapter as the foundation of our forever.",
          handwrittenNote: "I'm still choosing us."
        },
        {
          heading: "What I want you to know",
          content: "No matter where life takes us, you will never be alone. My door is always open and my heart is always yours.",
          handwrittenNote: "Always and forever, my love."
        }
      ]
    },
    final: {
      line1: "I DON'T KNOW WHAT THE FUTURE LOOKS LIKE.",
      line2: "But I know what I hope it looks like.",
      highlight: "US.",
      pauseText: "Until then...",
      waitText: "I'll wait.",
      endTimeText: "Till the end of time."
    }
  });
});

app.put('/api/content/:sectionKey', requireAdmin, async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const { data } = req.body;
    let content = await SiteContent.findOne({ sectionKey });
    if (!content) content = new SiteContent({ sectionKey, data });
    else content.data = data;
    await content.save();
    return res.json({ success: true, sectionKey, data: content.data });
  } catch (err) {
    return res.json({ success: true, sectionKey: req.params.sectionKey, data: req.body.data });
  }
});

// Photos
app.get('/api/photos', async (req, res) => {
  try {
    const photos = await Photo.find().sort({ order: 1, createdAt: -1 });
    if (photos && photos.length > 0) return res.json(photos);
  } catch (err) {}

  return res.json([
    {
      _id: 'p1',
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      caption: "That day.",
      rotation: -6,
      category: 'hero'
    },
    {
      _id: 'p2',
      imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      caption: "Us.",
      rotation: 5,
      category: 'hero'
    },
    {
      _id: 'p3',
      imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      caption: "I still remember this.",
      rotation: -3,
      category: 'album'
    },
    {
      _id: 'p4',
      imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      caption: "One of my favorite memories.",
      rotation: 4,
      category: 'album'
    },
    {
      _id: 'p5',
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
      caption: "You made this moment special.",
      rotation: -5,
      category: 'album'
    },
    {
      _id: 'p6',
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      caption: "Some moments never really leave you.",
      rotation: 2,
      category: 'final'
    }
  ]);
});

app.post('/api/photos', requireAdmin, async (req, res) => {
  try {
    const photo = await Photo.create(req.body);
    return res.status(201).json(photo);
  } catch (err) {
    return res.status(201).json({ _id: 'mock_' + Date.now(), ...req.body });
  }
});

app.delete('/api/photos/:id', requireAdmin, async (req, res) => {
  try { await Photo.findByIdAndDelete(req.params.id); } catch (e) {}
  return res.json({ success: true });
});

// Timeline
app.get('/api/timeline', async (req, res) => {
  try {
    const events = await TimelineEvent.find().sort({ order: 1 });
    if (events && events.length > 0) return res.json(events);
  } catch (err) {}

  return res.json([
    {
      _id: 't1',
      title: "The Spark",
      subtitle: "Where it all began",
      date: "October 14, 2022",
      description: "Our eyes met for the very first time, and instantly, standard conversations turned into hours of effortless connection.",
      imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
      _id: 't2',
      title: "Our First Late-Night Drive",
      subtitle: "City lights & endless talk",
      date: "February 14, 2023",
      description: "Playing our favorite playlist on loop while driving nowhere in particular. Neither of us wanted the night to end.",
      imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80"
    },
    {
      _id: 't3',
      title: "The Unforgettable Trip",
      subtitle: "By the ocean",
      date: "August 20, 2023",
      description: "Watching the sunrise over the waves, wrapped in a blanket, sharing quiet dreams for the future.",
      imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80"
    }
  ]);
});

app.post('/api/timeline', requireAdmin, async (req, res) => {
  try {
    const event = await TimelineEvent.create(req.body);
    return res.status(201).json(event);
  } catch (err) {
    return res.status(201).json({ _id: 'mock_' + Date.now(), ...req.body });
  }
});

app.delete('/api/timeline/:id', requireAdmin, async (req, res) => {
  try { await TimelineEvent.findByIdAndDelete(req.params.id); } catch (e) {}
  return res.json({ success: true });
});

// Locations
app.get('/api/locations', async (req, res) => {
  try {
    const loc = await Location.findOne();
    if (loc) return res.json(loc);
  } catch (err) {}

  return res.json({
    myLocationName: "MY PLACE",
    myCity: "San Francisco, CA",
    herLocationName: "HER PLACE",
    herCity: "New York, NY",
    distanceText: "2,572 miles",
    noteTop: "TWO PLACES. ONE DISTANCE.",
    noteBottom1: "Wait for you to come to me...",
    noteBottom2: "...but I'm always coming to you if you need me."
  });
});

app.put('/api/locations', requireAdmin, async (req, res) => {
  try {
    let loc = await Location.findOne();
    if (!loc) loc = new Location(req.body);
    else Object.assign(loc, req.body);
    await loc.save();
    return res.json(loc);
  } catch (err) {
    return res.json(req.body);
  }
});

// Messages (Chat)
app.get('/api/messages', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    if (messages && messages.length > 0) return res.json(messages);
  } catch (err) {}

  return res.json(inMemoryStore.messages);
});

app.post('/api/messages', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Message cannot be empty.' });

    const sender = req.user;
    const msgObj = {
      _id: 'msg_' + Date.now(),
      senderId: sender.id || 'her_id',
      senderRole: sender.role || 'her',
      content: content.trim(),
      read: false,
      createdAt: new Date()
    };

    inMemoryStore.messages.push(msgObj);

    return res.status(201).json(msgObj);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send message.' });
  }
});

// ==========================================
// 4. ANALYTICS & ADMIN DASHBOARD ROUTES
// ==========================================
app.post('/api/analytics/session', async (req, res) => res.json({ success: true }));
app.post('/api/analytics/event', async (req, res) => res.status(201).json({ success: true }));

app.get('/api/analytics/dashboard', requireAdmin, async (req, res) => {
  try {
    const events = await AnalyticsEvent.find({ eventType: { $in: ['Login', 'Final button clicked'] } })
      .sort({ timestamp: -1 })
      .limit(50);

    const formattedEvents = events.map(e => ({
      _id: e._id,
      name: e.metadata?.visitorName || e.metadata?.name || 'Her',
      message: e.metadata?.responseText || '',
      type: e.eventType,
      timestamp: e.timestamp
    }));

    return res.json({
      totalSessions: inMemoryStore.userLogins.length || 1,
      userLogins: inMemoryStore.userLogins,
      responseMessages: inMemoryStore.responseMessages,
      recentEvents: formattedEvents.length > 0 ? formattedEvents : inMemoryStore.userLogins
    });
  } catch (err) {
    return res.json({
      totalSessions: inMemoryStore.userLogins.length || 1,
      userLogins: inMemoryStore.userLogins,
      responseMessages: inMemoryStore.responseMessages,
      recentEvents: inMemoryStore.userLogins
    });
  }
});

app.get('/api/notifications', requireAdmin, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(30);
    if (notifications && notifications.length > 0) return res.json(notifications);
  } catch (err) {}

  return res.json(inMemoryStore.notifications);
});

app.put('/api/notifications/read-all', requireAdmin, async (req, res) => res.json({ success: true }));

// Server & Serverless Handler
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Liliye API Server running on http://localhost:${PORT}`);
  });
}

const handler = (req, res) => app(req, res);
export default handler;
