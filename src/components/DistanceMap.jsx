import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Heart } from 'lucide-react';

export default function DistanceMap({ locationData }) {
  const myPlace = locationData?.myLocationName || "MY PLACE";
  const myCity = locationData?.myCity || "Shegole, Addis Ababa";
  const herPlace = locationData?.herLocationName || "HER PLACE";
  const herCity = locationData?.herCity || "Addis Sefer, Addis Ababa";
  const distance = locationData?.distanceText || "4.5 kilometers";
  const noteTop = locationData?.noteTop || "TWO PLACES. ONE DISTANCE.";
  const note1 = locationData?.noteBottom1 || "Wait for you to come to me...";
  const note2 = locationData?.noteBottom2 || "...but I'm always coming to you if you need me.";

  return (
    <div id="locations" className="w-full max-w-4xl mx-auto my-16 px-4 overflow-hidden">
      <div className="glass-card rounded-[2.5rem] p-5 sm:p-8 md:p-12 relative overflow-hidden border border-white/80 shadow-2xl text-center">
        
        {/* Subtle background gradient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd0e0]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffe4ec]/40 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffe4ec] text-[#ff2a75] text-xs font-extrabold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            {noteTop}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">
            Connected Across The Map 🗺️
          </h2>
        </div>

        {/* MOBILE LAYOUT (< sm): Clean vertical path & cards (Zero horizontal overlap!) */}
        <div className="sm:hidden my-6 py-2 flex flex-col items-center gap-3">
          {/* Card 1: My Place */}
          <div className="w-full max-w-[260px] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-md border border-[#ffd0e0] flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff2a75] to-[#e60067] text-white flex items-center justify-center shadow-md border-2 border-white shrink-0 animate-bounce">
              <MapPin className="w-5.5 h-5.5" />
            </div>
            <div className="text-left overflow-hidden">
              <div className="font-display font-bold text-xs text-[#80003c] truncate">{myPlace}</div>
              <div className="text-[11px] text-slate-600 font-semibold truncate">{myCity}</div>
            </div>
          </div>

          {/* Animated Connecting Line & Heart Badge */}
          <div className="flex flex-col items-center my-1 relative">
            <div className="w-0.5 h-6 border-l-2 border-dashed border-[#ff2a75]" />
            <div className="px-3 py-1 bg-[#ffe4ec] border border-[#ffd0e0] rounded-full text-[11px] font-bold text-[#ff2a75] flex items-center gap-1 shadow-sm">
              <Heart className="w-3 h-3 fill-[#ff2a75]" />
              <span>{distance}</span>
            </div>
            <div className="w-0.5 h-6 border-l-2 border-dashed border-[#ff2a75]" />
          </div>

          {/* Card 2: Her Place */}
          <div className="w-full max-w-[260px] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-md border border-[#ffd0e0] flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff2a75] to-[#e60067] text-white flex items-center justify-center shadow-md border-2 border-white shrink-0 animate-bounce" style={{ animationDelay: '0.5s' }}>
              <Heart className="w-5.5 h-5.5 fill-white" />
            </div>
            <div className="text-left overflow-hidden">
              <div className="font-display font-bold text-xs text-[#80003c] truncate">{herPlace}</div>
              <div className="text-[11px] text-slate-600 font-semibold truncate">{herCity}</div>
            </div>
          </div>
        </div>

        {/* DESKTOP / TABLET LAYOUT (>= sm): Horizontal Arc Map */}
        <div className="hidden sm:block relative my-10 py-6 max-w-2xl mx-auto">
          
          {/* Animated SVG Path Line */}
          <svg className="w-full h-24 overflow-hidden" viewBox="0 0 500 100" fill="none">
            <motion.path
              d="M 60 50 Q 250 -20 440 50"
              stroke="#ff2a75"
              strokeWidth="4"
              strokeDasharray="8 8"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
            {/* Heart moving along path */}
            <circle cx="250" cy="15" r="16" fill="#ffffff" stroke="#ff2a75" strokeWidth="2" />
            <text x="250" y="20" textAnchor="middle" fontSize="12" fill="#ff2a75">💖</text>
          </svg>

          {/* Place Pin 1 - My Place */}
          <div className="absolute top-6 left-2 md:left-8 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ff2a75] to-[#e60067] text-white flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
              <MapPin className="w-7 h-7" />
            </div>
            <div className="mt-3 bg-white/95 px-4 py-1.5 rounded-full shadow-md border border-[#ffd0e0] max-w-[180px]">
              <div className="font-display font-bold text-xs text-[#80003c] truncate">{myPlace}</div>
              <div className="text-[11px] text-slate-600 font-semibold truncate">{myCity}</div>
            </div>
          </div>

          {/* Place Pin 2 - Her Place */}
          <div className="absolute top-6 right-2 md:right-8 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ff2a75] to-[#e60067] text-white flex items-center justify-center shadow-xl border-4 border-white animate-bounce" style={{ animationDelay: '0.5s' }}>
              <Heart className="w-7 h-7 fill-white" />
            </div>
            <div className="mt-3 bg-white/95 px-4 py-1.5 rounded-full shadow-md border border-[#ffd0e0] max-w-[180px]">
              <div className="font-display font-bold text-xs text-[#80003c] truncate">{herPlace}</div>
              <div className="text-[11px] text-slate-600 font-semibold truncate">{herCity}</div>
            </div>
          </div>

        </div>

        {/* Distance Badge & Quotes */}
        <div className="mt-8 sm:mt-12 space-y-4 max-w-xl mx-auto">
          <div className="inline-block px-5 py-2 rounded-full bg-white/90 border border-[#ffd0e0] shadow-sm font-mono text-xs sm:text-sm font-bold text-[#ff2a75]">
            Approximate Distance: {distance}
          </div>

          <div className="space-y-1">
            <p className="font-sans text-base sm:text-lg md:text-xl font-bold text-slate-800">
              "{note1}"
            </p>
            <p className="font-handwritten text-xl sm:text-2xl md:text-3xl font-bold text-[#ff2a75]">
              "{note2}"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
