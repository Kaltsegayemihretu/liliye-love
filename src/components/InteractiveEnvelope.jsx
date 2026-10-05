import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ChevronDown, RotateCcw } from 'lucide-react';
import { api } from '../services/api';

export default function InteractiveEnvelope({ letterData }) {
  const [isOpen, setIsOpen] = useState(false);
  const letterRef = useRef(null);
  const hasTrackedOpen = useRef(false);

  const title = letterData?.title || 'FOR YOU';
  const subtitle = letterData?.subtitle || 'Tap to open';
  const sections = letterData?.sections || [
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
  ];

  const handleOpen = () => {
    setIsOpen(true);
    if (!hasTrackedOpen.current) {
      api.trackEvent('Envelope opened');
      hasTrackedOpen.current = true;
    } else {
      api.trackEvent('Envelope reopened');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Scroll threshold detection for auto-closing envelope when reaching bottom
  useEffect(() => {
    if (!isOpen || !letterRef.current) return;

    const el = letterRef.current;
    let bottomReachCount = 0;

    const handleScroll = () => {
      const scrollPosition = el.scrollTop + el.clientHeight;
      const isAtBottom = scrollPosition >= el.scrollHeight - 15;

      if (isAtBottom) {
        bottomReachCount += 1;
        if (bottomReachCount > 4) {
          setIsOpen(false);
          api.trackEvent('Letter completed');
        }
      } else {
        bottomReachCount = 0;
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  return (
    <div id="letter" className="w-full max-w-4xl mx-auto my-20 px-4 flex flex-col items-center">
      
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffe4ec] text-[#ff2a75] text-xs font-extrabold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          INTERACTIVE LOVE LETTER
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900">
          A Letter For Your Heart 💌
        </h2>
      </div>

      {!isOpen ? (
        /* CLOSED ENVELOPE STATE */
        <motion.div
          onClick={handleOpen}
          whileHover={{ scale: 1.03, rotate: 1 }}
          whileTap={{ scale: 0.97 }}
          className="cursor-pointer w-full max-w-lg relative bg-gradient-to-br from-[#ff2a75] via-[#e60067] to-[#80003c] rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-white overflow-hidden text-center group border-4 border-white/40"
        >
          {/* Decorative Envelope Triangular Flap Graphic */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-white/10 backdrop-blur-sm clip-envelope-flap border-b border-white/20" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />

          {/* Envelope Seal Icon */}
          <div className="relative z-10 my-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white text-[#ff2a75] flex items-center justify-center shadow-2xl border-4 border-[#ffd0e0] group-hover:scale-110 transition-transform">
              <Heart className="w-10 h-10 fill-[#ff2a75] animate-bounce" />
            </div>

            <h3 className="font-display text-3xl md:text-4xl font-extrabold mt-6 tracking-wide">
              {title}
            </h3>

            <p className="text-sm md:text-base font-semibold text-white/90 mt-2 bg-white/20 px-5 py-2 rounded-full backdrop-blur-md">
              {hasTrackedOpen.current ? 'Tap to open again ✨' : subtitle}
            </p>
          </div>
        </motion.div>
      ) : (
        /* OPEN LETTER EXPERIENCE */
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-[#fffaf5] rounded-[2.5rem] p-6 md:p-12 shadow-2xl border-2 border-[#ffd0e0] relative text-slate-800"
        >
          {/* Floating Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-[#ffe4ec] text-[#ff2a75] hover:bg-[#ff2a75] hover:text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Fold Letter
          </button>

          {/* Scrollable Digital Paper Container */}
          <div
            ref={letterRef}
            className="max-h-[600px] overflow-y-auto pr-3 space-y-10 custom-scrollbar"
          >
            <div className="text-center border-b border-[#ffd0e0] pb-6">
              <span className="font-handwritten text-3xl text-[#ff2a75] font-bold">
                My Dearest Love,
              </span>
            </div>

            {sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="font-display text-xl md:text-2xl font-bold text-[#80003c] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff2a75]" />
                  {section.heading}
                </h4>

                <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans font-medium">
                  {section.content}
                </p>

                {section.handwrittenNote && (
                  <div className="pt-1">
                    <span className="font-handwritten text-2xl text-[#ff2a75] block font-semibold">
                      "{section.handwrittenNote}"
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Letter End Notice */}
            <div className="text-center pt-8 border-t border-[#ffd0e0]">
              <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-3">
                (Scroll past end or click fold to return to envelope)
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff2a75] to-[#e60067] text-white font-bold text-sm shadow-md hover:scale-105 transition-transform"
              >
                Close Letter 💖
              </button>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
