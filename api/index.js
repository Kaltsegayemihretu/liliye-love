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

// Fallback in-memory data store for Logins and Messages
const inMemoryStore = {
  responseMessages: [],
  userLogins: [],
  notifications: [
    {
      _id: 'notif_1',
      title: 'Romantic Experience Ready 💖',
      message: 'Website is listening for Her name sign-in and messages.',
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
// 1. NAME SIGN-IN ROUTE
// ==========================================
app.post('/api/auth/name-login', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Please enter your name.' });
    }

    const cleanName = name.trim();
    const loginEntry = {
      _id: 'login_' + Date.now(),
      name: cleanName,
      timestamp: new Date()
    };

    inMemoryStore.userLogins.unshift(loginEntry);
    inMemoryStore.notifications.unshift({
      _id: 'notif_' + Date.now(),
      title: `Her Signed In: ${cleanName} 💖`,
      message: `${cleanName} signed into website at ${new Date().toLocaleTimeString()}`,
      type: 'login',
      read: false,
      createdAt: new Date()
    });

    // Save to MongoDB if available
    await AnalyticsEvent.create({
      eventType: 'Login',
      metadata: { visitorName: cleanName },
      timestamp: new Date()
    }).catch(() => {});

    await Notification.create({
      title: `Her Signed In: ${cleanName} 💖`,
      message: `${cleanName} signed in on ${new Date().toLocaleString()}`,
      type: 'login',
      link: '/admin'
    }).catch(() => {});

    // Email Notification to Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@liliye.love';
    sendEmail({
      to: adminEmail,
      subject: `💖 ${cleanName} signed into your website!`,
      text: `${cleanName} signed in at ${new Date().toLocaleString()}`,
      html: buildNotificationEmailHtml({
        title: `${cleanName} Signed In 💖`,
        messageText: `${cleanName} signed into your website on ${new Date().toLocaleString()}`,
        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin`,
        actionText: "View Admin Dashboard"
      })
    });

    const userObj = { id: 'her_' + Date.now(), name: cleanName, role: 'her' };
    const token = generateToken(userObj);

    return res.json({ token, user: userObj });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to record sign-in.' });
  }
});

// Admin Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@liliye.love').toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || 'LiliyeAdmin2026!';

    // MongoDB Lookup
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
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        return res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
      }
    }

    // Fallback Admin Check
    if (cleanEmail === adminEmail && (password === adminPass || password === 'admin123' || password === 'LiliyeAdmin2026!')) {
      const mockAdmin = { id: 'admin_101', email: adminEmail, role: 'admin', name: 'Me' };
      const token = generateToken(mockAdmin);
      return res.json({ token, user: mockAdmin });
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
// 2. HER MESSAGE RECEIVE ROUTE (Name, Message, Date, Time)
// ==========================================
app.post('/api/events/response-message', async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Please write a message.' });
    }

    const senderName = (name && name.trim()) ? name.trim() : 'Her';
    const cleanMsg = message.trim();
    const now = new Date();

    const responseObj = {
      _id: 'resp_' + Date.now(),
      name: senderName,
      message: cleanMsg,
      timestamp: now
    };

    inMemoryStore.responseMessages.unshift(responseObj);
    inMemoryStore.notifications.unshift({
      _id: 'notif_' + Date.now(),
      title: `💌 ${senderName} Sent You A Message!`,
      message: `"${cleanMsg}"`,
      type: 'final_button',
      read: false,
      createdAt: now
    });

    // Save to MongoDB if available
    await AnalyticsEvent.create({
      eventType: 'Final button clicked',
      metadata: { name: senderName, responseText: cleanMsg },
      timestamp: now
    }).catch(() => {});

    await Notification.create({
      title: `💌 ${senderName} Sent You A Message!`,
      message: `"${cleanMsg}"`,
      type: 'final_button',
      link: '/admin'
    }).catch(() => {});

    // Email Notification to Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@liliye.love';
    sendEmail({
      to: adminEmail,
      subject: `💌 ${senderName} Sent You A Message!`,
      text: `${senderName} wrote: "${cleanMsg}" on ${now.toLocaleString()}`,
      html: buildNotificationEmailHtml({
        title: `${senderName} Sent You A Message! 💌`,
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
    return res.status(500).json({ error: 'Failed to save message.' });
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
      singleLetterText: `Liliye,

I remember the first time we met like it was yesterday. We were learning our license, walking down the stairs, and I asked you if it was boring. You replied, “No, not really.” I asked you to send me the document, but honestly, I just wanted your number.

The next day, you agreed to walk with me to Imperial, and then we walked all the way to your home, talking the entire journey together. It wasn’t awkward at all. I still get chills just thinking about it. I told you that you had beautiful nails and held your bag like the gentleman I am. We started talking, and I asked you out. You said no, telling me you liked older men in their mid-30s. Like, bruh...

I ghosted you after you said no. I prayed you would text me back, and after 15 days, you finally said, “Hey.” It took me a day to reply, but I’m so glad I did.

We talked more, and you applied to AASTU and got accepted for the entrance exam. We met there. Man, I looked at you the whole day. Even Halle noticed it, haha. We called a ride together and walked to the front gates, but then I got a migraine. I got so sick, remember? I was so mad because I wanted to have lunch with you that day. I remember wanting to lay my head on your thighs because I was so tired too.

But somehow, we still met up. First, I waited for you at Caramel Café, and then we went to Coffeecology. It was our first date.

LILIYE, I LOVE YOU. PLEASE, LET’S BE TOGETHER AGAIN. I WON’T MESS IT UP THIS TIME.

After our first date, you told me you wanted to go out again. I had never felt so much like a man. We went to Nu Cheka Enabuka and then to Century. You were checking my Instagram the whole time, looking for other girls, which you didn’t find. Thank God there weren’t any.

It was Fantu’s birthday, so we had to rush home. You were a bit sad because you wanted to spend more time together.

Once we got accepted at AASTU, we started going home together. You were so funny, Liliye. I’m so sorry I had to mess this up, but we can still make this work, my love. I’m sorry, my love.

One day, we were crossing the road, and you held my hand. I still remember the rush I felt before you pulled away.

Oh, and the day before, I forgot my document with you and came to your house wearing a gold necklace. You came out and gave it to me, and I texted you asking why you had put a stain on my document, saying something funny like you let it eat with you. You said, “Cute,” and made me blush.

You were the first person to truly love me, Liliye, and I truly loved you back. I miss you like I did in the old days. I will marry you, Liliye, no matter what.

Anyway, after you held my hand, we went to Karavan and talked about where this relationship was going. You said you liked me, but you wanted friends with benefits.

YOU SAID IT FIRST, and then I agreed.

We started whatever that was for a week. Do you remember, Liliye, the way we used to hold hands when we sat at the basketball court?

Then I told you to stop the friends-with-benefits thing and start dating seriously. You were a bit unsure. I remember, my love.

We were imperfect, and that is what made us perfect. We started having sleepovers, watching movies, making love, learning things, and experiencing life together.

We went to Eliana and watched movies. Then we ate at Ako, and you were wearing your cardigan. Then we went to Elaina Café, and we talked. That was when we became boyfriend and girlfriend.

My love, BE EGEZIABHER YKERE BEYEGN, let’s not ruin this.

We still have time. I want to be with you forever. You won’t regret a single thing, Liliye. I guarantee you that. It won’t be a risk. I’m so serious. You don’t know how seriously I want to be with you.

Do you remember the food I used to cook for you?

Do you remember the first time you came home?

Do you remember the agelgel we brought to the hotel?

Do you remember the wrestling matches we had, the showers we took together, or the time I brushed my teeth with your toothbrush?

You were my everything, and you still are.

I’m not joking, Liliye. I will do so many things GENA. I will do whatever it takes to get you back, yene abeba.

Do you remember the time you met Hilu and Tamu?

Liliye, sentun text laregew.

I want to remember and reminisce about the past with you, have kids with you, and build a house together with you. Only you. Just the way you like it.

I will die for you, literally.

Don’t just look at the present, Liliye. Look at the past and the future with me.

Yene abeba, I’m so sorry. Yeker beyegn. Aberen enehun. Ayelemedegnme yene fiker.

I’m dumb. I did the dumbest thing. But this is just the start, Liliye.

I will make you fall in love with me again if I have to. I would rather try a million times with you than with someone else.

I get a stomach ache imagining you laughing with someone else when I’m not there to make you laugh harder.

Liliye, you might find this intense or toxic, but this is love, Liliye.

BE EGEZIABHER, Liliye, give me a chance.

Be Mazi. Be Demese. Be Babi. Be Baby. Be Nati. Be Mother. Be Unc, who works at Ethio Telecom, who we rip money off, oof. Be MEDHANIALEM.

Let’s work on this.

I will do whatever it takes, yene fiker.

I love you until death do us part!

It’s not too late. No, it’s not.

Let’s think about us and no one else for a second.

Liliye, yene fiker, PLEASE.

I LOVE YOU A MILLION, LILIYE.`
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
      imageUrl: "https://drive.google.com/file/d/1Ywnng1aKcnsroblkhBBhB6O4aW19j3n4/view?usp=sharing",
      caption: "",
      rotation: -6,
      category: 'hero'
    },
    {
      _id: 'p2',
      imageUrl: "https://drive.google.com/file/d/1mLY9Y1cmPC9fpL1X4BDJmvSBHpM_42Eg/view?usp=sharing",
      caption: "",
      rotation: 5,
      category: 'hero'
    },
    {
      _id: 'p3',
      imageUrl: "https://drive.google.com/file/d/1Ed4PxbKSH2gTTmCU1XCE6ln3S_GtlP6x/view?usp=sharing",
      caption: "",
      rotation: -4,
      category: 'album'
    },
    {
      _id: 'p4',
      imageUrl: "https://drive.google.com/file/d/1Xag3ljr61LxjeUc0UgDQpYJNvl3SMB-T/view?usp=sharing",
      caption: "",
      rotation: 3,
      category: 'album'
    },
    {
      _id: 'p5',
      imageUrl: "https://drive.google.com/file/d/1R2Rw7lXW_nHePAQri6qqZuIqr1lCQ7_n/view?usp=sharing",
      caption: "",
      rotation: -5,
      category: 'album'
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
    myCity: "Shegole, Addis Ababa",
    herLocationName: "HER PLACE",
    herCity: "Addis Sefer, Addis Ababa",
    distanceText: "4.5 kilometers",
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

// ==========================================
// 4. ADMIN DASHBOARD ANALYTICS ROUTE (Who Signed In & Messages Received)
// ==========================================
app.post('/api/analytics/session', async (req, res) => res.json({ success: true }));
app.post('/api/analytics/event', async (req, res) => res.status(201).json({ success: true }));

app.get('/api/analytics/dashboard', requireAdmin, async (req, res) => {
  try {
    let mongoLogins = [];
    let mongoResponses = [];

    try {
      const loginEvents = await AnalyticsEvent.find({ eventType: 'Login' }).sort({ timestamp: -1 });
      mongoLogins = loginEvents.map(e => ({
        _id: e._id ? e._id.toString() : 'log_' + Math.random(),
        name: e.metadata?.visitorName || 'Her',
        timestamp: e.timestamp || e.createdAt
      }));

      const responseEvents = await AnalyticsEvent.find({ eventType: 'Final button clicked' }).sort({ timestamp: -1 });
      mongoResponses = responseEvents.map(e => ({
        _id: e._id ? e._id.toString() : 'resp_' + Math.random(),
        name: e.metadata?.name || 'Her',
        message: e.metadata?.responseText || '',
        timestamp: e.timestamp || e.createdAt
      }));
    } catch (e) {}

    // Combine MongoDB and in-memory list without duplicates
    const combinedLoginsMap = new Map();
    inMemoryStore.userLogins.forEach(item => combinedLoginsMap.set(item._id, item));
    mongoLogins.forEach(item => combinedLoginsMap.set(item._id, item));

    const combinedResponsesMap = new Map();
    inMemoryStore.responseMessages.forEach(item => combinedResponsesMap.set(item._id, item));
    mongoResponses.forEach(item => combinedResponsesMap.set(item._id, item));

    const userLogins = Array.from(combinedLoginsMap.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const responseMessages = Array.from(combinedResponsesMap.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.json({
      totalSessions: userLogins.length,
      userLogins,
      responseMessages
    });
  } catch (err) {
    return res.json({
      totalSessions: inMemoryStore.userLogins.length,
      userLogins: inMemoryStore.userLogins,
      responseMessages: inMemoryStore.responseMessages
    });
  }
});

// Clear all analytics & reset counters to 0
app.delete('/api/analytics/clear', requireAdmin, async (req, res) => {
  try {
    await AnalyticsEvent.deleteMany({}).catch(() => {});
    await VisitorSession.deleteMany({}).catch(() => {});
    await Notification.deleteMany({}).catch(() => {});

    inMemoryStore.userLogins = [];
    inMemoryStore.responseMessages = [];
    inMemoryStore.notifications = [];

    return res.json({ success: true, message: 'All analytics and overview data reset to 0.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reset analytics data.' });
  }
});

// Delete specific sign-in or message entry by ID
app.delete('/api/analytics/entry/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await AnalyticsEvent.findByIdAndDelete(id).catch(() => {});
    await Notification.findByIdAndDelete(id).catch(() => {});

    inMemoryStore.userLogins = inMemoryStore.userLogins.filter(i => i._id !== id);
    inMemoryStore.responseMessages = inMemoryStore.responseMessages.filter(i => i._id !== id);
    inMemoryStore.notifications = inMemoryStore.notifications.filter(i => i._id !== id);

    return res.json({ success: true, id });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete entry.' });
  }
});

app.get('/api/notifications', requireAdmin, async (req, res) => {
  try {
    let mongoNotifs = [];
    try {
      mongoNotifs = await Notification.find().sort({ createdAt: -1 }).limit(30);
    } catch (e) {}

    let mongoEvents = [];
    try {
      mongoEvents = await AnalyticsEvent.find({ eventType: { $in: ['Login', 'Final button clicked'] } }).sort({ timestamp: -1 }).limit(30);
    } catch (e) {}

    const rawList = [];

    if (mongoNotifs && mongoNotifs.length > 0) {
      mongoNotifs.forEach(n => {
        rawList.push({
          _id: n._id ? n._id.toString() : 'n_' + Math.random(),
          title: n.title,
          message: n.message,
          type: n.type || 'system',
          read: n.read || false,
          createdAt: n.createdAt || new Date()
        });
      });
    }

    if (mongoEvents && mongoEvents.length > 0) {
      mongoEvents.forEach(e => {
        const isLogin = e.eventType === 'Login';
        const name = isLogin ? (e.metadata?.visitorName || 'Her') : (e.metadata?.name || 'Her');
        const text = isLogin ? `${name} signed into the website.` : `"${e.metadata?.responseText || ''}"`;
        rawList.push({
          _id: 'evt_' + (e._id ? e._id.toString() : Math.random()),
          title: isLogin ? `Her Signed In: ${name} 💖` : `💌 ${name} Sent You A Message!`,
          message: text,
          type: isLogin ? 'login' : 'final_button',
          read: false,
          createdAt: e.timestamp || e.createdAt || new Date()
        });
      });
    }

    // Include inMemoryStore items as fallbacks
    inMemoryStore.userLogins.forEach(item => {
      rawList.push({
        _id: item._id,
        title: `Her Signed In: ${item.name} 💖`,
        message: `${item.name} signed into the website.`,
        type: 'login',
        read: false,
        createdAt: item.timestamp
      });
    });

    inMemoryStore.responseMessages.forEach(item => {
      rawList.push({
        _id: item._id,
        title: `💌 ${item.name} Sent You A Message!`,
        message: `"${item.message}"`,
        type: 'final_button',
        read: false,
        createdAt: item.timestamp
      });
    });

    inMemoryStore.notifications.forEach(item => {
      rawList.push(item);
    });

    // Deduplicate by title & 2-second timestamp window
    const uniqueMap = new Map();
    rawList.forEach(item => {
      const timeMs = Math.floor(new Date(item.createdAt).getTime() / 2000);
      const key = `${item.title}_${timeMs}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });

    const sorted = Array.from(uniqueMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(sorted.slice(0, 40));
  } catch (err) {
    return res.json(inMemoryStore.notifications);
  }
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
