import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Photo from '../models/Photo.js';
import Video from '../models/Video.js';
import TimelineEvent from '../models/TimelineEvent.js';
import Song from '../models/Song.js';
import Location from '../models/Location.js';
import SiteContent from '../models/SiteContent.js';

export async function seedInitialData() {
  try {
    // 1. Seed Users
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@liliye.love';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const herEmail = process.env.HER_EMAIL || 'her@liliye.love';
    const herPass = process.env.HER_PASSWORD || 'her123';

    let adminUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!adminUser) {
      const hash = await bcrypt.hash(adminPass, 10);
      adminUser = await User.create({
        email: adminEmail.toLowerCase(),
        passwordHash: hash,
        role: 'admin',
        name: 'Me',
        isVerified: true
      });
      console.log('🌱 Admin user seeded successfully.');
    }

    let herUser = await User.findOne({ email: herEmail.toLowerCase() });
    if (!herUser) {
      const hash = await bcrypt.hash(herPass, 10);
      herUser = await User.create({
        email: herEmail.toLowerCase(),
        passwordHash: hash,
        role: 'her',
        name: 'My Love',
        isVerified: true
      });
      console.log('🌱 Her user seeded successfully.');
    }

    // 2. Seed Site Content (Hero, Watch, Letter, Final)
    const siteContentCount = await SiteContent.countDocuments();
    if (siteContentCount === 0) {
      await SiteContent.create([
        {
          sectionKey: 'hero',
          data: {
            mainTitle: "I'LL WAIT FOR YOU TILL THE END OF TIME",
            subTitle1: "I'm serious about us, my love.",
            subTitle2: "Maybe this isn't the end of our story.",
            buttonText: "BEGIN",
            backgroundAudioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-112708.mp3"
          }
        },
        {
          sectionKey: 'watch',
          data: {
            title: "UNTIL THE END OF TIME",
            quoteText: "This watch will help you keep time until we find our way back to each other.",
            subText: "Every second ticks as a gentle reminder of the moments we've shared and the ones still waiting for us."
          }
        },
        {
          sectionKey: 'letter',
          data: {
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
                content: "I remember the quiet late-night conversations, the effortless laughter, and the way your eyes light up when you're genuinely happy. Those memories aren't just moments in the past—they are the sweetest parts of who I am today.",
                handwrittenNote: "Some memories live in color forever."
              },
              {
                heading: "What I regret",
                content: "I regret every words unsaid, every misunderstood moment, and every time I let silly pride get in the way of holding you tight. If I could rewrite the hard days, I would turn them all into promises to love you better.",
                handwrittenNote: "I wish I could have held you longer."
              },
              {
                heading: "What I still hope for",
                content: "I hope for morning coffees together, quiet walks where we don't need to speak to understand each other, and a future where we look back at this chapter as the foundation of our forever.",
                handwrittenNote: "I'm still choosing us."
              },
              {
                heading: "What I want you to know",
                content: "No matter where life takes us, you will never be alone. My door is always open, my heart is always yours, and I am standing right here whenever you are ready.",
                handwrittenNote: "Always and forever, my love."
              }
            ]
          }
        },
        {
          sectionKey: 'final',
          data: {
            line1: "I DON'T KNOW WHAT THE FUTURE LOOKS LIKE.",
            line2: "But I know what I hope it looks like.",
            highlight: "US.",
            pauseText: "Until then...",
            waitText: "I'll wait.",
            endTimeText: "Till the end of time.",
            buttonText: "CLICK WHEN YOU'RE READY FOR US",
            confirmedText: "I'll take that as your answer."
          }
        }
      ]);
      console.log('🌱 Site Content seeded.');
    }

    // 3. Seed Photos
    const photoCount = await Photo.countDocuments();
    if (photoCount === 0) {
      await Photo.create([
        {
          title: "First Sunset",
          imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
          caption: "That day.",
          isCutout: true,
          rotation: -6,
          order: 1,
          category: 'hero'
        },
        {
          title: "Coffee Date",
          imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
          caption: "Us.",
          isCutout: true,
          rotation: 5,
          order: 2,
          category: 'hero'
        },
        {
          title: "Warm Hug",
          imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
          caption: "I still remember this.",
          isCutout: false,
          rotation: -3,
          order: 3,
          category: 'album'
        },
        {
          title: "Spontaneous Roadtrip",
          imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
          caption: "One of my favorite memories.",
          isCutout: false,
          rotation: 4,
          order: 4,
          category: 'album'
        },
        {
          title: "Stargazing Night",
          imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
          caption: "You made this moment special.",
          isCutout: true,
          rotation: -5,
          order: 5,
          category: 'album'
        },
        {
          title: "Quiet Afternoon",
          imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
          caption: "Some moments never really leave you.",
          isCutout: false,
          rotation: 2,
          order: 6,
          category: 'final'
        }
      ]);
      console.log('🌱 Photos seeded.');
    }

    // 4. Seed Video
    const videoCount = await Video.countDocuments();
    if (videoCount === 0) {
      await Video.create({
        title: "A few moments I wish I could live again.",
        subtitle: "And there are still so many moments I'd like to make with you.",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-couple-walking-hand-in-hand-on-the-beach-41548-large.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
        order: 1
      });
      console.log('🌱 Video seeded.');
    }

    // 5. Seed Songs (Soundtrack)
    const songCount = await Song.countDocuments();
    if (songCount === 0) {
      await Song.create([
        {
          title: "I Wanna Be Yours",
          artist: "Arctic Monkeys",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-112708.mp3",
          coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
          duration: "3:04",
          order: 1
        },
        {
          title: "Golden Hour",
          artist: "JVKE",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a735e2.mp3?filename=romantic-guitars-10940.mp3",
          coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80",
          duration: "3:29",
          order: 2
        },
        {
          title: "Until I Found You",
          artist: "Stephen Sanchez",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939ab7b57.mp3?filename=romantic-acoustic-guitar-124443.mp3",
          coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80",
          duration: "2:57",
          order: 3
        },
        {
          title: "Lover",
          artist: "Taylor Swift",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_2911b3320f.mp3?filename=soft-piano-love-126487.mp3",
          coverUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=300&q=80",
          duration: "3:41",
          order: 4
        }
      ]);
      console.log('🌱 Songs seeded.');
    }

    // 6. Seed Timeline
    const timelineCount = await TimelineEvent.countDocuments();
    if (timelineCount === 0) {
      await TimelineEvent.create([
        {
          title: "The Spark",
          subtitle: "Where it all began",
          date: "October 14, 2022",
          description: "Our eyes met for the very first time, and instantly, standard conversations turned into hours of effortless connection.",
          imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
          order: 1
        },
        {
          title: "Our First Late-Night Drive",
          subtitle: "City lights & endless talk",
          date: "February 14, 2023",
          description: "Playing our favorite playlist on loop while driving nowhere in particular. Neither of us wanted the night to end.",
          imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
          order: 2
        },
        {
          title: "The Unforgettable Trip",
          subtitle: "By the ocean",
          date: "August 20, 2023",
          description: "Watching the sunrise over the waves, wrapped in a blanket, sharing quiet dreams for the future.",
          imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
          order: 3
        },
        {
          title: "And somehow, after everything...",
          subtitle: "Here we are.",
          date: "Today",
          description: "Through distance, time, and life's changes, my heart still finds its way back to you.",
          imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
          order: 4
        }
      ]);
      console.log('🌱 Timeline events seeded.');
    }

    // 7. Seed Location
    const locationCount = await Location.countDocuments();
    if (locationCount === 0) {
      await Location.create({
        myLocationName: "MY PLACE",
        myCity: "San Francisco, CA",
        herLocationName: "HER PLACE",
        herCity: "New York, NY",
        distanceText: "2,572 miles",
        noteTop: "TWO PLACES. ONE DISTANCE.",
        noteBottom1: "Wait for you to come to me...",
        noteBottom2: "...but I'm always coming to you if you need me."
      });
      console.log('🌱 Location seeded.');
    }

  } catch (err) {
    console.error('Error seeding initial data:', err);
  }
}
