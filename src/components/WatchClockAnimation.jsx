import React, { useState, useEffect } from 'react';
import { Clock, Heart } from 'lucide-react';

export default function WatchClockAnimation({ quote, subText }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const secondsRatio = time.getSeconds() / 60;
  const minutesRatio = (secondsRatio + time.getMinutes()) / 60;
  const hoursRatio = (minutesRatio + time.getHours()) / 12;

  return (
    <div className="w-full max-w-3xl mx-auto my-12 px-4">
      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden text-center border border-white/80 shadow-2xl">
        {/* Subtle background blob */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#ffd0e0]/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#ffe4ec]/50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Watch Visual Face */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 mb-8 flex items-center justify-center">
            {/* Outer Watch Bezel / Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-[#ff2a75]/30 bg-gradient-to-br from-white to-[#fff0f5] shadow-inner flex items-center justify-center">
              
              {/* Hour Ticks */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-3 bg-[#ff2a75]/40 rounded-full"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-68px)`
                  }}
                />
              ))}

              {/* Ticking Clock Hands */}
              {/* Hour hand */}
              <div
                className="absolute bottom-1/2 left-1/2 w-1.5 h-10 bg-[#80003c] rounded-full origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${hoursRatio * 360}deg)` }}
              />
              {/* Minute hand */}
              <div
                className="absolute bottom-1/2 left-1/2 w-1 h-14 bg-[#ff2a75] rounded-full origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${minutesRatio * 360}deg)` }}
              />
              {/* Second hand */}
              <div
                className="absolute bottom-1/2 left-1/2 w-0.5 h-16 bg-[#e60067] origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${secondsRatio * 360}deg)` }}
              />

              {/* Center Pin */}
              <div className="w-4 h-4 rounded-full bg-[#80003c] border-2 border-white z-10 shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Pulsing Outer Glow Ring */}
            <div className="absolute -inset-2 rounded-full border border-[#ff2a75]/20 animate-ping pointer-events-none opacity-40" />
          </div>

          {/* Time Motif Quote */}
          <div className="max-w-xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffe4ec] text-[#ff2a75] text-xs font-extrabold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              TIME KEEPER MOTIF
            </span>

            <h3 className="font-display text-2xl md:text-3xl text-slate-900 font-bold leading-relaxed">
              "{quote || "This watch will help you keep time until we find our way back to each other."}"
            </h3>

            <p className="text-sm md:text-base text-slate-600 font-medium">
              {subText || "Every second ticks as a gentle reminder of the moments we've shared and the ones still waiting for us."}
            </p>
          </div>

          {/* Live Digital Counter Display */}
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 shadow-md border border-[#ffd0e0] text-xs md:text-sm font-semibold text-[#80003c]">
            <Heart className="w-4 h-4 text-[#ff2a75] fill-[#ff2a75] animate-pulse" />
            <span>Current Time: {time.toLocaleTimeString()}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
