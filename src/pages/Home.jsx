import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Clock, Send, CheckCircle2, User } from 'lucide-react';
import { api } from '../services/api';
import { formatImageUrl, getFallbackDriveUrl } from '../utils/image';

import Navbar from '../components/Navbar';
import CutoutSticker from '../components/CutoutSticker';
import WatchClockAnimation from '../components/WatchClockAnimation';
import InteractiveEnvelope from '../components/InteractiveEnvelope';
import DistanceMap from '../components/DistanceMap';

export default function Home() {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [locations, setLocations] = useState(null);
  
  const [selectedImage, setSelectedImage] = useState(null);

  // Name login state
  const [herName, setHerName] = useState(() => localStorage.getItem('her_name') || '');
  const [showNameModal, setShowNameModal] = useState(false);
  const [inputName, setInputName] = useState('');

  // End-of-page message state
  const [responseMsg, setResponseMsg] = useState('');
  const [msgSubmitted, setMsgSubmitted] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  useEffect(() => {
    // If Her name has not been entered yet, prompt login page immediately
    if (!localStorage.getItem('her_name')) {
      navigate('/login');
      return;
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
    subTitle2: "This isn't the end of our story.",
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
  const heroPhotos = safePhotos
    .filter(p => p && p.category === 'hero')
    .map(p => {
      if (p.imageUrl && p.imageUrl.includes('photo-1518199266791')) {
        return { ...p, imageUrl: "https://drive.google.com/file/d/1Ywnng1aKcnsroblkhBBhB6O4aW19j3n4/view?usp=sharing" };
      }
      if (p.imageUrl && p.imageUrl.includes('photo-1517841905240')) {
        return { ...p, imageUrl: "https://drive.google.com/file/d/1mLY9Y1cmPC9fpL1X4BDJmvSBHpM_42Eg/view?usp=sharing" };
      }
      return p;
    })
    .slice(0, 4);
  const albumPhotos = safePhotos
    .filter(p => p && (p.category === 'album' || !p.category))
    .filter(p => p.imageUrl && !p.imageUrl.includes('unsplash.com'))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#fff0f5] text-slate-800 relative overflow-x-hidden">
      
      <Navbar />

      {/* 1. MINIMAL HERO SECTION */}
      <section id="hero" className="pt-24 pb-16 px-4 max-w-5xl mx-auto min-h-[85vh] flex items-center justify-center">
        <div className="w-full bg-gradient-to-br from-[#ff2a75] via-[#e60067] to-[#80003c] rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl text-white border-4 border-white/30 text-center">
          
          {/* Animated Liquid / Blob Shapes */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#ffa8bc]/30 rounded-full blur-3xl animate-blob-1 pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ffd0e0]/20 rounded-full blur-3xl animate-blob-2 pointer-events-none" />

          {/* Cutout Sticker Photos for Mobile Phones */}
          <div className="flex lg:hidden justify-center items-center gap-4 mb-4 relative z-10">
            <div className="w-32 sm:w-40">
              <CutoutSticker
                imageUrl={heroPhotos[0]?.imageUrl || "https://drive.google.com/file/d/1Ywnng1aKcnsroblkhBBhB6O4aW19j3n4/view?usp=sharing"}
                caption={heroPhotos[0]?.caption || ""}
                rotation={-5}
                onClick={() => setSelectedImage(heroPhotos[0]?.imageUrl || "https://drive.google.com/file/d/1Ywnng1aKcnsroblkhBBhB6O4aW19j3n4/view?usp=sharing")}
              />
            </div>
            <div className="w-32 sm:w-40">
              <CutoutSticker
                imageUrl={heroPhotos[1]?.imageUrl || "https://drive.google.com/file/d/1mLY9Y1cmPC9fpL1X4BDJmvSBHpM_42Eg/view?usp=sharing"}
                caption={heroPhotos[1]?.caption || ""}
                rotation={5}
                onClick={() => setSelectedImage(heroPhotos[1]?.imageUrl || "https://drive.google.com/file/d/1mLY9Y1cmPC9fpL1X4BDJmvSBHpM_42Eg/view?usp=sharing")}
              />
            </div>
          </div>

          {/* Cutout Sticker Photos floating around hero for Desktop */}
          <div className="hidden lg:block absolute top-12 left-10 w-40 z-10">
            <CutoutSticker
              imageUrl={heroPhotos[0]?.imageUrl || "https://drive.google.com/file/d/1Ywnng1aKcnsroblkhBBhB6O4aW19j3n4/view?usp=sharing"}
              caption={heroPhotos[0]?.caption || ""}
              rotation={-8}
              onClick={() => setSelectedImage(heroPhotos[0]?.imageUrl || "https://drive.google.com/file/d/1Ywnng1aKcnsroblkhBBhB6O4aW19j3n4/view?usp=sharing")}
            />
          </div>

          <div className="hidden lg:block absolute top-16 right-10 w-40 z-10">
            <CutoutSticker
              imageUrl={heroPhotos[1]?.imageUrl || "https://drive.google.com/file/d/1mLY9Y1cmPC9fpL1X4BDJmvSBHpM_42Eg/view?usp=sharing"}
              caption={heroPhotos[1]?.caption || ""}
              rotation={6}
              onClick={() => setSelectedImage(heroPhotos[1]?.imageUrl || "https://drive.google.com/file/d/1mLY9Y1cmPC9fpL1X4BDJmvSBHpM_42Eg/view?usp=sharing")}
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
              { caption: "", url: "https://drive.google.com/file/d/1Ed4PxbKSH2gTTmCU1XCE6ln3S_GtlP6x/view?usp=sharing", rot: -4 },
              { caption: "", url: "https://drive.google.com/file/d/1Xag3ljr61LxjeUc0UgDQpYJNvl3SMB-T/view?usp=sharing", rot: 3 },
              { caption: "", url: "https://drive.google.com/file/d/1R2Rw7lXW_nHePAQri6qqZuIqr1lCQ7_n/view?usp=sharing", rot: -5 }
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
            src={formatImageUrl(selectedImage)}
            alt="Enlarged Memory"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const fallback = getFallbackDriveUrl(selectedImage);
              if (e.currentTarget.src !== fallback) {
                e.currentTarget.src = fallback;
              }
            }}
            className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl border-4 border-white"
          />
        </div>
      )}

    </div>
  );
}
