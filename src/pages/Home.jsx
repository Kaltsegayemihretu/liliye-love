import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Clock, Send, CheckCircle2, User } from 'lucide-react';
import { api } from '../services/api';

import Navbar from '../components/Navbar';
import CutoutSticker from '../components/CutoutSticker';
import WatchClockAnimation from '../components/WatchClockAnimation';
import InteractiveEnvelope from '../components/InteractiveEnvelope';
import DistanceMap from '../components/DistanceMap';

export default function Home() {
  const [content, setContent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [locations, setLocations] = useState(null);
  
  const [selectedImage, setSelectedImage] = useState(null);

  // Name login prompt modal on first visit
  const [herName, setHerName] = useState(() => localStorage.getItem('her_name') || '');
  const [showNameModal, setShowNameModal] = useState(false);
  const [inputName, setInputName] = useState('');

  // End-of-page message state
  const [responseMsg, setResponseMsg] = useState('');
  const [msgSubmitted, setMsgSubmitted] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  useEffect(() => {
    // Show name prompt on initial visit if name not entered yet
    if (!localStorage.getItem('her_name')) {
      setShowNameModal(true);
    }

    const loadData = async () => {
      try {
        const [cData, pData, tData, lData] = await Promise.all([
          api.getContent(),
          api.getPhotos(),
          api.getTimeline(),
          api.getLocations()
        ]);

        if (cData && typeof cData === 'object') setContent(cData);
        if (Array.isArray(pData)) setPhotos(pData);
        if (Array.isArray(tData)) setTimeline(tData);
        if (lData && typeof lData === 'object') setLocations(lData);
      } catch (err) {
        console.warn('Using default content fallback:', err?.message || err);
      }
    };

    loadData();

    const sessionId = localStorage.getItem('session_id') || 'sess_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('session_id', sessionId);
    api.registerSession({
      sessionId,
      deviceType: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
      browser: 'Browser',
      region: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }, []);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    const clean = inputName.trim();
    setHerName(clean);
    localStorage.setItem('her_name', clean);
    setShowNameModal(false);

    try {
      await api.nameLogin(clean);
    } catch (err) {}
  };

  const handleBeginClick = () => {
    api.trackEvent('Begin clicked');
    const watchSec = document.getElementById('watch-motif');
    if (watchSec) watchSec.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!responseMsg.trim() || msgLoading || msgSubmitted) return;

    setMsgLoading(true);
    try {
      await api.sendResponseMessage(herName || 'Her', responseMsg.trim());
      setMsgSubmitted(true);

      // Trigger celebratory romantic heart confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#ff2a75', '#e60067', '#ffd0e0', '#ffffff', '#80003c']
        });
      } catch (e) {}
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setMsgLoading(false);
    }
  };

  const heroContent = content?.hero || {
    mainTitle: "I'LL WAIT FOR YOU TILL THE END OF TIME",
    subTitle1: "I'm serious about us, my love.",
    subTitle2: "Maybe this isn't the end of our story.",
    buttonText: "BEGIN"
  };

  const watchContent = content?.watch || {
    quoteText: "This watch will help you keep time until we find our way back to each other.",
    subText: "Every second ticks as a gentle reminder of the moments we've shared and the ones still waiting for us."
  };

  const finalContent = content?.final || {
    line1: "I DON'T KNOW WHAT THE FUTURE LOOKS LIKE.",
    line2: "But I know what I hope it looks like.",
    highlight: "US.",
    pauseText: "Until then...",
    waitText: "I'll wait.",
    endTimeText: "Till the end of time."
  };

  const safePhotos = Array.isArray(photos) ? photos : [];
  const heroPhotos = safePhotos.filter(p => p && p.category === 'hero').slice(0, 4);
  const albumPhotos = safePhotos.filter(p => p && (p.category === 'album' || !p.category));

  return (
    <div className="min-h-screen bg-[#fff0f5] text-slate-800 relative overflow-x-hidden">
      
      <Navbar />

      {/* 1. MINIMAL HERO SECTION */}
      <section id="hero" className="pt-24 pb-16 px-4 max-w-5xl mx-auto min-h-[85vh] flex items-center justify-center">
        <div className="w-full bg-gradient-to-br from-[#ff2a75] via-[#e60067] to-[#80003c] rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl text-white border-4 border-white/30 text-center">
          
          {/* Animated Liquid / Blob Shapes */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#ffa8bc]/30 rounded-full blur-3xl animate-blob-1 pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ffd0e0]/20 rounded-full blur-3xl animate-blob-2 pointer-events-none" />

          {/* Cutout Sticker Photos floating around hero */}
          <div className="hidden lg:block absolute top-12 left-10 w-40">
            <CutoutSticker
              imageUrl={heroPhotos[0]?.imageUrl || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80"}
              caption="That day."
              rotation={-8}
              onClick={() => setSelectedImage(heroPhotos[0]?.imageUrl)}
            />
          </div>

          <div className="hidden lg:block absolute top-16 right-10 w-40">
            <CutoutSticker
              imageUrl={heroPhotos[1]?.imageUrl || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"}
              caption="Us."
              rotation={6}
              onClick={() => setSelectedImage(heroPhotos[1]?.imageUrl)}
            />
          </div>

          {/* Main Hero Content */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-6 flex flex-col items-center">
            
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-md">
              {heroContent.mainTitle}
            </h1>

            <div className="space-y-2 text-lg md:text-2xl font-medium text-white/95">
              <p>"{heroContent.subTitle1}"</p>
              <p className="font-handwritten text-3xl md:text-4xl text-[#ffd0e0] font-bold">
                "{heroContent.subTitle2}"
              </p>
            </div>

            <div className="pt-4">
              <motion.button
                onClick={handleBeginClick}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full bg-white text-[#ff2a75] font-display font-extrabold text-lg shadow-2xl hover:bg-[#ffe4ec] transition-all border-2 border-white flex items-center gap-3 cursor-pointer"
              >
                <span>{heroContent.buttonText}</span>
                <Heart className="w-5 h-5 fill-[#ff2a75]" />
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
      <section id="memories" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900">
            Moments I Hold Close To My Heart 📸
          </h2>
        </div>

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
              { caption: "I Love You", url: "https://drive.google.com/file/d/1Ywnng1aKcnsroblkhBBhB6O4aW19j3n4/view?usp=sharing", rot: -4 },
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

      {/* 4. INTERACTIVE LOVE LETTER */}
      <InteractiveEnvelope letterData={content?.letter} />

      {/* 5. RELATIONSHIP TIMELINE */}
      <section id="timeline" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900">
            LOOK HOW FAR WE'VE COME ⏳
          </h2>
        </div>

        <div className="relative border-l-4 border-[#ff2a75]/30 ml-4 md:ml-32 space-y-12 pl-6 md:pl-10">
          {((Array.isArray(timeline) && timeline.length > 0) ? timeline : [
            {
              title: "The Spark",
              subtitle: "Where it all began",
              date: "October 14, 2022",
              description: "Our eyes met for the very first time, and instantly, standard conversations turned into hours of effortless connection.",            },
            {
              title: "Our First Late-Night Drive",
              subtitle: "City lights & endless talk",
              date: "February 14, 2023",
              description: "Playing our favorite playlist on loop while driving nowhere in particular. Neither of us wanted the night to end.",
            },
            {
              title: "The Unforgettable Trip",
              subtitle: "By the ocean",
              date: "August 20, 2023",
              description: "Watching the sunrise over the waves, wrapped in a blanket, sharing quiet dreams for the future.",
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
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#ff2a75] border-4 border-white shadow-md" />

              <div className="glass-card rounded-3xl p-6 md:p-8 shadow-xl border border-white/80 space-y-3">
                <div className="text-xs font-bold text-[#ff2a75] uppercase font-mono">
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

      {/* 6. TWO LOCATIONS SECTION */}
      <DistanceMap locationData={locations} />

      {/* 7. MINIMAL FINAL SECTION & HER PERSONAL REPLY FORM */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#ff2a75] via-[#e60067] to-[#80003c] rounded-[3.5rem] p-8 md:p-14 relative overflow-hidden shadow-2xl text-white border-4 border-white/30 text-center space-y-8">
          
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#ffd0e0]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#ffe4ec]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight">
              "{finalContent.line1}"
            </h2>
            <p className="text-lg md:text-xl font-semibold text-white/90">
              "{finalContent.line2}"
            </p>
            <div className="font-display text-4xl md:text-6xl font-extrabold text-white tracking-widest py-1">
              "{finalContent.highlight}"
            </div>
            
            <div className="pt-2 space-y-1">
              <p className="text-base text-white/80 font-medium">{finalContent.pauseText}</p>
              <p className="font-handwritten text-3xl text-[#ffd0e0] font-bold">
                "{finalContent.waitText}"
              </p>
              <p className="font-display text-xl font-bold tracking-wide">
                "{finalContent.endTimeText}"
              </p>
            </div>
          </div>

          {/* HER PERSONAL MESSAGE RESPONSE CARD */}
          <div className="relative z-10 pt-8 border-t border-white/20 max-w-xl mx-auto">
            {!msgSubmitted ? (
              <form onSubmit={handleResponseSubmit} className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl text-slate-900 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-[#80003c] flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#ff2a75] fill-[#ff2a75]" />
                    Leave A Message For Me 💌
                  </h3>
                  {herName && (
                    <span className="text-xs font-bold text-[#ff2a75] bg-[#ffe4ec] px-3 py-1 rounded-full">
                      From: {herName}
                    </span>
                  )}
                </div>

                <textarea
                  rows={3}
                  required
                  value={responseMsg}
                  onChange={(e) => setResponseMsg(e.target.value)}
                  placeholder="Write your personal thoughts or message here for me..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-[#ffd0e0] text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#ff2a75]"
                />

                <button
                  type="submit"
                  disabled={!responseMsg.trim() || msgLoading}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ff2a75] to-[#e60067] text-white font-display font-extrabold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{msgLoading ? 'Sending...' : 'Send Message To Me 💖'}</span>
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl text-center space-y-3 border-4 border-[#ffd0e0]"
              >
                <CheckCircle2 className="w-12 h-12 text-[#ff2a75] mx-auto" />
                <h3 className="font-display text-2xl font-extrabold text-[#80003c]">
                  Thank You, My Love ❤️
                </h3>
                <p className="text-sm font-semibold text-slate-700">
                  Your message has been sent to me. I will keep it close to my heart.
                </p>
              </motion.div>
            )}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-slate-400 text-xs font-semibold">
      </footer>

      {/* HER NAME PROMPT MODAL ON FIRST VISIT */}
      <AnimatePresence>
        {showNameModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl text-center border-4 border-[#ffd0e0] space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ff2a75] to-[#e60067] text-white flex items-center justify-center shadow-lg border-4 border-white mx-auto">
                <Heart className="w-8 h-8 fill-white animate-bounce" />
              </div>

              <h2 className="font-display text-3xl font-extrabold text-slate-900">
                Welcome, My Love 💖
              </h2>

              <p className="text-xs text-slate-600 font-semibold">
                Please enter your name to open our digital world.
              </p>

              <form onSubmit={handleNameSubmit} className="space-y-4 text-left pt-2">
                <div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-[#ffd0e0] text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff2a75]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#ff2a75] to-[#e60067] text-white font-display font-extrabold text-base shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Open Experience ✨
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
