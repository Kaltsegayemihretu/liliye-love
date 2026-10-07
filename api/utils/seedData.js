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
    const adminPass = process.env.ADMIN_PASSWORD || 'LiliyeAdmin2026!';
    const herEmail = process.env.HER_EMAIL || 'her@liliye.love';
    const herPass = process.env.HER_PASSWORD || 'LiliyeLove2026!';

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
            singleLetterText: `Liliye,

I remember the first time we met like it was yesterday. We were learning our driving license, we were walking down the stairs, and I asked you if it was boring. You replied, “No, not really.” I asked you to send me the document, but honestly, I just wanted your number.

The next day, you agreed to walk with me to Imperial, and then we walked all the way to your home, talking the entire journey together. It wasn’t awkward at all. I still get chills just thinking about it. I told you that you had beautiful nails and held your bag like the gentleman I am. We started talking, and I asked you out. You said no, telling me you liked older men in their mid-30s.

I ghosted you after you said no. I prayed you would text me back, and after 15 days, you finally said, “Hey.”. I’m so glad you did.

We talked more, and you applied to AASTU and got accepted for the entrance exam. We decided to meet at AASTU. I couldn't stop laying my eyes on you my love. Even Halle noticed it, haha. We called a ride together and walked to the front gates, but then I got SICk, migraine  remember? I was so mad because I wanted to have lunch with you that day. I remember wanting to lay my head on your thighs because I was so tired and sick.

But somehow, we went out. I waited for you at the caramel cafe and then we went to coffecology. We talked we laughed you ordered cocktail we both did actually, we didn’t like it….and we ORDERED waffles and pancakes for lunch hehehe remember. Mazi won the first spot Eqube tela.

LILIYE, I LOVE YOU. PLEASE, LET’S GET BACK TOGETHER AGAIN. I WON’T MESS IT UP THIS TIME. I SWEAR TO GOD.

After our first date, you told me you wanted to go out again. I had never felt so much like a man. We went to Nu Cheka Enabuka and then to Century. You were checking my Instagram the whole time, looking for other girls, which you didn’t find. Thank God there weren’t any.

It was Fantu’s birthday, so we had to rush home. You were a bit sad because you wanted to spend more time together.

Once we got accepted at AASTU, we started going home together. You were so funny, Liliye. GASH i had to admit that you’re funny to get back with you mtsm haha. I remember how i look at you GOD your eyes they were so beautiful…..i used to lean on the front seat of the taxi head against my forearms looking at your eyes and you would smile at me. It was the most beautiful thing in this world.

You remember the day we were crossing the road, and you held my hand for a split of a second and you let me go. I still remember the rush I felt before you pulled away. Oh, and the day before, I forgot my document with you and came to your house wearing a gold necklace. You came out and gave it to me, and I texted you asking why you had put a stain on my document, i said something funny like you “did you let it eat with you”. You said, “Cute,” and made me blush.

You were the first person to truly love me, Liliye, and I truly loved back. I miss you like I did in the old days. I will marry you, Liliye, no matter what.

Anyway, after you held my hand, we went to Karavan and talked about where this relationship was going. You said you liked me, but you wanted friends with benefits.

YOU SAID IT DON’T DENY IT, and then I agreed. I MISS THIS GUFFY FIGHTS WE HAD LIKE WHO SAID I LOVE YOU FIRST OR YOU SAID YOU WANTED TO BE FRIENDS WITH BENFITS.

We started whatever that was for a week. Do you remember, Liliye, the way we used to hold hands when we sat at the basketball court? HEHEHE we we’re so corny i swear to god hahah i can’t stop laughing writing this. And Cry also…….I MENTIONED CRY BECAUSE YOU TOLD ME YOU WOULD LOVE TO SEE ME CRY AND THEN YOU WOULD COMFORT ME…..I CRIED ALOT ESKI NEYE ENA ABABYEGN.

Then I told you to stop the friends-with-benefits thing and start dating seriously. You were a bit unsure. We were imperfect, and that is what made us perfect. We went to Eliana and watched movies. Then we ate at Ako, and you were wearing your cardigan. Then we went to Elaina Café, and we talked. Then we became boyfriend and girlfriend. God the walks we used to take the talks we used to talk……we counted the stars we saw crazy BEINGS, remember the time the fly won’t stop circling my head hehe. What about the kisses we were so paranoid to make out because of the guards hehehe they would shine the light on us to make sure we weren’t doing anything. I would tread everything for those moments of my love.

Afripolitan and Ag used to be our home eko yene fiker, im sorry i had to ruine what we had. But i promise im truly changed matured to i can make you happier then now or ever our story shouldn’t end like this. Lets not end it liliyee benatshe. Yene fiker i miss you i love you. Even my family misses you truly. Please we can never find a love story like this. We loved each other and i believe we can love each other more. Last time we talked you you said you didn’t feel loved in our relationship…….i will make sure that will happen my love their is no deseret i wouldn’t cross for you.

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

I want you to remember and reminisce about the past we had,i want to have kids with you, and build a house together with you. Only you. Just the way you like it.

I will die for you, literally.

Don’t just look at the present, Liliye. Look at the past and the future with me.

Yene abeba, I’m so sorry. Yeker beyegn. Aberen enehun. Ayelemedegnme yene fiker.

I’m dumb. I did the dumbest thing. But this is just the start, Liliye.

I will make you fall in love with me again if I have to. I would rather try a million times with you than with someone else.

I get a stomach ache imagining you laughing with someone else when I’m not there to make you laugh harder.

Liliye, you might find this intense or toxic, but this is love, Liliye.

BE EGEZIABHER, Liliye, give me a chance.

Be Mazi. Be Demese. Be Babi. Be Baby. Be Nati. Be Mother. Be Unc, who works at Ethio Telecom, who we ripped money of.

Let’s work on this.

I will do whatever it takes, yene fiker.

I love you until death do part us.

It’s not too late. No, it’s not.

Let’s think about us and no one else for a second.

Liliye, yene fiker, PLEASE.

I LOVE YOU A MILLION, LILIYE.`
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
