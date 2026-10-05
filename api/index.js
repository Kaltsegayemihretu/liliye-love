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
import Video from './models/Video.js';
import TimelineEvent from './models/TimelineEvent.js';
import Song from './models/Song.js';
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

// Database connection & Seeding middleware for Serverless
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
// 1. AUTH ROUTES
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    await AnalyticsEvent.create({
      eventType: 'Login',
      userId: user._id,
      metadata: { role: user.role, email: user.email }
    }).catch(() => {});

    if (user.role === 'her') {
      await Notification.create({
        title: 'Her Logged In 💖',
        message: `${user.email} logged into the website.`,
        type: 'login',
        link: '/admin/messages'
      }).catch(() => {});
    }

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  return res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      name: req.user.name
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// ==========================================
// 2. SITE CONTENT ROUTES
// ==========================================
app.get('/api/content', async (req, res) => {
  try {
    const contents = await SiteContent.find();
    const result = {};
    contents.forEach(item => {
      result[item.sectionKey] = item.data;
    });
    return res.json(result);
  } catch (err) {
    return res.json({});
  }
});

app.put('/api/content/:sectionKey', requireAdmin, async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const { data } = req.body;
    
    let content = await SiteContent.findOne({ sectionKey });
    if (!content) {
      content = new SiteContent({ sectionKey, data });
    } else {
      content.data = data;
    }
    await content.save();
    return res.json({ success: true, sectionKey, data: content.data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update section content.' });
  }
});

// ==========================================
// 3. PHOTOS & MEMORIES ROUTES
// ==========================================
app.get('/api/photos', async (req, res) => {
  try {
    const photos = await Photo.find().sort({ order: 1, createdAt: -1 });
    return res.json(photos);
  } catch (err) {
    return res.json([]);
  }
});

app.post('/api/photos', requireAdmin, async (req, res) => {
  try {
    const { title, imageUrl, caption, isCutout, rotation, order, category } = req.body;
    const photo = await Photo.create({
      title,
      imageUrl,
      caption,
      isCutout: isCutout || false,
      rotation: rotation || 0,
      order: order || 0,
      category: category || 'album'
    });
    return res.status(201).json(photo);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create photo.' });
  }
});

app.put('/api/photos/:id', requireAdmin, async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!photo) return res.status(404).json({ error: 'Photo not found.' });
    return res.json(photo);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update photo.' });
  }
});

app.delete('/api/photos/:id', requireAdmin, async (req, res) => {
  try {
    await Photo.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete photo.' });
  }
});

// ==========================================
// 4. VIDEOS ROUTES
// ==========================================
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ order: 1, createdAt: -1 });
    return res.json(videos);
  } catch (err) {
    return res.json([]);
  }
});

app.post('/api/videos', requireAdmin, async (req, res) => {
  try {
    const video = await Video.create(req.body);
    return res.status(201).json(video);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create video.' });
  }
});

app.put('/api/videos/:id', requireAdmin, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(video);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update video.' });
  }
});

app.delete('/api/videos/:id', requireAdmin, async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete video.' });
  }
});

// ==========================================
// 5. TIMELINE ROUTES
// ==========================================
app.get('/api/timeline', async (req, res) => {
  try {
    const events = await TimelineEvent.find().sort({ order: 1, createdAt: 1 });
    return res.json(events);
  } catch (err) {
    return res.json([]);
  }
});

app.post('/api/timeline', requireAdmin, async (req, res) => {
  try {
    const event = await TimelineEvent.create(req.body);
    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create timeline event.' });
  }
});

app.put('/api/timeline/:id', requireAdmin, async (req, res) => {
  try {
    const event = await TimelineEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update timeline event.' });
  }
});

app.delete('/api/timeline/:id', requireAdmin, async (req, res) => {
  try {
    await TimelineEvent.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete timeline event.' });
  }
});

// ==========================================
// 6. SOUNDTRACK MUSIC ROUTES
// ==========================================
app.get('/api/music', async (req, res) => {
  try {
    const songs = await Song.find().sort({ order: 1 });
    return res.json(songs);
  } catch (err) {
    return res.json([]);
  }
});

app.post('/api/music', requireAdmin, async (req, res) => {
  try {
    const song = await Song.create(req.body);
    return res.status(201).json(song);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add song.' });
  }
});

app.put('/api/music/:id', requireAdmin, async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(song);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update song.' });
  }
});

app.delete('/api/music/:id', requireAdmin, async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete song.' });
  }
});

// ==========================================
// 7. LOCATIONS ROUTES
// ==========================================
app.get('/api/locations', async (req, res) => {
  try {
    let loc = await Location.findOne();
    if (!loc) {
      loc = {
        myLocationName: "MY PLACE",
        myCity: "San Francisco, CA",
        herLocationName: "HER PLACE",
        herCity: "New York, NY",
        distanceText: "2,572 miles"
      };
    }
    return res.json(loc);
  } catch (err) {
    return res.json({
      myLocationName: "MY PLACE",
      myCity: "San Francisco, CA",
      herLocationName: "HER PLACE",
      herCity: "New York, NY",
      distanceText: "2,572 miles"
    });
  }
});

app.put('/api/locations', requireAdmin, async (req, res) => {
  try {
    let loc = await Location.findOne();
    if (!loc) {
      loc = new Location(req.body);
    } else {
      Object.assign(loc, req.body);
    }
    await loc.save();
    return res.json(loc);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update location info.' });
  }
});

// ==========================================
// 8. PRIVATE CHAT MESSAGES ROUTES
// ==========================================
app.get('/api/messages', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    
    await Message.updateMany(
      { recipientId: req.user._id, read: false },
      { read: true, readAt: new Date() }
    ).catch(() => {});

    return res.json(messages);
  } catch (err) {
    return res.json([]);
  }
});

app.post('/api/messages', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }

    const sender = req.user;
    const recipientRole = sender.role === 'admin' ? 'her' : 'admin';
    const recipient = await User.findOne({ role: recipientRole });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient account not configured.' });
    }

    const message = await Message.create({
      senderId: sender._id,
      recipientId: recipient._id,
      senderRole: sender.role,
      content: content.trim(),
      read: false
    });

    const appUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const chatLink = `${appUrl}/chat`;

    if (sender.role === 'admin') {
      sendEmail({
        to: recipient.email,
        subject: "You have a new message 💖",
        text: `You have a new message on your personal website: "${content.substring(0, 50)}...". Open conversation: ${chatLink}`,
        html: buildNotificationEmailHtml({
          title: "You have a new message",
          messageText: "I just sent you a new message in our private chat.",
          actionUrl: chatLink,
          actionText: "Open the Conversation"
        })
      });
    } else {
      const adminEmail = process.env.ADMIN_EMAIL || recipient.email;
      sendEmail({
        to: adminEmail,
        subject: "New Message Received from Her! 📬",
        text: `Her sent a message: "${content}". Open conversation: ${appUrl}/admin/messages`,
        html: buildNotificationEmailHtml({
          title: "New Message Received!",
          messageText: `Her just sent you a message: "${content}"`,
          actionUrl: `${appUrl}/admin/messages`,
          actionText: "Open Admin Chat"
        })
      });

      await Notification.create({
        title: "New Message from Her 💬",
        message: content.length > 60 ? content.substring(0, 60) + '...' : content,
        type: 'chat',
        link: '/admin/messages'
      }).catch(() => {});
    }

    return res.status(201).json(message);
  } catch (err) {
    console.error('Send message error:', err);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
});

// ==========================================
// 9. ANALYTICS & MONITORING ROUTES
// ==========================================
app.post('/api/analytics/session', async (req, res) => {
  try {
    const { sessionId, deviceType, browser, region } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'Session ID required.' });

    let session = await VisitorSession.findOne({ sessionId });
    if (!session) {
      session = await VisitorSession.create({
        sessionId,
        userIp: req.ip || 'anonymous',
        userAgent: req.headers['user-agent'] || '',
        deviceType: deviceType || 'Desktop',
        browser: browser || 'Chrome',
        region: region || 'Unknown',
        startedAt: new Date(),
        lastActive: new Date()
      });

      await AnalyticsEvent.create({
        eventType: 'Website opened',
        sessionId,
        metadata: { deviceType, browser }
      }).catch(() => {});
    } else {
      session.lastActive = new Date();
      await session.save();
    }

    return res.json(session);
  } catch (err) {
    return res.json({ success: true });
  }
});

app.post('/api/analytics/event', async (req, res) => {
  try {
    const { eventType, sessionId, metadata } = req.body;
    if (!eventType) return res.status(400).json({ error: 'Event type required.' });

    const event = await AnalyticsEvent.create({
      eventType,
      sessionId: sessionId || '',
      metadata: metadata || {},
      timestamp: new Date()
    });

    return res.status(201).json(event);
  } catch (err) {
    return res.json({ success: true });
  }
});

app.get('/api/analytics/dashboard', requireAdmin, async (req, res) => {
  try {
    const totalSessions = await VisitorSession.countDocuments();
    const recentSessions = await VisitorSession.find().sort({ lastActive: -1 }).limit(10);
    const unreadMessagesCount = await Message.countDocuments({ senderRole: 'her', read: false });
    const events = await AnalyticsEvent.find().sort({ timestamp: -1 }).limit(50);
    
    const envelopeOpens = await AnalyticsEvent.countDocuments({ eventType: 'Envelope opened' });
    const boomboxOpens = await AnalyticsEvent.countDocuments({ eventType: 'Boombox opened' });
    const finalClicks = await AnalyticsEvent.countDocuments({ eventType: 'Final button clicked' });

    return res.json({
      totalSessions,
      recentSessions,
      unreadMessagesCount,
      envelopeOpens,
      boomboxOpens,
      finalClicks,
      recentEvents: events
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load analytics dashboard.' });
  }
});

// ==========================================
// 10. NOTIFICATIONS ROUTES
// ==========================================
app.get('/api/notifications', requireAdmin, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(30);
    return res.json(notifications);
  } catch (err) {
    return res.json([]);
  }
});

app.put('/api/notifications/:id/read', requireAdmin, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    return res.json(notification);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update notification.' });
  }
});

app.put('/api/notifications/read-all', requireAdmin, async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to mark notifications read.' });
  }
});

// ==========================================
// 11. FINAL RED BUTTON CLICK ROUTE
// ==========================================
app.post('/api/events/final-button', async (req, res) => {
  try {
    const { sessionId } = req.body;

    await AnalyticsEvent.create({
      eventType: 'Final button clicked',
      sessionId: sessionId || '',
      timestamp: new Date()
    }).catch(() => {});

    await Notification.create({
      title: '🚨 HER CLICKED THE FINAL RED BUTTON! 💖',
      message: 'She clicked "CLICK WHEN YOU\'RE READY FOR US". She is ready!',
      type: 'final_button',
      link: '/admin/overview'
    }).catch(() => {});

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@liliye.love';
    sendEmail({
      to: adminEmail,
      subject: "💖 SHE CLICKED THE FINAL BUTTON! SHE'S READY!",
      text: "She clicked 'CLICK WHEN YOU'RE READY FOR US' on the website! Check your admin dashboard now.",
      html: buildNotificationEmailHtml({
        title: "SHE'S READY! 💖",
        messageText: "She just clicked the final red button on the website: 'CLICK WHEN YOU'RE READY FOR US'!",
        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin`,
        actionText: "View Admin Dashboard"
      })
    });

    return res.json({
      success: true,
      message: "I'll take that as your answer."
    });
  } catch (err) {
    console.error('Final button click error:', err);
    return res.status(500).json({ error: 'Failed to process interaction.' });
  }
});

// Standalone local server listener
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Liliye API Server running on http://localhost:${PORT}`);
  });
}

// Vercel Serverless Function Handler
const handler = (req, res) => {
  return app(req, res);
};

export default handler;
