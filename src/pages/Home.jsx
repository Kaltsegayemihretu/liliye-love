import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Clock, Film, CheckCircle2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { api } from '../services/api';

import Navbar from '../components/Navbar';
import AudioPlayerWidget from '../components/AudioPlayerWidget';
import CutoutSticker from '../components/CutoutSticker';
import WatchClockAnimation from '../components/WatchClockAnimation';
import InteractiveEnvelope from '../components/InteractiveEnvelope';
import PinkBoombox from '../components/PinkBoombox';
import DistanceMap from '../components/DistanceMap';

export default function Home() {
  const { startBackgroundMusic } = useAudio();
  
  const [content, setContent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [songs, setSongs] = useState([]);
  const [locations, setLocations] = useState(null);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [finalClicked, setFinalClicked] = useState(false);
  const [finalLoading, setFinalLoading] = useState(false);

  // Fetch public dynamic site content
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cData, pData, vData, tData, sData, lData] = await Promise.all([
          api.getContent(),
          api.getPhotos(),
          api.getVideos(),
          api.getTimeline(),
          api.getMusic(),
          api.getLocations()
        ]);

        if (cData && typeof cData === 'object') setContent(cData);
        if (Array.isArray(pData)) setPhotos(pData);
        if (Array.isArray(vData)) setVideos(vData);
        if (Array.isArray(tData)) setTimeline(tData);
        if (Array.isArray(sData)) setSongs(sData);
        if (lData && typeof lData === 'object') setLocations(lData);
      } catch (err) {
        console.warn('Using default content fallback:', err?.message || err);
      }
    };

    loadData();

    // Register analytics visitor session
    const sessionId = localStorage.getItem('session_id') || 'sess_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('session_id', sessionId);
    
    api.registerSession({
      sessionId,
      deviceType: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
      browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser',
      region: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }, []);

  const handleBeginClick = () => {
    startBackgroundMusic();
    api.trackEvent('Begin clicked');
    const memoriesSection = document.getElementById('watch-motif');
    if (memoriesSection) {
      memoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFinalButtonClick = async () => {
    if (finalClicked || finalLoading) return;
    setFinalLoading(true);

    try {
      await api.clickFinalButton();
      setFinalClicked(true);

      // Trigger celebratory romantic heart confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#ff2a75', '#e60067', '#ffd0e0', '#ffffff', '#80003c']
      });
    } catch (err) {
      console.error('Final button error:', err);
    } finally {
      setFinalLoading(false);
    }
  };

  const heroContent = content?.hero || {
    mainTitle: "I'LL WAIT FOR YOU TILL THE END OF TIME",
    subTitle1: "I'm serious about us, my love.",
    subTitle2: "Maybe this isn't the end of our story.",
    buttonText: "BEGIN"
  };

  const watchContent = content?.watch || {
    title: "UNTIL THE END OF TIME",
    quoteText: "This watch will help you keep time until we find our way back to each other.",
    subText: "Every second ticks as a gentle reminder of the moments we've shared and the ones still waiting for us."
  };

  const finalContent = content?.final || {
    line1: "I DON'T KNOW WHAT THE FUTURE LOOKS LIKE.",
    line2: "But I know what I hope it looks like.",
    highlight: "US.",
    pauseText: "Until then...",
    waitText: "I'll wait.",
    endTimeText: "Till the end of time.",
    buttonText: "CLICK WHEN YOU'RE READY FOR US",
    confirmedText: "I'll take that as your answer."
  };

  const safePhotos = Array.isArray(photos) ? photos : [];
  const heroPhotos = safePhotos.filter(p => p && p.category === 'hero').slice(0, 4);
  const albumPhotos = safePhotos.filter(p => p && (p.category === 'album' || !p.category));

  return (
    <div className="min-h-screen bg-[#fff0f5] text-slate-800 relative overflow-x-hidden">
      
      {/* Navigation & Audio Player Widget */}
      <Navbar />
      <AudioPlayerWidget />

      {/* 1. OPENING HERO SECTION */}
      <section id="hero" className="pt-24 pb-16 px-4 max-w-6xl mx-auto min-h-[90vh] flex items-center justify-center">
        <div className="w-full bg-gradient-to-br from-[#ff2a75] via-[#e60067] to-[#80003c] rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl text-white border-4 border-white/30 text-center">
          
          {/* Animated Liquid / Blob Shapes */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#ffa8bc]/30 rounded-full blur-3xl animate-blob-1 pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ffd0e0]/20 rounded-full blur-3xl animate-blob-2 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob-3 pointer-events-none" />

          {/* Cutout Sticker Photos floating around hero */}
          <div className="hidden lg:block absolute top-12 left-12 w-44">
            <CutoutSticker
              imageUrl={heroPhotos[0]?.imageUrl || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80"}
              caption="That day."
              rotation={-8}
              onClick={() => setSelectedImage(heroPhotos[0]?.imageUrl)}
            />
          </div>

          <div className="hidden lg:block absolute top-16 right-12 w-44">
            <CutoutSticker
              imageUrl={heroPhotos[1]?.imageUrl || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"}
              caption="Us."
              rotation={6}
              onClick={() => setSelectedImage(heroPhotos[1]?.imageUrl)}
            />
          </div>

          {/* Main Hero Content */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-6 flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-widest text-white">
              <Sparkles className="w-4 h-4 text-amber-300" />
              A PRIVATE DIGITAL LOVE STORY
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-md">
              {heroContent.mainTitle}
            </h1>

            <div className="space-y-2 text-lg md:text-2xl font-medium text-white/95 max-w-xl">
              <p>"{heroContent.subTitle1}"</p>
              <p className="font-handwritten text-3xl md:text-4xl text-[#ffd0e0] font-bold">
                "{heroContent.subTitle2}"
              </p>
            </div>

            {/* BEGIN Button */}
            <div className="pt-6">
              <motion.button
                onClick={handleBeginClick}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full bg-white text-[#ff2a75] font-display font-extrabold text-xl shadow-2xl hover:bg-[#ffe4ec] transition-all border-2 border-white flex items-center gap-3 group cursor-pointer"
              >
                <span>{heroContent.buttonText}</span>
                <Heart className="w-5 h-5 fill-[#ff2a75] group-hover:scale-125 transition-transform" />
              </motion.button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WATCH / TIME MOTIF SECTION */}
      <section id="watch-motif">
        <WatchClockAnimation quote={watchContent.quoteText} subText={watchContent.subText} />
      </section>

      {/* 3. MEMORIES ALBUM SECTION */}
      <section id="memories" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffe4ec] text-[#ff2a75] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5" />
            THE MOMENTS
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900">
            Moments I Hold Close To My Heart 📸
          </h2>
        </div>

        {/* Floating Scrapbook Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
          {albumPhotos.length > 0 ? (
            albumPhotos.map((photo, idx) => (
              <motion.div
                key={photo._id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <CutoutSticker
                  imageUrl={photo.imageUrl}
                  caption={photo.caption}
                  rotation={photo.rotation || (idx % 2 === 0 ? -4 : 4)}
                  onClick={() => setSelectedImage(photo.imageUrl)}
                />
              </motion.div>
            ))
          ) : (
            [
              { caption: "That day.", url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80", rot: -4 },
              { caption: "Us.", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", rot: 3 },
              { caption: "I still remember this.", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80", rot: -5 },
              { caption: "One of my favorite memories.", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80", rot: 4 },
              { caption: "You made this moment special.", url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80", rot: -3 },
              { caption: "Some moments never really leave you.", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80", rot: 2 }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <CutoutSticker
                  imageUrl={item.url}
                  caption={item.caption}
                  rotation={item.rot}
                  onClick={() => setSelectedImage(item.url)}
                />
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* 4. VIDEO MEMORY SECTION */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/80 shadow-2xl text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffe4ec] text-[#ff2a75] text-xs font-extrabold uppercase tracking-wider mb-2">
              <Film className="w-3.5 h-3.5" />
              DIGITAL SCRAPBOOK VIDEO
            </span>
            <h3 className="font-display text-2xl md:text-4xl font-extrabold text-slate-900">
              "{videos[0]?.title || 'A few moments I wish I could live again.'}"
            </h3>
            <p className="text-sm md:text-base text-slate-600 font-medium mt-2">
              "{videos[0]?.subtitle || "And there are still so many moments I'd like to make with you."}"
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-xl aspect-video border-4 border-white">
            <video
              src={videos[0]?.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-couple-walking-hand-in-hand-on-the-beach-41548-large.mp4"}
              controls
              poster={videos[0]?.thumbnailUrl || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80"}
              className="w-full h-full object-cover"
              onPlay={() => api.trackEvent('Video played')}
            />
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE LOVE LETTER */}
      <InteractiveEnvelope letterData={content?.letter} />

      {/* 6. BOOMBOX & SOUNDTRACK */}
      <PinkBoombox songs={Array.isArray(songs) ? songs : []} />

      {/* 7. RELATIONSHIP TIMELINE */}
      <section id="timeline" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffe4ec] text-[#ff2a75] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" />
            OUR STORY
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900">
            LOOK HOW FAR WE'VE COME ⏳
          </h2>
        </div>

        <div className="relative border-l-4 border-[#ff2a75]/30 ml-4 md:ml-32 space-y-12 pl-6 md:pl-10">
          {((Array.isArray(timeline) && timeline.length > 0) ? timeline : [
            {
              title: "The Spark",
              subtitle: "Where it all began",
              date: "October 14, 2022",
              description: "Our eyes met for the very first time, and instantly, standard conversations turned into hours of effortless connection.",
              imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
            },
            {
              title: "Our First Late-Night Drive",
              subtitle: "City lights & endless talk",
              date: "February 14, 2023",
              description: "Playing our favorite playlist on loop while driving nowhere in particular. Neither of us wanted the night to end.",
              imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80"
            },
            {
              title: "The Unforgettable Trip",
              subtitle: "By the ocean",
              date: "August 20, 2023",
              description: "Watching the sunrise over the waves, wrapped in a blanket, sharing quiet dreams for the future.",
              imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80"
            }
          ]).map((evt, idx) => (
            <motion.div
              key={evt._id || idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative"
            >
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#ff2a75] border-4 border-white shadow-md flex items-center justify-center" />

              <div className="glass-card rounded-3xl p-6 md:p-8 shadow-xl border border-white/80 space-y-3">
                <div className="text-xs font-bold text-[#ff2a75] uppercase tracking-wider font-mono">
                  {evt.date}
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  {evt.title}
                </h3>
                {evt.subtitle && (
                  <div className="text-sm font-semibold text-[#80003c]">
                    {evt.subtitle}
                  </div>
                )}
                <p className="text-sm md:text-base text-slate-600 font-medium">
                  {evt.description}
                </p>

                {evt.imageUrl && (
                  <div className="pt-2">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="w-full max-h-60 object-cover rounded-2xl border border-white/60"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          <div className="relative pt-6">
            <div className="absolute -left-[31px] md:-left-[47px] top-8 w-6 h-6 rounded-full bg-[#80003c] border-4 border-white shadow-md" />
            <div className="bg-gradient-to-r from-[#ff2a75] to-[#80003c] rounded-3xl p-8 text-white shadow-2xl text-center space-y-3">
              <h4 className="font-display text-2xl md:text-3xl font-extrabold">
                "And somehow, after everything..."
              </h4>
              <p className="font-handwritten text-4xl text-[#ffd0e0] font-bold">
                "Here we are."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. TWO LOCATIONS SECTION */}
      <DistanceMap locationData={locations} />

      {/* 9. FINAL SECTION */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-[#ff2a75] via-[#e60067] to-[#80003c] rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl text-white border-4 border-white/30 text-center space-y-8">
          
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#ffd0e0]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#ffe4ec]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 w-44 h-44 md:w-56 md:h-56 mx-auto rounded-full p-2 bg-white/20 backdrop-blur-md shadow-2xl border-4 border-white/60 overflow-hidden">
            <img
              src={safePhotos.find(p => p && p.category === 'final')?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}
              alt="Us Together"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
              "{finalContent.line1}"
            </h2>
            <p className="text-xl md:text-2xl font-semibold text-white/90">
              "{finalContent.line2}"
            </p>
            <div className="font-display text-5xl md:text-7xl font-extrabold text-white tracking-widest py-2">
              "{finalContent.highlight}"
            </div>
            
            <div className="pt-4 space-y-2">
              <p className="text-lg text-white/80 font-medium">{finalContent.pauseText}</p>
              <p className="font-handwritten text-4xl text-[#ffd0e0] font-bold">
                "{finalContent.waitText}"
              </p>
              <p className="font-display text-2xl font-bold tracking-wide">
                "{finalContent.endTimeText}"
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* 10. FINAL RED BUTTON */}
          <div className="relative z-10 pt-10 border-t border-white/20">
            {!finalClicked ? (
              <motion.button
                onClick={handleFinalButtonClick}
                disabled={finalLoading}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="w-full max-w-xl py-5 px-8 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-display font-extrabold text-xl md:text-2xl shadow-2xl hover:shadow-red-500/50 transition-all border-4 border-white cursor-pointer animate-pulse-glow flex items-center justify-center gap-3 mx-auto"
              >
                <Heart className="w-7 h-7 fill-white animate-bounce" />
                <span>{finalContent.buttonText}</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white text-slate-900 rounded-full py-6 px-10 max-w-xl mx-auto shadow-2xl font-display text-2xl font-extrabold flex items-center justify-center gap-3 border-4 border-[#ffd0e0]"
              >
                <CheckCircle2 className="w-8 h-8 text-[#ff2a75]" />
                <span>{finalContent.confirmedText} ❤️</span>
              </motion.div>
            )}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-slate-500 text-xs font-semibold tracking-wider">
        <p className="opacity-70 hover:opacity-100 transition-opacity">
          "Technically, I'm not contacting you."
        </p>
      </footer>

      {/* Lightbox Modal for Photo viewing */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={selectedImage}
            alt="Enlarged Memory"
            className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl border-4 border-white"
          />
        </div>
      )}

    </div>
  );
}
